var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
"use strict";
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
var app = document.querySelector('#app');
app.addEventListener('dom-change', function () {
    console.log('app ready event!');
});
window.addEventListener('polymer-ready', function (e) {
    console.log('polymer-ready event!');
});
console.log("running module: cnst.js");
var Cnst = (function () {
    function Cnst(varName) {
        this.ANON = "anonymous";
        this.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
        this.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
        this.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
        this.INSERT_ATTACHMENT = "{{insert-attachment}}";
        this.NEW_ON_TOOLBAR = true;
        this.INS_ON_TOOLBAR = true;
        this.USE_ACE_EDITOR = false;
        this.SHOW_PATH_ON_ROWS = true;
        this.SHOW_PATH_IN_DLGS = true;
        console.log("creating cnst varName =" + varName);
    }
    return Cnst;
}());
if (!window["cnst"]) {
    var cnst = new Cnst("cnst");
}
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
var NodeInfo = (function () {
    function NodeInfo(id, path, name, primaryTypeName, properties, hasChildren, hasBinary, binaryIsImage, binVer, width, height, childrenOrdered) {
        this.id = id;
        this.path = path;
        this.name = name;
        this.primaryTypeName = primaryTypeName;
        this.properties = properties;
        this.hasChildren = hasChildren;
        this.hasBinary = hasBinary;
        this.binaryIsImage = binaryIsImage;
        this.binVer = binVer;
        this.width = width;
        this.height = height;
        this.childrenOrdered = childrenOrdered;
    }
    return NodeInfo;
}());
var PropertyInfo = (function () {
    function PropertyInfo(type, name, value, values, htmlValue) {
        this.type = type;
        this.name = name;
        this.value = value;
        this.values = values;
        this.htmlValue = htmlValue;
    }
    return PropertyInfo;
}());
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
var Util = (function () {
    function Util() {
        var _this = this;
        this.logAjax = false;
        this.timeoutMessageShown = false;
        this.offline = false;
        this.waitCounter = 0;
        this.pgrsDlg = null;
        this.assertNotNull = function (varName) {
            if (typeof eval(varName) === 'undefined') {
                (new MessageDlg("Variable not found: " + varName)).open();
            }
        };
        this._ajaxCounter = 0;
        this.daylightSavingsTime = (new Date().dst()) ? true : false;
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
            setInterval(_this.progressInterval, 1000);
        };
        this.progressInterval = function () {
            var isWaiting = _this.isAjaxWaiting();
            if (isWaiting) {
                _this.waitCounter++;
                if (_this.waitCounter >= 3) {
                    if (!_this.pgrsDlg) {
                        _this.pgrsDlg = new ProgressDlg();
                        _this.pgrsDlg.open();
                    }
                }
            }
            else {
                _this.waitCounter = 0;
                if (_this.pgrsDlg) {
                    _this.pgrsDlg.cancel();
                    _this.pgrsDlg = null;
                }
            }
        };
        this.json = function (postName, postData, callback, callbackThis, callbackPayload) {
            if (callbackThis === window) {
                console.log("PROBABLE BUG: json call for " + postName + " used global 'window' as 'this', which is almost never going to be correct.");
            }
            var ironAjax;
            var ironRequest;
            var thiz = _this;
            try {
                if (_this.offline) {
                    console.log("offline: ignoring call for " + postName);
                    return;
                }
                if (_this.logAjax) {
                    console.log("JSON-POST: [" + postName + "]" + JSON.stringify(postData));
                }
                ironAjax = Polymer.dom(_this.root).querySelector("#ironAjax");
                ironAjax.url = postTargetUrl + postName;
                ironAjax.verbose = true;
                ironAjax.body = JSON.stringify(postData);
                ironAjax.method = "POST";
                ironAjax.contentType = "application/json";
                ironAjax.handleAs = "json";
                ironAjax.debounceDuration = "300";
                _this._ajaxCounter++;
                ironRequest = ironAjax.generateRequest();
            }
            catch (ex) {
                throw "Failed starting request: " + postName;
            }
            ironRequest.completes.then(function () {
                try {
                    thiz._ajaxCounter--;
                    thiz.progressInterval();
                    if (thiz.logAjax) {
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
                    thiz._ajaxCounter--;
                    thiz.progressInterval();
                    console.log("Error in util.json");
                    if (ironRequest.status == "403") {
                        console.log("Not logged in detected in util.");
                        thiz.offline = true;
                        if (!thiz.timeoutMessageShown) {
                            thiz.timeoutMessageShown = true;
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
                    throw "Failed processing server-side fail of: " + postName;
                }
            });
            return ironRequest;
        };
        this.ajaxReady = function (requestName) {
            if (_this._ajaxCounter > 0) {
                console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
                return false;
            }
            return true;
        };
        this.isAjaxWaiting = function () {
            return _this._ajaxCounter > 0;
        };
        this.delayedFocus = function (id) {
            setTimeout(function () {
                $(id).focus();
            }, 500);
            setTimeout(function () {
                $(id).focus();
            }, 1000);
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
                uid = meta64.nextUid++;
                map[id] = uid;
            }
            return uid;
        };
        this.elementExists = function (id) {
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
        this.getTextAreaValById = function (id) {
            var domElm = _this.domElm(id);
            return domElm.value;
        };
        this.domElm = function (id) {
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
        this.poly = function (id) {
            return _this.polyElm(id).node;
        };
        this.polyElm = function (id) {
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
            return _this.polyElm(id).node.value;
        };
        this.setInputVal = function (id, val) {
            if (val == null) {
                val = "";
            }
            var elm = _this.polyElm(id);
            if (elm) {
                elm.node.value = val;
            }
            return elm != null;
        };
        this.bindEnterKey = function (id, func) {
            _this.bindKey(id, func, 13);
        };
        this.bindKey = function (id, func, keyCode) {
            $(id).keypress(function (e) {
                if (e.which == keyCode) {
                    func();
                    return false;
                }
            });
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
        this.setHtmlEnhanced = function (id, content) {
            if (content == null) {
                content = "";
            }
            var elm = _this.domElm(id);
            var polyElm = Polymer.dom(elm);
            polyElm.node.innerHTML = content;
            Polymer.dom.flush();
            Polymer.updateStyles();
            return elm;
        };
        this.setHtml = function (id, content) {
            if (content == null) {
                content = "";
            }
            var elm = _this.domElm(id);
            var polyElm = Polymer.dom(elm);
            polyElm.node.innerHTML = content;
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
            try {
                var count = 0;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        console.log("Property[" + count + "]");
                        count++;
                    }
                }
                var val = '';
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
            var val = '';
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
            var domElm = null;
            if (typeof elmId == "string") {
                domElm = _this.domElm(elmId);
            }
            else {
                domElm = elmId;
            }
            if (domElm == null) {
                console.log("setVisibility couldn't find item: " + elmId);
                return;
            }
            if (!enable) {
                domElm.disabled = true;
            }
            else {
                domElm.disabled = false;
            }
        };
        this.setVisibility = function (elmId, vis) {
            var domElm = null;
            if (typeof elmId == "string") {
                domElm = _this.domElm(elmId);
            }
            else {
                domElm = elmId;
            }
            if (domElm == null) {
                console.log("setVisibility couldn't find item: " + elmId);
                return;
            }
            if (vis) {
                domElm.style.display = 'block';
            }
            else {
                domElm.style.display = 'none';
            }
        };
    }
    return Util;
}());
if (!window["util"]) {
    var util = new Util();
}
console.log("running module: jcrCnst.js");
var JcrCnst = (function () {
    function JcrCnst() {
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
    return JcrCnst;
}());
if (!window["jcrCnst"]) {
    var jcrCnst = new JcrCnst();
}
console.log("running module: attachment.js");
var Attachment = (function () {
    function Attachment() {
        var _this = this;
        this.uploadNode = null;
        this.openUploadFromFileDlg = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                _this.uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            _this.uploadNode = node;
            (new UploadFromFileDlg()).open();
        };
        this.openUploadFromUrlDlg = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                _this.uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            _this.uploadNode = node;
            (new UploadFromUrlDlg()).open();
        };
        this.deleteAttachment = function () {
            var node = meta64.getHighlightedNode();
            var thiz = _this;
            if (node) {
                (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                    util.json("deleteAttachment", {
                        "nodeId": node.id
                    }, thiz.deleteAttachmentResponse, thiz, node.uid);
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
if (!window["attachment"]) {
    var attachment = new Attachment();
}
console.log("running module: edit.js");
var Edit = (function () {
    function Edit() {
        var _this = this;
        this._insertBookResponse = function (res) {
            console.log("insertBookResponse running.");
            util.checkSuccess("Insert Book", res);
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        };
        this._deleteNodesResponse = function (res) {
            if (util.checkSuccess("Delete node", res)) {
                meta64.clearSelectedNodes();
                view.refreshTree(null, false);
            }
        };
        this._initNodeEditResponse = function (res) {
            if (util.checkSuccess("Editing node", res)) {
                var node = res.nodeInfo;
                var isRep = node.name.startsWith("rep:") || node.path.contains("/rep:");
                var editingAllowed = props.isOwnedCommentNode(node);
                if (!editingAllowed) {
                    editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                        && !props.isNonOwnedNode(node);
                }
                if (editingAllowed) {
                    _this.editNode = res.nodeInfo;
                    _this.editNodeDlgInst = new EditNodeDlg();
                    _this.editNodeDlgInst.open();
                }
                else {
                    (new MessageDlg("You cannot edit nodes that you don't own.")).open();
                }
            }
        };
        this._moveNodesResponse = function (res) {
            if (util.checkSuccess("Move nodes", res)) {
                _this.nodesToMove = null;
                view.refreshTree(null, false);
            }
        };
        this._setNodePositionResponse = function (res) {
            if (util.checkSuccess("Change node position", res)) {
                meta64.refresh();
            }
        };
        this._splitContentResponse = function (res) {
            if (util.checkSuccess("Split content", res)) {
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        this.showReadOnlyProperties = true;
        this.nodesToMove = null;
        this.parentOfNewNode = null;
        this.editingUnsavedNode = false;
        this.sendNotificationPendingSave = false;
        this.editNode = null;
        this.editNodeDlgInst = null;
        this.nodeInsertTarget = null;
        this.isEditAllowed = function (node) {
            return meta64.editMode && node.path != "/" &&
                (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
                && !props.isNonOwnedNode(node);
        };
        this.isInsertAllowed = function (node) {
            return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
        };
        this.startEditingNewNode = function () {
            _this.editingUnsavedNode = false;
            _this.editNode = null;
            _this.editNodeDlgInst = new EditNodeDlg();
            _this.editNodeDlgInst.saveNewNode("");
        };
        this.startEditingNewNodeWithName = function () {
            _this.editingUnsavedNode = true;
            _this.editNode = null;
            _this.editNodeDlgInst = new EditNodeDlg();
            _this.editNodeDlgInst.open();
        };
        this.insertNodeResponse = function (res) {
            if (util.checkSuccess("Insert node", res)) {
                meta64.initNode(res.newNode);
                meta64.highlightNode(res.newNode, true);
                _this.runEditNode(res.newNode.uid);
            }
        };
        this.createSubNodeResponse = function (res) {
            if (util.checkSuccess("Create subnode", res)) {
                meta64.initNode(res.newNode);
                _this.runEditNode(res.newNode.uid);
            }
        };
        this.saveNodeResponse = function (res, payload) {
            if (util.checkSuccess("Save node", res)) {
                view.refreshTree(null, false, payload.savedId);
                meta64.selectTab("mainTabName");
            }
        };
        this.editMode = function () {
            meta64.editMode = meta64.editMode ? false : true;
            render.renderPageFromData();
            view.scrollToSelectedNode();
        };
        this.splitContent = function () {
            var nodeBelow = _this.getNodeBelow(_this.editNode);
            util.json("splitNode", {
                "nodeId": _this.editNode.id,
                "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id)
            }, _this._splitContentResponse, _this);
        };
        this.cancelEdit = function () {
            if (meta64.treeDirty) {
                meta64.goToMainPage(true);
            }
            else {
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
        this.moveNodeUp = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                var nodeAbove = _this.getNodeAbove(node);
                if (nodeAbove == null) {
                    return;
                }
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": nodeAbove.name
                }, _this._setNodePositionResponse, _this);
            }
            else {
                console.log("idToNodeMap does not contain " + uid);
            }
        };
        this.moveNodeDown = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (node) {
                var nodeBelow = _this.getNodeBelow(node);
                if (nodeBelow == null) {
                    return;
                }
                util.json("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": nodeBelow.name,
                    "siblingId": node.name
                }, _this._setNodePositionResponse, _this);
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
        this.runEditNode = function (uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                _this.editNode = null;
                (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            _this.editingUnsavedNode = false;
            util.json("initNodeEdit", {
                "nodeId": node.id
            }, _this._initNodeEditResponse, _this);
        };
        this.insertNode = function (uid) {
            _this.parentOfNewNode = meta64.currentNode;
            if (!_this.parentOfNewNode) {
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
                _this.nodeInsertTarget = node;
                _this.startEditingNewNode();
            }
        };
        this.createSubNodeUnderHighlight = function () {
            _this.parentOfNewNode = meta64.getHighlightedNode();
            if (!_this.parentOfNewNode) {
                (new MessageDlg("Tap a node to insert under.")).open();
                return;
            }
            _this.nodeInsertTarget = null;
            _this.startEditingNewNode();
        };
        this.replyToComment = function (uid) {
            _this.createSubNode(uid);
        };
        this.createSubNode = function (uid) {
            if (!uid) {
                _this.parentOfNewNode = meta64.currentNode;
            }
            else {
                _this.parentOfNewNode = meta64.uidToNodeMap[uid];
                if (!_this.parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }
            _this.nodeInsertTarget = null;
            _this.startEditingNewNode();
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
            var thiz = _this;
            (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
                util.json("deleteNodes", {
                    "nodeIds": selNodesArray
                }, thiz._deleteNodesResponse, thiz);
            })).open();
        };
        this.moveSelNodes = function () {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
                return;
            }
            var thiz = _this;
            (new ConfirmDlg("Confirm Move", "Move " + selNodesArray.length + " node(s) to a new location ?", "Yes, move.", function () {
                thiz.nodesToMove = selNodesArray;
                meta64.selectedNodes = {};
                (new MessageDlg("Identified nodes to move.<p/>To actually move these nodes, browse to the target location, then click 'Finish Moving'<p/>" +
                    "The nodes will then be moved to the end of the list of subnodes under the target node. (i.e. The target you select will become the new parent of the nodes)"))
                    .open();
                meta64.refreshAllGuiEnablement();
            })).open();
        };
        this.finishMovingSelNodes = function () {
            var thiz = _this;
            (new ConfirmDlg("Confirm Move", "Move " + thiz.nodesToMove.length + " node(s) to selected location ?", "Yes, move.", function () {
                var highlightNode = meta64.getHighlightedNode();
                util.json("moveNodes", {
                    "targetNodeId": highlightNode.id,
                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                    "nodeIds": thiz.nodesToMove
                }, thiz._moveNodesResponse, thiz);
            })).open();
        };
        this.insertBookWarAndPeace = function () {
            var thiz = _this;
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
                    }, thiz._insertBookResponse, thiz);
                }
            })).open();
        };
    }
    return Edit;
}());
if (!window["edit"]) {
    var edit = new Edit();
}
console.log("running module: meta64.js");
var Meta64 = (function () {
    function Meta64() {
        var _this = this;
        this.appInitialized = false;
        this.curUrlPath = window.location.pathname + window.location.search;
        this.codeFormatDirty = false;
        this.serverMarkdown = true;
        this.nextGuid = 0;
        this.userName = "anonymous";
        this.deviceWidth = 0;
        this.deviceHeight = 0;
        this.homeNodeId = "";
        this.homeNodePath = "";
        this.isAdminUser = false;
        this.isAnonUser = true;
        this.anonUserLandingPageNode = null;
        this.treeDirty = false;
        this.uidToNodeMap = {};
        this.aceEditorsById = {};
        this.idToNodeMap = {};
        this.nextUid = 1;
        this.identToUidMap = {};
        this.parentUidToFocusNodeMap = {};
        this.editMode = false;
        this.MODE_ADVANCED = "advanced";
        this.MODE_SIMPLE = "simple";
        this.editModeOption = "simple";
        this.showProperties = false;
        this.simpleModeNodePrefixBlackList = {
            "rep:": true
        };
        this.simpleModePropertyBlackList = {};
        this.readOnlyPropertyList = {};
        this.binaryPropertyList = {};
        this.selectedNodes = {};
        this.currentNodeData = null;
        this.currentNode = null;
        this.currentNodeUid = null;
        this.currentNodeId = null;
        this.currentNodePath = null;
        this.dataObjMap = {};
        this.updateMainMenuPanel = function () {
            console.log("building main menu panel");
            menuPanel.build();
            menuPanel.init();
        };
        this.registerDataObject = function (data) {
            if (!data.guid) {
                data.guid = ++_this.nextGuid;
                _this.dataObjMap[data.guid] = data;
            }
        };
        this.getObjectByGuid = function (guid) {
            var ret = _this.dataObjMap[guid];
            if (!ret) {
                console.log("data object not found: guid=" + guid);
            }
            return ret;
        };
        this.encodeOnClick = function (callback, ctx) {
            if (typeof callback == "string") {
                return callback;
            }
            else if (typeof callback == "function") {
                _this.registerDataObject(callback);
                if (ctx) {
                    _this.registerDataObject(ctx);
                    return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
                }
                else {
                    return "meta64.runCallback(" + callback.guid + ");";
                }
            }
        };
        this.runCallback = function (guid, ctx) {
            var dataObj = _this.getObjectByGuid(guid);
            if (dataObj.callback) {
                dataObj.callback();
            }
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = _this.getObjectByGuid(ctx);
                    dataObj.call(thiz);
                }
                else {
                    dataObj();
                }
            }
            else {
                alert("unable to find callback on registered guid: " + guid);
            }
        };
        this.inSimpleMode = function () {
            return _this.editModeOption === _this.MODE_SIMPLE;
        };
        this.refresh = function () {
            _this.goToMainPage(true, true);
        };
        this.goToMainPage = function (rerender, forceServerRefresh) {
            if (forceServerRefresh) {
                _this.treeDirty = true;
            }
            if (rerender || _this.treeDirty) {
                if (_this.treeDirty) {
                    view.refreshTree(null, true);
                }
                else {
                    render.renderPageFromData();
                }
                _this.refreshAllGuiEnablement();
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
            var paperTabs = document.querySelector("#mainPaperTabs");
            paperTabs.select(pg.tabId);
        };
        this.isNodeBlackListed = function (node) {
            if (!_this.inSimpleMode())
                return false;
            var prop;
            for (prop in _this.simpleModeNodePrefixBlackList) {
                if (_this.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                    return true;
                }
            }
            return false;
        };
        this.getSelectedNodeUidsArray = function () {
            var selArray = [], idx = 0, uid;
            for (uid in _this.selectedNodes) {
                if (_this.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uid;
                }
            }
            return selArray;
        };
        this.getSelectedNodeIdsArray = function () {
            var selArray = [], idx = 0, uid;
            if (!_this.selectedNodes) {
                console.log("no selected nodes.");
            }
            else {
                console.log("selectedNode count: " + util.getPropertyCount(_this.selectedNodes));
            }
            for (uid in _this.selectedNodes) {
                if (_this.selectedNodes.hasOwnProperty(uid)) {
                    var node = _this.uidToNodeMap[uid];
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
        this.getSelectedNodesArray = function () {
            var selArray = [], idx = 0, uid;
            for (uid in _this.selectedNodes) {
                if (_this.selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = _this.uidToNodeMap[uid];
                }
            }
            return selArray;
        };
        this.clearSelectedNodes = function () {
            _this.selectedNodes = {};
        };
        this.updateNodeInfoResponse = function (res, node) {
            var ownerBuf = '';
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
                    util.changeOrAddClass(elm, "created-by-other", "created-by-me");
                }
                else {
                    util.changeOrAddClass(elm, "created-by-me", "created-by-other");
                }
            }
        };
        this.updateNodeInfo = function (node) {
            var ironRes = util.json("getNodePrivileges", {
                "nodeId": node.id,
                "includeAcl": false,
                "includeOwners": true
            });
            var thiz = _this;
            ironRes.completes.then(function () {
                thiz.updateNodeInfoResponse(ironRes.response, node);
            });
        };
        this.getNodeFromId = function (id) {
            return _this.idToNodeMap[id];
        };
        this.getPathOfUid = function (uid) {
            var node = _this.uidToNodeMap[uid];
            if (!node) {
                return "[path error. invalid uid: " + uid + "]";
            }
            else {
                return node.path;
            }
        };
        this.getHighlightedNode = function () {
            var ret = _this.parentUidToFocusNodeMap[_this.currentNodeUid];
            return ret;
        };
        this.highlightRowById = function (id, scroll) {
            var node = _this.getNodeFromId(id);
            if (node) {
                _this.highlightNode(node, scroll);
            }
            else {
                console.log("highlightRowById failed to find id: " + id);
            }
        };
        this.highlightNode = function (node, scroll) {
            if (!node)
                return;
            var doneHighlighting = false;
            var curHighlightedNode = _this.parentUidToFocusNodeMap[_this.currentNodeUid];
            if (curHighlightedNode) {
                if (curHighlightedNode.uid === node.uid) {
                    doneHighlighting = true;
                }
                else {
                    var rowElmId = curHighlightedNode.uid + "_row";
                    var rowElm = $("#" + rowElmId);
                    util.changeOrAddClass(rowElm, "active-row", "inactive-row");
                }
            }
            if (!doneHighlighting) {
                _this.parentUidToFocusNodeMap[_this.currentNodeUid] = node;
                var rowElmId = node.uid + "_row";
                var rowElm = $("#" + rowElmId);
                util.changeOrAddClass(rowElm, "inactive-row", "active-row");
            }
            if (scroll) {
                view.scrollToSelectedNode();
            }
        };
        this.refreshAllGuiEnablement = function () {
            var selNodeCount = util.getPropertyCount(_this.selectedNodes);
            var highlightNode = _this.getHighlightedNode();
            var selNodeIsMine = highlightNode != null && highlightNode.createdBy === meta64.userName;
            util.setEnablement("navLogoutButton", !_this.isAnonUser);
            util.setEnablement("openSignupPgButton", _this.isAnonUser);
            util.setEnablement("openExportDlg", _this.isAdminUser);
            util.setEnablement("openImportDlg", _this.isAdminUser);
            var propsToggle = _this.currentNode && !_this.isAnonUser;
            util.setEnablement("propsToggleButton", propsToggle);
            var allowEditMode = _this.currentNode && !_this.isAnonUser;
            util.setEnablement("editModeButton", allowEditMode);
            util.setEnablement("upLevelButton", _this.currentNode && nav.parentVisibleToUser());
            util.setEnablement("moveSelNodesButton", !_this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("deleteSelNodesButton", !_this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("clearSelectionsButton", !_this.isAnonUser && selNodeCount > 0);
            util.setEnablement("moveSelNodesButton", !_this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("finishMovingSelNodesButton", !_this.isAnonUser && edit.nodesToMove != null && selNodeIsMine);
            util.setEnablement("changePasswordPgButton", !_this.isAnonUser);
            util.setEnablement("accountPreferencesButton", !_this.isAnonUser);
            util.setEnablement("manageAccountButton", !_this.isAnonUser);
            util.setEnablement("insertBookWarAndPeaceButton", _this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
            util.setEnablement("uploadFromFileButton", !_this.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("uploadFromUrlButton", !_this.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("deleteAttachmentsButton", !_this.isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            util.setEnablement("editNodeSharingButton", !_this.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("renameNodePgButton", !_this.isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("searchDlgButton", !_this.isAnonUser && highlightNode != null);
            util.setEnablement("timelineButton", !_this.isAnonUser && highlightNode != null);
            util.setEnablement("showServerInfoButton", _this.isAdminUser);
            util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            util.setEnablement("refreshPageButton", !_this.isAnonUser);
            util.setEnablement("findSharedNodesButton", !_this.isAnonUser && highlightNode != null);
            util.setVisibility("openImportDlg", _this.isAdminUser && selNodeIsMine);
            util.setVisibility("openExportDlg", _this.isAdminUser && selNodeIsMine);
            util.setVisibility("navHomeButton", !_this.isAnonUser);
            util.setVisibility("editModeButton", allowEditMode);
            util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
            util.setVisibility("insertBookWarAndPeaceButton", _this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
            util.setVisibility("propsToggleButton", !_this.isAnonUser);
            util.setVisibility("openLoginDlgButton", _this.isAnonUser);
            util.setVisibility("navLogoutButton", !_this.isAnonUser);
            util.setVisibility("openSignupPgButton", _this.isAnonUser);
            Polymer.dom.flush();
            Polymer.updateStyles();
        };
        this.getSingleSelectedNode = function () {
            var uid;
            for (uid in _this.selectedNodes) {
                if (_this.selectedNodes.hasOwnProperty(uid)) {
                    return _this.uidToNodeMap[uid];
                }
            }
            return null;
        };
        this.getOrdinalOfNode = function (node) {
            if (!_this.currentNodeData || !_this.currentNodeData.children)
                return -1;
            for (var i = 0; i < _this.currentNodeData.children.length; i++) {
                if (node.id === _this.currentNodeData.children[i].id) {
                    return i;
                }
            }
            return -1;
        };
        this.setCurrentNodeData = function (data) {
            _this.currentNodeData = data;
            _this.currentNode = data.node;
            _this.currentNodeUid = data.node.uid;
            _this.currentNodeId = data.node.id;
            _this.currentNodePath = data.node.path;
        };
        this.anonPageLoadResponse = function (res) {
            if (res.renderNodeResponse) {
                util.setVisibility("mainNodeContent", true);
                render.renderPageFromData(res.renderNodeResponse);
                _this.refreshAllGuiEnablement();
            }
            else {
                util.setVisibility("mainNodeContent", false);
                console.log("setting listview to: " + res.content);
                util.setHtmlEnhanced("listView", res.content);
            }
            render.renderMainPageControls();
        };
        this.removeBinaryByUid = function (uid) {
            for (var i = 0; i < _this.currentNodeData.children.length; i++) {
                var node = _this.currentNodeData.children[i];
                if (node.uid === uid) {
                    node.hasBinary = false;
                    break;
                }
            }
        };
        this.initNode = function (node) {
            if (!node) {
                console.log("initNode has null node");
                return;
            }
            node.uid = util.getUidForId(_this.identToUidMap, node.id);
            node.properties = props.getPropertiesInEditingOrder(node.properties);
            node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);
            _this.uidToNodeMap[node.uid] = node;
            _this.idToNodeMap[node.id] = node;
        };
        this.initConstants = function () {
            util.addAll(_this.simpleModePropertyBlackList, [
                jcrCnst.MIXIN_TYPES,
                jcrCnst.PRIMARY_TYPE,
                jcrCnst.POLICY,
                jcrCnst.IMG_WIDTH,
                jcrCnst.IMG_HEIGHT,
                jcrCnst.BIN_VER,
                jcrCnst.BIN_DATA,
                jcrCnst.BIN_MIME,
                jcrCnst.COMMENT_BY,
                jcrCnst.PUBLIC_APPEND]);
            util.addAll(_this.readOnlyPropertyList, [
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
                jcrCnst.PUBLIC_APPEND]);
            util.addAll(_this.binaryPropertyList, [jcrCnst.BIN_DATA]);
        };
        this.initApp = function () {
            console.log("initApp running.");
            if (_this.appInitialized)
                return;
            _this.appInitialized = true;
            var tabs = util.poly("mainIronPages");
            var thiz = _this;
            tabs.addEventListener("iron-select", function () {
                thiz.tabChangeEvent(tabs.selected);
            });
            _this.initConstants();
            _this.displaySignupMessage();
            $(window).bind("beforeunload", function () {
                return "Leave Meta64 ?";
            });
            _this.deviceWidth = $(window).width();
            _this.deviceHeight = $(window).height();
            user.refreshLogin();
            _this.updateMainMenuPanel();
            _this.refreshAllGuiEnablement();
            util.initProgressMonitor();
            _this.processUrlParams();
        };
        this.processUrlParams = function () {
            var passCode = util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function () {
                    (new ChangePasswordDlg(passCode)).open();
                }, 100);
            }
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
            if (_this.currentNodeData) {
                if (meta64.currentNode.imgId) {
                    render.adjustImageSize(meta64.currentNode);
                }
                $.each(_this.currentNodeData.children, function (i, node) {
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
            }, _this.anonPageLoadResponse, _this);
        };
    }
    return Meta64;
}());
if (!window["meta64"]) {
    var meta64 = new Meta64();
}
console.log("running module: nav.js");
var Nav = (function () {
    function Nav() {
        var _this = this;
        this._UID_ROWID_SUFFIX = "_row";
        this.openMainMenuHelp = function () {
            window.open(window.location.origin + "?id=/meta64/public/help", "_blank");
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
            return !_this.displayingHome();
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
            if (!_this.parentVisibleToUser()) {
                return;
            }
            var ironRes = util.json("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": 1
            });
            var thiz = _this;
            ironRes.completes.then(function () {
                thiz.upLevelResponse(ironRes.response, meta64.currentNodeId);
            });
        };
        this.getSelectedDomElement = function () {
            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + _this._UID_ROWID_SUFFIX;
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
                        var nodeId = node.uid + _this._UID_ROWID_SUFFIX;
                        console.log("looking up using element id: " + nodeId);
                        return util.polyElm(nodeId);
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
        this.clickOnNodeRow = function (rowElm, uid) {
            var node = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                return;
            }
            meta64.highlightNode(node, false);
            if (meta64.editMode) {
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
        this.navHomeResponse = function (res) {
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
                util.json("renderNode", {
                    "nodeId": meta64.homeNodeId
                }, _this.navHomeResponse);
            }
        };
        this.navPublicHome = function () {
            meta64.loadAnonPageHome(true);
        };
        this.toggleMainMenu = function () {
        };
    }
    return Nav;
}());
if (!window["nav"]) {
    var nav = new Nav();
}
console.log("running module: prefs.js");
var Prefs = (function () {
    function Prefs() {
        var _this = this;
        this.closeAccountResponse = function () {
            $(window).off("beforeunload");
            window.location.href = window.location.origin;
        };
        this.closeAccount = function () {
            var thiz = _this;
            (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
                (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                    user.deleteAllUserCookies();
                    util.json("closeAccount", {}, thiz.closeAccountResponse);
                })).open();
            })).open();
        };
    }
    return Prefs;
}());
if (!window["prefs"]) {
    var prefs = new Prefs();
}
console.log("running module: props.js");
var Props = (function () {
    function Props() {
        var _this = this;
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
        this.getPropertiesInEditingOrder = function (props) {
            var propsNew = props.clone();
            var targetIdx = 0;
            var tagIdx = propsNew.indexOfItemByProp("name", jcrCnst.CONTENT);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            tagIdx = propsNew.indexOfItemByProp("name", jcrCnst.TAGS);
            if (tagIdx != -1) {
                propsNew.arrayMoveItem(tagIdx, targetIdx++);
            }
            return propsNew;
        };
        this.renderProperties = function (properties) {
            if (properties) {
                var ret = "<table class='property-text'>";
                var propCount = 0;
                ret += "<thead><tr><th></th><th></th></tr></thead>";
                ret += "<tbody>";
                $.each(properties, function (i, property) {
                    if (render.allowPropertyToDisplay(property.name)) {
                        var isBinaryProp = render.isBinaryProperty(property.name);
                        propCount++;
                        ret += "<tr class='prop-table-row'>";
                        ret += "<td class='prop-table-name-col'>" + render.sanitizePropertyName(property.name)
                            + "</td>";
                        if (isBinaryProp) {
                            ret += "<td class='prop-table-val-col'>[binary]</td>";
                        }
                        else if (!property.values) {
                            var val = property.htmlValue ? property.htmlValue : property.value;
                            ret += "<td class='prop-table-val-col'>" + render.wrapHtml(val) + "</td>";
                        }
                        else {
                            ret += "<td class='prop-table-val-col'>" + props.renderPropertyValues(property.values)
                                + "</td>";
                        }
                        ret += "</tr>";
                    }
                    else {
                        console.log("Hiding property: " + property.name);
                    }
                });
                if (propCount == 0) {
                    return "";
                }
                ret += "</tbody></table>";
                return ret;
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
            var prop = _this.getNodeProperty(propertyName, node);
            return prop ? prop.value : null;
        };
        this.isNonOwnedNode = function (node) {
            var createdBy = _this.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            if (!createdBy) {
                createdBy = "admin";
            }
            return createdBy != meta64.userName;
        };
        this.isNonOwnedCommentNode = function (node) {
            var commentBy = _this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != meta64.userName;
        };
        this.isOwnedCommentNode = function (node) {
            var commentBy = _this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == meta64.userName;
        };
        this.renderProperty = function (property) {
            if (!property.values) {
                if (!property.value || property.value.length == 0) {
                    return "";
                }
                return render.wrapHtml(property.htmlValue);
            }
            else {
                return _this.renderPropertyValues(property.values);
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
if (!window["props"]) {
    var props = new Props();
}
console.log("running module: render.js");
var Render = (function () {
    function Render() {
        var _this = this;
        this._debug = false;
        this._getEmptyPagePrompt = function () {
            return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
        };
        this._renderBinary = function (node) {
            if (node.binaryIsImage) {
                return _this.makeImageTag(node);
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
                headerText += "<div class='path-display'>Path: " + _this.formatPath(node) + "</div>";
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
            headerText = _this.tag("div", {
                "class": "header-text"
            }, headerText);
            return headerText;
        };
        this.injectCodeFormatting = function (content) {
            if (content.contains("<code")) {
                meta64.codeFormatDirty = true;
                content = _this.encodeLanguages(content);
                content = content.replaceAll("</code>", "</pre>");
            }
            return content;
        };
        this.injectSubstitutions = function (content) {
            return content.replaceAll("{{locationOrigin}}", window.location.origin);
        };
        this.encodeLanguages = function (content) {
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = content.replaceAll("<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = content.replaceAll("<code>", "<pre class='prettyprint'>");
            return content;
        };
        this.renderNodeContent = function (node, showPath, showName, renderBinary, rowStyling, showHeader) {
            var ret = _this.getTopRightImageTag(node);
            ret += showHeader ? _this.buildRowHeader(node, showPath, showName) : "";
            if (meta64.showProperties) {
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += properties;
                }
            }
            else {
                var contentProp = props.getNodeProperty(jcrCnst.CONTENT, node);
                if (contentProp) {
                    var jcrContent = props.renderProperty(contentProp);
                    jcrContent = "<div>" + jcrContent + "</div>";
                    if (jcrContent.length > 0) {
                        if (meta64.serverMarkdown) {
                            jcrContent = _this.injectCodeFormatting(jcrContent);
                            jcrContent = _this.injectSubstitutions(jcrContent);
                            if (rowStyling) {
                                ret += _this.tag("div", {
                                    "class": "jcr-content"
                                }, jcrContent);
                            }
                            else {
                                ret += _this.tag("div", {
                                    "class": "jcr-root-content"
                                }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                    + jcrContent);
                            }
                        }
                        else {
                            if (rowStyling) {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += _this.tag("script", {
                                    "type": "text/markdown"
                                }, jcrContent);
                            }
                            else {
                                ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                                ret += _this.tag("script", {
                                    "type": "text/markdown"
                                }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                    + jcrContent);
                            }
                            ret += "</div></marked-element>";
                        }
                    }
                    else {
                        ret += "<div>[No Content Text]</div>";
                        var properties = props.renderProperties(node.properties);
                        if (properties) {
                            ret += properties;
                        }
                    }
                }
                else {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    var properties = props.renderProperties(node.properties);
                    if (properties) {
                        ret += properties;
                    }
                }
            }
            if (renderBinary && node.hasBinary) {
                var binary = _this._renderBinary(node);
                if (ret.contains(cnst.INSERT_ATTACHMENT)) {
                    ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
                }
                else {
                    ret += binary;
                }
            }
            var tags = props.getNodePropertyVal(jcrCnst.TAGS, node);
            if (tags) {
                ret += _this.tag("div", {
                    "class": "tags-content"
                }, "Tags: " + tags);
            }
            return ret;
        };
        this.renderNodeAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            var canMoveUp = index > 0 && rowCount > 1;
            var canMoveDown = index < count - 1;
            var isRep = node.name.startsWith("rep:") ||
                node.path.contains("/rep:");
            var editingAllowed = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }
            var focusNode = meta64.getHighlightedNode();
            var selected = (focusNode && focusNode.uid === uid);
            var buttonBarHtmlRet = _this.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            var bkgStyle = _this.getNodeBkgImageStyle(node);
            var cssId = uid + "_row";
            return _this.tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
                "id": cssId,
                "style": bkgStyle
            }, buttonBarHtmlRet + _this.tag("div", {
                "id": uid + "_content"
            }, _this.renderNodeContent(node, true, true, true, true, true)));
        };
        this.showNodeUrl = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("You must first click on a node.")).open();
                return;
            }
            var path = node.path.stripIfStartsWith("/root");
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
                topRightImgTag = _this.tag("img", {
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
            return _this.tag("div", {
                "class": "horizontal center-justified layout " + classes
            }, buttons);
        };
        this.buttonBar = function (buttons, classes) {
            classes = classes || "";
            return _this.tag("div", {
                "class": "horizontal left-justified layout " + classes
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
                replyButton = _this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + node.uid + "');"
                }, "Reply");
            }
            var buttonCount = 0;
            if (_this.nodeHasChildren(node.uid)) {
                buttonCount++;
                openButton = _this.tag("paper-button", {
                    "class": "highlight-button",
                    "raised": "raised",
                    "onClick": "nav.openNode('" + node.uid + "');"
                }, "Open");
            }
            if (meta64.editMode) {
                var selected = meta64.selectedNodes[node.uid] ? true : false;
                buttonCount++;
                var css = selected ? {
                    "id": node.uid + "_sel",
                    "onClick": "nav.toggleNodeSel('" + node.uid + "');",
                    "checked": "checked"
                } :
                    {
                        "id": node.uid + "_sel",
                        "onClick": "nav.toggleNodeSel('" + node.uid + "');"
                    };
                selButton = _this.tag("paper-checkbox", css, "");
                if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    createSubNodeButton = _this.tag("paper-button", {
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + node.uid + "');"
                    }, "Add");
                }
                if (cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    insertNodeButton = _this.tag("paper-button", {
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": "edit.insertNode('" + node.uid + "');"
                    }, "Ins");
                }
            }
            if (meta64.editMode && editingAllowed) {
                buttonCount++;
                editNodeButton = _this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + node.uid + "');"
                }, "Edit");
                if (meta64.currentNode.childrenOrdered && !commentBy) {
                    if (canMoveUp) {
                        buttonCount++;
                        moveNodeUpButton = _this.tag("paper-button", {
                            "raised": "raised",
                            "onClick": "edit.moveNodeUp('" + node.uid + "');"
                        }, "Up");
                    }
                    if (canMoveDown) {
                        buttonCount++;
                        moveNodeDownButton = _this.tag("paper-button", {
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
            return allButtons.length > 0 ? _this.makeHorizontalFieldSet(allButtons) : "";
        };
        this.makeHorizontalFieldSet = function (content, extraClasses) {
            return _this.tag("div", {
                "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
            }, content, true);
        };
        this.makeHorzControlGroup = function (content) {
            return _this.tag("div", {
                "class": "horizontal layout"
            }, content, true);
        };
        this.makeRadioButton = function (label, id) {
            return _this.tag("paper-radio-button", {
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
            path = path.replaceAll("/", " / ");
            var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
            var noRootPath = shortPath;
            if (noRootPath.startsWith("/root")) {
                noRootPath = noRootPath.substring(0, 5);
            }
            var ret = meta64.isAdminUser ? shortPath : noRootPath;
            ret += " [" + node.primaryTypeName + "]";
            return ret;
        };
        this.wrapHtml = function (text) {
            return "<div>" + text + "</div>";
        };
        this.renderMainPageControls = function () {
            var html = '';
            var hasContent = html.length > 0;
            if (hasContent) {
                util.setHtmlEnhanced("mainPageControls", html);
            }
            util.setVisibility("#mainPageControls", hasContent);
        };
        this.renderPageFromData = function (data) {
            meta64.codeFormatDirty = false;
            console.log("render.renderPageFromData()");
            var newData = false;
            if (!data) {
                data = meta64.currentNodeData;
            }
            else {
                newData = true;
            }
            if (!data || !data.node) {
                util.setVisibility("#listView", false);
                $("#mainNodeContent").html("No content is available here.");
                return;
            }
            else {
                util.setVisibility("#listView", true);
            }
            _this.renderMainPageControls();
            meta64.treeDirty = false;
            if (newData) {
                meta64.uidToNodeMap = {};
                meta64.idToNodeMap = {};
                meta64.selectedNodes = {};
                meta64.initNode(data.node);
                meta64.setCurrentNodeData(data);
            }
            var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;
            if (_this._debug) {
                console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
            }
            var output = '';
            var bkgStyle = _this.getNodeBkgImageStyle(data.node);
            var mainNodeContent = _this.renderNodeContent(data.node, true, true, true, false, true);
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
                    replyButton = _this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.replyToComment('" + data.node.uid + "');"
                    }, "Reply");
                }
                if (meta64.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = _this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.createSubNode('" + uid + "');"
                    }, "Add");
                }
                if (edit.isEditAllowed(data.node)) {
                    editNodeButton = _this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.runEditNode('" + uid + "');"
                    }, "Edit");
                }
                var focusNode = meta64.getHighlightedNode();
                var selected = focusNode && focusNode.uid === uid;
                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar = _this.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }
                var content = _this.tag("div", {
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
            _this.renderMainPageControls();
            var rowCount = 0;
            if (data.children) {
                var childCount = data.children.length;
                var rowCount = 0;
                for (var i = 0; i < data.children.length; i++) {
                    var node = data.children[i];
                    var row = _this.generateRow(i, node, newData, childCount, rowCount);
                    if (row.length != 0) {
                        output += row;
                        rowCount++;
                    }
                }
            }
            if (edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !meta64.isAnonUser) {
                    output = _this._getEmptyPagePrompt();
                }
            }
            util.setHtmlEnhanced("listView", output);
            if (meta64.codeFormatDirty) {
                prettyPrint();
            }
            meta64.screenSizeChange();
            if (!meta64.getHighlightedNode()) {
                view.scrollToTop();
            }
            else {
                view.scrollToSelectedNode();
            }
        };
        this.generateRow = function (i, node, newData, childCount, rowCount) {
            if (meta64.isNodeBlackListed(node))
                return "";
            if (newData) {
                meta64.initNode(node);
                if (_this._debug) {
                    console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                }
            }
            rowCount++;
            var row = _this.renderNodeAsListItem(node, i, childCount, rowCount);
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
            var src = _this.getUrlForNodeAttachment(node);
            node.imgId = "imgUid_" + node.uid;
            if (node.width && node.height) {
                if (node.width > meta64.deviceWidth - 50) {
                    var width = meta64.deviceWidth - 50;
                    var height = width * node.height / node.width;
                    return _this.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": width + "px",
                        "height": height + "px"
                    }, null, false);
                }
                else {
                    return _this.tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": node.width + "px",
                        "height": node.height + "px"
                    }, null, false);
                }
            }
            else {
                return _this.tag("img", {
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
        this.makeTextArea = function (fieldName, fieldId) {
            return _this.tag("paper-textarea", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        };
        this.makeEditField = function (fieldName, fieldId) {
            return _this.tag("paper-input", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        };
        this.makePasswordField = function (fieldName, fieldId) {
            return _this.tag("paper-input", {
                "type": "password",
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        };
        this.makeButton = function (text, id, callback) {
            var attribs = {
                "raised": "raised",
                "id": id
            };
            if (callback != undefined) {
                attribs["onClick"] = callback;
            }
            return _this.tag("paper-button", attribs, text, true);
        };
        this.makeBackButton = function (text, id, domId, callback) {
            if (callback === undefined) {
                callback = "";
            }
            return _this.tag("paper-button", {
                "raised": "raised",
                "id": id,
                "onClick": "meta64.cancelDialog('" + domId + "');" + callback
            }, text, true);
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
if (!window["render"]) {
    var render = new Render();
}
console.log("running module: search.js");
var Srch = (function () {
    function Srch() {
        var _this = this;
        this._UID_ROWID_SUFFIX = "_srch_row";
        this.searchNodes = null;
        this.searchPageTitle = "Search Results";
        this.timelinePageTitle = "Timeline";
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
            if (_this.numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchDlg()).open();
            }
        };
        this.searchNodesResponse = function (res) {
            _this.searchResults = res;
            var content = searchResultsPanel.build();
            util.setHtmlEnhanced("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        };
        this.timelineResponse = function (res) {
            _this.timelineResults = res;
            var content = timelineResultsPanel.build();
            util.setHtmlEnhanced("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        };
        this.timeline = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }
            util.json("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "modSortDesc": true,
                "searchProp": "jcr:content"
            }, _this.timelineResponse);
        };
        this.initSearchNode = function (node) {
            node.uid = util.getUidForId(_this.identToUidMap, node.id);
            _this.uidToNodeMap[node.uid] = node;
        };
        this.populateSearchResultsPage = function (data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;
            var rowCount = 0;
            var thiz = _this;
            $.each(data.searchResults, function (i, node) {
                if (meta64.isNodeBlackListed(node))
                    return;
                thiz.initSearchNode(node);
                rowCount++;
                output += thiz.renderSearchResultAsListItem(node, i, childCount, rowCount);
            });
            util.setHtmlEnhanced(viewName, output);
        };
        this.renderSearchResultAsListItem = function (node, index, count, rowCount) {
            var uid = node.uid;
            console.log("renderSearchResult: " + uid);
            var cssId = uid + _this._UID_ROWID_SUFFIX;
            var buttonBarHtml = _this.makeButtonBarHtml("" + uid);
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
            _this.unhighlightRow();
            _this.highlightRowNode = _this.uidToNodeMap[uid];
            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        };
        this.clickSearchNode = function (uid) {
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            view.refreshTree(srch.highlightRowNode.id, true);
            meta64.selectTab("mainTabName");
        };
        this.unhighlightRow = function () {
            if (!_this.highlightRowNode) {
                return;
            }
            var nodeId = _this.highlightRowNode.uid + _this._UID_ROWID_SUFFIX;
            var elm = util.domElm(nodeId);
            if (elm) {
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        };
    }
    return Srch;
}());
if (!window["srch"]) {
    var srch = new Srch();
}
console.log("running module: share.js");
var Share = (function () {
    function Share() {
        var _this = this;
        this._findSharedNodesResponse = function (res) {
            srch.searchNodesResponse(res);
        };
        this.sharingNode = null;
        this.editNodeSharing = function () {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            _this.sharingNode = node;
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
            }, _this._findSharedNodesResponse, _this);
        };
    }
    return Share;
}());
if (!window["share"]) {
    var share = new Share();
}
console.log("running module: user.js");
var User = (function () {
    function User() {
        var _this = this;
        this._refreshLoginResponse = function (res) {
            console.log("refreshLoginResponse");
            if (res.success) {
                user.setStateVarsUsingLoginResponse(res);
                user.setTitleUsingLoginResponse(res);
            }
            meta64.loadAnonPageHome(false);
        };
        this._logoutResponse = function (res) {
            window.location.href = window.location.origin;
        };
        this._twitterLoginResponse = function (res) {
            console.log("twitter Login response recieved.");
        };
        this.isTestUserAccount = function () {
            return meta64.userName.toLowerCase() === "adam" ||
                meta64.userName.toLowerCase() === "bob" ||
                meta64.userName.toLowerCase() === "cory" ||
                meta64.userName.toLowerCase() === "dan";
        };
        this.setTitleUsingLoginResponse = function (res) {
            var title = BRANDING_TITLE;
            if (!meta64.isAnonUser) {
                title += " - " + res.userName;
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
            meta64.editModeOption = res.userPreferences.advancedMode ? meta64.MODE_ADVANCED : meta64.MODE_SIMPLE;
            console.log("from server: meta64.editModeOption=" + meta64.editModeOption);
        };
        this.twitterLogin = function () {
            (new MessageDlg("not yet implemented.")).open();
            return;
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
            var thiz = _this;
            var callUsr, callPwd, usingCookies = false;
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
                var ironRes = util.json("login", {
                    "userName": callUsr,
                    "password": callPwd,
                    "tzOffset": new Date().getTimezoneOffset(),
                    "dst": util.daylightSavingsTime
                });
                ironRes.completes.then(function () {
                    if (usingCookies) {
                        thiz.loginResponse(ironRes.response, callUsr, callPwd, usingCookies);
                    }
                    else {
                        thiz._refreshLoginResponse(ironRes.response);
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
                _this.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
            }
            util.json("logout", {}, _this._logoutResponse, _this);
        };
        this.login = function (loginDlg, usr, pwd) {
            var thiz = _this;
            var ironRes = util.json("login", {
                "userName": usr,
                "password": pwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": util.daylightSavingsTime
            });
            ironRes.completes.then(function () {
                thiz.loginResponse(ironRes.response, usr, pwd, null, loginDlg);
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
                    _this.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
                    _this.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                    _this.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
                }
                if (loginDlg) {
                    loginDlg.cancel();
                }
                _this.setStateVarsUsingLoginResponse(res);
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
                view.refreshTree(id, false);
                _this.setTitleUsingLoginResponse(res);
            }
            else {
                if (usingCookies) {
                    (new MessageDlg("Cookie login failed.")).open();
                    $.removeCookie(cnst.COOKIE_LOGIN_USR);
                    $.removeCookie(cnst.COOKIE_LOGIN_PWD);
                    _this.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
                    location.reload();
                }
            }
        };
    }
    return User;
}());
if (!window["user"]) {
    var user = new User();
}
console.log("running module: view.js");
var View = (function () {
    function View() {
        var _this = this;
        this.scrollToSelNodePending = false;
        this.updateStatusBar = function () {
            if (!meta64.currentNodeData)
                return;
            var statusLine = "";
            if (meta64.editModeOption === meta64.MODE_ADVANCED) {
                statusLine += "count: " + meta64.currentNodeData.children.length;
            }
            if (meta64.editMode) {
                statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
            }
        };
        this.refreshTreeResponse = function (res, targetId, renderParentIfLeaf, newId) {
            render.renderPageFromData(res);
            if (newId) {
                meta64.highlightRowById(newId, true);
            }
            else {
                if (targetId && renderParentIfLeaf && res.displayedParent) {
                    meta64.highlightRowById(targetId, true);
                }
                else {
                    _this.scrollToSelectedNode();
                }
            }
            meta64.refreshAllGuiEnablement();
        };
        this.refreshTree = function (nodeId, renderParentIfLeaf, newId) {
            if (!nodeId) {
                nodeId = meta64.currentNodeId;
            }
            console.log("Refreshing tree: nodeId=" + nodeId);
            var ironRes = util.json("renderNode", {
                "nodeId": nodeId,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false
            });
            var thiz = _this;
            ironRes.completes.then(function () {
                thiz.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
            });
        };
        this.scrollToSelectedNode = function () {
            _this.scrollToSelNodePending = true;
            var thiz = _this;
            setTimeout(function () {
                thiz.scrollToSelNodePending = false;
                var elm = nav.getSelectedPolyElement();
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
                else {
                    elm = util.polyElm("mainPaperTabs");
                    if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                        elm.node.scrollIntoView();
                    }
                }
            }, 1000);
        };
        this.scrollToTop = function () {
            if (_this.scrollToSelNodePending)
                return;
            var thiz = _this;
            setTimeout(function () {
                if (thiz.scrollToSelNodePending)
                    return;
                var elm = util.polyElm("mainPaperTabs");
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
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
            var ironRes = util.json("getServerInfo", {});
            ironRes.completes.then(function () {
                (new MessageDlg(ironRes.response.serverInfo)).open();
            });
        };
    }
    return View;
}());
if (!window["view"]) {
    var view = new View();
}
console.log("running module: menuPanel.js");
var MenuPanel = (function () {
    function MenuPanel() {
        var _this = this;
        this._makeTopLevelMenu = function (title, content) {
            return render.tag("paper-submenu", {
                "class": "meta64-menu-heading"
            }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" +
                _this._makeSecondLevelList(content), true);
        };
        this._makeSecondLevelList = function (content) {
            return render.tag("paper-menu", {
                "class": "menu-content my-menu-section",
                "multi": "multi"
            }, content, true);
        };
        this._menuItem = function (name, id, onClick) {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        };
        this._menuToggleItem = function (name, id, onClick) {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick
            }, name, true);
        };
        this.domId = "mainNavBar";
        this.build = function () {
            var editMenuItems = _this._menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") +
                _this._menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") +
                _this._menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
                _this._menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") +
                _this._menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
                _this._menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
                _this._menuItem("Export", "openExportDlg", "(new ExportDlg()).open();");
            var editMenu = _this._makeTopLevelMenu("Edit", editMenuItems);
            var attachmentMenuItems = _this._menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
                _this._menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
                _this._menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
            var attachmentMenu = _this._makeTopLevelMenu("Attach", attachmentMenuItems);
            var sharingMenuItems = _this._menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
                _this._menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
            var sharingMenu = _this._makeTopLevelMenu("Share", sharingMenuItems);
            var searchMenuItems = _this._menuItem("Text Search", "searchDlgButton", "(new SearchDlg()).open();") +
                _this._menuItem("Timeline", "timelineButton", "srch.timeline();");
            var searchMenu = _this._makeTopLevelMenu("Search", searchMenuItems);
            var viewOptionsMenuItems = _this._menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
                _this._menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
                _this._menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
                _this._menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();");
            var viewOptionsMenu = _this._makeTopLevelMenu("View", viewOptionsMenuItems);
            var myAccountItems = _this._menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
                _this._menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();") +
                _this._menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();") +
                _this._menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();");
            var myAccountMenu = _this._makeTopLevelMenu("Account", myAccountItems);
            var helpItems = _this._menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
            var mainMenuHelp = _this._makeTopLevelMenu("Help/Docs", helpItems);
            var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu
                + mainMenuHelp;
            util.setHtmlEnhanced(_this.domId, content);
        };
        this.init = function () {
            meta64.refreshAllGuiEnablement();
        };
    }
    return MenuPanel;
}());
if (!window["menuPanel"]) {
    var menuPanel = new MenuPanel();
}
console.log("running module: DialogBase.js");
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
            var modalsContainer = util.polyElm("modalsContainer");
            var id = _this.id(_this.domId);
            var node = document.createElement("paper-dialog");
            node.setAttribute("id", id);
            modalsContainer.node.appendChild(node);
            node.style.border = "3px solid gray";
            Polymer.dom.flush();
            Polymer.updateStyles();
            var content = _this.build();
            util.setHtmlEnhanced(id, content);
            _this.built = true;
            if (_this.init) {
                _this.init();
            }
            console.log("Showing dialog: " + id);
            var polyElm = util.polyElm(id);
            polyElm.node.refit();
            polyElm.node.constrain();
            polyElm.node.center();
            polyElm.node.open();
        };
        this.cancel = function () {
            var polyElm = util.polyElm(_this.id(_this.domId));
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
            return render.makePasswordField(text, _this.id(id));
        };
        this.makeEditField = function (fieldName, id) {
            id = _this.id(id);
            return render.tag("paper-input", {
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
            return render.tag("p", attrs, message);
        };
        this.makeButton = function (text, id, callback, ctx) {
            var attribs = {
                "raised": "raised",
                "id": _this.id(id)
            };
            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }
            return render.tag("paper-button", attribs, text, true);
        };
        this.makeCloseButton = function (text, id, callback, ctx) {
            var attribs = {
                "raised": "raised",
                "dialog-confirm": "dialog-confirm",
                "id": _this.id(id)
            };
            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
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
        this.makeHeader = function (text, id, centered) {
            var attrs = {
                "class": "dialog-header " + (centered ? "horizontal center-justified layout" : "")
            };
            if (id) {
                attrs["id"] = _this.id(id);
            }
            return render.tag("h2", attrs, text);
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
        meta64.registerDataObject(this);
        meta64.registerDataObject(this.data);
    }
    return DialogBase;
}());
console.log("running module: ConfirmDlg.js");
var ConfirmDlg = (function (_super) {
    __extends(ConfirmDlg, _super);
    function ConfirmDlg(title, message, buttonText, callback) {
        var _this = this;
        _super.call(this, "ConfirmDlg");
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.callback = callback;
        this.build = function () {
            var content = _this.makeHeader("", "ConfirmDlgTitle") + _this.makeMessageArea("", "ConfirmDlgMessage");
            var buttons = _this.makeCloseButton("Yes", "ConfirmDlgYesButton", _this.callback)
                + _this.makeCloseButton("No", "ConfirmDlgNoButton");
            content += render.centeredButtonBar(buttons);
            return content;
        };
        this.init = function () {
            _this.setHtml(_this.title, "ConfirmDlgTitle");
            _this.setHtml(_this.message, "ConfirmDlgMessage");
            _this.setHtml(_this.buttonText, "ConfirmDlgYesButton");
        };
    }
    return ConfirmDlg;
}(DialogBase));
console.log("running module: ProgressDlg.js");
var ProgressDlg = (function (_super) {
    __extends(ProgressDlg, _super);
    function ProgressDlg() {
        var _this = this;
        _super.call(this, "ProgressDlg");
        this.build = function () {
            var header = _this.makeHeader("Processing Request", "", true);
            var progressBar = render.tag("paper-progress", {
                "indeterminate": "indeterminate",
                "value": "800",
                "min": "100",
                "max": "1000"
            });
            var barContainer = render.tag("div", {
                "style": "width:280px; margin:24px;",
                "class": "horizontal center-justified layout"
            }, progressBar);
            return header + barContainer;
        };
    }
    return ProgressDlg;
}(DialogBase));
console.log("running module: MessageDlg.js");
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
            content += render.centeredButtonBar(_this.makeCloseButton("Ok", "messageDlgOkButton", _this.callback));
            return content;
        };
        if (this.title == null) {
            this.title = "Message";
        }
        this.title = title;
    }
    return MessageDlg;
}(DialogBase));
console.log("running module: LoginDlg.js");
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
            var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
            var twitterButton = _this.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
            var socialButtonBar = render.makeHorzControlGroup(twitterButton);
            var divider = "<div><h3>Or Login With...</h3></div>";
            var form = formControls + buttonBar;
            var mainContent = form;
            var content = header + mainContent;
            _this.bindEnterKey("userName", user.login);
            _this.bindEnterKey("password", user.login);
            return content;
        };
        this.init = function () {
            _this.populateFromCookies();
        };
        this.populateFromCookies = function () {
            var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
            var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
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
            user.login(_this, usr, pwd);
        };
        this.resetPassword = function () {
            var thiz = _this;
            var usr = _this.getInputVal("userName");
            (new ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
                thiz.cancel();
                (new ResetPasswordDlg(usr)).open();
            })).open();
        };
    }
    return LoginDlg;
}(DialogBase));
console.log("running module: SignupDlg.js");
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
        this.signup = function () {
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
                "useName": userName,
                "pasword": password,
                "mail": email,
                "catcha": captcha
            }, _this.signupResponse, _this);
        };
        this.signupResponse = function (res) {
            if (util.checkSuccess("Signup new user", res)) {
                _this.cancel();
                (new MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
            }
        };
        this.tryAnotherCaptcha = function () {
            var n = util.currentTimeMillis();
            var src = postTargetUrl + "captcha?t=" + n;
            $("#" + _this.id("captchaImage")).attr("src", src);
        };
        this.pageInitSignupPg = function () {
            _this.tryAnotherCaptcha();
        };
        this.init = function () {
            _this.pageInitSignupPg();
            util.delayedFocus("#" + _this.id("signupUserName"));
        };
    }
    return SignupDlg;
}(DialogBase));
console.log("running module: PrefsDlg.js");
var PrefsDlg = (function (_super) {
    __extends(PrefsDlg, _super);
    function PrefsDlg() {
        var _this = this;
        _super.call(this, "PrefsDlg");
        this.build = function () {
            var header = _this.makeHeader("Account Peferences");
            var radioButtons = _this.makeRadioButton("Simple", "editModeSimple") +
                _this.makeRadioButton("Advanced", "editModeAdvanced");
            var radioButtonGroup = render.tag("paper-radio-group", {
                "id": _this.id("simpleModeRadioGroup"),
                "selected": _this.id("editModeSimple")
            }, radioButtons);
            var formControls = radioButtonGroup;
            var legend = "<legend>Edit Mode:</legend>";
            var radioBar = render.makeHorzControlGroup(legend + formControls);
            var saveButton = _this.makeCloseButton("Save", "savePreferencesButton", _this.savePreferences, _this);
            var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
            var buttonBar = render.centeredButtonBar(saveButton + backButton);
            return header + radioBar + buttonBar;
        };
        this.savePreferences = function () {
            var polyElm = util.polyElm(_this.id("simpleModeRadioGroup"));
            meta64.editModeOption = polyElm.node.selected == _this.id("editModeSimple") ? meta64.MODE_SIMPLE
                : meta64.MODE_ADVANCED;
            util.json("saveUserPreferences", {
                "userPreferences": {
                    "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED
                }
            }, _this.savePreferencesResponse, _this);
        };
        this.savePreferencesResponse = function (res) {
            if (util.checkSuccess("Saving Preferences", res)) {
                meta64.selectTab("mainTabName");
                meta64.refresh();
            }
        };
        this.init = function () {
            var polyElm = util.polyElm(_this.id("simpleModeRadioGroup"));
            polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? _this.id("editModeSimple") : _this
                .id("editModeAdvanced"));
            Polymer.dom.flush();
        };
    }
    return PrefsDlg;
}(DialogBase));
console.log("running module: ManageAccountDlg.js");
var ManageAccountDlg = (function (_super) {
    __extends(ManageAccountDlg, _super);
    function ManageAccountDlg() {
        var _this = this;
        _super.call(this, "ManageAccountDlg");
        this.build = function () {
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
    }
    return ManageAccountDlg;
}(DialogBase));
console.log("running module: ExportDlg.js");
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
            var buttonBar = render.centeredButtonBar(exportButton + backButton);
            return header + formControls + buttonBar;
        };
        this.exportNodes = function () {
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
        this.exportResponse = function (res) {
            if (util.checkSuccess("Export", res)) {
                (new MessageDlg("Export Successful.")).open();
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
    }
    return ExportDlg;
}(DialogBase));
console.log("running module: ImportDlg.js");
var ImportDlg = (function (_super) {
    __extends(ImportDlg, _super);
    function ImportDlg() {
        var _this = this;
        _super.call(this, "ImportDlg");
        this.build = function () {
            var header = _this.makeHeader("Import from XML");
            var formControls = _this.makeEditField("Import Target Node Name", "importTargetNodeName");
            var importButton = _this.makeButton("Import", "importNodesButton", _this.importNodes, _this);
            var backButton = _this.makeCloseButton("Close", "cancelImportButton");
            var buttonBar = render.centeredButtonBar(importButton + backButton);
            return header + formControls + buttonBar;
        };
        this.importNodes = function () {
            var highlightNode = meta64.getHighlightedNode();
            var sourceFileName = _this.getInputVal("importTargetNodeName");
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
        this.importResponse = function (res) {
            if (util.checkSuccess("Import", res)) {
                (new MessageDlg("Import Successful.")).open();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        };
    }
    return ImportDlg;
}(DialogBase));
console.log("running module: SearchDlg.js");
var SearchDlg = (function (_super) {
    __extends(SearchDlg, _super);
    function SearchDlg() {
        var _this = this;
        _super.call(this, "SearchDlg");
        this.build = function () {
            var header = _this.makeHeader("Search");
            var instructions = _this.makeMessageArea("Enter some text to find. All sub-nodes under the selected node are included in the search.");
            var formControls = _this.makeEditField("Search", "searchText");
            var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchNodes, _this);
            var searchTagsButton = _this.makeCloseButton("Search Tags", "searchTagsButton", _this.searchTags, _this);
            var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + searchTagsButton + backButton);
            var content = header + instructions + formControls + buttonBar;
            _this.bindEnterKey("searchText", srch.searchNodes);
            return content;
        };
        this.searchNodes = function () {
            return _this.searchProperty("jcr:content");
        };
        this.searchTags = function () {
            return _this.searchProperty(jcrCnst.TAGS);
        };
        this.searchProperty = function (searchProp) {
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
                "modSortDesc": false,
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        };
        this.init = function () {
            util.delayedFocus(_this.id("searchText"));
        };
    }
    return SearchDlg;
}(DialogBase));
console.log("running module: ChangePasswordDlg.js");
var ChangePasswordDlg = (function (_super) {
    __extends(ChangePasswordDlg, _super);
    function ChangePasswordDlg(passCode) {
        var _this = this;
        _super.call(this, "ChangePasswordDlg");
        this.passCode = passCode;
        this.build = function () {
            var header = _this.makeHeader(_this.passCode ? "Password Reset" : "Change Password");
            var message = render.tag("p", {}, "Enter your new password below...");
            var formControls = _this.makePasswordField("New Password", "changePassword1");
            var changePasswordButton = _this.makeCloseButton("Change Password", "changePasswordActionButton", _this.changePassword, _this);
            var backButton = _this.makeCloseButton("Close", "cancelChangePasswordButton");
            var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);
            return header + message + formControls + buttonBar;
        };
        this.changePassword = function () {
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
        this.changePasswordResponse = function (res) {
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
        this.init = function () {
            _this.focus("changePassword1");
        };
    }
    return ChangePasswordDlg;
}(DialogBase));
console.log("running module: ResetPasswordDlg.js");
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
            var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);
            return header + message + formControls + buttonBar;
        };
        this.resetPassword = function () {
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
        this.resetPasswordResponse = function (res) {
            if (util.checkSuccess("Reset password", res)) {
                (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
            }
        };
        this.init = function () {
            if (_this.user) {
                _this.setInputVal("userName", _this.user);
            }
        };
    }
    return ResetPasswordDlg;
}(DialogBase));
console.log("running module: UploadFromFileDlg.js");
var UploadFromFileDlg = (function (_super) {
    __extends(UploadFromFileDlg, _super);
    function UploadFromFileDlg() {
        var _this = this;
        _super.call(this, "UploadFromFileDlg");
        this.build = function () {
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
        this.uploadFileNow = function () {
            $("#" + _this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
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
        this.init = function () {
            $("#" + _this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        };
    }
    return UploadFromFileDlg;
}(DialogBase));
console.log("running module: UploadFromUrlDlg.js");
var UploadFromUrlDlg = (function (_super) {
    __extends(UploadFromUrlDlg, _super);
    function UploadFromUrlDlg() {
        var _this = this;
        _super.call(this, "UploadFromUrlDlg");
        this.build = function () {
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
        this.uploadFileNow = function () {
            var sourceUrl = _this.getInputVal("uploadFromUrl");
            if (sourceUrl) {
                util.json("uploadFromUrl", {
                    "nodeId": attachment.uploadNode.id,
                    "sourceUrl": sourceUrl
                }, _this.uploadFromUrlResponse, _this);
            }
        };
        this.uploadFromUrlResponse = function (res) {
            if (util.checkSuccess("Upload from URL", res)) {
                meta64.refresh();
            }
        };
        this.init = function () {
            util.setInputVal(_this.id("uploadFromUrl"), "");
            $("#" + _this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        };
    }
    return UploadFromUrlDlg;
}(DialogBase));
console.log("running module: EditNodeDlg.js");
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
            var addTagsPropertyButton = _this.makeButton("Add Tags Property", "addTagsPropertyButton", _this.addTagsProperty, _this);
            var cancelEditButton = _this.makeCloseButton("Close", "cancelEditButton", "edit.cancelEdit();", _this);
            var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton
                + cancelEditButton, "buttons");
            var width = window.innerWidth * 0.6;
            var height = window.innerHeight * 0.4;
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
                style: "padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll;"
            }, "Loading...");
            return header + internalMainContent + buttonBar;
        };
        this.populateEditNodePg = function () {
            view.initEditPathDisplayById(_this.id("editNodePathDisplay"));
            var fields = "";
            var counter = 0;
            _this.fieldIdToPropMap = {};
            _this.propEntries = new Array();
            if (edit.editNode) {
                console.log("Editing existing node.");
                var thiz = _this;
                var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode.properties);
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
                    fields += render.tag("div", {}, field);
                }
            }
            util.setHtmlEnhanced(_this.id("propertyEditFieldContainer"), fields);
            if (cnst.USE_ACE_EDITOR) {
                for (var i = 0; i < aceFields.length; i++) {
                    var editor = ace.edit(aceFields[i].id);
                    editor.setValue(aceFields[i].val.unencodeHtml());
                    meta64.aceEditorsById[aceFields[i].id] = editor;
                }
            }
            var instr = edit.editingUnsavedNode ?
                "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                :
                    "";
            $("#" + _this.id("editNodeInstructions")).html(instr);
            util.setVisibility("#" + _this.id("addPropertyButton"), !edit.editingUnsavedNode);
            var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
            util.setVisibility("#" + _this.id("addTagsPropertyButton"), !tagsPropExists);
        };
        this.toggleShowReadOnly = function () {
        };
        this.addProperty = function () {
            _this.editPropertyDlgInst = new EditPropertyDlg(_this);
            _this.editPropertyDlgInst.open();
        };
        this.addTagsProperty = function () {
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
        this.addTagsPropertyResponse = function (res) {
            if (util.checkSuccess("Add Tags Property", res)) {
                _this.savePropertyResponse(res);
            }
        };
        this.savePropertyResponse = function (res) {
            util.checkSuccess("Save properties", res);
            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;
            if (_this.domId != "EditNodeDlg") {
                console.log("error: incorrect object for EditNodeDlg");
            }
            _this.populateEditNodePg();
        };
        this.makePropertyEditButtonBar = function (prop, fieldId) {
            var buttonBar = "";
            var clearButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "meta64.getObjectByGuid(" + _this.guid + ").clearProperty('" + fieldId + "');"
            }, "Clear");
            var addMultiButton = "";
            var deleteButton = "";
            if (prop.name !== jcrCnst.CONTENT) {
                deleteButton = render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "meta64.getObjectByGuid(" + _this.guid + ").deleteProperty('" + prop.name + "');"
                }, "Del");
            }
            var allButtons = addMultiButton + clearButton + deleteButton;
            if (allButtons.length > 0) {
                buttonBar = render.makeHorizontalFieldSet(allButtons, "property-edit-button-bar");
            }
            else {
                buttonBar = "";
            }
            return buttonBar;
        };
        this.addSubProperty = function (fieldId) {
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
        this.deleteProperty = function (propName) {
            var thiz = _this;
            (new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
                thiz.deletePropertyImmediate(propName);
            })).open();
        };
        this.deletePropertyImmediate = function (propName) {
            var ironRes = util.json("deleteProperty", {
                "nodeId": edit.editNode.id,
                "propName": propName
            });
            var thiz = _this;
            ironRes.completes.then(function () {
                thiz.deletePropertyResponse(ironRes.response, propName);
            });
        };
        this.deletePropertyResponse = function (res, propertyToDelete) {
            if (util.checkSuccess("Delete property", res)) {
                props.deletePropertyFromLocalData(propertyToDelete);
                meta64.treeDirty = true;
                _this.populateEditNodePg();
            }
        };
        this.clearProperty = function (fieldId) {
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
        this.saveNode = function () {
            if (edit.editingUnsavedNode) {
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
                    "newNodeName": newNodeName
                }, edit.insertNodeResponse, edit);
            }
            else {
                util.json("createSubNode", {
                    "nodeId": edit.parentOfNewNode.id,
                    "newNodeName": newNodeName
                }, edit.createSubNodeResponse, edit);
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
                util.json("saveNode", postData, edit.saveNodeResponse, edit, {
                    savedId: edit.editNode.id
                });
                edit.sendNotificationPendingSave = false;
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
            return fields;
        };
        this.makeSinglePropEditor = function (propEntry, aceFields) {
            console.log("Property single-type: " + propEntry.property.name);
            var field = "";
            var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
            var label = render.sanitizePropertyName(propEntry.property.name);
            var propValStr = propVal ? propVal : '';
            propValStr = propValStr.escapeForAttrib();
            console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.val
                + "] fieldId=" + propEntry.id);
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
            return field;
        };
        this.init = function () {
            console.log("EditNodeDlg.init");
            _this.populateEditNodePg();
        };
        this.fieldIdToPropMap = {};
        this.propEntries = new Array();
    }
    return EditNodeDlg;
}(DialogBase));
console.log("running module: EditPropertyDlg.js");
var EditPropertyDlg = (function (_super) {
    __extends(EditPropertyDlg, _super);
    function EditPropertyDlg(editNodeDlg) {
        var _this = this;
        _super.call(this, "EditPropertyDlg");
        this.build = function () {
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
        this.populatePropertyEdit = function () {
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
            util.setHtmlEnhanced(_this.id("addPropertyFieldContainer"), field);
        };
        this.saveProperty = function () {
            var propertyNameData = util.getInputVal(_this.id("addPropertyNameTextContent"));
            var propertyValueData = util.getInputVal(_this.id("addPropertyValueTextContent"));
            var postData = {
                nodeId: edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: propertyValueData
            };
            util.json("saveProperty", postData, _this.savePropertyResponse, _this);
        };
        this.savePropertyResponse = function (res) {
            util.checkSuccess("Save properties", res);
            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;
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
}(DialogBase));
console.log("running module: ShareToPersonDlg.js");
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
            var buttonBar = render.centeredButtonBar(shareButton + backButton);
            return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                + buttonBar;
        };
        this.shareNodeToPerson = function () {
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
                "privileges": ["read", "write", "addChildren", "nodeTypeManagement"]
            }, thiz.reloadFromShareWithPerson, thiz);
        };
        this.reloadFromShareWithPerson = function (res) {
            if (util.checkSuccess("Share Node with Person", res)) {
                (new SharingDlg()).open();
            }
        };
    }
    return ShareToPersonDlg;
}(DialogBase));
console.log("running module: SharingDlg.js");
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
            var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
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
            util.json("getNodePrivileges", {
                "nodeId": share.sharingNode.id,
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
                html += render.tag("div", {
                    "class": "privilege-list"
                }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
            });
            var thiz = _this;
            var publicAppendAttrs = {
                "onClick": "meta64.getObjectByGuid(" + thiz.guid + ").publicCommentingChanged();",
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
            util.setHtmlEnhanced(_this.id("sharingListFieldContainer"), html);
        };
        this.publicCommentingChanged = function () {
            var thiz = _this;
            setTimeout(function () {
                var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));
                meta64.treeDirty = true;
                util.json("addPrivilege", {
                    "nodeId": share.sharingNode.id,
                    "publicAppend": polyElm.node.checked ? "true" : "false"
                });
            }, 250);
        };
        this.removePrivilege = function (principal, privilege) {
            meta64.treeDirty = true;
            util.json("removePrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": principal,
                "privilege": privilege
            }, _this.removePrivilegeResponse, _this);
        };
        this.removePrivilegeResponse = function (res) {
            util.json("getNodePrivileges", {
                "nodeId": share.sharingNode.path,
                "includeAcl": true,
                "includeOwners": true
            }, _this.getNodePrivilegesResponse, _this);
        };
        this.renderAclPrivileges = function (principal, aclEntry) {
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
        this.shareNodeToPersonPg = function () {
            (new ShareToPersonDlg()).open();
        };
        this.shareNodeToPublic = function () {
            console.log("Sharing node to public.");
            meta64.treeDirty = true;
            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": "everyone",
                "privileges": ["read"]
            }, _this.reload, _this);
        };
    }
    return SharingDlg;
}(DialogBase));
console.log("running module: RenameNodeDlg.js");
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
            var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);
            return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
        };
        this.renameNode = function () {
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
            var ironRes = util.json("renameNode", {
                "nodeId": highlightNode.id,
                "newName": newName
            });
            var thiz = _this;
            ironRes.completes.then(function () {
                thiz.renameNodeResponse(ironRes.response, renamingRootNode);
            });
        };
        this.renameNodeResponse = function (res, renamingPageRoot) {
            if (util.checkSuccess("Rename node", res)) {
                if (renamingPageRoot) {
                    view.refreshTree(res.newId, true);
                }
                else {
                    view.refreshTree(null, false, res.newId);
                }
            }
        };
        this.init = function () {
            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                return;
            }
            $("#" + _this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
            $("#" + _this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
        };
    }
    return RenameNodeDlg;
}(DialogBase));
console.log("running module: searchResultsPanel.js");
var searchResultsPanel = function () {
    var _ = {
        domId: "searchResultsPanel",
        tabId: "searchTabName",
        visible: false,
        build: function () {
            var header = "<h2 id='searchPageTitle'></h2>";
            var mainContent = "<div id='searchResultsView'></div>";
            return header + mainContent;
        },
        init: function () {
            $("#searchPageTitle").html(srch.searchPageTitle);
            srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
        }
    };
    return _;
}();
console.log("running module: timelineResultsPanel.js");
var timelineResultsPanel = function () {
    var _ = {
        domId: "timelineResultsPanel",
        tabId: "timelineTabName",
        visible: false,
        build: function () {
            var header = "<h2 id='timelinePageTitle'></h2>";
            var mainContent = "<div id='timelineView'></div>";
            return header + mainContent;
        },
        init: function () {
            $("#timelinePageTitle").html(srch.timelinePageTitle);
            srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
        }
    };
    return _;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2FwcC50cyIsIi4uL3RzL2Nuc3QudHMiLCIuLi90cy9tb2RlbHMudHMiLCIuLi90cy91dGlsLnRzIiwiLi4vdHMvamNyQ25zdC50cyIsIi4uL3RzL2F0dGFjaG1lbnQudHMiLCIuLi90cy9lZGl0LnRzIiwiLi4vdHMvbWV0YTY0LnRzIiwiLi4vdHMvbmF2LnRzIiwiLi4vdHMvcHJlZnMudHMiLCIuLi90cy9wcm9wcy50cyIsIi4uL3RzL3JlbmRlci50cyIsIi4uL3RzL3NlYXJjaC50cyIsIi4uL3RzL3NoYXJlLnRzIiwiLi4vdHMvdXNlci50cyIsIi4uL3RzL3ZpZXcudHMiLCIuLi90cy9tZW51LnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tVXJsRGxnLnRzIiwiLi4vdHMvZGxnL0VkaXROb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0VkaXRQcm9wZXJ0eURsZy50cyIsIi4uL3RzL2RsZy9TaGFyZVRvUGVyc29uRGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJpbmdEbGcudHMiLCIuLi90cy9kbGcvUmVuYW1lTm9kZURsZy50cyIsIi4uL3RzL3BhbmVsL3NlYXJjaFJlc3VsdHNQYW5lbC50cyIsIi4uL3RzL3BhbmVsL3RpbWVsaW5lUmVzdWx0c1BhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsWUFBWSxDQUFDO0FBUWIsSUFBSSxRQUFRLEdBQUcsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7SUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ2pELE1BQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU1GO0FBRUEsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBR3pDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFJekMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFVBQVMsQ0FB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QUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUM1RSxDQUFDO0tBQ0osQ0FBQztJQUVGLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDYixDQUFDLEVBQUcsQ0FBQztBQ3ZCTCxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFFdkQsSUFBSSxvQkFBb0IsR0FBRztJQUd2QixJQUFJLENBQUMsR0FBRztRQUNKLEtBQUssRUFBRSxzQkFBc0I7UUFDN0IsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixPQUFPLEVBQUUsS0FBSztRQUVkLEtBQUssRUFBRTtZQUNILElBQUksTUFBTSxHQUFHLGtDQUFrQyxDQUFDO1lBQ2hELElBQUksV0FBVyxHQUFHLCtCQUErQixDQUFDO1lBQ2xELE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLENBQUM7UUFFRCxJQUFJLEVBQUU7WUFDRixDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDekUsQ0FBQztLQUNKLENBQUM7SUFFRixNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2IsQ0FBQyxFQUFHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxuLy8gdmFyIG9ucmVzaXplID0gd2luZG93Lm9ucmVzaXplO1xuLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHsgaWYgKHR5cGVvZiBvbnJlc2l6ZSA9PT0gJ2Z1bmN0aW9uJykgb25yZXNpemUoKTsgLyoqIC4uLiAqLyB9XG5cbnZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChvYmplY3QuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RbXCJvblwiICsgdHlwZV0gPSBjYWxsYmFjaztcbiAgICB9XG59O1xuXG4vKlxuICogV0FSTklORzogVGhpcyBpcyBjYWxsZWQgaW4gcmVhbHRpbWUgd2hpbGUgdXNlciBpcyByZXNpemluZyBzbyBhbHdheXMgdGhyb3R0bGUgYmFjayBhbnkgcHJvY2Vzc2luZyBzbyB0aGF0IHlvdSBkb24ndFxuICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAqL1xuZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiV2luZG93UmVzaXplOiB3PVwiICsgd2luZG93LmlubmVyV2lkdGggKyBcIiBoPVwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemUpO1xuXG4vLyBUaGlzIGlzIG91ciB0ZW1wbGF0ZSBlbGVtZW50IGluIGluZGV4Lmh0bWxcbnZhciBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyk7XG5cbi8vIExpc3RlbiBmb3IgdGVtcGxhdGUgYm91bmQgZXZlbnQgdG8ga25vdyB3aGVuIGJpbmRpbmdzXG4vLyBoYXZlIHJlc29sdmVkIGFuZCBjb250ZW50IGhhcyBiZWVuIHN0YW1wZWQgdG8gdGhlIHBhZ2VcbmFwcC5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ2FwcCByZWFkeSBldmVudCEnKTtcbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9seW1lci1yZWFkeScsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZygncG9seW1lci1yZWFkeSBldmVudCEnKTtcbn0pO1xuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogY25zdC5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIGNvb2tpZVByZWZpeDtcclxuXHJcbi8vdG9kby0wOiB0eXBlc2NyaXB0IHdpbGwgbm93IGxldCB1cyBqdXN0IGRvIHRoaXM6IGNvbnN0IHZhcj0ndmFsdWUnO1xyXG5jbGFzcyBDbnN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHZhck5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRpbmcgY25zdCB2YXJOYW1lID1cIiArIHZhck5hbWUpO1xyXG4gICAgfVxyXG4gICAgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgIENPT0tJRV9MT0dJTl9VU1I6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Vc3JcIjtcclxuICAgIENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgIC8qXHJcbiAgICAgKiBsb2dpblN0YXRlPVwiMFwiIGlmIHVzZXIgbG9nZ2VkIG91dCBpbnRlbnRpb25hbGx5LiBsb2dpblN0YXRlPVwiMVwiIGlmIGxhc3Qga25vd24gc3RhdGUgb2YgdXNlciB3YXMgJ2xvZ2dlZCBpbidcclxuICAgICAqL1xyXG4gICAgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgIEJSOiBcIjxkaXYgY2xhc3M9J3ZlcnQtc3BhY2UnPjwvZGl2PlwiO1xyXG4gICAgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBJTlNfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICogb24uXHJcbiAgICAgKi9cclxuICAgIFVTRV9BQ0VfRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcImNuc3RcIl0pIHtcclxuICAgIHZhciBjbnN0OiBDbnN0ID0gbmV3IENuc3QoXCJjbnN0XCIpO1xyXG59XHJcblxyXG4vL2V4cG9ydCB2YXIgY25zdDogQ25zdCA9IG5ldyBDbnN0KFwiY25zdFwiKTtcclxuIiwiXG5jbGFzcyBQcm9wRW50cnkge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgcHJvcGVydHk6IFByb3BlcnR5SW5mbywgLy9cbiAgICAgICAgcHVibGljIG11bHRpOiBib29sZWFuLCAvL1xuICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyBiaW5hcnk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyBzdWJQcm9wczogU3ViUHJvcFtdKSB7XG4gICAgfVxufVxuXG5jbGFzcyBTdWJQcm9wIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHZhbDogc3RyaW5nKSB7XG4gICAgfVxufVxuXG5jbGFzcyBOb2RlSW5mbyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyBwcmltYXJ5VHlwZU5hbWU6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHByb3BlcnRpZXM6IFByb3BlcnR5SW5mb1tdLCAvL1xuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRyZW46IGJvb2xlYW4sLy9cbiAgICAgICAgcHVibGljIGhhc0JpbmFyeTogYm9vbGVhbiwvL1xuICAgICAgICBwdWJsaWMgYmluYXJ5SXNJbWFnZTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIGJpblZlcjogbnVtYmVyLCAvL1xuICAgICAgICBwdWJsaWMgd2lkdGg6IG51bWJlciwgLy9cbiAgICAgICAgcHVibGljIGhlaWdodDogbnVtYmVyLCAvL1xuICAgICAgICBwdWJsaWMgY2hpbGRyZW5PcmRlcmVkOiBib29sZWFuKSB7XG4gICAgfVxufVxuXG5jbGFzcyBQcm9wZXJ0eUluZm8ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBudW1iZXIsIC8vXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgdmFsdWVzOiBzdHJpbmdbXSwgLy9cbiAgICAgICAgcHVibGljIGh0bWxWYWx1ZTogc3RyaW5nKSB7XG4gICAgfVxufVxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG4vL3RvZG8tMDogbmVlZCB0byBmaW5kIHRoZSBEZWZpbml0ZWx5VHlwZWQgZmlsZSBmb3IgUG9seW1lci5cclxuZGVjbGFyZSB2YXIgUG9seW1lcjtcclxuZGVjbGFyZSB2YXIgJDsgLy88LS0tLS0tLS0tLS0tLXRoaXMgd2FzIGEgd2lsZGFzcyBndWVzcy5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xyXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbmludGVyZmFjZSBfSGFzUm9vdCB7XHJcbiAgICByb290PzogYW55O1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFycmF5IHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL1dBUk5JTkc6IFRoZXNlIHByb3RvdHlwZSBmdW5jdGlvbnMgbXVzdCBiZSBkZWZpbmVkIG91dHNpZGUgYW55IGZ1bmN0aW9ucy5cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHRcdFx0XHRjbG9uZSgpOiBBcnJheTxUPjtcclxuXHRcdFx0XHRpbmRleE9mSXRlbUJ5UHJvcChwcm9wTmFtZSwgcHJvcFZhbCk6IG51bWJlcjtcclxuXHRcdFx0XHRhcnJheU1vdmVJdGVtKGZyb21JbmRleCwgdG9JbmRleCk6IHZvaWQ7XHJcblx0XHRcdFx0aW5kZXhPZk9iamVjdChvYmo6IGFueSk6IG51bWJlcjtcclxufTtcclxuXHJcbkFycmF5LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCk7XHJcbn07XHJcblxyXG5BcnJheS5wcm90b3R5cGUuaW5kZXhPZkl0ZW1CeVByb3AgPSBmdW5jdGlvbihwcm9wTmFtZSwgcHJvcFZhbCkge1xyXG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldW3Byb3BOYW1lXSA9PT0gcHJvcFZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG4vKiBuZWVkIHRvIHRlc3QgYWxsIGNhbGxzIHRvIHRoaXMgbWV0aG9kIGJlY2F1c2UgaSBub3RpY2VkIGR1cmluZyBUeXBlU2NyaXB0IGNvbnZlcnNpb24gaSB3YXNuJ3QgZXZlbiByZXR1cm5pbmdcclxuYSB2YWx1ZSBmcm9tIHRoaXMgZnVuY3Rpb24hIHRvZG8tMFxyXG4qL1xyXG5BcnJheS5wcm90b3R5cGUuYXJyYXlNb3ZlSXRlbSA9IGZ1bmN0aW9uKGZyb21JbmRleCwgdG9JbmRleCkge1xyXG4gICAgdGhpcy5zcGxpY2UodG9JbmRleCwgMCwgdGhpcy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XHJcbn07XHJcblxyXG5pZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ICE9ICdmdW5jdGlvbicpIHtcclxuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEYXRlIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcblx0XHRcdFx0c3RkVGltZXpvbmVPZmZzZXQoKTogbnVtYmVyO1xyXG5cdFx0XHRcdGRzdCgpOiBib29sZWFuO1xyXG59O1xyXG5cclxuRGF0ZS5wcm90b3R5cGUuc3RkVGltZXpvbmVPZmZzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBqYW4gPSBuZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xyXG4gICAgdmFyIGp1bCA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgNiwgMSk7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoamFuLmdldFRpbWV6b25lT2Zmc2V0KCksIGp1bC5nZXRUaW1lem9uZU9mZnNldCgpKTtcclxufVxyXG5cclxuRGF0ZS5wcm90b3R5cGUuZHN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIDwgdGhpcy5zdGRUaW1lem9uZU9mZnNldCgpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0cmluZyBwcm90b3R5cGVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuaW50ZXJmYWNlIFN0cmluZyB7XHJcbiAgICBzdGFydHNXaXRoKHN0cjogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIHN0cmlwSWZTdGFydHNXaXRoKHN0cjogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgY29udGFpbnMoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgcmVwbGFjZUFsbChmaW5kOiBzdHJpbmcsIHJlcGxhY2U6IHN0cmluZyk6IHN0cmluZztcclxuICAgIHVuZW5jb2RlSHRtbCgpOiBzdHJpbmc7XHJcbiAgICBlc2NhcGVGb3JBdHRyaWIoKTogc3RyaW5nO1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGggPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN0cikgPT09IDA7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuc3RyaXBJZlN0YXJ0c1dpdGggIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0c1dpdGgoc3RyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihzdHIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHN0cikgIT0gLTE7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbihmaW5kLCByZXBsYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChmaW5kKSwgJ2cnKSwgcmVwbGFjZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS51bmVuY29kZUh0bWwgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS51bmVuY29kZUh0bWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoXCImXCIpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbCgnJmFtcDsnLCAnJicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZndDsnLCAnPicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZsdDsnLCAnPCcpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyZxdW90OycsICdcIicpLy9cclxuICAgICAgICAgICAgLnJlcGxhY2VBbGwoJyYjMzk7JywgXCInXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuZXNjYXBlRm9yQXR0cmliICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZXNjYXBlRm9yQXR0cmliID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUFsbChcIlxcXCJcIiwgXCImcXVvdDtcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFV0aWwge1xyXG5cclxuICAgIGxvZ0FqYXg6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgdGltZW91dE1lc3NhZ2VTaG93bjpib29sZWFuID0gZmFsc2U7XHJcbiAgICBvZmZsaW5lOmJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICB3YWl0Q291bnRlcjpudW1iZXIgPSAwO1xyXG4gICAgcGdyc0RsZzphbnkgPSBudWxsO1xyXG5cclxuICAgIC8vdGhpcyBibG93cyB0aGUgaGVsbCB1cCwgbm90IHN1cmUgd2h5LlxyXG4gICAgLy9cdE9iamVjdC5wcm90b3R5cGUudG9Kc29uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvL1x0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgNCk7XHJcbiAgICAvL1x0fTtcclxuXHJcbiAgICBhc3NlcnROb3ROdWxsPSh2YXJOYW1lKSA9PiAge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXZhbCh2YXJOYW1lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVmFyaWFibGUgbm90IGZvdW5kOiBcIiArIHZhck5hbWUpKS5vcGVuKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qXHJcblx0ICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcblx0ICogc2Vzc2lvbiBpcyBvbmx5IGFsbG93ZWQgb25lIGNvbmN1cnJlbnQgY2FsbCBhbmQgc2ltdWx0YW5lb3VzIGNhbGxzIHdvdWxkIGp1c3QgXCJxdWV1ZSB1cFwiLlxyXG5cdCAqL1xyXG4gICAgX2FqYXhDb3VudGVyOm51bWJlciA9IDA7XHJcblxyXG5cclxuICAgICAgICBkYXlsaWdodFNhdmluZ3NUaW1lOmJvb2xlYW49IChuZXcgRGF0ZSgpLmRzdCgpKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgdG9Kc29uPShvYmopICA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogVGhpcyBjYW1lIGZyb20gaGVyZTpcclxuXHRcdCAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcblx0XHQgKi9cclxuICAgICAgICBnZXRQYXJhbWV0ZXJCeU5hbWU9KG5hbWU/OiBhbnksIHVybD86IGFueSkgID0+IHtcclxuICAgICAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSwgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0c1syXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogU2V0cyB1cCBhbiBpbmhlcml0YW5jZSByZWxhdGlvbnNoaXAgc28gdGhhdCBjaGlsZCBpbmhlcml0cyBmcm9tIHBhcmVudCwgYW5kIHRoZW4gcmV0dXJucyB0aGUgcHJvdG90eXBlIG9mIHRoZVxyXG5cdFx0ICogY2hpbGQgc28gdGhhdCBtZXRob2RzIGNhbiBiZSBhZGRlZCB0byBpdCwgd2hpY2ggd2lsbCBiZWhhdmUgbGlrZSBtZW1iZXIgZnVuY3Rpb25zIGluIGNsYXNzaWMgT09QIHdpdGhcclxuXHRcdCAqIGluaGVyaXRhbmNlIGhpZXJhcmNoaWVzLlxyXG5cdFx0ICovXHJcbiAgICAgICAgaW5oZXJpdD0ocGFyZW50LCBjaGlsZCkgID0+IHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0UHJvZ3Jlc3NNb25pdG9yPSgpID0+ICB7XHJcbiAgICAgICAgICAgIHNldEludGVydmFsKHRoaXMucHJvZ3Jlc3NJbnRlcnZhbCwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm9ncmVzc0ludGVydmFsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaXNXYWl0aW5nID0gdGhpcy5pc0FqYXhXYWl0aW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChpc1dhaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2FpdENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLndhaXRDb3VudGVyID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBncnNEbGcgPSBuZXcgUHJvZ3Jlc3NEbGcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wZ3JzRGxnLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRDb3VudGVyID0gMDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBncnNEbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZ3JzRGxnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogSWYgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG5lZWRzIGEgJ3RoaXMnIGNvbnRleHQgZm9yIHRoZSBjYWxsLCB0aGVuIHBhc3MgdGhlICd0aGlzJyBpbiB0aGUgY2FsbGJhY2tUaGlzXHJcblx0XHQgKiBwYXJhbWV0ZXIuXHJcblx0XHQgKlxyXG5cdFx0ICogY2FsbGJhY2tQYXlsb2FkIGlzIHBhc3NlZCB0byBjYWxsYmFjayBhcyBpdHMgbGFzdCBwYXJhbWV0ZXJcclxuXHRcdCAqXHJcblx0XHQgKiB0b2RvLTM6IHRoaXMgbWV0aG9kIGdvdCB0b28gbG9uZy4gTmVlZCB0byBub3QgaW5saW5lIHRoZXNlIGZ1bmN0aW9uIGRlZmluaXRpb25zXHJcblx0XHQgKi9cclxuICAgICAgICBqc29uPShwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogYW55LCBjYWxsYmFjaz86IGFueSwgY2FsbGJhY2tUaGlzPzogYW55LCBjYWxsYmFja1BheWxvYWQ/OiBhbnkpID0+ICB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzPT09d2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBST0JBQkxFIEJVRzoganNvbiBjYWxsIGZvciBcIitwb3N0TmFtZStcIiB1c2VkIGdsb2JhbCAnd2luZG93JyBhcyAndGhpcycsIHdoaWNoIGlzIGFsbW9zdCBuZXZlciBnb2luZyB0byBiZSBjb3JyZWN0LlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25BamF4O1xyXG4gICAgICAgICAgICB2YXIgaXJvblJlcXVlc3Q7XHJcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vZmZsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvZmZsaW5lOiBpZ25vcmluZyBjYWxsIGZvciBcIiArIHBvc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNPTi1QT1NUOiBbXCIgKyBwb3N0TmFtZSArIFwiXVwiICsgSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBEbyBub3QgZGVsZXRlLCByZXNlYXJjaCB0aGlzIHdheS4uLiAqL1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGlyb25BamF4ID0gdGhpcy4kJChcIiNteUlyb25BamF4XCIpO1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IEkgaGFkIHRvIGZvcmNlICd0aGlzLnJvb3QnIHRvIGJlIGFjY2VwdGFibGUgdXNpbmcgaW50ZXJmYWNlLCB3aHk/PyBpcyB0aGlzIGNvcnJlY3Q/XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheCA9IFBvbHltZXIuZG9tKCg8X0hhc1Jvb3Q+dGhpcykucm9vdCkucXVlcnlTZWxlY3RvcihcIiNpcm9uQWpheFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC51cmwgPSBwb3N0VGFyZ2V0VXJsICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC52ZXJib3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5tZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc3BlY2lmeSBhbnkgdXJsIHBhcmFtcyB0aGlzIHdheTpcclxuICAgICAgICAgICAgICAgIC8vIGlyb25BamF4LnBhcmFtcz0ne1wiYWx0XCI6XCJqc29uXCIsIFwicVwiOlwiY2hyb21lXCJ9JztcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5oYW5kbGVBcyA9IFwianNvblwiOyAvLyBoYW5kbGUtYXMgKGlzIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgLyogVGhpcyBub3QgYSByZXF1aXJlZCBwcm9wZXJ0eSAqL1xyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgub25SZXNwb25zZSA9IFwidXRpbC5pcm9uQWpheFJlc3BvbnNlXCI7IC8vIG9uLXJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAvLyAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5kZWJvdW5jZUR1cmF0aW9uID0gXCIzMDBcIjsgLy8gZGVib3VuY2UtZHVyYXRpb24gKGlzXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2FqYXhDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpcm9uUmVxdWVzdCA9IGlyb25BamF4LmdlbmVyYXRlUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJGYWlsZWQgc3RhcnRpbmcgcmVxdWVzdDogXCIgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIE5vdGVzXHJcblx0XHRcdCAqIDxwPlxyXG5cdFx0XHQgKiBJZiB1c2luZyB0aGVuIGZ1bmN0aW9uOiBwcm9taXNlLnRoZW4oc3VjY2Vzc0Z1bmN0aW9uLCBmYWlsRnVuY3Rpb24pO1xyXG5cdFx0XHQgKiA8cD5cclxuXHRcdFx0ICogSSB0aGluayB0aGUgd2F5IHRoZXNlIHBhcmFtZXRlcnMgZ2V0IHBhc3NlZCBpbnRvIGRvbmUvZmFpbCBmdW5jdGlvbnMsIGlzIGJlY2F1c2UgdGhlcmUgYXJlIHJlc29sdmUvcmVqZWN0XHJcblx0XHRcdCAqIG1ldGhvZHMgZ2V0dGluZyBjYWxsZWQgd2l0aCB0aGUgcGFyYW1ldGVycy4gQmFzaWNhbGx5IHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byAncmVzb2x2ZScgZ2V0IGRpc3RyaWJ1dGVkXHJcblx0XHRcdCAqIHRvIGFsbCB0aGUgd2FpdGluZyBtZXRob2RzIGp1c3QgbGlrZSBhcyBpZiB0aGV5IHdlcmUgc3Vic2NyaWJpbmcgaW4gYSBwdWIvc3ViIG1vZGVsLiBTbyB0aGUgJ3Byb21pc2UnXHJcblx0XHRcdCAqIHBhdHRlcm4gaXMgc29ydCBvZiBhIHB1Yi9zdWIgbW9kZWwgaW4gYSB3YXlcclxuXHRcdFx0ICogPHA+XHJcblx0XHRcdCAqIFRoZSByZWFzb24gdG8gcmV0dXJuIGEgJ3Byb21pc2UucHJvbWlzZSgpJyBtZXRob2QgaXMgc28gbm8gb3RoZXIgY29kZSBjYW4gY2FsbCByZXNvbHZlL3JlamVjdCBidXQgY2FuXHJcblx0XHRcdCAqIG9ubHkgcmVhY3QgdG8gYSBkb25lL2ZhaWwvY29tcGxldGUuXHJcblx0XHRcdCAqIDxwPlxyXG5cdFx0XHQgKiBkZWZlcnJlZC53aGVuKHByb21pc2UxLCBwcm9taXNlMikgY3JlYXRlcyBhIG5ldyBwcm9taXNlIHRoYXQgYmVjb21lcyAncmVzb2x2ZWQnIG9ubHkgd2hlbiBhbGwgcHJvbWlzZXNcclxuXHRcdFx0ICogYXJlIHJlc29sdmVkLiBJdCdzIGEgYmlnIFwiYW5kIGNvbmRpdGlvblwiIG9mIHJlc29sdmVtZW50LCBhbmQgaWYgYW55IG9mIHRoZSBwcm9taXNlcyBwYXNzZWQgdG8gaXQgZW5kIHVwXHJcblx0XHRcdCAqIGZhaWxpbmcsIGl0IGZhaWxzIHRoaXMgXCJBTkRlZFwiIG9uZSBhbHNvLlxyXG5cdFx0XHQgKi9cclxuICAgICAgICAgICAgaXJvblJlcXVlc3QuY29tcGxldGVzLnRoZW4oLy9cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgU3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5fYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5wcm9ncmVzc0ludGVydmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpei5sb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBKU09OLVJFU1VMVDogXCIgKyBwb3N0TmFtZSArIFwiXFxuICAgIEpTT04tUkVTVUxULURBVEE6IFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShpcm9uUmVxdWVzdC5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdWdseSBiZWNhdXNlIGl0IGNvdmVycyBhbGwgZm91ciBjYXNlcyBiYXNlZCBvbiB0d28gYm9vbGVhbnMsIGJ1dCBpdCdzIHN0aWxsIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc2ltcGxlc3Qgd2F5IHRvIGRvIHRoaXMuIFdlIGhhdmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IG1heSBvciBtYXkgbm90IHNwZWNpZnkgYSAndGhpcydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBhbHdheXMgY2FsbHMgd2l0aCB0aGUgJ3JlcG9uc2UnIHBhcmFtIGFuZCBvcHRpb25hbGx5IGEgY2FsbGJhY2tQYXlsb2FkIHBhcmFtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tQYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrVGhpcywgaXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soaXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCBpcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soaXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiRmFpbGVkIGhhbmRsaW5nIHJlc3VsdCBvZjogXCIgKyBwb3N0TmFtZSArIFwiIGV4PVwiICsgZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRmFpbFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5fYWpheENvdW50ZXItLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5wcm9ncmVzc0ludGVydmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gdXRpbC5qc29uXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlyb25SZXF1ZXN0LnN0YXR1cyA9PSBcIjQwM1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgaW4gZGV0ZWN0ZWQgaW4gdXRpbC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGl6Lm9mZmxpbmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpei50aW1lb3V0TWVzc2FnZVNob3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpei50aW1lb3V0TWVzc2FnZVNob3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZXNzaW9uIHRpbWVkIG91dC4gUGFnZSB3aWxsIHJlZnJlc2guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IFwiU2VydmVyIHJlcXVlc3QgZmFpbGVkLlxcblxcblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2F0Y2ggYmxvY2sgc2hvdWxkIGZhaWwgc2lsZW50bHkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIlN0YXR1czogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXNUZXh0ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIkNvZGU6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhpcyBjYXRjaCBibG9jayBzaG91bGQgYWxzbyBmYWlsIHNpbGVudGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoaXMgd2FzIHNob3dpbmcgXCJjbGFzc0Nhc3RFeGNlcHRpb25cIiB3aGVuIEkgdGhyZXcgYSByZWd1bGFyIFwiRXhjZXB0aW9uXCIgZnJvbSBzZXJ2ZXIgc28gZm9yIG5vd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJJ20ganVzdCB0dXJuaW5nIHRoaXMgb2ZmIHNpbmNlIGl0cycgbm90IGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgbWVzc2FnZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1zZyArPSBcIlJlc3BvbnNlOiBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZXhjZXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpcm9uUmVxdWVzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFqYXhSZWFkeT0ocmVxdWVzdE5hbWUpICA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNBamF4V2FpdGluZz0oKSAgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWpheENvdW50ZXIgPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0IGZvY3VzIHRvIGVsZW1lbnQgYnkgaWQgKGlkIG11c3Qgc3RhcnQgd2l0aCAjKSAqL1xyXG4gICAgICAgIGRlbGF5ZWRGb2N1cz0oaWQpICA9PiB7XHJcbiAgICAgICAgICAgIC8qIHNvIHVzZXIgc2VlcyB0aGUgZm9jdXMgZmFzdCB3ZSB0cnkgYXQgLjUgc2Vjb25kcyAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHdlIHRyeSBhZ2FpbiBhIGZ1bGwgc2Vjb25kIGxhdGVyLiBOb3JtYWxseSBub3QgcmVxdWlyZWQsIGJ1dCBuZXZlciB1bmRlc2lyYWJsZSAqL1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBjb3VsZCBoYXZlIHB1dCB0aGlzIGxvZ2ljIGluc2lkZSB0aGUganNvbiBtZXRob2QgaXRzZWxmLCBidXQgSSBjYW4gZm9yc2VlIGNhc2VzIHdoZXJlIHdlIGRvbid0IHdhbnQgYVxyXG5cdFx0ICogbWVzc2FnZSB0byBhcHBlYXIgd2hlbiB0aGUganNvbiByZXNwb25zZSByZXR1cm5zIHN1Y2Nlc3M9PWZhbHNlLCBzbyB3ZSB3aWxsIGhhdmUgdG8gY2FsbCBjaGVja1N1Y2Nlc3MgaW5zaWRlXHJcblx0XHQgKiBldmVyeSByZXNwb25zZSBtZXRob2QgaW5zdGVhZCwgaWYgd2Ugd2FudCB0aGF0IHJlc3BvbnNlIHRvIHByaW50IGEgbWVzc2FnZSB0byB0aGUgdXNlciB3aGVuIGZhaWwgaGFwcGVucy5cclxuXHRcdCAqXHJcblx0XHQgKiByZXF1aXJlczogcmVzLnN1Y2Nlc3MgcmVzLm1lc3NhZ2VcclxuXHRcdCAqL1xyXG4gICAgICAgIGNoZWNrU3VjY2Vzcz0ob3BGcmllbmRseU5hbWUsIHJlcykgID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG9wRnJpZW5kbHlOYW1lICsgXCIgZmFpbGVkOiBcIiArIHJlcy5tZXNzYWdlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3VjY2VzcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGFkZHMgYWxsIGFycmF5IG9iamVjdHMgdG8gb2JqIGFzIGEgc2V0ICovXHJcbiAgICAgICAgYWRkQWxsPShvYmosIGEpICA9PiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIm51bGwgZWxlbWVudCBpbiBhZGRBbGwgYXQgaWR4PVwiICsgaSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialthW2ldXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG51bGxPclVuZGVmPShvYmopICA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG5cdFx0ICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuXHRcdCAqL1xyXG4gICAgICAgIGdldFVpZEZvcklkPShtYXAsIGlkKSAgPT4ge1xyXG4gICAgICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgICAgIHZhciB1aWQgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudEV4aXN0cz0oaWQpID0+ICB7XHJcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5jb250YWlucyhcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRha2VzIHRleHRhcmVhIGRvbSBJZCAoIyBvcHRpb25hbCkgYW5kIHJldHVybnMgaXRzIHZhbHVlICovXHJcbiAgICAgICAgZ2V0VGV4dEFyZWFWYWxCeUlkPShpZCkgID0+IHtcclxuICAgICAgICAgICAgdmFyIGRvbUVsbTogSFRNTEVsZW1lbnQgPSB0aGlzLmRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9tRWxtKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBkb21FbG09KGlkKSAgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvbHk9KGlkKSAgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIHBvbHlFbG09KGlkKSA9PiAge1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFBvbHltZXIuZG9tKGUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZFxyXG5cdFx0ICovXHJcbiAgICAgICAgZ2V0UmVxdWlyZWRFbGVtZW50PShpZCkgID0+IHtcclxuICAgICAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzT2JqZWN0PShvYmopICA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLmxlbmd0aCAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudFRpbWVNaWxsaXM9KCkgPT4gIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbXB0eVN0cmluZz0odmFsKSA9PiAge1xyXG4gICAgICAgICAgICByZXR1cm4gIXZhbCB8fCB2YWwubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRJbnB1dFZhbD0oaWQpID0+ICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvbHlFbG0oaWQpLm5vZGUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgZWxlbWVudCB3YXMgZm91bmQsIG9yIGZhbHNlIGlmIGVsZW1lbnQgbm90IGZvdW5kICovXHJcbiAgICAgICAgc2V0SW5wdXRWYWw9KGlkLCB2YWwpICA9PiB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWxtID0gdGhpcy5wb2x5RWxtKGlkKTtcclxuICAgICAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAgICAgZWxtLm5vZGUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVsbSAhPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmluZEVudGVyS2V5PShpZCwgZnVuYykgID0+IHtcclxuICAgICAgICAgICAgdGhpcy5iaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiaW5kS2V5PShpZCwgZnVuYywga2V5Q29kZSkgPT4gIHtcclxuICAgICAgICAgICAgJChpZCkua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0ga2V5Q29kZSkgeyAvLyAxMz09ZW50ZXIga2V5IGNvZGVcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFJlbW92ZWQgb2xkQ2xhc3MgZnJvbSBlbGVtZW50IGFuZCByZXBsYWNlcyB3aXRoIG5ld0NsYXNzLCBhbmQgaWYgb2xkQ2xhc3MgaXMgbm90IHByZXNlbnQgaXQgc2ltcGx5IGFkZHNcclxuXHRcdCAqIG5ld0NsYXNzLiBJZiBvbGQgY2xhc3MgZXhpc3RlZCwgaW4gdGhlIGxpc3Qgb2YgY2xhc3NlcywgdGhlbiB0aGUgbmV3IGNsYXNzIHdpbGwgbm93IGJlIGF0IHRoYXQgcG9zaXRpb24uIElmXHJcblx0XHQgKiBvbGQgY2xhc3MgZGlkbid0IGV4aXN0LCB0aGVuIG5ldyBDbGFzcyBpcyBhZGRlZCBhdCBlbmQgb2YgY2xhc3MgbGlzdC5cclxuXHRcdCAqL1xyXG4gICAgICAgIGNoYW5nZU9yQWRkQ2xhc3M9KGVsbSwgb2xkQ2xhc3MsIG5ld0NsYXNzKSAgPT4ge1xyXG4gICAgICAgICAgICB2YXIgZWxtZW1lbnQgPSAkKGVsbSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG9sZENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG5ld0NsYXNzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGRpc3BsYXlzIG1lc3NhZ2UgKG1zZykgb2Ygb2JqZWN0IGlzIG5vdCBvZiBzcGVjaWZpZWQgdHlwZVxyXG5cdFx0ICovXHJcbiAgICAgICAgdmVyaWZ5VHlwZT0ob2JqLCB0eXBlLCBtc2cpICA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0cyBodG1sIGFuZCByZXR1cm5zIERPTSBlbGVtZW50ICovXHJcbiAgICAgICAgc2V0SHRtbEVuaGFuY2VkPShpZCwgY29udGVudCkgID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB0aGlzLmRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3Qgc3VyZSB5ZXQsIGlmIHRoZXNlIHR3byBhcmUgcmVxdWlyZWQuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7XHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZWxtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0SHRtbD0oaWQsIGNvbnRlbnQpICA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gdGhpcy5kb21FbG0oaWQpO1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IFBvbHltZXIuZG9tKGVsbSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0UHJvcGVydHlDb3VudD0ob2JqKSAgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvcDtcclxuXHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuXHRcdCAqL1xyXG4gICAgICAgIHByaW50T2JqZWN0PShvYmopID0+ICB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHlbXCIgKyBjb3VudCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSBrICsgXCIgLCBcIiArIHYgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZXJyXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzICovXHJcbiAgICAgICAgcHJpbnRLZXlzPShvYmopICA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZhbCA9ICcnO1xyXG4gICAgICAgICAgICAkLmVhY2gob2JqLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWspIHtcclxuICAgICAgICAgICAgICAgICAgICBrID0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9ICcsJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbCArPSBrO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIE1ha2VzIGVsZUlkIGVuYWJsZWQgYmFzZWQgb24gdmlzIGZsYWdcclxuXHRcdCAqXHJcblx0XHQgKiBlbGVJZCBjYW4gYmUgYSBET00gZWxlbWVudCBvciB0aGUgSUQgb2YgYSBkb20gZWxlbWVudCwgd2l0aCBvciB3aXRob3V0IGxlYWRpbmcgI1xyXG5cdFx0ICovXHJcbiAgICAgICAgc2V0RW5hYmxlbWVudD0oZWxtSWQsIGVuYWJsZSkgID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkb21FbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGRvbUVsbSA9IHRoaXMuZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbUVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9tRWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGRvbUVsbS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGRvbUVsbS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIHNldFZpc2liaWxpdHk9KGVsbUlkLCB2aXMpICA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZG9tRWxtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbG1JZCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBkb21FbG0gPSB0aGlzLmRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb21FbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRvbUVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpcykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZG9tRWxtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoaWRpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBkb21FbG0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvd1tcInV0aWxcIl0pIHtcclxuICAgICAgICB2YXIgdXRpbDogVXRpbCA9IG5ldyBVdGlsKCk7XHJcbiAgICB9XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGpjckNuc3QuanNcIik7XHJcblxyXG5jbGFzcyBKY3JDbnN0IHtcclxuXHJcbiAgICBDT01NRU5UX0JZOiBzdHJpbmcgPSBcImNvbW1lbnRCeVwiO1xyXG4gICAgUFVCTElDX0FQUEVORDogc3RyaW5nID0gXCJwdWJsaWNBcHBlbmRcIjtcclxuICAgIFBSSU1BUllfVFlQRTogc3RyaW5nID0gXCJqY3I6cHJpbWFyeVR5cGVcIjtcclxuICAgIFBPTElDWTogc3RyaW5nID0gXCJyZXA6cG9saWN5XCI7XHJcblxyXG4gICAgTUlYSU5fVFlQRVM6IHN0cmluZyA9IFwiamNyOm1peGluVHlwZXNcIjtcclxuXHJcbiAgICBFTUFJTF9DT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICBFTUFJTF9SRUNJUDogc3RyaW5nID0gXCJyZWNpcFwiO1xyXG4gICAgRU1BSUxfU1VCSkVDVDogc3RyaW5nID0gXCJzdWJqZWN0XCI7XHJcblxyXG4gICAgQ1JFQVRFRDogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZFwiO1xyXG4gICAgQ1JFQVRFRF9CWTogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZEJ5XCI7XHJcbiAgICBDT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICBUQUdTOiBzdHJpbmcgPSBcInRhZ3NcIjtcclxuICAgIFVVSUQ6IHN0cmluZyA9IFwiamNyOnV1aWRcIjtcclxuICAgIExBU1RfTU9ESUZJRUQ6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZFwiO1xyXG4gICAgTEFTVF9NT0RJRklFRF9CWTogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkQnlcIjtcclxuXHJcbiAgICBESVNBQkxFX0lOU0VSVDogc3RyaW5nID0gXCJkaXNhYmxlSW5zZXJ0XCI7XHJcblxyXG4gICAgVVNFUjogc3RyaW5nID0gXCJ1c2VyXCI7XHJcbiAgICBQV0Q6IHN0cmluZyA9IFwicHdkXCI7XHJcbiAgICBFTUFJTDogc3RyaW5nID0gXCJlbWFpbFwiO1xyXG4gICAgQ09ERTogc3RyaW5nID0gXCJjb2RlXCI7XHJcblxyXG4gICAgQklOX1ZFUjogc3RyaW5nID0gXCJiaW5WZXJcIjtcclxuICAgIEJJTl9EQVRBOiBzdHJpbmcgPSBcImpjckRhdGFcIjtcclxuICAgIEJJTl9NSU1FOiBzdHJpbmcgPSBcImpjcjptaW1lVHlwZVwiO1xyXG5cclxuICAgIElNR19XSURUSDogc3RyaW5nID0gXCJpbWdXaWR0aFwiO1xyXG4gICAgSU1HX0hFSUdIVDogc3RyaW5nID0gXCJpbWdIZWlnaHRcIjtcclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJqY3JDbnN0XCJdKSB7XHJcbiAgICB2YXIgamNyQ25zdDogSmNyQ25zdCA9IG5ldyBKY3JDbnN0KCk7XHJcbn1cclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IGF0dGFjaG1lbnQuanNcIik7XHJcblxyXG5jbGFzcyBBdHRhY2htZW50IHtcclxuXHJcbiAgICAvKiBOb2RlIGJlaW5nIHVwbG9hZGVkIHRvICovXHJcbiAgICB1cGxvYWROb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIG9wZW5VcGxvYWRGcm9tRmlsZURsZyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblVwbG9hZEZyb21VcmxEbGcgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwbG9hZE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwbG9hZE5vZGUgPSBub2RlO1xyXG4gICAgICAgIChuZXcgVXBsb2FkRnJvbVVybERsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQXR0YWNobWVudCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICB2YXIgdGhpejogQXR0YWNobWVudCA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGUgQXR0YWNobWVudFwiLCBcIkRlbGV0ZSB0aGUgQXR0YWNobWVudCBvbiB0aGUgTm9kZT9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbihcImRlbGV0ZUF0dGFjaG1lbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpei5kZWxldGVBdHRhY2htZW50UmVzcG9uc2UsIHRoaXosIG5vZGUudWlkKTtcclxuICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSA9IChyZXM6IGFueSwgdWlkOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgYXR0YWNobWVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZW1vdmVCaW5hcnlCeVVpZCh1aWQpO1xyXG4gICAgICAgICAgICAvLyBmb3JjZSByZS1yZW5kZXIgZnJvbSBsb2NhbCBkYXRhLlxyXG4gICAgICAgICAgICBtZXRhNjQuZ29Ub01haW5QYWdlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJhdHRhY2htZW50XCJdKSB7XHJcbiAgICB2YXIgYXR0YWNobWVudDogQXR0YWNobWVudCA9IG5ldyBBdHRhY2htZW50KCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogZWRpdC5qc1wiKTtcclxuXHJcbmNsYXNzIEVkaXQge1xyXG5cclxuICAgIF9pbnNlcnRCb29rUmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEJvb2tSZXNwb25zZSBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgQm9va1wiLCByZXMpO1xyXG4gICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbGV0ZU5vZGVzUmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJEZWxldGUgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0Tm9kZUVkaXRSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkVkaXRpbmcgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gcmVzLm5vZGVJbmZvO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlzUmVwID0gbm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJyZXA6XCIpIHx8IC8qIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz8gKi9ub2RlLnBhdGguY29udGFpbnMoXCIvcmVwOlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUgYW5kIHdlIGFyZSB0aGUgY29tbWVudGVyICovXHJcbiAgICAgICAgICAgIHZhciBlZGl0aW5nQWxsb3dlZCA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0aW5nQWxsb3dlZCkge1xyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0ICogU2VydmVyIHdpbGwgaGF2ZSBzZW50IHVzIGJhY2sgdGhlIHJhdyB0ZXh0IGNvbnRlbnQsIHRoYXQgc2hvdWxkIGJlIG1hcmtkb3duIGluc3RlYWQgb2YgYW55IEhUTUwsIHNvXHJcblx0XHRcdFx0ICogdGhhdCB3ZSBjYW4gZGlzcGxheSB0aGlzIGFuZCBzYXZlLlxyXG5cdFx0XHRcdCAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZSA9IHJlcy5ub2RlSW5mbztcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgY2Fubm90IGVkaXQgbm9kZXMgdGhhdCB5b3UgZG9uJ3Qgb3duLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9tb3ZlTm9kZXNSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIk1vdmUgbm9kZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVzVG9Nb3ZlID0gbnVsbDsgLy8gcmVzZXRcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9zZXROb2RlUG9zaXRpb25SZXNwb25zZSA9IChyZXM6IHZvaWQpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDaGFuZ2Ugbm9kZSBwb3NpdGlvblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9zcGxpdENvbnRlbnRSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNwbGl0IGNvbnRlbnRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dSZWFkT25seVByb3BlcnRpZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLypcclxuICAgICAqIE5vZGUgSUQgYXJyYXkgb2Ygbm9kZXMgdGhhdCBhcmUgcmVhZHkgdG8gYmUgbW92ZWQgd2hlbiB1c2VyIGNsaWNrcyAnRmluaXNoIE1vdmluZydcclxuICAgICAqL1xyXG4gICAgbm9kZXNUb01vdmU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgcGFyZW50T2ZOZXdOb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBpbmRpY2F0ZXMgZWRpdG9yIGlzIGRpc3BsYXlpbmcgYSBub2RlIHRoYXQgaXMgbm90IHlldCBzYXZlZCBvbiB0aGUgc2VydmVyXHJcbiAgICAgKi9cclxuICAgIGVkaXRpbmdVbnNhdmVkTm9kZTogYW55ID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIG5vZGUgKE5vZGVJbmZvLmphdmEpIHRoYXQgaXMgYmVpbmcgY3JlYXRlZCB1bmRlciB3aGVuIG5ldyBub2RlIGlzIGNyZWF0ZWRcclxuICAgICAqL1xyXG4gICAgc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlOiBhbnkgPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTm9kZSBiZWluZyBlZGl0ZWRcclxuICAgICAqXHJcbiAgICAgKiB0b2RvLTI6IHRoaXMgYW5kIHNldmVyYWwgb3RoZXIgdmFyaWFibGVzIGNhbiBub3cgYmUgbW92ZWQgaW50byB0aGUgZGlhbG9nIGNsYXNzPyBJcyB0aGF0IGdvb2Qgb3IgYmFkXHJcbiAgICAgKiBjb3VwbGluZy9yZXNwb25zaWJpbGl0eT9cclxuICAgICAqL1xyXG4gICAgZWRpdE5vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgIGVkaXROb2RlRGxnSW5zdDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogdHlwZT1Ob2RlSW5mby5qYXZhXHJcbiAgICAgKlxyXG4gICAgICogV2hlbiBpbnNlcnRpbmcgYSBuZXcgbm9kZSwgdGhpcyBob2xkcyB0aGUgbm9kZSB0aGF0IHdhcyBjbGlja2VkIG9uIGF0IHRoZSB0aW1lIHRoZSBpbnNlcnQgd2FzIHJlcXVlc3RlZCwgYW5kXHJcbiAgICAgKiBpcyBzZW50IHRvIHNlcnZlciBmb3Igb3JkaW5hbCBwb3NpdGlvbiBhc3NpZ25tZW50IG9mIG5ldyBub2RlLiBBbHNvIGlmIHRoaXMgdmFyIGlzIG51bGwsIGl0IGluZGljYXRlcyB3ZSBhcmVcclxuICAgICAqIGNyZWF0aW5nIGluIGEgJ2NyZWF0ZSB1bmRlciBwYXJlbnQnIG1vZGUsIHZlcnN1cyBub24tbnVsbCBtZWFuaW5nICdpbnNlcnQgaW5saW5lJyB0eXBlIG9mIGluc2VydC5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIG5vZGVJbnNlcnRUYXJnZXQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyogcmV0dXJucyB0cnVlIGlmIHdlIGNhbiAndHJ5IHRvJyBpbnNlcnQgdW5kZXIgJ25vZGUnIG9yIGZhbHNlIGlmIG5vdCAqL1xyXG4gICAgaXNFZGl0QWxsb3dlZCA9IChub2RlOiBhbnkpOiBib29sZWFuID0+IHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmVkaXRNb2RlICYmIG5vZGUucGF0aCAhPSBcIi9cIiAmJlxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBDaGVjayB0aGF0IGlmIHdlIGhhdmUgYSBjb21tZW50QnkgcHJvcGVydHkgd2UgYXJlIHRoZSBjb21tZW50ZXIsIGJlZm9yZSBhbGxvd2luZyBlZGl0IGJ1dHRvbiBhbHNvLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgKCFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSkgfHwgcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpKSAvL1xyXG4gICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogYmVzdCB3ZSBjYW4gZG8gaGVyZSBpcyBhbGxvdyB0aGUgZGlzYWJsZUluc2VydCBwcm9wIHRvIGJlIGFibGUgdG8gdHVybiB0aGluZ3Mgb2ZmLCBub2RlIGJ5IG5vZGUgKi9cclxuICAgIGlzSW5zZXJ0QWxsb3dlZCA9IChub2RlOiBhbnkpOiBib29sZWFuID0+IHtcclxuICAgICAgICByZXR1cm4gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuRElTQUJMRV9JTlNFUlQsIG5vZGUpID09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLmVkaXRpbmdVbnNhdmVkTm9kZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0Tm9kZURsZ0luc3Quc2F2ZU5ld05vZGUoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGNhbGxlZCB0byBkaXNwbGF5IGVkaXRvciB0aGF0IHdpbGwgY29tZSB1cCBCRUZPUkUgYW55IG5vZGUgaXMgc2F2ZWQgb250byB0aGUgc2VydmVyLCBzbyB0aGF0IHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKiBhbnkgc2F2ZSBpcyBwZXJmb3JtZWQgd2Ugd2lsbCBoYXZlIHRoZSBjb3JyZWN0IG5vZGUgbmFtZSwgYXQgbGVhc3QuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyB2ZXJzaW9uIGlzIG5vIGxvbmdlciBiZWluZyB1c2VkLCBhbmQgY3VycmVudGx5IHRoaXMgbWVhbnMgJ2VkaXRpbmdVbnNhdmVkTm9kZScgaXMgbm90IGN1cnJlbnRseSBldmVyXHJcbiAgICAgKiB0cmlnZ2VyZWQuIFRoZSBuZXcgYXBwcm9hY2ggbm93IHRoYXQgd2UgaGF2ZSB0aGUgYWJpbGl0eSB0byAncmVuYW1lJyBub2RlcyBpcyB0byBqdXN0IGNyZWF0ZSBvbmUgd2l0aCBhXHJcbiAgICAgKiByYW5kb20gbmFtZSBhbiBsZXQgdXNlciBzdGFydCBlZGl0aW5nIHJpZ2h0IGF3YXkgYW5kIHRoZW4gcmVuYW1lIHRoZSBub2RlIElGIGEgY3VzdG9tIG5vZGUgbmFtZSBpcyBuZWVkZWQuXHJcbiAgICAgKlxyXG4gICAgICogV2hhdCB0aGlzIG1lYW5zIGlzIGlmIHdlIGNhbGwgdGhpcyBmdW5jdGlvbiAoc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lKSBpbnN0ZWFkIG9mICdzdGFydEVkaXRpbmdOZXdOb2RlKCknXHJcbiAgICAgKiB0aGF0IHdpbGwgY2F1c2UgdGhlIEdVSSB0byBhbHdheXMgcHJvbXB0IGZvciB0aGUgbm9kZSBuYW1lIGJlZm9yZSBjcmVhdGluZyB0aGUgbm9kZS4gVGhpcyB3YXMgdGhlIG9yaWdpbmFsXHJcbiAgICAgKiBmdW5jdGlvbmFsaXR5IGFuZCBzdGlsbCB3b3Jrcy5cclxuICAgICAqL1xyXG4gICAgc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdGluZ1Vuc2F2ZWROb2RlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgIHRoaXMuZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnNlcnROb2RlUmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbnNlcnQgbm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTdWJOb2RlUmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDcmVhdGUgc3Vibm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShyZXMubmV3Tm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZU5vZGVSZXNwb25zZSA9IChyZXM6IGFueSwgcGF5bG9hZDogYW55KTogdm9pZCA9PiB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcGF5bG9hZC5zYXZlZElkKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlZGl0TW9kZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGUgPSBtZXRhNjQuZWRpdE1vZGUgPyBmYWxzZSA6IHRydWU7XHJcbiAgICAgICAgLy8gdG9kby0zOiByZWFsbHkgZWRpdCBtb2RlIGJ1dHRvbiBuZWVkcyB0byBiZSBzb21lIGtpbmQgb2YgYnV0dG9uXHJcbiAgICAgICAgLy8gdGhhdCBjYW4gc2hvdyBhbiBvbi9vZmYgc3RhdGUuXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNpbmNlIGVkaXQgbW9kZSB0dXJucyBvbiBsb3RzIG9mIGJ1dHRvbnMsIHRoZSBsb2NhdGlvbiBvZiB0aGUgbm9kZSB3ZSBhcmUgdmlld2luZyBjYW4gY2hhbmdlIHNvIG11Y2ggaXRcclxuICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGxpdENvbnRlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IG5vZGVCZWxvdzogTm9kZUluZm8gPSB0aGlzLmdldE5vZGVCZWxvdyh0aGlzLmVkaXROb2RlKTtcclxuICAgICAgICB1dGlsLmpzb24oXCJzcGxpdE5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiB0aGlzLmVkaXROb2RlLmlkLFxyXG4gICAgICAgICAgICBcIm5vZGVCZWxvd0lkXCI6IChub2RlQmVsb3cgPT0gbnVsbCA/IG51bGwgOiBub2RlQmVsb3cuaWQpXHJcbiAgICAgICAgfSwgdGhpcy5fc3BsaXRDb250ZW50UmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbmNlbEVkaXQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQudHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVOb2RlVXAgPSAodWlkOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZUFib3ZlID0gdGhpcy5nZXROb2RlQWJvdmUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChub2RlQWJvdmUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb24oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlQWJvdmUubmFtZVxyXG4gICAgICAgICAgICB9LCB0aGlzLl9zZXROb2RlUG9zaXRpb25SZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZU5vZGVEb3duID0gKHVpZDogYW55KTogdm9pZCA9PiB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGVCZWxvdyA9IHRoaXMuZ2V0Tm9kZUJlbG93KG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAobm9kZUJlbG93ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uKFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEubm9kZS5pZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVCZWxvdy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogbm9kZS5uYW1lXHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3NldE5vZGVQb3NpdGlvblJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0aGUgbm9kZSBhYm92ZSB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgdG9wIG5vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9kZUFib3ZlID0gKG5vZGUpOiBhbnkgPT4ge1xyXG4gICAgICAgIHZhciBvcmRpbmFsID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgaWYgKG9yZGluYWwgPD0gMClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGJlbG93IHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSBib3R0b20gbm9kZVxyXG4gICAgICovXHJcbiAgICBnZXROb2RlQmVsb3cgPSAobm9kZTogYW55KTogTm9kZUluZm8gPT4ge1xyXG4gICAgICAgIHZhciBvcmRpbmFsID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvcmRpbmFsID0gXCIgKyBvcmRpbmFsKTtcclxuICAgICAgICBpZiAob3JkaW5hbCA9PSAtMSB8fCBvcmRpbmFsID49IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgKyAxXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmdWxsUmVwb3NpdG9yeUV4cG9ydDogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgdXRpbC5qc29uKFwiZXhwb3J0VG9YbWxcIiwge1xyXG4gICAgLy8gICAgICAgICBcIm5vZGVJZFwiOiBcIi9cIlxyXG4gICAgLy8gICAgIH0sIHRoaXMuX2V4cG9ydFJlc3BvbnNlLCB0aGlzKTtcclxuICAgIC8vIH0sXHJcblxyXG4gICAgcnVuRWRpdE5vZGUgPSAodWlkOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVua25vd24gbm9kZUlkIGluIGVkaXROb2RlQ2xpY2s6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbihcImluaXROb2RlRWRpdFwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICB9LCB0aGlzLl9pbml0Tm9kZUVkaXRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5zZXJ0Tm9kZSA9ICh1aWQ6IGFueSk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICBpZiAoIXRoaXMucGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBwYXJlbnRcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2UgZ2V0IHRoZSBub2RlIHNlbGVjdGVkIGZvciB0aGUgaW5zZXJ0IHBvc2l0aW9uIGJ5IHVzaW5nIHRoZSB1aWQgaWYgb25lIHdhcyBwYXNzZWQgaW4gb3IgdXNpbmcgdGhlXHJcbiAgICAgICAgICogY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgbm8gdWlkIHdhcyBwYXNzZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIG5vZGUgPSBudWxsO1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRFZGl0aW5nTmV3Tm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTdWJOb2RlVW5kZXJIaWdobGlnaHQgPSAoKTogdm9pZCA9PiB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVGFwIGEgbm9kZSB0byBpbnNlcnQgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdGhpcyBpbmRpY2F0ZXMgd2UgYXJlIE5PVCBpbnNlcnRpbmcgaW5saW5lLiBBbiBpbmxpbmUgaW5zZXJ0IHdvdWxkIGFsd2F5cyBoYXZlIGEgdGFyZ2V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwbHlUb0NvbW1lbnQgPSAodWlkOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVN1Yk5vZGUodWlkKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTdWJOb2RlID0gKHVpZDogYW55KTogdm9pZCA9PiB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSlcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBjcmVhdGVTdWJOb2RlOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdGhpcyBpbmRpY2F0ZXMgd2UgYXJlIE5PVCBpbnNlcnRpbmcgaW5saW5lLiBBbiBpbmxpbmUgaW5zZXJ0IHdvdWxkIGFsd2F5cyBoYXZlIGEgdGFyZ2V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubm9kZUluc2VydFRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTZWxlY3Rpb25zID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSBjb3VsZCB3cml0ZSBjb2RlIHRoYXQgb25seSBzY2FucyBmb3IgYWxsIHRoZSBcIlNFTFwiIGJ1dHRvbnMgYW5kIHVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZW0sIGJ1dCBmb3Igbm93XHJcbiAgICAgICAgICogd2UgdGFrZSB0aGUgc2ltcGxlIGFwcHJvYWNoIGFuZCBqdXN0IHJlLXJlbmRlciB0aGUgcGFnZS4gVGhlcmUgaXMgbm8gY2FsbCB0byB0aGUgc2VydmVyLCBzbyB0aGlzIGlzXHJcbiAgICAgICAgICogYWN0dWFsbHkgdmVyeSBlZmZpY2llbnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogRGVsZXRlIHRoZSBzaW5nbGUgbm9kZSBpZGVudGlmaWVkIGJ5ICd1aWQnIHBhcmFtZXRlciBpZiB1aWQgcGFyYW1ldGVyIGlzIHBhc3NlZCwgYW5kIGlmIHVpZCBwYXJhbWV0ZXIgaXMgbm90XHJcbiAgICAgKiBwYXNzZWQgdGhlbiB1c2UgdGhlIG5vZGUgc2VsZWN0aW9ucyBmb3IgbXVsdGlwbGUgc2VsZWN0aW9ucyBvbiB0aGUgcGFnZS5cclxuICAgICAqL1xyXG4gICAgZGVsZXRlU2VsTm9kZXMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgaGF2ZSBub3Qgc2VsZWN0ZWQgYW55IG5vZGVzLiBTZWxlY3Qgbm9kZXMgdG8gZGVsZXRlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbihcImRlbGV0ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogc2VsTm9kZXNBcnJheVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpei5fZGVsZXRlTm9kZXNSZXNwb25zZSwgdGhpeik7XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVNlbE5vZGVzID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBtb3ZlIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFxyXG4gICAgICAgICAgICBcIkNvbmZpcm0gTW92ZVwiLFxyXG4gICAgICAgICAgICBcIk1vdmUgXCIgKyBzZWxOb2Rlc0FycmF5Lmxlbmd0aCArIFwiIG5vZGUocykgdG8gYSBuZXcgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICBcIlllcywgbW92ZS5cIixcclxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGl6Lm5vZGVzVG9Nb3ZlID0gc2VsTm9kZXNBcnJheTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RlZE5vZGVzID0ge307IC8vIGNsZWFyIHNlbGVjdGlvbnMuXHJcbiAgICAgICAgICAgICAgICAvLyBObyBsb25nZXIgbmVlZFxyXG4gICAgICAgICAgICAgICAgLy8gb3Igd2FudCBhbnkgc2VsZWN0aW9ucy5cclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcclxuICAgICAgICAgICAgICAgICAgICBcIklkZW50aWZpZWQgbm9kZXMgdG8gbW92ZS48cC8+VG8gYWN0dWFsbHkgbW92ZSB0aGVzZSBub2RlcywgYnJvd3NlIHRvIHRoZSB0YXJnZXQgbG9jYXRpb24sIHRoZW4gY2xpY2sgJ0ZpbmlzaCBNb3ZpbmcnPHAvPlwiICtcclxuICAgICAgICAgICAgICAgICAgICBcIlRoZSBub2RlcyB3aWxsIHRoZW4gYmUgbW92ZWQgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBzdWJub2RlcyB1bmRlciB0aGUgdGFyZ2V0IG5vZGUuIChpLmUuIFRoZSB0YXJnZXQgeW91IHNlbGVjdCB3aWxsIGJlY29tZSB0aGUgbmV3IHBhcmVudCBvZiB0aGUgbm9kZXMpXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5pc2hNb3ZpbmdTZWxOb2RlcyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBNb3ZlXCIsIFwiTW92ZSBcIiArIHRoaXoubm9kZXNUb01vdmUubGVuZ3RoICsgXCIgbm9kZShzKSB0byBzZWxlY3RlZCBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgIFwiWWVzLCBtb3ZlLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRm9yIG5vdywgd2Ugd2lsbCBqdXN0IGNyYW0gdGhlIG5vZGVzIG9udG8gdGhlIGVuZCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICogcGFnZS4gTGF0ZXIgb24gd2UgY2FuIGdldCBtb3JlIHNwZWNpZmljIGFib3V0IGFsbG93aW5nIHByZWNpc2UgZGVzdGluYXRpb24gbG9jYXRpb24gZm9yIG1vdmVkXHJcbiAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uKFwibW92ZU5vZGVzXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Q2hpbGRJZFwiOiBoaWdobGlnaHROb2RlICE9IG51bGwgPyBoaWdobGlnaHROb2RlLmlkIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZHNcIjogdGhpei5ub2Rlc1RvTW92ZVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpei5fbW92ZU5vZGVzUmVzcG9uc2UsIHRoaXopO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluc2VydEJvb2tXYXJBbmRQZWFjZSA9ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xyXG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvKiBpbnNlcnRpbmcgdW5kZXIgd2hhdGV2ZXIgbm9kZSB1c2VyIGhhcyBmb2N1c2VkICovXHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uKFwiaW5zZXJ0Qm9va1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHJ1bmNhdGVkXCI6IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpei5faW5zZXJ0Qm9va1Jlc3BvbnNlLCB0aGl6KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wiZWRpdFwiXSkge1xyXG4gICAgdmFyIGVkaXQ6IEVkaXQgPSBuZXcgRWRpdCgpO1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG1ldGE2NC5qc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIEFwcGxpY2F0aW9uIGluc3RhbmNlLCBhbmQgY2VudHJhbCByb290IGxldmVsIG9iamVjdCBmb3IgYWxsIGNvZGUsIGFsdGhvdWdoIGVhY2ggbW9kdWxlIGdlbmVyYWxseSBjb250cmlidXRlcyBvbmVcclxuICogc2luZ2xldG9uIHZhcmlhYmxlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHdpdGggYSBuYW1lIHVzdWFsbHkgaWRlbnRpY2FsIHRvIHRoYXQgZmlsZS5cclxuICovXHJcbmNsYXNzIE1ldGE2NCB7XHJcblxyXG4gICAgYXBwSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjdXJVcmxQYXRoOiBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG5cclxuICAgIGNvZGVGb3JtYXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgc2VydmVyTWFya2Rvd246IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qIHVzZWQgYXMgYSBraW5kIG9mICdzZXF1ZW5jZScgaW4gdGhlIGFwcCwgd2hlbiB1bmlxdWUgdmFscyBhIG5lZWRlZCAqL1xyXG4gICAgbmV4dEd1aWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyogbmFtZSBvZiBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgKi9cclxuICAgIHVzZXJOYW1lOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG5cclxuICAgIC8qIHNjcmVlbiBjYXBhYmlsaXRpZXMgKi9cclxuICAgIGRldmljZVdpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgZGV2aWNlSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBVc2VyJ3Mgcm9vdCBub2RlLiBUb3AgbGV2ZWwgb2Ygd2hhdCBsb2dnZWQgaW4gdXNlciBpcyBhbGxvd2VkIHRvIHNlZS5cclxuICAgICAqL1xyXG4gICAgaG9tZU5vZGVJZDogc3RyaW5nID0gXCJcIjtcclxuICAgIGhvbWVOb2RlUGF0aDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgICogc3BlY2lmaWVzIGlmIHRoaXMgaXMgYWRtaW4gdXNlci5cclxuICAgICAqL1xyXG4gICAgaXNBZG1pblVzZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiBhbHdheXMgc3RhcnQgb3V0IGFzIGFub24gdXNlciB1bnRpbCBsb2dpbiAqL1xyXG4gICAgaXNBbm9uVXNlcjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBhbm9uVXNlckxhbmRpbmdQYWdlTm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogc2lnbmFscyB0aGF0IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHRoZSBuZXh0IHRpbWUgd2UgZ28gdG8gdGhlIG1haW4gdHJlZSB2aWV3IHdpbmRvdyB3ZSBuZWVkIHRvIHJlZnJlc2ggZGF0YVxyXG4gICAgICogZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgKi9cclxuICAgIHRyZWVEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAqXHJcbiAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgKiBub2RlLiBMaW1pdGVkIGxpZmV0aW1lIGhvd2V2ZXIuIFRoZSBzZXJ2ZXIgaXMgc2ltcGx5IG51bWJlcmluZyBub2RlcyBzZXF1ZW50aWFsbHkuIEFjdHVhbGx5IHJlcHJlc2VudHMgdGhlXHJcbiAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAqL1xyXG4gICAgdWlkVG9Ob2RlTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBNYXBzIGZyb20gdGhlIERPTSBJRCB0byB0aGUgZWRpdG9yIGphdmFzY3JpcHQgaW5zdGFuY2UgKEFjZSBFZGl0b3IgaW5zdGFuY2UpICovXHJcbiAgICBhY2VFZGl0b3JzQnlJZDogYW55ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZS5pZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGlkVG9Ob2RlTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBjb3VudGVyIGZvciBsb2NhbCB1aWRzICovXHJcbiAgICBuZXh0VWlkOiBudW1iZXIgPSAxO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgKi9cclxuICAgIGlkZW50VG9VaWRNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBVbmRlciBhbnkgZ2l2ZW4gbm9kZSwgdGhlcmUgY2FuIGJlIG9uZSBhY3RpdmUgJ3NlbGVjdGVkJyBub2RlIHRoYXQgaGFzIHRoZSBoaWdobGlnaHRpbmcsIGFuZCB3aWxsIGJlIHNjcm9sbGVkXHJcbiAgICAgKiB0byB3aGVuZXZlciB0aGUgcGFnZSB3aXRoIHRoYXQgY2hpbGQgaXMgdmlzaXRlZCwgYW5kIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwIGhvbGRzIHRoZSBtYXAgb2YgXCJwYXJlbnQgdWlkIHRvXHJcbiAgICAgKiBzZWxlY3RlZCBub2RlIChOb2RlSW5mbyBvYmplY3QpXCIsIHdoZXJlIHRoZSBrZXkgaXMgdGhlIHBhcmVudCBub2RlIHVpZCwgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgY3VycmVudGx5XHJcbiAgICAgKiBzZWxlY3RlZCBub2RlIHdpdGhpbiB0aGF0IHBhcmVudC4gTm90ZSB0aGlzICdzZWxlY3Rpb24gc3RhdGUnIGlzIG9ubHkgc2lnbmlmaWNhbnQgb24gdGhlIGNsaWVudCwgYW5kIG9ubHkgZm9yXHJcbiAgICAgKiBiZWluZyBhYmxlIHRvIHNjcm9sbCB0byB0aGUgbm9kZSBkdXJpbmcgbmF2aWdhdGluZyBhcm91bmQgb24gdGhlIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogZGV0ZXJtaW5lcyBpZiB3ZSBzaG91bGQgcmVuZGVyIGFsbCB0aGUgZWRpdGluZyBidXR0b25zIG9uIGVhY2ggcm93XHJcbiAgICAgKi9cclxuICAgIGVkaXRNb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogVXNlci1zZWxlY3RhYmxlIHVzZXItYWNjb3VudCBvcHRpb25zIGVhY2ggdXNlciBjYW4gc2V0IG9uIGhpcyBhY2NvdW50ICovXHJcbiAgICBNT0RFX0FEVkFOQ0VEOiBzdHJpbmcgPSBcImFkdmFuY2VkXCI7XHJcbiAgICBNT0RFX1NJTVBMRTogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAvKiBjYW4gYmUgJ3NpbXBsZScgb3IgJ2FkdmFuY2VkJyAqL1xyXG4gICAgZWRpdE1vZGVPcHRpb246IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgLypcclxuICAgICAqIHRvZ2dsZWQgYnkgYnV0dG9uLCBhbmQgaG9sZHMgaWYgd2UgYXJlIGdvaW5nIHRvIHNob3cgcHJvcGVydGllcyBvciBub3Qgb24gZWFjaCBub2RlIGluIHRoZSBtYWluIHZpZXdcclxuICAgICAqL1xyXG4gICAgc2hvd1Byb3BlcnRpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogTGlzdCBvZiBub2RlIHByZWZpeGVzIHRvIGZsYWcgbm9kZXMgdG8gbm90IGFsbG93IHRvIGJlIHNob3duIGluIHRoZSBwYWdlIGluIHNpbXBsZSBtb2RlXHJcbiAgICAgKi9cclxuICAgIHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0OiBhbnkgPSB7XHJcbiAgICAgICAgXCJyZXA6XCI6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICByZWFkT25seVByb3BlcnR5TGlzdDogYW55ID0ge307XHJcblxyXG4gICAgYmluYXJ5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBhbGwgbm9kZSB1aWRzIHRvIHRydWUgaWYgc2VsZWN0ZWQsIG90aGVyd2lzZSB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGRlbGV0ZWQgKG5vdCBleGlzdGluZylcclxuICAgICAqL1xyXG4gICAgc2VsZWN0ZWROb2RlczogYW55ID0ge307XHJcblxyXG4gICAgLyogUmVuZGVyTm9kZVJlc3BvbnNlLmphdmEgb2JqZWN0ICovXHJcbiAgICBjdXJyZW50Tm9kZURhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIGFsbCB2YXJpYWJsZXMgZGVyaXZhYmxlIGZyb20gY3VycmVudE5vZGVEYXRhLCBidXQgc3RvcmVkIGRpcmVjdGx5IGZvciBzaW1wbGVyIGNvZGUvYWNjZXNzXHJcbiAgICAgKi9cclxuICAgIGN1cnJlbnROb2RlOiBhbnkgPSBudWxsO1xyXG4gICAgY3VycmVudE5vZGVVaWQ6IGFueSA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZUlkOiBhbnkgPSBudWxsO1xyXG4gICAgY3VycmVudE5vZGVQYXRoOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qIE1hcHMgZnJvbSBndWlkIHRvIERhdGEgT2JqZWN0ICovXHJcbiAgICBkYXRhT2JqTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICB1cGRhdGVNYWluTWVudVBhbmVsID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRpbmcgbWFpbiBtZW51IHBhbmVsXCIpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIG1lbnVQYW5lbC5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIENyZWF0ZXMgYSAnZ3VpZCcgb24gdGhpcyBvYmplY3QsIGFuZCBtYWtlcyBkYXRhT2JqTWFwIGFibGUgdG8gbG9vayB1cCB0aGUgb2JqZWN0IHVzaW5nIHRoYXQgZ3VpZCBpbiB0aGVcclxuICAgICAqIGZ1dHVyZS5cclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJEYXRhT2JqZWN0ID0gKGRhdGEpID0+IHtcclxuICAgICAgICBpZiAoIWRhdGEuZ3VpZCkge1xyXG4gICAgICAgICAgICBkYXRhLmd1aWQgPSArK3RoaXMubmV4dEd1aWQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YU9iak1hcFtkYXRhLmd1aWRdID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T2JqZWN0QnlHdWlkID0gKGd1aWQpID0+IHtcclxuICAgICAgICB2YXIgcmV0ID0gdGhpcy5kYXRhT2JqTWFwW2d1aWRdO1xyXG4gICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YSBvYmplY3Qgbm90IGZvdW5kOiBndWlkPVwiICsgZ3VpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIElmIGNhbGxiYWNrIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgc2NyaXB0IHRvIHJ1biwgb3IgaWYgaXQncyBhIGZ1bmN0aW9uIG9iamVjdCB0aGF0IHdpbGwgYmVcclxuICAgICAqIHRoZSBmdW5jdGlvbiB0byBydW4uXHJcbiAgICAgKlxyXG4gICAgICogV2hlbmV2ZXIgd2UgYXJlIGJ1aWxkaW5nIGFuIG9uQ2xpY2sgc3RyaW5nLCBhbmQgd2UgaGF2ZSB0aGUgYWN0dWFsIGZ1bmN0aW9uLCByYXRoZXIgdGhhbiB0aGUgbmFtZSBvZiB0aGVcclxuICAgICAqIGZ1bmN0aW9uIChpLmUuIHdlIGhhdmUgdGhlIGZ1bmN0aW9uIG9iamVjdCBhbmQgbm90IGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIHdlIGhhbmRlIHRoYXQgYnkgYXNzaWduaW5nIGEgZ3VpZFxyXG4gICAgICogdG8gdGhlIGZ1bmN0aW9uIG9iamVjdCwgYW5kIHRoZW4gZW5jb2RlIGEgY2FsbCB0byBydW4gdGhhdCBndWlkIGJ5IGNhbGxpbmcgcnVuQ2FsbGJhY2suIFRoZXJlIGlzIGEgbGV2ZWwgb2ZcclxuICAgICAqIGluZGlyZWN0aW9uIGhlcmUsIGJ1dCB0aGlzIGlzIHRoZSBzaW1wbGVzdCBhcHByb2FjaCB3aGVuIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBtYXAgZnJvbSBhIHN0cmluZyB0byBhXHJcbiAgICAgKiBmdW5jdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBjdHg9Y29udGV4dCwgd2hpY2ggaXMgdGhlICd0aGlzJyB0byBjYWxsIHdpdGggaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCBhbmQgaGF2ZSBhICd0aGlzJyBjb250ZXh0IHRvIGJpbmQgdG8gaXQuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZU9uQ2xpY2sgPSAoY2FsbGJhY2ssIGN0eCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XHJcbiAgICAgICAgfSAvL1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckRhdGFPYmplY3QoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckRhdGFPYmplY3QoY3R4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm1ldGE2NC5ydW5DYWxsYmFjayhcIiArIGNhbGxiYWNrLmd1aWQgKyBcIixcIiArIGN0eC5ndWlkICsgXCIpO1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibWV0YTY0LnJ1bkNhbGxiYWNrKFwiICsgY2FsbGJhY2suZ3VpZCArIFwiKTtcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBydW5DYWxsYmFjayA9IChndWlkLCBjdHgpID0+IHtcclxuICAgICAgICB2YXIgZGF0YU9iaiA9IHRoaXMuZ2V0T2JqZWN0QnlHdWlkKGd1aWQpO1xyXG5cclxuICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgLy8gdGhhdCBpcyBhIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKGRhdGFPYmouY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvciBlbHNlIHNvbWV0aW1lcyB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgaXRzZWxmIGlzIHRoZSBmdW5jdGlvbixcclxuICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGF0YU9iaiA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcy5nZXRPYmplY3RCeUd1aWQoY3R4KTtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmouY2FsbCh0aGl6KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmooKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwidW5hYmxlIHRvIGZpbmQgY2FsbGJhY2sgb24gcmVnaXN0ZXJlZCBndWlkOiBcIiArIGd1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpblNpbXBsZU1vZGUgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdE1vZGVPcHRpb24gPT09IHRoaXMuTU9ERV9TSU1QTEU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmdvVG9NYWluUGFnZSh0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnb1RvTWFpblBhZ2UgPSAocmVyZW5kZXI/OiBib29sZWFuLCBmb3JjZVNlcnZlclJlZnJlc2g/OiBib29sZWFuKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgdGhpcy50cmVlRGlydHkgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlcmVuZGVyIHx8IHRoaXMudHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyZWVEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgbm90IHJlLXJlbmRlcmluZyBwYWdlIChlaXRoZXIgZnJvbSBzZXJ2ZXIsIG9yIGZyb20gbG9jYWwgZGF0YSwgdGhlbiB3ZSBqdXN0IG5lZWQgdG8gbGl0dGVyYWxseSBzd2l0Y2hcclxuICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFRhYiA9IChwYWdlTmFtZSkgPT4ge1xyXG4gICAgICAgIHZhciBpcm9uUGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgKDxfSGFzU2VsZWN0Pmlyb25QYWdlcykuc2VsZWN0KHBhZ2VOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSWYgZGF0YSAoaWYgcHJvdmlkZWQpIG11c3QgYmUgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBjdXJyZW50IGluc3RhbmNlIG9mIHRoZSBkaWFsb2csIGFuZCBhbGwgdGhlIGRpYWxvZ1xyXG4gICAgICogbWV0aG9kcyBhcmUgb2YgY291cnNlIHNpbmdsZXRvbnMgdGhhdCBhY2NlcHQgdGhpcyBkYXRhIHBhcmFtZXRlciBmb3IgYW55IG9wdGVyYXRpb25zLiAob2xkc2Nob29sIHdheSBvZiBkb2luZ1xyXG4gICAgICogT09QIHdpdGggJ3RoaXMnIGJlaW5nIGZpcnN0IHBhcmFtZXRlciBhbHdheXMpLlxyXG4gICAgICpcclxuICAgICAqIE5vdGU6IGVhY2ggZGF0YSBpbnN0YW5jZSBpcyByZXF1aXJlZCB0byBoYXZlIGEgZ3VpZCBudW1iZXJpYyBwcm9wZXJ0eSwgdW5pcXVlIHRvIGl0LlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgY2hhbmdlUGFnZSA9IChwZz86IGFueSwgZGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcGcudGFiSWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib29wcywgd3Jvbmcgb2JqZWN0IHR5cGUgcGFzc2VkIHRvIGNoYW5nZVBhZ2UgZnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHRoaXMgaXMgdGhlIHNhbWUgYXMgc2V0dGluZyB1c2luZyBtYWluSXJvblBhZ2VzPz8gKi9cclxuICAgICAgICB2YXIgcGFwZXJUYWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICg8X0hhc1NlbGVjdD5wYXBlclRhYnMpLnNlbGVjdChwZy50YWJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNOb2RlQmxhY2tMaXN0ZWQgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgcHJvcDtcclxuICAgICAgICBmb3IgKHByb3AgaW4gdGhpcy5zaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBub2RlLm5hbWUuc3RhcnRzV2l0aChwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RlZE5vZGVVaWRzQXJyYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgdmFyIHNlbEFycmF5ID0gW10sIGlkeCA9IDAsIHVpZDtcclxuXHJcbiAgICAgICAgZm9yICh1aWQgaW4gdGhpcy5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RlZE5vZGVJZHNBcnJheSA9ICgpID0+IHtcclxuICAgICAgICB2YXIgc2VsQXJyYXkgPSBbXSwgaWR4ID0gMCwgdWlkO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHNlbGVjdGVkIG5vZGVzLlwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQodGhpcy5zZWxlY3RlZE5vZGVzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHVpZCBpbiB0aGlzLnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVuYWJsZSB0byBmaW5kIHVpZFRvTm9kZU1hcCBmb3IgdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogR2V0cyBzZWxlY3RlZCBub2RlcyBhcyBOb2RlSW5mby5qYXZhIG9iamVjdHMgYXJyYXkgKi9cclxuICAgIGdldFNlbGVjdGVkTm9kZXNBcnJheSA9ICgpID0+IHtcclxuICAgICAgICB2YXIgc2VsQXJyYXkgPSBbXSwgaWR4ID0gMCwgdWlkO1xyXG4gICAgICAgIGZvciAodWlkIGluIHRoaXMuc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHNlbEFycmF5W2lkeCsrXSA9IHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU2VsZWN0ZWROb2RlcyA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gKHJlcywgbm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBvd25lckJ1ZiA9ICcnO1xyXG4gICAgICAgIHZhciBtaW5lID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICQuZWFjaChyZXMub3duZXJzLCBmdW5jdGlvbihpbmRleCwgb3duZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyID09PSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBvd25lcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3duZXJCdWYubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgIHZhciBlbG0gPSAkKFwiI293bmVyRGlzcGxheVwiICsgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICBlbG0uaHRtbChcIiAoTWFuYWdlcjogXCIgKyBvd25lckJ1ZiArIFwiKVwiKTtcclxuICAgICAgICAgICAgaWYgKG1pbmUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1vdGhlclwiLCBcImNyZWF0ZWQtYnktbWVcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU5vZGVJbmZvID0gKG5vZGUpID0+IHtcclxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpei51cGRhdGVOb2RlSW5mb1Jlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIFJldHVybnMgdGhlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gbm9kZS5pZCB2YWx1ZSAqL1xyXG4gICAgZ2V0Tm9kZUZyb21JZCA9IChpZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlkVG9Ob2RlTWFwW2lkXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoT2ZVaWQgPSAodWlkKSA9PiB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUucGF0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGlnaGxpZ2h0ZWROb2RlID0gKCkgPT4ge1xyXG4gICAgICAgIHZhciByZXQgPSB0aGlzLnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW3RoaXMuY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0Um93QnlJZCA9IChpZCwgc2Nyb2xsKSA9PiB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlnaGxpZ2h0Um93QnlJZCBmYWlsZWQgdG8gZmluZCBpZDogXCIgKyBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgKiBzZXR0aW5nIHRoYXQgdmFsdWUgc2hvdWxkIGdvIHRocnUgdGhpcyBmdW5jdGlvbi5cclxuICAgICAqL1xyXG4gICAgaGlnaGxpZ2h0Tm9kZSA9IChub2RlLCBzY3JvbGwpID0+IHtcclxuICAgICAgICBpZiAoIW5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGRvbmVIaWdobGlnaHRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogVW5oaWdobGlnaHQgY3VycmVudGx5IGhpZ2hsaWdodGVkIG5vZGUgaWYgYW55ICovXHJcbiAgICAgICAgdmFyIGN1ckhpZ2hsaWdodGVkTm9kZSA9IHRoaXMucGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbdGhpcy5jdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCA9PT0gbm9kZS51aWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWxyZWFkeSBoaWdobGlnaHRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciByb3dFbG1JZCA9IGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgICAgIHZhciByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRvbmVIaWdobGlnaHRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFt0aGlzLmN1cnJlbnROb2RlVWlkXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICB2YXIgcm93RWxtSWQgPSBub2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICB2YXIgcm93RWxtID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKHJvd0VsbSwgXCJpbmFjdGl2ZS1yb3dcIiwgXCJhY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZWFsbHkgbmVlZCB0byB1c2UgcHViL3N1YiBldmVudCB0byBicm9hZGNhc3QgZW5hYmxlbWVudCwgYW5kIGxldCBlYWNoIGNvbXBvbmVudCBkbyB0aGlzIGluZGVwZW5kZW50bHkgYW5kXHJcbiAgICAgKiBkZWNvdXBsZVxyXG4gICAgICovXHJcbiAgICByZWZyZXNoQWxsR3VpRW5hYmxlbWVudCA9ICgpID0+IHtcclxuXHJcbiAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgdmFyIHNlbE5vZGVDb3VudCA9IHV0aWwuZ2V0UHJvcGVydHlDb3VudCh0aGlzLnNlbGVjdGVkTm9kZXMpO1xyXG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gdGhpcy5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICB2YXIgc2VsTm9kZUlzTWluZSA9IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJuYXZMb2dvdXRCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIHRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkV4cG9ydERsZ1wiLCB0aGlzLmlzQWRtaW5Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuSW1wb3J0RGxnXCIsIHRoaXMuaXNBZG1pblVzZXIpO1xyXG5cclxuICAgICAgICB2YXIgcHJvcHNUb2dnbGUgPSB0aGlzLmN1cnJlbnROb2RlICYmICF0aGlzLmlzQW5vblVzZXI7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicHJvcHNUb2dnbGVCdXR0b25cIiwgcHJvcHNUb2dnbGUpO1xyXG5cclxuICAgICAgICB2YXIgYWxsb3dFZGl0TW9kZSA9IHRoaXMuY3VycmVudE5vZGUgJiYgIXRoaXMuaXNBbm9uVXNlcjtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBMZXZlbEJ1dHRvblwiLCB0aGlzLmN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDApO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIHRoaXMuaXNBZG1pblVzZXIgfHwgdXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21GaWxlQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImRlbGV0ZUF0dGFjaG1lbnRzQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICYmIGhpZ2hsaWdodE5vZGUuaGFzQmluYXJ5ICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2VhcmNoRGxnQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd1NlcnZlckluZm9CdXR0b25cIiwgdGhpcy5pc0FkbWluVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVmcmVzaFBhZ2VCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkltcG9ydERsZ1wiLCB0aGlzLmlzQWRtaW5Vc2VyICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5FeHBvcnREbGdcIiwgdGhpcy5pc0FkbWluVXNlciAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJuYXZIb21lQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImVkaXRNb2RlQnV0dG9uXCIsIGFsbG93RWRpdE1vZGUpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVwTGV2ZWxCdXR0b25cIiwgbWV0YTY0LmN1cnJlbnROb2RlICYmIG5hdi5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCB0aGlzLmlzQWRtaW5Vc2VyIHx8IHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuTG9naW5EbGdCdXR0b25cIiwgdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJuYXZMb2dvdXRCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlblNpZ251cFBnQnV0dG9uXCIsIHRoaXMuaXNBbm9uVXNlcik7XHJcblxyXG4gICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXHJcbiAgICAgICAgUG9seW1lci51cGRhdGVTdHlsZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTaW5nbGVTZWxlY3RlZE5vZGUgPSAoKSA9PiB7XHJcbiAgICAgICAgdmFyIHVpZDtcclxuICAgICAgICBmb3IgKHVpZCBpbiB0aGlzLnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvdW5kIGEgc2luZ2xlIFNlbCBOb2RlSUQ6IFwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIG5vZGUgPSBOb2RlSW5mby5qYXZhIG9iamVjdCAqL1xyXG4gICAgZ2V0T3JkaW5hbE9mTm9kZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnROb2RlRGF0YSB8fCAhdGhpcy5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gdGhpcy5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV0uaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXJyZW50Tm9kZURhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gZGF0YS5ub2RlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGVVaWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlUGF0aCA9IGRhdGEubm9kZS5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGFub25QYWdlTG9hZFJlc3BvbnNlID0gKHJlcykgPT4ge1xyXG5cclxuICAgICAgICBpZiAocmVzLnJlbmRlck5vZGVSZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwibWFpbk5vZGVDb250ZW50XCIsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMucmVuZGVyTm9kZVJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIGxpc3R2aWV3IHRvOiBcIiArIHJlcy5jb250ZW50KTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQoXCJsaXN0Vmlld1wiLCByZXMuY29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbmRlci5yZW5kZXJNYWluUGFnZUNvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQmluYXJ5QnlVaWQgPSAodWlkKSA9PiB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICBpZiAobm9kZS51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5oYXNCaW5hcnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB1cGRhdGVzIGNsaWVudCBzaWRlIG1hcHMgYW5kIGNsaWVudC1zaWRlIGlkZW50aWZpZXIgZm9yIG5ldyBub2RlLCBzbyB0aGF0IHRoaXMgbm9kZSBpcyAncmVjb2duaXplZCcgYnkgY2xpZW50XHJcbiAgICAgKiBzaWRlIGNvZGVcclxuICAgICAqL1xyXG4gICAgaW5pdE5vZGUgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXROb2RlIGhhcyBudWxsIG5vZGVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBhc3NpZ24gYSBwcm9wZXJ0eSBmb3IgZGV0ZWN0aW5nIHRoaXMgbm9kZSB0eXBlLCBJJ2xsIGRvIHRoaXMgaW5zdGVhZCBvZiB1c2luZyBzb21lIGtpbmQgb2YgY3VzdG9tIEpTXHJcbiAgICAgICAgICogcHJvdG90eXBlLXJlbGF0ZWQgYXBwcm9hY2hcclxuICAgICAgICAgKi9cclxuICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQodGhpcy5pZGVudFRvVWlkTWFwLCBub2RlLmlkKTtcclxuICAgICAgICBub2RlLnByb3BlcnRpZXMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIobm9kZS5wcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBGb3IgdGhlc2UgdHdvIHByb3BlcnRpZXMgdGhhdCBhcmUgYWNjZXNzZWQgZnJlcXVlbnRseSB3ZSBnbyBhaGVhZCBhbmQgbG9va3VwIHRoZSBwcm9wZXJ0aWVzIGluIHRoZVxyXG4gICAgICAgICAqIHByb3BlcnR5IGFycmF5LCBhbmQgYXNzaWduIHRoZW0gZGlyZWN0bHkgYXMgbm9kZSBvYmplY3QgcHJvcGVydGllcyBzbyB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLCBhbmQgYWxzb1xyXG4gICAgICAgICAqIHNpbXBsaWZ5IGNvZGUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbm9kZS5jcmVhdGVkQnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICBub2RlLmxhc3RNb2RpZmllZCA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIG5vZGUpO1xyXG5cclxuICAgICAgICB0aGlzLnVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgICAgIHRoaXMuaWRUb05vZGVNYXBbbm9kZS5pZF0gPSBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDb25zdGFudHMgPSAoKSA9PiB7XHJcbiAgICAgICAgdXRpbC5hZGRBbGwodGhpcy5zaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3QsIFsgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QUklNQVJZX1RZUEUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUE9MSUNZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19IRUlHSFQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX1ZFUiwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fTUlNRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DT01NRU5UX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgdXRpbC5hZGRBbGwodGhpcy5yZWFkT25seVByb3BlcnR5TGlzdCwgWyAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5VVUlELCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNSRUFURUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRF9CWSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5MQVNUX01PRElGSUVELCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlksLy9cclxuICAgICAgICAgICAgamNyQ25zdC5JTUdfV0lEVEgsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICB1dGlsLmFkZEFsbCh0aGlzLmJpbmFyeVByb3BlcnR5TGlzdCwgW2pjckNuc3QuQklOX0RBVEFdKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0b2RvLTA6IHRoaXMgYW5kIGV2ZXJ5IG90aGVyIG1ldGhvZCB0aGF0J3MgY2FsbGVkIGJ5IGEgbGl0c3RlbmVyIG9yIGEgdGltZXIgbmVlZHMgdG8gaGF2ZSB0aGUgJ2ZhdCBhcnJvdycgc3ludGF4IGZvciB0aGlzICovXHJcbiAgICBpbml0QXBwID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdEFwcCBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5hcHBJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAgIHZhciB0YWJzID0gdXRpbC5wb2x5KFwibWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgdGFicy5hZGRFdmVudExpc3RlbmVyKFwiaXJvbi1zZWxlY3RcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXoudGFiQ2hhbmdlRXZlbnQodGFicy5zZWxlY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENvbnN0YW50cygpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTM6IGhvdyBkb2VzIG9yaWVudGF0aW9uY2hhbmdlIG5lZWQgdG8gd29yayBmb3IgcG9seW1lcj8gUG9seW1lciBkaXNhYmxlZFxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgKiBcImlkPVxcbXlcXHBhdGhcIiB0eXBlIG9mIHVybCB0byBvcGVuIGEgc3BlY2lmaWMgbm9kZS4gTmVlZCB0byByZXRoaW5rIHRoaXMuIEJhc2ljYWxseSBmb3Igbm93IEknbSB0aGlua2luZ1xyXG4gICAgICAgICAqIGdvaW5nIHRvIGEgZGlmZmVyZW50IHVybCBzaG91bGRuJ3QgYmxvdyB1cCB0aGUgc2Vzc2lvbiwgd2hpY2ggaXMgd2hhdCAnbG9nb3V0JyBkb2VzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogJCh3aW5kb3cpLm9uKFwidW5sb2FkXCIsIGZ1bmN0aW9uKCkgeyB1c2VyLmxvZ291dChmYWxzZSk7IH0pO1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZVdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgdGhpcy5kZXZpY2VIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBjYWxsIGNoZWNrcyB0aGUgc2VydmVyIHRvIHNlZSBpZiB3ZSBoYXZlIGEgc2Vzc2lvbiBhbHJlYWR5LCBhbmQgZ2V0cyBiYWNrIHRoZSBsb2dpbiBpbmZvcm1hdGlvbiBmcm9tXHJcbiAgICAgICAgICogdGhlIHNlc3Npb24sIGFuZCB0aGVuIHJlbmRlcnMgcGFnZSBjb250ZW50LCBhZnRlciB0aGF0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVzZXIucmVmcmVzaExvZ2luKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogQ2hlY2sgZm9yIHNjcmVlbiBzaXplIGluIGEgdGltZXIuIFdlIGRvbid0IHdhbnQgdG8gbW9uaXRvciBhY3R1YWwgc2NyZWVuIHJlc2l6ZSBldmVudHMgYmVjYXVzZSBpZiBhIHVzZXJcclxuICAgICAgICAgKiBpcyBleHBhbmRpbmcgYSB3aW5kb3cgd2UgYmFzaWNhbGx5IHdhbnQgdG8gbGltaXQgdGhlIENQVSBhbmQgY2hhb3MgdGhhdCB3b3VsZCBlbnN1ZSBpZiB3ZSB0cmllZCB0byBhZGp1c3RcclxuICAgICAgICAgKiB0aGluZ3MgZXZlcnkgdGltZSBpdCBjaGFuZ2VzLiBTbyB3ZSB0aHJvdHRsZSBiYWNrIHRvIG9ubHkgcmVvcmdhbml6aW5nIHRoZSBzY3JlZW4gb25jZSBwZXIgc2Vjb25kLiBUaGlzXHJcbiAgICAgICAgICogdGltZXIgaXMgYSB0aHJvdHRsZSBzb3J0IG9mLiBZZXMgSSBrbm93IGhvdyB0byBsaXN0ZW4gZm9yIGV2ZW50cy4gTm8gSSdtIG5vdCBkb2luZyBpdCB3cm9uZyBoZXJlLiBUaGlzXHJcbiAgICAgICAgICogdGltZXIgaXMgY29ycmVjdCBpbiB0aGlzIGNhc2UgYW5kIGJlaGF2ZXMgc3VwZXJpb3IgdG8gZXZlbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUG9seW1lci0+ZGlzYWJsZVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7IHZhciB3aWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogaWYgKHdpZHRoICE9IF8uZGV2aWNlV2lkdGgpIHsgLy8gY29uc29sZS5sb2coXCJTY3JlZW4gd2lkdGggY2hhbmdlZDogXCIgKyB3aWR0aCk7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBfLmRldmljZVdpZHRoID0gd2lkdGg7IF8uZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXy5zY3JlZW5TaXplQ2hhbmdlKCk7IH0gfSwgMTUwMCk7XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlTWFpbk1lbnVQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdXRpbC5pbml0UHJvZ3Jlc3NNb25pdG9yKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvY2Vzc1VybFBhcmFtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3NVcmxQYXJhbXMgPSAoKSA9PiB7XHJcbiAgICAgICAgdmFyIHBhc3NDb2RlID0gdXRpbC5nZXRQYXJhbWV0ZXJCeU5hbWUoXCJwYXNzQ29kZVwiKTtcclxuICAgICAgICBpZiAocGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ2hhbmdlUGFzc3dvcmREbGcocGFzc0NvZGUpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhYkNoYW5nZUV2ZW50ID0gKHRhYk5hbWUpID0+IHtcclxuICAgICAgICBpZiAodGFiTmFtZSA9PSBcInNlYXJjaFRhYk5hbWVcIikge1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFRhYkFjdGl2YXRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5U2lnbnVwTWVzc2FnZSA9ICgpID0+IHtcclxuICAgICAgICB2YXIgc2lnbnVwUmVzcG9uc2UgPSAkKFwiI3NpZ251cENvZGVSZXNwb25zZVwiKS50ZXh0KCk7XHJcbiAgICAgICAgaWYgKHNpZ251cFJlc3BvbnNlID09PSBcIm9rXCIpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2lnbnVwIGNvbXBsZXRlLiBZb3UgbWF5IG5vdyBsb2dpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2NyZWVuU2l6ZUNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZURhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuY3VycmVudE5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUobWV0YTY0LmN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHRoaXMuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pbWdJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci5hZGp1c3RJbWFnZVNpemUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBEb24ndCBuZWVkIHRoaXMgbWV0aG9kIHlldCwgYW5kIGhhdmVuJ3QgdGVzdGVkIHRvIHNlZSBpZiB3b3JrcyAqL1xyXG4gICAgb3JpZW50YXRpb25IYW5kbGVyID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50Lm9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbm9uUGFnZUhvbWUgPSAoaWdub3JlVXJsKSA9PiB7XHJcbiAgICAgICAgdXRpbC5qc29uKFwiYW5vblBhZ2VMb2FkXCIsIHtcclxuICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgfSwgdGhpcy5hbm9uUGFnZUxvYWRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wibWV0YTY0XCJdKSB7XHJcbiAgICB2YXIgbWV0YTY0OiBNZXRhNjQgPSBuZXcgTWV0YTY0KCk7XHJcbn1cclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbmNsYXNzIE5hdiB7XHJcbiAgICBfVUlEX1JPV0lEX1NVRkZJWDogc3RyaW5nID0gXCJfcm93XCI7XHJcblxyXG4gICAgb3Blbk1haW5NZW51SGVscCA9ICgpID0+IHtcclxuICAgICAgICB3aW5kb3cub3Blbih3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9L21ldGE2NC9wdWJsaWMvaGVscFwiLCBcIl9ibGFua1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5aW5nSG9tZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGFyZW50VmlzaWJsZVRvVXNlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuZGlzcGxheWluZ0hvbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cExldmVsUmVzcG9uc2UgPSAocmVzLCBpZCkgPT4ge1xyXG4gICAgICAgIGlmICghcmVzIHx8ICFyZXMubm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBkYXRhIGlzIHZpc2libGUgdG8geW91IGFib3ZlIHRoaXMgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKGlkLCB0cnVlKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdlVwTGV2ZWwgPSAoKSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5wYXJlbnRWaXNpYmxlVG9Vc2VyKCkpIHtcclxuICAgICAgICAgICAgLy8gQWxyZWFkeSBhdCByb290LiBDYW4ndCBnbyB1cC5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlSWQsXHJcbiAgICAgICAgICAgIFwidXBMZXZlbFwiOiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICBpcm9uUmVzLmNvbXBsZXRlcy50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGl6LnVwTGV2ZWxSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBtZXRhNjQuY3VycmVudE5vZGVJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGdldFNlbGVjdGVkRG9tRWxlbWVudCA9ICgpID0+IHtcclxuXHJcbiAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgIHZhciBub2RlSWQgPSBub2RlLnVpZCArIHRoaXMuX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIrbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGdldFNlbGVjdGVkUG9seUVsZW1lbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZUlkID0gbm9kZS51aWQgKyB0aGlzLl9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlsLnBvbHlFbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gbm9kZSBoaWdobGlnaHRlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrT25Ob2RlUm93ID0gKHJvd0VsbSwgdWlkKSA9PiB7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrT25Ob2RlUm93IHJlY2lldmVkIHVpZCB0aGF0IGRvZXNuJ3QgbWFwIHRvIGFueSBub2RlLiB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgKi9cclxuICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Tm9kZShub2RlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGUpIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIG5vZGUub3duZXIgaXMgY3VycmVudGx5IG51bGwsIHRoYXQgbWVhbnMgd2UgaGF2ZSBub3QgcmV0cmlldmUgdGhlIG93bmVyIGZyb20gdGhlIHNlcnZlciB5ZXQsIGJ1dFxyXG4gICAgICAgICAgICAgKiBpZiBub24tbnVsbCBpdCdzIGFscmVhZHkgZGlzcGxheWluZyBhbmQgd2UgZG8gbm90aGluZy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghbm9kZS5vd25lcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHVwZGF0ZU5vZGVJbmZvXCIpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVwZGF0ZU5vZGVJbmZvKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5Ob2RlID0gKHVpZCkgPT4ge1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuXHJcbiAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJVbmtub3duIG5vZGVJZCBpbiBvcGVuTm9kZTogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShub2RlLmlkLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB1bmZvcnR1bmF0ZWx5IHdlIGhhdmUgdG8gcmVseSBvbiBvbkNsaWNrLCBiZWNhdXNlIG9mIHRoZSBmYWN0IHRoYXQgZXZlbnRzIHRvIGNoZWNrYm94ZXMgZG9uJ3QgYXBwZWFyIHRvIHdvcmtcclxuICAgICAqIGluIFBvbG1lciBhdCBhbGwsIGFuZCBzaW5jZSBvbkNsaWNrIHJ1bnMgQkVGT1JFIHRoZSBzdGF0ZSBjaGFuZ2UgaXMgY29tcGxldGVkLCB0aGF0IGlzIHRoZSByZWFzb24gZm9yIHRoZVxyXG4gICAgICogc2lsbHkgbG9va2luZyBhc3luYyB0aW1lciBoZXJlLlxyXG4gICAgICovXHJcbiAgICB0b2dnbGVOb2RlU2VsID0gKHVpZCkgPT4ge1xyXG4gICAgICAgIHZhciB0b2dnbGVCdXR0b24gPSB1dGlsLnBvbHlFbG0odWlkICsgXCJfc2VsXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0b2dnbGVCdXR0b24ubm9kZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdkhvbWVSZXNwb25zZSA9IChyZXMpID0+IHtcclxuICAgICAgICBtZXRhNjQuY2xlYXJTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZIb21lID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgICAgICAgICAgLy8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbWV0YTY0LmhvbWVOb2RlSWRcclxuICAgICAgICAgICAgfSwgdGhpcy5uYXZIb21lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZQdWJsaWNIb21lID0gKCkgPT4ge1xyXG4gICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZU1haW5NZW51ID0gKCkgPT4ge1xyXG4gICAgICAgIC8vdmFyIHBhcGVyRHJhd2VyUGFuZWwgPSB1dGlsLnBvbHlFbG0oXCJwYXBlckRyYXdlclBhbmVsXCIpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHRoaXMgdG9nZ2xlUGFuZWwgZnVuY3Rpb24gZG9lcyBhYnNvbHV0ZWx5IG5vdGhpbmcsIGFuZCBJIHRoaW5rIHRoaXMgaXMgcHJvYmFibHkgYSBidWcgb24gdGhlIGdvb2dsZVxyXG4gICAgICAgICAqIHBvbHltZXIgY29kZSwgYmVjYXVzZSBpdCBzaG91bGQgYWx3YXlzIHdvcmsuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy9wYXBlckRyYXdlclBhbmVsLm5vZGUudG9nZ2xlUGFuZWwoKTtcclxuICAgIH1cclxufVxyXG5pZiAoIXdpbmRvd1tcIm5hdlwiXSkge1xyXG4gICAgdmFyIG5hdjogTmF2ID0gbmV3IE5hdigpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcmVmcy5qc1wiKTtcclxuXHJcbmNsYXNzIFByZWZzIHtcclxuXHJcbiAgICBjbG9zZUFjY291bnRSZXNwb25zZSA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAvKiBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAqL1xyXG4gICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgIC8qIHJlbG9hZHMgYnJvd3NlciB3aXRoIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmlwcGVkIG9mZiB0aGUgcGF0aCAqL1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUFjY291bnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgLy90b2RvLTA6IHNlZSBpZiB0aGVyZSdzIGEgYmV0dGVyIHdheSB0byBkbyB0aGl6LlxyXG4gICAgICAgIHZhciB0aGl6OiBQcmVmcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9oIE5vIVwiLCBcIkNsb3NlIHlvdXIgQWNjb3VudD88cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9uZSBtb3JlIENsaWNrXCIsIFwiWW91ciBkYXRhIHdpbGwgYmUgZGVsZXRlZCBhbmQgY2FuIG5ldmVyIGJlIHJlY292ZXJlZC48cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyLmRlbGV0ZUFsbFVzZXJDb29raWVzKCk7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb24oXCJjbG9zZUFjY291bnRcIiwge30sIHRoaXouY2xvc2VBY2NvdW50UmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wicHJlZnNcIl0pIHtcclxuICAgIHZhciBwcmVmczogUHJlZnMgPSBuZXcgUHJlZnMoKTtcclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcm9wcy5qc1wiKTtcclxuXHJcbi8vaW1wb3J0IHsgY25zdCB9IGZyb20gXCIuL2Nuc3RcIjtcclxuXHJcbmNsYXNzIFByb3BzIHtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAqL1xyXG4gICAgcHJvcHNUb2dnbGUgPSAoKSA9PiB7XHJcbiAgICAgICAgbWV0YTY0LnNob3dQcm9wZXJ0aWVzID0gbWV0YTY0LnNob3dQcm9wZXJ0aWVzID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIC8vIHNldERhdGFJY29uVXNpbmdJZChcIiNlZGl0TW9kZUJ1dHRvblwiLCBlZGl0TW9kZSA/IFwiZWRpdFwiIDpcclxuICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgLy8gZml4IGZvciBwb2x5bWVyXHJcbiAgICAgICAgLy8gdmFyIGVsbSA9ICQoXCIjcHJvcHNUb2dnbGVCdXR0b25cIik7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1mb3JiaWRkZW5cIiwgIW1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YSA9IChwcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc3BsaWNlIGlzIGhvdyB5b3UgZGVsZXRlIGFycmF5IGVsZW1lbnRzIGluIGpzLlxyXG4gICAgICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBTb3J0cyBwcm9wcyBpbnB1dCBhcnJheSBpbnRvIHRoZSBwcm9wZXIgb3JkZXIgdG8gc2hvdyBmb3IgZWRpdGluZy4gU2ltcGxlIGFsZ29yaXRobSBmaXJzdCBncmFicyAnamNyOmNvbnRlbnQnXHJcbiAgICAgKiBub2RlIGFuZCBwdXRzIGl0IG9uIHRoZSB0b3AsIGFuZCB0aGVuIGRvZXMgc2FtZSBmb3IgJ2pjdENuc3QuVEFHUydcclxuICAgICAqL1xyXG4gICAgZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyID0gKHByb3BzKSA9PiB7XHJcbiAgICAgICAgdmFyIHByb3BzTmV3ID0gcHJvcHMuY2xvbmUoKTtcclxuICAgICAgICB2YXIgdGFyZ2V0SWR4ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHRhZ0lkeCA9IHByb3BzTmV3LmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBqY3JDbnN0LkNPTlRFTlQpO1xyXG4gICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRhZ0lkeCA9IHByb3BzTmV3LmluZGV4T2ZJdGVtQnlQcm9wKFwibmFtZVwiLCBqY3JDbnN0LlRBR1MpO1xyXG4gICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgcHJvcHNOZXcuYXJyYXlNb3ZlSXRlbSh0YWdJZHgsIHRhcmdldElkeCsrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwcm9wc05ldztcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogcHJvcGVydGllcyB3aWxsIGJlIG51bGwgb3IgYSBsaXN0IG9mIFByb3BlcnR5SW5mbyBvYmplY3RzLlxyXG4gICAgICpcclxuICAgICAqIHRvZG8tMzogSSBjYW4gZG8gbXVjaCBiZXR0ZXIgaW4gdGhpcyBtZXRob2QsIEkganVzdCBoYXZlbid0IGhhZCB0aW1lIHRvIGNsZWFuIGl0IHVwLiB0aGlzIG1ldGhvZCBpcyB1Z2x5LlxyXG4gICAgICovXHJcbiAgICByZW5kZXJQcm9wZXJ0aWVzID0gKHByb3BlcnRpZXMpID0+IHtcclxuICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gXCI8dGFibGUgY2xhc3M9J3Byb3BlcnR5LXRleHQnPlwiO1xyXG4gICAgICAgICAgICB2YXIgcHJvcENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGRvbid0IG5lZWQgb3Igd2FudCBhIHRhYmxlIGhlYWRlciwgYnV0IEpRdWVyeSBkaXNwbGF5cyBhbiBlcnJvciBpbiB0aGUgSlMgY29uc29sZSBpZiBpdCBjYW4ndCBmaW5kXHJcbiAgICAgICAgICAgICAqIHRoZSA8dGhlYWQ+IGVsZW1lbnQuIFNvIHdlIHByb3ZpZGUgZW1wdHkgdGFncyBoZXJlLCBqdXN0IHRvIG1ha2UgSlF1ZXJ5IGhhcHB5LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmV0ICs9IFwiPHRoZWFkPjx0cj48dGg+PC90aD48dGg+PC90aD48L3RyPjwvdGhlYWQ+XCI7XHJcblxyXG4gICAgICAgICAgICByZXQgKz0gXCI8dGJvZHk+XCI7XHJcbiAgICAgICAgICAgICQuZWFjaChwcm9wZXJ0aWVzLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3BlcnR5Lm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcm9wQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8dHIgY2xhc3M9J3Byb3AtdGFibGUtcm93Jz5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPHRkIGNsYXNzPSdwcm9wLXRhYmxlLW5hbWUtY29sJz5cIiArIHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICArIFwiPC90ZD5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmluYXJ5UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8dGQgY2xhc3M9J3Byb3AtdGFibGUtdmFsLWNvbCc+W2JpbmFyeV08L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXByb3BlcnR5LnZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gcHJvcGVydHkuaHRtbFZhbHVlID8gcHJvcGVydHkuaHRtbFZhbHVlIDogcHJvcGVydHkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjx0ZCBjbGFzcz0ncHJvcC10YWJsZS12YWwtY29sJz5cIiArIHJlbmRlci53cmFwSHRtbCh2YWwpICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjx0ZCBjbGFzcz0ncHJvcC10YWJsZS12YWwtY29sJz5cIiArIHByb3BzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvcENvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXQgKz0gXCI8L3Rib2R5PjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGJydXRlIGZvcmNlIHNlYXJjaGVzIG9uIG5vZGUgKE5vZGVJbmZvLmphdmEpIG9iamVjdCBwcm9wZXJ0aWVzIGxpc3QsIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBwcm9wZXJ0eVxyXG4gICAgICogKFByb3BlcnR5SW5mby5qYXZhKSB3aXRoIG5hbWUgbWF0Y2hpbmcgcHJvcGVydHlOYW1lLCBlbHNlIG51bGwuXHJcbiAgICAgKi9cclxuICAgIGdldE5vZGVQcm9wZXJ0eSA9IChwcm9wZXJ0eU5hbWUsIG5vZGUpID0+IHtcclxuICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucHJvcGVydGllcylcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAocHJvcC5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVQcm9wZXJ0eVZhbCA9IChwcm9wZXJ0eU5hbWUsIG5vZGUpID0+IHtcclxuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZ2V0Tm9kZVByb3BlcnR5KHByb3BlcnR5TmFtZSwgbm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHByb3AgPyBwcm9wLnZhbHVlIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0cnVzIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUsIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBkb2Vzbid0IG93bi4gVXNlZCB0byBkaXNhYmxlIFwiZWRpdFwiLCBcImRlbGV0ZVwiLFxyXG4gICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICovXHJcbiAgICBpc05vbk93bmVkTm9kZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNyZWF0ZWRCeSA9IHRoaXMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGRvbid0IGtub3cgd2hvIG93bnMgdGhpcyBub2RlIGFzc3VtZSB0aGUgYWRtaW4gb3ducyBpdC5cclxuICAgICAgICBpZiAoIWNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICBjcmVhdGVkQnkgPSBcImFkbWluXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUaGlzIGlzIE9SIGNvbmRpdGlvbiBiZWNhdXNlIG9mIGNyZWF0ZWRCeSBpcyBudWxsIHdlIGFzc3VtZSB3ZSBkbyBub3Qgb3duIGl0ICovXHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAqL1xyXG4gICAgaXNOb25Pd25lZENvbW1lbnROb2RlID0gKG5vZGUpID0+IHtcclxuICAgICAgICB2YXIgY29tbWVudEJ5ID0gdGhpcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBpc093bmVkQ29tbWVudE5vZGUgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBjb21tZW50QnkgPSB0aGlzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgPT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBwcm9wZXJ0eSB2YWx1ZSwgZXZlbiBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHJlbmRlclByb3BlcnR5ID0gKHByb3BlcnR5KSA9PiB7XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS52YWx1ZSB8fCBwcm9wZXJ0eS52YWx1ZS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdG9kby0xOiBtYWtlIHN1cmUgdGhpcyB3cmFwSHRtbCBpc24ndCBjcmVhdGluZyBhbiB1bm5lY2Vzc2FyeSBESVYgZWxlbWVudC5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci53cmFwSHRtbChwcm9wZXJ0eS5odG1sVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclByb3BlcnR5VmFsdWVzID0gKHZhbHVlcykgPT4ge1xyXG4gICAgICAgIHZhciByZXQgPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAkLmVhY2godmFsdWVzLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXQgKz0gcmVuZGVyLndyYXBIdG1sKHZhbHVlKTtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXQgKz0gXCI8L2Rpdj5cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInByb3BzXCJdKSB7XHJcbiAgICB2YXIgcHJvcHM6IFByb3BzID0gbmV3IFByb3BzKCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcmVuZGVyLmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgcG9zdFRhcmdldFVybDtcclxuZGVjbGFyZSB2YXIgcHJldHR5UHJpbnQ7XHJcblxyXG4vLyYmJiYgSSB0aGluayBqdXN0IGJ5IGltcG9ydGluZyBjbnN0LCBub3cgQUxMIG90aGVyICdtb2R1bGVzJyBoYXZlIHRvIGJlIGltcG9ydGVkPz8gV1RGLiB0aGlzIHNob3VsZCBub3cgYmUgaG93IHRoZXkgZGVzaWduZWQgaXQuXHJcblxyXG4vL2ltcG9ydCB7IGNuc3QgfSBmcm9tIFwiLi9jbnN0XCI7XHJcblxyXG5jbGFzcyBSZW5kZXIge1xyXG4gICAgX2RlYnVnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8qXHJcblx0ICogVGhpcyBpcyB0aGUgY29udGVudCBkaXNwbGF5ZWQgd2hlbiB0aGUgdXNlciBzaWducyBpbiwgYW5kIHdlIHNlZSB0aGF0IHRoZXkgaGF2ZSBubyBjb250ZW50IGJlaW5nIGRpc3BsYXllZC4gV2VcclxuXHQgKiB3YW50IHRvIGdpdmUgdGhlbSBzb21lIGluc3RydWN0aW9ucyBhbmQgdGhlIGFiaWxpdHkgdG8gYWRkIGNvbnRlbnQuXHJcblx0ICovXHJcbiAgICBfZ2V0RW1wdHlQYWdlUHJvbXB0ID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBcIjxwPlRoZXJlIGFyZSBubyBzdWJub2RlcyB1bmRlciB0aGlzIG5vZGUuIDxicj48YnI+Q2xpY2sgJ0VESVQgTU9ERScgYW5kIHRoZW4gdXNlIHRoZSAnQUREJyBidXR0b24gdG8gY3JlYXRlIGNvbnRlbnQuPC9wPlwiO1xyXG4gICAgfVxyXG5cclxuICAgIF9yZW5kZXJCaW5hcnkgPSAobm9kZSkgPT4ge1xyXG5cdFx0LypcclxuXHRcdCAqIElmIHRoaXMgaXMgYW4gaW1hZ2UgcmVuZGVyIHRoZSBpbWFnZSBkaXJlY3RseSBvbnRvIHRoZSBwYWdlIGFzIGEgdmlzaWJsZSBpbWFnZVxyXG5cdFx0ICovXHJcbiAgICAgICAgaWYgKG5vZGUuYmluYXJ5SXNJbWFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlSW1hZ2VUYWcobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cdFx0LypcclxuXHRcdCAqIElmIG5vdCBhbiBpbWFnZSB3ZSByZW5kZXIgYSBsaW5rIHRvIHRoZSBhdHRhY2htZW50LCBzbyB0aGF0IGl0IGNhbiBiZSBkb3dubG9hZGVkLlxyXG5cdFx0ICovXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSByZW5kZXIudGFnKFwiYVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImhyZWZcIjogcmVuZGVyLmdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpXHJcbiAgICAgICAgICAgIH0sIFwiW0Rvd25sb2FkIEF0dGFjaG1lbnRdXCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImJpbmFyeS1saW5rXCJcclxuICAgICAgICAgICAgfSwgYW5jaG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEltcG9ydGFudCBsaXR0bGUgbWV0aG9kIGhlcmUuIEFsbCBHVUkgcGFnZS9kaXZzIGFyZSBjcmVhdGVkIHVzaW5nIHRoaXMgc29ydCBvZiBzcGVjaWZpY2F0aW9uIGhlcmUgdGhhdCB0aGV5XHJcbiAgICAgKiBhbGwgbXVzdCBoYXZlIGEgJ2J1aWxkJyBtZXRob2QgdGhhdCBpcyBjYWxsZWQgZmlyc3QgdGltZSBvbmx5LCBhbmQgdGhlbiB0aGUgJ2luaXQnIG1ldGhvZCBjYWxsZWQgYmVmb3JlIGVhY2hcclxuICAgICAqIHRpbWUgdGhlIGNvbXBvbmVudCBnZXRzIGRpc3BsYXllZCB3aXRoIG5ldyBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBJZiAnZGF0YScgaXMgcHJvdmlkZWQsIHRoaXMgaXMgdGhlIGluc3RhbmNlIGRhdGEgZm9yIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpZFBhZ2UgPSAocGcsIGRhdGEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ1aWxkUGFnZTogcGcuZG9tSWQ9XCIgKyBwZy5kb21JZCk7XHJcblxyXG4gICAgICAgIGlmICghcGcuYnVpbHQgfHwgZGF0YSkge1xyXG4gICAgICAgICAgICBwZy5idWlsZChkYXRhKTtcclxuICAgICAgICAgICAgcGcuYnVpbHQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBnLmluaXQpIHtcclxuICAgICAgICAgICAgcGcuaW5pdChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnVpbGRSb3dIZWFkZXIgPSAobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA9PiB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICB2YXIgaGVhZGVyVGV4dCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9PTl9ST1dTKSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2IGNsYXNzPSdwYXRoLWRpc3BsYXknPlBhdGg6IFwiICsgdGhpcy5mb3JtYXRQYXRoKG5vZGUpICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gXCI8ZGl2PlwiO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgIHZhciBjbGF6eiA9IChjb21tZW50QnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q29tbWVudCBCeTogXCIgKyBjb21tZW50QnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICB9IC8vXHJcbiAgICAgICAgZWxzZSBpZiAobm9kZS5jcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgdmFyIGNsYXp6ID0gKG5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNyZWF0ZWQgQnk6IFwiICsgbm9kZS5jcmVhdGVkQnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBpZD0nb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCArIFwiJz48L3NwYW4+XCI7XHJcbiAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCIgIE1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGVhZGVyVGV4dCArPSBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogY29tbWVudGluZzogSSBkZWNpZGVkIHVzZXJzIHdpbGwgdW5kZXJzdGFuZCB0aGUgcGF0aCBhcyBhIHNpbmdsZSBsb25nIGVudGl0eSB3aXRoIGxlc3MgY29uZnVzaW9uIHRoYW5cclxuICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAqIHRvIGJhYnkgdGhlbS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICogbmFtZSwgc28gd2UgZG9uJ3QgbmVlZCB0byBzaG93IHRoZSBwYXRoIEFORCB0aGUgbmFtZS4gT25lIGlzIGEgc3Vic3RyaW5nIG9mIHRoZSBvdGhlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiTmFtZTogXCIgKyBub2RlLm5hbWUgKyBcIiBbdWlkPVwiICsgbm9kZS51aWQgKyBcIl1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlclRleHQgPSB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJoZWFkZXItdGV4dFwiXHJcbiAgICAgICAgfSwgaGVhZGVyVGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAqIHByZXR0aWZpZXIgdG8gcHJvY2VzcyBpdCB0aGUgcmVzdCBvZiB0aGUgd2F5ICh3aGVuIHdlIGNhbGwgcHJldHR5UHJpbnQoKSBmb3IgdGhlIHdob2xlIHBhZ2UpIHdlIG5vdyBydW5cclxuICAgICAqIGFub3RoZXIgc3RhZ2Ugb2YgdHJhbnNmb3JtYXRpb24gdG8gZ2V0IHRoZSA8cHJlPiB0YWcgcHV0IGluIHdpdGggJ3ByZXR0eXByaW50JyBldGMuXHJcbiAgICAgKi9cclxuICAgIGluamVjdENvZGVGb3JtYXR0aW5nID0gKGNvbnRlbnQpID0+IHtcclxuXHJcbiAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAvLyBgYGBqc1xyXG4gICAgICAgIC8vIHZhciB4ID0gMTA7XHJcbiAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAvLyBgYGBcclxuICAgICAgICAvL1xyXG4gICAgICAgIGlmIChjb250ZW50LmNvbnRhaW5zKFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjwvY29kZT5cIiwgXCI8L3ByZT5cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBpbmplY3RTdWJzdGl0dXRpb25zID0gKGNvbnRlbnQpID0+IHtcclxuICAgICAgICByZXR1cm4gY29udGVudC5yZXBsYWNlQWxsKFwie3tsb2NhdGlvbk9yaWdpbn19XCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGVuY29kZUxhbmd1YWdlcyA9IChjb250ZW50KSA9PiB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0b2RvLTE6IG5lZWQgdG8gcHJvdmlkZSBzb21lIHdheSBvZiBoYXZpbmcgdGhlc2UgbGFuZ3VhZ2UgdHlwZXMgY29uZmlndXJhYmxlIGluIGEgcHJvcGVydGllcyBmaWxlXHJcbiAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBsYW5ncyA9IFtcImpzXCIsIFwiaHRtbFwiLCBcImh0bVwiLCBcImNzc1wiXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZSBjbGFzcz1cXFwiXCIgKyBsYW5nc1tpXSArIFwiXFxcIj5cIiwgLy9cclxuICAgICAgICAgICAgICAgIFwiPD9wcmV0dGlmeSBsYW5nPVwiICsgbGFuZ3NbaV0gKyBcIj8+PHByZSBjbGFzcz0ncHJldHR5cHJpbnQnPlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZUFsbChcIjxjb2RlPlwiLCBcIjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAqIGFwcCBhbmQgaXMgd2hhdCB0aGUgdXNlciBzZWVzIGNvdmVyaW5nIDkwJSBvZiB0aGUgc2NyZWVuIG1vc3Qgb2YgdGhlIHRpbWUuIFRoZSBcImNvbnRlbnQqIG5vZGVzLlxyXG4gICAgICpcclxuICAgICAqIG5vZGU6IEpTT04gb2YgTm9kZUluZm8uamF2YVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcmVuZGVyTm9kZUNvbnRlbnQgPSAobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lLCByZW5kZXJCaW5hcnksIHJvd1N0eWxpbmcsIHNob3dIZWFkZXIpID0+IHtcclxuICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSB0aGlzLmdldFRvcFJpZ2h0SW1hZ2VUYWcobm9kZSk7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMjogZW5hYmxlIGhlYWRlclRleHQgd2hlbiBhcHByb3ByaWF0ZSBoZXJlICovXHJcbiAgICAgICAgcmV0ICs9IHNob3dIZWFkZXIgPyB0aGlzLmJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkgOiBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobWV0YTY0LnNob3dQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnRQcm9wID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCwgbm9kZSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICBpZiAoY29udGVudFByb3ApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgamNyQ29udGVudCA9IHByb3BzLnJlbmRlclByb3BlcnR5KGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgIGpjckNvbnRlbnQgPSBcIjxkaXY+XCIgKyBqY3JDb250ZW50ICsgXCI8L2Rpdj5cIlxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChqY3JDb250ZW50Lmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGE2NC5zZXJ2ZXJNYXJrZG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gdGhpcy5pbmplY3RDb2RlRm9ybWF0dGluZyhqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCA9IHRoaXMuaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9iYWJseSBjb3VsZCB1c2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChBbHNvIG5lZWQgdG8gbWFrZSB0aGlzIGEgY29uZmlndXJhYmxlIG9wdGlvbiwgYmVjYXVzZSBvdGhlciBjbG9uZXMgb2YgbWV0YTY0IGRvbid0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2FudCBteSBnaXRodWIgbGluayEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vQ2xheS1GZXJndXNvbi9tZXRhNjQnPjxpbWcgc3JjPScvZm9yay1tZS1vbi1naXRodWIucG5nJyBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEkgc3BlbnQgaG91cnMgdHJ5aW5nIHRvIGdldCBtYXJrZWQtZWxlbWVudCB0byB3b3JrLiBVbnN1Y2Nlc3NmdWwgc3RpbGwsIHNvIEkganVzdCBoYXZlXHJcbiAgICAgICAgICAgICAgICAgICAgICogc2VydmVyTWFya2Rvd24gZmxhZyB0aGF0IEkgY2FuIHNldCB0byB0cnVlLCBhbmQgdHVybiB0aGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIG9mZiBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogYWx0ZXJuYXRlIGF0dHJpYnV0ZSB3YXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gamNyQ29udGVudCA9IGpjckNvbnRlbnQucmVwbGFjZUFsbChcIidcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJ7e3F1b3R9fVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZG93bj0nXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBqY3JDb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICsgXCInPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwgamNyLWNvbnRlbnQnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXQgKz0gXCI8L2Rpdj48L21hcmtlZC1lbGVtZW50PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSB0aGlzLnRhZyhcInNjcmlwdFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dC9tYXJrZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGhpcy50YWcoXCJzY3JpcHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9iYWJseSBjb3VsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIGlmIHdlIHdhbnRlZCB0by4gb29wcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnIGNsYXNzPSdjb3JuZXItc3R5bGUnLz48L2E+XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGpjckNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PjwvbWFya2VkLWVsZW1lbnQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8ZGl2PltObyBDb250ZW50IFRleHRdPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0aWVzKG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaWYgKGpjckNvbnRlbnQubGVuZ3RoID4gMCkgeyBpZiAocm93U3R5bGluZykgeyByZXQgKz0gdGhpcy50YWcoXCJkaXZcIiwgeyBcImNsYXNzXCIgOiBcImpjci1jb250ZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAqIGpjckNvbnRlbnQpOyB9IGVsc2UgeyByZXQgKz0gdGhpcy50YWcoXCJkaXZcIiwgeyBcImNsYXNzXCIgOiBcImpjci1yb290LWNvbnRlbnRcIiB9LCAvLyBwcm9iYWJseSBjb3VsZFxyXG4gICAgICAgICAgICAgICAgICogXCJpbWcudG9wLnJpZ2h0XCIgZmVhdHVyZSBmb3IgdGhpcyAvLyBpZiB3ZSB3YW50ZWQgdG8uIG9vcHMuIFwiPGFcclxuICAgICAgICAgICAgICAgICAqIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9DbGF5LUZlcmd1c29uL21ldGE2NCc+PGltZyBzcmM9Jy9mb3JrLW1lLW9uLWdpdGh1Yi5wbmcnXHJcbiAgICAgICAgICAgICAgICAgKiBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiICsgamNyQ29udGVudCk7IH0gfVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXRoLnRyaW0oKSA9PSBcIi9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBcIlJvb3QgTm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPGRpdj5bTm8gQ29udGVudCBQcm9wZXJ0eV08L2Rpdj5cIjtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZW5kZXJCaW5hcnkgJiYgbm9kZS5oYXNCaW5hcnkpIHtcclxuICAgICAgICAgICAgdmFyIGJpbmFyeSA9IHRoaXMuX3JlbmRlckJpbmFyeShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAqIHRoZSB1c2VyIGhhcyBwdXQge3tpbnNlcnQtYXR0YWNobWVudH19IGlmIHRoZXkgYXJlIHVzaW5nIHRoYXQgdG8gbWFrZSB0aGUgaW1hZ2UgYXBwZWFyIGluIGEgc3BlY2lmaWNcclxuICAgICAgICAgICAgICogbG9jYXRpbyBpbiB0aGUgY29udGVudCB0ZXh0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHJldC5jb250YWlucyhjbnN0LklOU0VSVF9BVFRBQ0hNRU5UKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gcmV0LnJlcGxhY2VBbGwoY25zdC5JTlNFUlRfQVRUQUNITUVOVCwgYmluYXJ5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBiaW5hcnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0YWdzID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuVEFHUywgbm9kZSk7XHJcbiAgICAgICAgaWYgKHRhZ3MpIHtcclxuICAgICAgICAgICAgcmV0ICs9IHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0YWdzLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBcIlRhZ3M6IFwiICsgdGFncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIGlzIHRoZSBwcmltYXJ5IG1ldGhvZCBmb3IgcmVuZGVyaW5nIGVhY2ggbm9kZSAobGlrZSBhIHJvdykgb24gdGhlIG1haW4gSFRNTCBwYWdlIHRoYXQgZGlzcGxheXMgbm9kZVxyXG4gICAgICogY29udGVudC4gVGhpcyBnZW5lcmF0ZXMgdGhlIEhUTUwgZm9yIGEgc2luZ2xlIHJvdy9ub2RlLlxyXG4gICAgICpcclxuICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAqL1xyXG4gICAgcmVuZGVyTm9kZUFzTGlzdEl0ZW0gPSAobm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkgPT4ge1xyXG5cclxuICAgICAgICB2YXIgdWlkID0gbm9kZS51aWQ7XHJcbiAgICAgICAgdmFyIGNhbk1vdmVVcCA9IGluZGV4ID4gMCAmJiByb3dDb3VudCA+IDE7XHJcbiAgICAgICAgdmFyIGNhbk1vdmVEb3duID0gaW5kZXggPCBjb3VudCAtIDE7XHJcblxyXG4gICAgICAgIHZhciBpc1JlcCA9IG5vZGUubmFtZS5zdGFydHNXaXRoKFwicmVwOlwiKSB8fCAvKlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnP1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICovbm9kZS5wYXRoLmNvbnRhaW5zKFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgIHZhciBlZGl0aW5nQWxsb3dlZCA9IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKTtcclxuICAgICAgICBpZiAoIWVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gZWRpdGluZ0FsbG93ZWQ9XCIrZWRpdGluZ0FsbG93ZWQpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGlmIG5vdCBzZWxlY3RlZCBieSBiZWluZyB0aGUgbmV3IGNoaWxkLCB0aGVuIHdlIHRyeSB0byBzZWxlY3QgYmFzZWQgb24gaWYgdGhpcyBub2RlIHdhcyB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgKiBjbGlja2VkIG9uIGZvciB0aGlzIHBhZ2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0ZXN0OiBbXCIgKyBwYXJlbnRJZFRvRm9jdXNJZE1hcFtjdXJyZW50Tm9kZUlkXVxyXG4gICAgICAgIC8vICtcIl09PVtcIisgbm9kZS5pZCArIFwiXVwiKVxyXG4gICAgICAgIHZhciBmb2N1c05vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgdmFyIHNlbGVjdGVkID0gKGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFySHRtbFJldCA9IHRoaXMubWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpO1xyXG4gICAgICAgIHZhciBia2dTdHlsZSA9IHRoaXMuZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUobm9kZSk7XHJcblxyXG4gICAgICAgIHZhciBjc3NJZCA9IHVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvd1wiICsgKHNlbGVjdGVkID8gXCIgYWN0aXZlLXJvd1wiIDogXCIgaW5hY3RpdmUtcm93XCIpLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJuYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgXCJpZFwiOiBjc3NJZCxcclxuICAgICAgICAgICAgXCJzdHlsZVwiOiBia2dTdHlsZVxyXG4gICAgICAgIH0sLy9cclxuICAgICAgICAgICAgYnV0dG9uQmFySHRtbFJldCArIHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfY29udGVudFwiXHJcbiAgICAgICAgICAgIH0sIHRoaXMucmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93Tm9kZVVybCA9ICgpID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IG11c3QgZmlyc3QgY2xpY2sgb24gYSBub2RlLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcGF0aCA9IG5vZGUucGF0aC5zdHJpcElmU3RhcnRzV2l0aChcIi9yb290XCIpO1xyXG4gICAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyBwYXRoO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIlVSTCB1c2luZyBwYXRoOiA8YnI+XCIgKyB1cmw7XHJcbiAgICAgICAgdmFyIHV1aWQgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJqY3I6dXVpZFwiLCBub2RlKTtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiPHA+VVJMIGZvciBVVUlEOiA8YnI+XCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCI/aWQ9XCIgKyB1dWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb3BSaWdodEltYWdlVGFnID0gKG5vZGUpID0+IHtcclxuICAgICAgICB2YXIgdG9wUmlnaHRJbWcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy50b3AucmlnaHQnLCBub2RlKTtcclxuICAgICAgICB2YXIgdG9wUmlnaHRJbWdUYWcgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0b3BSaWdodEltZykge1xyXG4gICAgICAgICAgICB0b3BSaWdodEltZ1RhZyA9IHRoaXMudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCI6IHRvcFJpZ2h0SW1nLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInRvcC1yaWdodC1pbWFnZVwiXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvcFJpZ2h0SW1nVGFnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVCa2dJbWFnZVN0eWxlID0gKG5vZGUpID0+IHtcclxuICAgICAgICB2YXIgYmtnSW1nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcubm9kZS5ia2cnLCBub2RlKTtcclxuICAgICAgICB2YXIgYmtnSW1nU3R5bGUgPSBcIlwiO1xyXG4gICAgICAgIGlmIChia2dJbWcpIHtcclxuICAgICAgICAgICAgYmtnSW1nU3R5bGUgPSBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcIiArIGJrZ0ltZyArIFwiKTtcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJrZ0ltZ1N0eWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlcmVkQnV0dG9uQmFyID0gKGJ1dHRvbnM/OiBhbnksIGNsYXNzZXM/OiBhbnkpID0+IHtcclxuICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dCBcIiArIGNsYXNzZXNcclxuICAgICAgICB9LCBidXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b25CYXIgPSAoYnV0dG9ucywgY2xhc3NlcykgPT4ge1xyXG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxlZnQtanVzdGlmaWVkIGxheW91dCBcIiArIGNsYXNzZXNcclxuICAgICAgICB9LCBidXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlUm93QnV0dG9uQmFySHRtbCA9IChub2RlLCBjYW5Nb3ZlVXAsIGNhbk1vdmVEb3duLCBlZGl0aW5nQWxsb3dlZCkgPT4ge1xyXG5cclxuICAgICAgICB2YXIgY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgbm9kZSk7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIG5vZGUpO1xyXG4gICAgICAgIHZhciBwdWJsaWNBcHBlbmQgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBub2RlKTtcclxuXHJcbiAgICAgICAgdmFyIG9wZW5CdXR0b24gPSBcIlwiO1xyXG4gICAgICAgIHZhciBzZWxCdXR0b24gPSBcIlwiO1xyXG4gICAgICAgIHZhciBjcmVhdGVTdWJOb2RlQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgZWRpdE5vZGVCdXR0b24gPSBcIlwiO1xyXG4gICAgICAgIHZhciBtb3ZlTm9kZVVwQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgbW92ZU5vZGVEb3duQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgaW5zZXJ0Tm9kZUJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHJlcGx5QnV0dG9uID0gXCJcIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBTaG93IFJlcGx5IGJ1dHRvbiBpZiB0aGlzIGlzIGEgcHVibGljbHkgYXBwZW5kYWJsZSBub2RlIGFuZCBub3QgY3JlYXRlZCBieSBjdXJyZW50IHVzZXIsXHJcbiAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJlZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIG5vZGUudWlkICsgXCInKTtcIiAvL1xyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBidXR0b25Db3VudCA9IDA7XHJcblxyXG4gICAgICAgIC8qIENvbnN0cnVjdCBPcGVuIEJ1dHRvbiAqL1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgIG9wZW5CdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaGlnaGxpZ2h0LWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm5hdi5vcGVuTm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIvL1xyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgKiB0aGV5IGRvbid0IGhhdmUgcHJpdmlsZWdlcyB0aGUgc2VydmVyIHNpZGUgc2VjdXJpdHkgd2lsbCBsZXQgdGhlbSBrbm93LiBJbiB0aGUgZnV0dXJlIHdlIGNhbiBhZGQgbW9yZVxyXG4gICAgICAgICAqIGludGVsbGlnZW5jZSB0byB3aGVuIHRvIHNob3cgdGhlc2UgYnV0dG9ucyBvciBub3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gbWV0YTY0LnNlbGVjdGVkTm9kZXNbbm9kZS51aWRdID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgbm9kZUlkIFwiICsgbm9kZS51aWQgKyBcIiBzZWxlY3RlZD1cIiArIHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgIHZhciBjc3MgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibmF2LnRvZ2dsZU5vZGVTZWwoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjaGVja2VkXCI6IFwiY2hlY2tlZFwiXHJcbiAgICAgICAgICAgIH0gOiAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNlbEJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0Lk5FV19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJBZGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5pbnNlcnROb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJlZGl0LnJ1bkVkaXROb2RlKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jdXJyZW50Tm9kZS5jaGlsZHJlbk9yZGVyZWQgJiYgIWNvbW1lbnRCeSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYW5Nb3ZlVXApIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZVVwQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJlZGl0Lm1vdmVOb2RlVXAoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJVcFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZURvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTm9kZURvd25CdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQubW92ZU5vZGVEb3duKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaSB3aWxsIGJlIGZpbmRpbmcgYSByZXVzYWJsZS9EUlkgd2F5IG9mIGRvaW5nIHRvb2x0b3BzIHNvb24sIHRoaXMgaXMganVzdCBteSBmaXJzdCBleHBlcmltZW50LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSG93ZXZlciB0b29sdGlwcyBBTFdBWVMgY2F1c2UgcHJvYmxlbXMuIE15c3RlcnkgZm9yIG5vdy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgaW5zZXJ0Tm9kZVRvb2x0aXAgPSBcIlwiO1xyXG4gICAgICAgIC8vXHRcdFx0IHRoaXMudGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgLy9cdFx0XHQgXCJmb3JcIiA6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZFxyXG4gICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgdmFyIGFkZE5vZGVUb29sdGlwID0gXCJcIjtcclxuICAgICAgICAvL1x0XHRcdCB0aGlzLnRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAvL1x0XHRcdCB9LCBcIkFERFMgYSBuZXcgbm9kZSBpbnNpZGUgdGhlIGN1cnJlbnQgbm9kZSwgYXMgYSBjaGlsZCBvZiBpdC5cIik7XHJcblxyXG4gICAgICAgIHZhciBhbGxCdXR0b25zID0gc2VsQnV0dG9uICsgb3BlbkJ1dHRvbiArIGluc2VydE5vZGVCdXR0b24gKyBjcmVhdGVTdWJOb2RlQnV0dG9uICsgaW5zZXJ0Tm9kZVRvb2x0aXBcclxuICAgICAgICAgICAgKyBhZGROb2RlVG9vbHRpcCArIGVkaXROb2RlQnV0dG9uICsgbW92ZU5vZGVVcEJ1dHRvbiArIG1vdmVOb2RlRG93bkJ1dHRvbiArIHJlcGx5QnV0dG9uO1xyXG5cclxuICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMpIDogXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlSG9yaXpvbnRhbEZpZWxkU2V0ID0gKGNvbnRlbnQ/OiBzdHJpbmcsIGV4dHJhQ2xhc3Nlcz86IHN0cmluZykgPT4ge1xyXG5cclxuICAgICAgICAvKiBOb3cgYnVpbGQgZW50aXJlIGNvbnRyb2wgYmFyICovXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiZGl2XCIsIC8vXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiICsgKGV4dHJhQ2xhc3NlcyA/IChcIiBcIiArIGV4dHJhQ2xhc3NlcykgOiBcIlwiKVxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlSG9yekNvbnRyb2xHcm91cCA9IChjb250ZW50KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCJcclxuICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlUmFkaW9CdXR0b24gPSAobGFiZWwsIGlkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGlkXHJcbiAgICAgICAgfSwgbGFiZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5vZGVJZCAoc2VlIG1ha2VOb2RlSWQoKSkgTm9kZUluZm8gb2JqZWN0IGhhcyAnaGFzQ2hpbGRyZW4nIHRydWVcclxuICAgICAqL1xyXG4gICAgbm9kZUhhc0NoaWxkcmVuID0gKHVpZCkgPT4ge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIG5vZGVIYXNDaGlsZHJlbjogXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFBhdGggPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBwYXRoID0gbm9kZS5wYXRoO1xyXG5cclxuICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2VBbGwoXCIvXCIsIFwiIC8gXCIpO1xyXG4gICAgICAgIHZhciBzaG9ydFBhdGggPSBwYXRoLmxlbmd0aCA8IDUwID8gcGF0aCA6IHBhdGguc3Vic3RyaW5nKDAsIDQwKSArIFwiLi4uXCI7XHJcblxyXG4gICAgICAgIHZhciBub1Jvb3RQYXRoID0gc2hvcnRQYXRoO1xyXG4gICAgICAgIGlmIChub1Jvb3RQYXRoLnN0YXJ0c1dpdGgoXCIvcm9vdFwiKSkge1xyXG4gICAgICAgICAgICBub1Jvb3RQYXRoID0gbm9Sb290UGF0aC5zdWJzdHJpbmcoMCwgNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcmV0ID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gc2hvcnRQYXRoIDogbm9Sb290UGF0aDtcclxuICAgICAgICByZXQgKz0gXCIgW1wiICsgbm9kZS5wcmltYXJ5VHlwZU5hbWUgKyBcIl1cIjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHdyYXBIdG1sID0gKHRleHQpID0+IHtcclxuICAgICAgICByZXR1cm4gXCI8ZGl2PlwiICsgdGV4dCArIFwiPC9kaXY+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEVhY2ggcGFnZSBjYW4gc2hvdyBidXR0b25zIGF0IHRoZSB0b3Agb2YgaXQgKG5vdCBtYWluIGhlYWRlciBidXR0b25zIGJ1dCBhZGRpdGlvbmFsIGJ1dHRvbnMganVzdCBmb3IgdGhhdFxyXG4gICAgICogcGFnZSBvbmx5LCBhbmQgdGhpcyBnZW5lcmF0ZXMgdGhhdCBjb250ZW50IGZvciB0aGF0IGVudGlyZSBjb250cm9sIGJhci5cclxuICAgICAqL1xyXG4gICAgcmVuZGVyTWFpblBhZ2VDb250cm9scyA9ICgpID0+IHtcclxuICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG5cclxuICAgICAgICB2YXIgaGFzQ29udGVudCA9IGh0bWwubGVuZ3RoID4gMDtcclxuICAgICAgICBpZiAoaGFzQ29udGVudCkge1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZChcIm1haW5QYWdlQ29udHJvbHNcIiwgaHRtbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbWFpblBhZ2VDb250cm9sc1wiLCBoYXNDb250ZW50KVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZW5kZXJzIHBhZ2UgYW5kIGFsd2F5cyBhbHNvIHRha2VzIGNhcmUgb2Ygc2Nyb2xsaW5nIHRvIHNlbGVjdGVkIG5vZGUgaWYgdGhlcmUgaXMgb25lIHRvIHNjcm9sbCB0b1xyXG4gICAgICovXHJcbiAgICByZW5kZXJQYWdlRnJvbURhdGEgPSAoZGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSBmYWxzZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEoKVwiKTtcclxuXHJcbiAgICAgICAgdmFyIG5ld0RhdGEgPSBmYWxzZTtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgZGF0YSA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZSkge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKFwiTm8gY29udGVudCBpcyBhdmFpbGFibGUgaGVyZS5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjbGlzdFZpZXdcIiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlck1haW5QYWdlQ29udHJvbHMoKTtcclxuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgbWV0YTY0LmlkVG9Ob2RlTWFwID0ge307XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJJ20gY2hvb3NpbmcgdG8gcmVzZXQgc2VsZWN0ZWQgbm9kZXMgd2hlbiBhIG5ldyBwYWdlIGxvYWRzLCBidXQgdGhpcyBpcyBub3QgYSByZXF1aXJlbWVudC4gSSBqdXN0XHJcbiAgICAgICAgICAgICAqIGRvbid0IGhhdmUgYSBcImNsZWFyIHNlbGVjdGlvbnNcIiBmZWF0dXJlIHdoaWNoIHdvdWxkIGJlIG5lZWRlZCBzbyB1c2VyIGhhcyBhIHdheSB0byBjbGVhciBvdXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZXRDdXJyZW50Tm9kZURhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHJvcENvdW50ID0gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMgPyBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZGVidWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSRU5ERVIgTk9ERTogXCIgKyBkYXRhLm5vZGUuaWQgKyBcIiBwcm9wQ291bnQ9XCIgKyBwcm9wQ291bnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xyXG4gICAgICAgIHZhciBia2dTdHlsZSA9IHRoaXMuZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUoZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOT1RFOiBtYWluTm9kZUNvbnRlbnQgaXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYWdlIGNvbnRlbnQsIGFuZCBpcyBhbHdheXMgdGhlIG5vZGUgZGlzcGxheWVkIGF0IHRoZSB0b1xyXG4gICAgICAgICAqIG9mIHRoZSBwYWdlIGFib3ZlIGFsbCB0aGUgb3RoZXIgbm9kZXMgd2hpY2ggYXJlIGl0cyBjaGlsZCBub2Rlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgbWFpbk5vZGVDb250ZW50ID0gdGhpcy5yZW5kZXJOb2RlQ29udGVudChkYXRhLm5vZGUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgaWYgKG1haW5Ob2RlQ29udGVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciB1aWQgPSBkYXRhLm5vZGUudWlkO1xyXG4gICAgICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBlZGl0Tm9kZUJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVTdWJOb2RlQnV0dG9uID0gXCJcIjtcclxuICAgICAgICAgICAgdmFyIHJlcGx5QnV0dG9uID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGF0YS5ub2RlLnBhdGg9XCIrZGF0YS5ub2RlLnBhdGgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXNOb25Pd25lZE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZE5vZGUoZGF0YS5ub2RlKSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3JlYXRlZEJ5ID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ1JFQVRFRF9CWSwgZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgdmFyIGNvbW1lbnRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNPTU1FTlRfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgIHZhciBwdWJsaWNBcHBlbmQgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5QVUJMSUNfQVBQRU5ELCBkYXRhLm5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXBseUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQucmVwbHlUb0NvbW1lbnQoJ1wiICsgZGF0YS5ub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJSZXBseVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZSAmJiBjbnN0Lk5FV19PTl9UT09MQkFSICYmIGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGVCdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJpZFwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5jcmVhdGVTdWJOb2RlKCdcIiArIHVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmlzRWRpdEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgdmFyIGZvY3VzTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZDtcclxuICAgICAgICAgICAgLy8gdmFyIHJvd0hlYWRlciA9IHRoaXMuYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjcmVhdGVTdWJOb2RlQnV0dG9uIHx8IGVkaXROb2RlQnV0dG9uIHx8IHJlcGx5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgPSB0aGlzLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnXCIgKyB1aWQgKyBcIicpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgICAgICBidXR0b25CYXIgKyBtYWluTm9kZUNvbnRlbnQpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5odG1sKGNvbnRlbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgIHZpZXcudXBkYXRlU3RhdHVzQmFyKCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIHBhZ2UgY29udHJvbHMuXCIpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyTWFpblBhZ2VDb250cm9scygpO1xyXG5cclxuICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZENvdW50ID0gZGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hpbGRDb3VudDogXCIgKyBjaGlsZENvdW50KTtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvblxyXG4gICAgICAgICAgICAgKiB0aGUgY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciByb3dDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChyb3cubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3dDb3VudCA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5fZ2V0RW1wdHlQYWdlUHJvbXB0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKFwibGlzdFZpZXdcIiwgb3V0cHV0KTtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5jb2RlRm9ybWF0RGlydHkpIHtcclxuICAgICAgICAgICAgcHJldHR5UHJpbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVE9ETy0zOiBJbnN0ZWFkIG9mIGNhbGxpbmcgc2NyZWVuU2l6ZUNoYW5nZSBoZXJlIGltbWVkaWF0ZWx5LCBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gc2V0IHRoZSBpbWFnZSBzaXplc1xyXG4gICAgICAgICAqIGV4YWN0bHkgb24gdGhlIGF0dHJpYnV0ZXMgb2YgZWFjaCBpbWFnZSwgYXMgdGhlIEhUTUwgdGV4dCBpcyByZW5kZXJlZCBiZWZvcmUgd2UgZXZlbiBjYWxsXHJcbiAgICAgICAgICogc2V0SHRtbEVuaGFuY2VkQnlJZCwgc28gdGhhdCBpbWFnZXMgYWx3YXlzIGFyZSBHVUFSQU5URUVEIHRvIHJlbmRlciBjb3JyZWN0bHkgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWV0YTY0LnNjcmVlblNpemVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgaWYgKCFtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCkpIHtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1RvcCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVSb3cgPSAoaSwgbm9kZSwgbmV3RGF0YSwgY2hpbGRDb3VudCwgcm93Q291bnQpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc05vZGVCbGFja0xpc3RlZChub2RlKSlcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZWJ1Zykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgdmFyIHJvdyA9IHRoaXMucmVuZGVyTm9kZUFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgIHJldHVybiByb3c7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBwb3N0VGFyZ2V0VXJsICsgXCJiaW4vZmlsZS1uYW1lP25vZGVJZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChub2RlLnBhdGgpICsgXCImdmVyPVwiICsgbm9kZS5iaW5WZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICBhZGp1c3RJbWFnZVNpemUgPSAobm9kZSkgPT4ge1xyXG5cclxuICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gZWxtLmF0dHIoXCJ3aWR0aFwiKTtcclxuICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndpZHRoPVwiICsgd2lkdGggKyBcIiBoZWlnaHQ9XCIgKyBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogTmV3IExvZ2ljIGlzIHRyeSB0byBkaXNwbGF5IGltYWdlIGF0IDE1MCUgbWVhbmluZyBpdCBjYW4gZ28gb3V0c2lkZSB0aGUgY29udGVudCBkaXYgaXQncyBpbixcclxuICAgICAgICAgICAgICAgICAqIHdoaWNoIHdlIHdhbnQsIGJ1dCB0aGVuIHdlIGFsc28gbGltaXQgaXQgd2l0aCBtYXgtd2lkdGggc28gb24gc21hbGxlciBzY3JlZW4gZGV2aWNlcyBvciBzbWFsbFxyXG4gICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICogY2xpcHBlZC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTUwJVwiKTtcclxuICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBETyBOT1QgREVMRVRFIChmb3IgYSBsb25nIHRpbWUgYXQgbGVhc3QpIFRoaXMgaXMgdGhlIG9sZCBsb2dpYyBmb3IgcmVzaXppbmcgaW1hZ2VzIHJlc3BvbnNpdmVseSxcclxuICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgKiBrZWVwIHRoaXMgb2xkIGNvZGUgZm9yIG5vdy4uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBub2RlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICBtYWtlSW1hZ2VUYWcgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBzcmMgPSB0aGlzLmdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgIG5vZGUuaW1nSWQgPSBcImltZ1VpZF9cIiArIG5vZGUudWlkO1xyXG5cclxuICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaWYgaW1hZ2Ugd29uJ3QgZml0IG9uIHNjcmVlbiB3ZSB3YW50IHRvIHNpemUgaXQgZG93biB0byBmaXRcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICogdGhlIGhpZ2h0IHdvdWxkIG5vdCBiZSBzZXQgZXhwbGljaXRseSBhbmQgdGhhdCB3b3VsZCBtZWFuIHRoYXQgYXMgaW1hZ2VzIGFyZSBsb2FkaW5nIGludG8gdGhlIHBhZ2UsXHJcbiAgICAgICAgICAgICAqIHRoZSBlZmZlY3RpdmUgc2Nyb2xsIHBvc2l0aW9uIG9mIGVhY2ggcm93IHdpbGwgYmUgaW5jcmVhc2luZyBlYWNoIHRpbWUgdGhlIFVSTCByZXF1ZXN0IGZvciBhIG5ld1xyXG4gICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgKiBwYXJ0aWN1bGFyIHJvdyBpbnRvIHZpZXcsIGl0IHdpbGwgc3RheSB0aGUgY29ycmVjdCBzY3JvbGwgbG9jYXRpb24gRVZFTiBBUyB0aGUgaW1hZ2VzIGFyZSBzdHJlYW1pbmdcclxuICAgICAgICAgICAgICogaW4gYXN5bmNocm9ub3VzbHkuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogd2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IG5vZGUuaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkXHJcbiAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGNyZWF0ZXMgSFRNTCB0YWcgd2l0aCBhbGwgYXR0cmlidXRlcy92YWx1ZXMgc3BlY2lmaWVkIGluIGF0dHJpYnV0ZXMgb2JqZWN0LCBhbmQgY2xvc2VzIHRoZSB0YWcgYWxzbyBpZlxyXG4gICAgICogY29udGVudCBpcyBub24tbnVsbFxyXG4gICAgICovXHJcbiAgICB0YWcgPSAodGFnPzogYW55LCBhdHRyaWJ1dGVzPzogYW55LCBjb250ZW50PzogYW55LCBjbG9zZVRhZz86IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAvKiBkZWZhdWx0IHBhcmFtZXRlciB2YWx1ZXMgKi9cclxuICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICBjbG9zZVRhZyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qIEhUTUwgdGFnIGl0c2VsZiAqL1xyXG4gICAgICAgIHZhciByZXQgPSBcIjxcIiArIHRhZztcclxuXHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgcmV0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24oaywgdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHdlIGludGVsbGlnZW50bHkgd3JhcCBzdHJpbmdzIHRoYXQgY29udGFpbiBzaW5nbGUgcXVvdGVzIGluIGRvdWJsZSBxdW90ZXMgYW5kIHZpY2UgdmVyc2FcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAodi5jb250YWlucyhcIidcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGsgKyBcIj1cXFwiXCIgKyB2ICsgXCJcXFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9J1wiICsgdiArIFwiJyBcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNsb3NlVGFnKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBcIj5cIiArIGNvbnRlbnQgKyBcIjwvXCIgKyB0YWcgKyBcIj5cIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXQgKz0gXCIvPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlVGV4dEFyZWEgPSAoZmllbGROYW1lLCBmaWVsZElkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VFZGl0RmllbGQgPSAoZmllbGROYW1lLCBmaWVsZElkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXHJcbiAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIG1ha2VQYXNzd29yZEZpZWxkID0gKGZpZWxkTmFtZSwgZmllbGRJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQnV0dG9uID0gKHRleHQsIGlkLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIHZhciBhdHRyaWJzID0ge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcImlkXCI6IGlkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IGNhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBkb21JZCBpcyBpZCBvZiBkaWFsb2cgYmVpbmcgY2xvc2VkLlxyXG4gICAgICovXHJcbiAgICBtYWtlQmFja0J1dHRvbiA9ICh0ZXh0LCBpZCwgZG9tSWQsIGNhbGxiYWNrKSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5jYW5jZWxEaWFsb2coJ1wiICsgZG9tSWQgKyBcIicpO1wiICsgY2FsbGJhY2tcclxuICAgICAgICB9LCB0ZXh0LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhbGxvd1Byb3BlcnR5VG9EaXNwbGF5ID0gKHByb3BOYW1lKSA9PiB7XHJcbiAgICAgICAgaWYgKCFtZXRhNjQuaW5TaW1wbGVNb2RlKCkpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuc2ltcGxlTW9kZVByb3BlcnR5QmxhY2tMaXN0W3Byb3BOYW1lXSA9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlzUmVhZE9ubHlQcm9wZXJ0eSA9IChwcm9wTmFtZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQucmVhZE9ubHlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQmluYXJ5UHJvcGVydHkgPSAocHJvcE5hbWUpID0+IHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmJpbmFyeVByb3BlcnR5TGlzdFtwcm9wTmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgc2FuaXRpemVQcm9wZXJ0eU5hbWUgPSAocHJvcE5hbWU6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IFwic2ltcGxlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BOYW1lID09PSBqY3JDbnN0LkNPTlRFTlQgPyBcIkNvbnRlbnRcIiA6IHByb3BOYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wicmVuZGVyXCJdKSB7XHJcbiAgICB2YXIgcmVuZGVyOiBSZW5kZXIgPSBuZXcgUmVuZGVyKCk7XHJcbn1cclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNlYXJjaC5qc1wiKTtcclxuXHJcbi8qXHJcbiAqIHRvZG8tMzogdHJ5IHRvIHJlbmFtZSB0byAnc2VhcmNoJywgYnV0IHJlbWVtYmVyIHlvdSBoYWQgaW5leHBsaWFibGUgcHJvYmxlbXMgdGhlIGZpcnN0IHRpbWUgeW91IHRyaWVkIHRvIHVzZSAnc2VhcmNoJ1xyXG4gKiBhcyB0aGUgdmFyIG5hbWUuXHJcbiAqL1xyXG5jbGFzcyBTcmNoIHtcclxuICAgIF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9zcmNoX3Jvd1wiO1xyXG5cclxuICAgIHNlYXJjaE5vZGVzOiBhbnkgPSBudWxsO1xyXG4gICAgc2VhcmNoUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlNlYXJjaCBSZXN1bHRzXCI7XHJcbiAgICB0aW1lbGluZVBhZ2VUaXRsZTogc3RyaW5nID0gXCJUaW1lbGluZVwiO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyBzZWFyY2ggaGFzIGJlZW4gZG9uZS5cclxuICAgICAqL1xyXG4gICAgc2VhcmNoUmVzdWx0czogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gdGltZWxpbmUgaGFzIGJlZW4gZG9uZS5cclxuICAgICAqL1xyXG4gICAgdGltZWxpbmVSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBXaWxsIGJlIHRoZSBsYXN0IHJvdyBjbGlja2VkIG9uIChOb2RlSW5mby5qYXZhIG9iamVjdCkgYW5kIGhhdmluZyB0aGUgcmVkIGhpZ2hsaWdodCBiYXJcclxuICAgICAqL1xyXG4gICAgaGlnaGxpZ2h0Um93Tm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlICdpZGVudGlmaWVyJyAoYXNzaWduZWQgYXQgc2VydmVyKSB0byB1aWQgdmFsdWUgd2hpY2ggaXMgYSB2YWx1ZSBiYXNlZCBvZmYgbG9jYWwgc2VxdWVuY2UsIGFuZCB1c2VzXHJcbiAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICovXHJcbiAgICBpZGVudFRvVWlkTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICpcclxuICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICB1aWRUb05vZGVNYXA6IGFueSA9e307XHJcblxyXG4gICAgbnVtU2VhcmNoUmVzdWx0cz0oKSAgPT4ge1xyXG4gICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCAhPSBudWxsID8gLy9cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hUYWJBY3RpdmF0ZWQ9KCkgPT4gIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICogYW5kIG9wZW4gdXAgdGhlIHNlYXJjaCBkaWFsb2cuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMubnVtU2VhcmNoUmVzdWx0cygpID09IDAgJiYgIW1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIChuZXcgU2VhcmNoRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoTm9kZXNSZXNwb25zZT0ocmVzKSA9PiAge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IHJlcztcclxuICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKFwic2VhcmNoUmVzdWx0c1BhbmVsXCIsIGNvbnRlbnQpO1xyXG4gICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2Uoc2VhcmNoUmVzdWx0c1BhbmVsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lbGluZVJlc3BvbnNlPShyZXMpID0+ICB7XHJcbiAgICAgICAgdGhpcy50aW1lbGluZVJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgdGltZWxpbmVSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHRpbWVsaW5lUmVzdWx0c1BhbmVsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lbGluZT0oKSA9PiAge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHV0aWwuanNvbihcIm5vZGVTZWFyY2hcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgXCJtb2RTb3J0RGVzY1wiOiB0cnVlLFxyXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogXCJqY3I6Y29udGVudFwiIC8vIHNob3VsZCBoYXZlIG5vIGVmZmVjdCwgZm9yXHJcbiAgICAgICAgICAgIC8vIHRpbWVsaW5lP1xyXG4gICAgICAgIH0sIHRoaXMudGltZWxpbmVSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNlYXJjaE5vZGU9KG5vZGUpID0+ICB7XHJcbiAgICAgICAgbm9kZS51aWQgPSB1dGlsLmdldFVpZEZvcklkKHRoaXMuaWRlbnRUb1VpZE1hcCwgbm9kZS5pZCk7XHJcbiAgICAgICAgdGhpcy51aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlPShkYXRhLCB2aWV3TmFtZSkgID0+IHtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XHJcbiAgICAgICAgdmFyIGNoaWxkQ291bnQgPSBkYXRhLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb24gdGhlXHJcbiAgICAgICAgICogY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpei5pbml0U2VhcmNoTm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSB0aGl6LnJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZCh2aWV3TmFtZSwgb3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVuZGVycyBhIHNpbmdsZSBsaW5lIG9mIHNlYXJjaCByZXN1bHRzIG9uIHRoZSBzZWFyY2ggcmVzdWx0cyBwYWdlLlxyXG4gICAgICpcclxuICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAqL1xyXG4gICAgcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbT0obm9kZSwgaW5kZXgsIGNvdW50LCByb3dDb3VudCkgPT4gIHtcclxuXHJcbiAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZGVyU2VhcmNoUmVzdWx0OiBcIiArIHVpZCk7XHJcblxyXG4gICAgICAgIHZhciBjc3NJZCA9IHVpZCArIHRoaXMuX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZW5kZXJpbmcgTm9kZSBSb3dbXCIgKyBpbmRleCArIFwiXSB3aXRoIGlkOiBcIiArY3NzSWQpXHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXJIdG1sID0gdGhpcy5tYWtlQnV0dG9uQmFySHRtbChcIlwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidXR0b25CYXJIdG1sPVwiICsgYnV0dG9uQmFySHRtbCk7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSByZW5kZXIucmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5vZGUtdGFibGUtcm93IGluYWN0aXZlLXJvd1wiLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJzcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIiwgLy9cclxuICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgIH0sLy9cclxuICAgICAgICAgICAgYnV0dG9uQmFySHRtbC8vXHJcbiAgICAgICAgICAgICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX3NyY2hfY29udGVudFwiXHJcbiAgICAgICAgICAgIH0sIGNvbnRlbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQnV0dG9uQmFySHRtbD0odWlkKSA9PiAge1xyXG4gICAgICAgIHZhciBnb3RvQnV0dG9uID0gcmVuZGVyLm1ha2VCdXR0b24oXCJHbyB0byBOb2RlXCIsIHVpZCwgXCJzcmNoLmNsaWNrU2VhcmNoTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiKTtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQoZ290b0J1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2tPblNlYXJjaFJlc3VsdFJvdz0ocm93RWxtLCB1aWQpICA9PiB7XHJcbiAgICAgICAgdGhpcy51bmhpZ2hsaWdodFJvdygpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0Um93Tm9kZSA9IHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja1NlYXJjaE5vZGU9KHVpZCkgID0+IHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVwZGF0ZSBoaWdobGlnaHQgbm9kZSB0byBwb2ludCB0byB0aGUgbm9kZSBjbGlja2VkIG9uLCBqdXN0IHRvIHBlcnNpc3QgaXQgZm9yIGxhdGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3JjaC5oaWdobGlnaHRSb3dOb2RlID0gc3JjaC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHNyY2guaGlnaGxpZ2h0Um93Tm9kZS5pZCwgdHJ1ZSk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gc3R5bGluZyBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVuaGlnaGxpZ2h0Um93PSgpID0+ICB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5oaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICB2YXIgbm9kZUlkID0gdGhpcy5oaWdobGlnaHRSb3dOb2RlLnVpZCArIHRoaXMuX1VJRF9ST1dJRF9TVUZGSVg7XHJcblxyXG4gICAgICAgIHZhciBlbG0gPSB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgIGlmIChlbG0pIHtcclxuICAgICAgICAgICAgLyogY2hhbmdlIGNsYXNzIG9uIGVsZW1lbnQgKi9cclxuICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJzcmNoXCJdKSB7XHJcbiAgICB2YXIgc3JjaDogU3JjaCA9IG5ldyBTcmNoKCk7XHJcbn1cclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNoYXJlLmpzXCIpO1xyXG5cclxuY2xhc3MgU2hhcmUge1xyXG5cclxuICAgIF9maW5kU2hhcmVkTm9kZXNSZXNwb25zZT0ocmVzKSAgPT4ge1xyXG4gICAgICAgIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZShyZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNoYXJpbmdOb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIYW5kbGVzICdTaGFyaW5nJyBidXR0b24gb24gYSBzcGVjaWZpYyBub2RlLCBmcm9tIGJ1dHRvbiBiYXIgYWJvdmUgbm9kZSBkaXNwbGF5IGluIGVkaXQgbW9kZVxyXG4gICAgICovXHJcbiAgICBlZGl0Tm9kZVNoYXJpbmc9KCkgID0+IHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaGFyaW5nTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU2hhcmVkTm9kZXM9KCkgID0+IHtcclxuICAgICAgICB2YXIgZm9jdXNOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIGlmIChmb2N1c05vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzcmNoLnNlYXJjaFBhZ2VUaXRsZSA9IFwiU2hhcmVkIE5vZGVzXCI7XHJcblxyXG4gICAgICAgIHV0aWwuanNvbihcImdldFNoYXJlZE5vZGVzXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogZm9jdXNOb2RlLmlkXHJcbiAgICAgICAgfSwgdGhpcy5fZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInNoYXJlXCJdKSB7XHJcbiAgICB2YXIgc2hhcmU6IFNoYXJlID0gbmV3IFNoYXJlKCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXNlci5qc1wiKTtcclxuLy9pbXBvcnQgeyBjbnN0IH0gZnJvbSBcIi4vY25zdFwiO1xyXG5cclxuY2xhc3MgVXNlciB7XHJcblxyXG4gICAgLy8gcmVzIGlzIEpTT04gcmVzcG9uc2Ugb2JqZWN0IGZyb20gc2VydmVyLlxyXG4gICAgX3JlZnJlc2hMb2dpblJlc3BvbnNlPShyZXMpID0+ICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW5SZXNwb25zZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHVzZXIuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgIHVzZXIuc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBfbG9nb3V0UmVzcG9uc2U9KHJlcykgPT4gIHtcclxuICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICB9XHJcblxyXG4gICAgX3R3aXR0ZXJMb2dpblJlc3BvbnNlPShyZXMpID0+ICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0d2l0dGVyIExvZ2luIHJlc3BvbnNlIHJlY2lldmVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZm9yIHRlc3RpbmcgcHVycG9zZXMsIEkgd2FudCB0byBhbGxvdyBjZXJ0YWluIHVzZXJzIGFkZGl0aW9uYWwgcHJpdmlsZWdlcy4gQSBiaXQgb2YgYSBoYWNrIGJlY2F1c2UgaXQgd2lsbCBnb1xyXG4gICAgICogaW50byBwcm9kdWN0aW9uLCBidXQgb24gbXkgb3duIHByb2R1Y3Rpb24gdGhlc2UgYXJlIG15IFwidGVzdFVzZXJBY2NvdW50c1wiLCBzbyBubyByZWFsIHVzZXIgd2lsbCBiZSBhYmxlIHRvXHJcbiAgICAgKiB1c2UgdGhlc2UgbmFtZXNcclxuICAgICAqL1xyXG4gICAgaXNUZXN0VXNlckFjY291bnQ9KCkgID0+IHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYWRhbVwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImJvYlwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNvcnlcIiB8fCAvL1xyXG4gICAgICAgICAgICBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkYW5cIjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZT0ocmVzKSA9PiAge1xyXG4gICAgICAgIHZhciB0aXRsZSA9IEJSQU5ESU5HX1RJVExFO1xyXG4gICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgdGl0bGUgKz0gXCIgLSBcIiArIHJlcy51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBUT0RPLTM6IG1vdmUgdGhpcyBpbnRvIG1ldGE2NCBtb2R1bGUgKi9cclxuICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZT0ocmVzKSAgPT4ge1xyXG4gICAgICAgIGlmIChyZXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlSWQgPSByZXMucm9vdE5vZGUuaWQ7XHJcbiAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZVBhdGggPSByZXMucm9vdE5vZGUucGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWV0YTY0LnVzZXJOYW1lID0gcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgIG1ldGE2NC5pc0FkbWluVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhZG1pblwiO1xyXG5cclxuICAgICAgICBtZXRhNjQuaXNBbm9uVXNlciA9IHJlcy51c2VyTmFtZSA9PT0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGUgPSByZXMuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcblxyXG4gICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHJlcy51c2VyUHJlZmVyZW5jZXMuYWR2YW5jZWRNb2RlID8gbWV0YTY0Lk1PREVfQURWQU5DRUQgOiBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZnJvbSBzZXJ2ZXI6IG1ldGE2NC5lZGl0TW9kZU9wdGlvbj1cIiArIG1ldGE2NC5lZGl0TW9kZU9wdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgdHdpdHRlckxvZ2luPSgpID0+ICB7XHJcbiAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwibm90IHlldCBpbXBsZW1lbnRlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogcG9seW1lciBSZW1vdmUgd2FybmluZyBkaWFsb2cgdG8gYXNrIHVzZXIgYWJvdXQgbGVhdmluZyB0aGUgcGFnZSAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG4gICAgICAgICAqIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL3R3aXR0ZXJMb2dpblwiO1xyXG4gICAgICAgICAqL1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5TaWdudXBQZz0oKSA9PiAge1xyXG4gICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBXcml0ZSBhIGNvb2tpZSB0aGF0IGV4cGlyZXMgaW4gYSB5ZWFyIGZvciBhbGwgcGF0aHMgKi9cclxuICAgIHdyaXRlQ29va2llPShuYW1lLCB2YWwpICA9PiB7XHJcbiAgICAgICAgJC5jb29raWUobmFtZSwgdmFsLCB7XHJcbiAgICAgICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICAgICAgcGF0aDogJy8nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgbWV0aG9kIGlzIHVnbHkuIEl0IGlzIHRoZSBidXR0b24gdGhhdCBjYW4gYmUgbG9naW4gKm9yKiBsb2dvdXQuXHJcbiAgICAgKi9cclxuICAgIG9wZW5Mb2dpblBnPSgpID0+ICB7XHJcbiAgICAgICAgdmFyIGxvZ2luRGxnID0gbmV3IExvZ2luRGxnKCk7XHJcbiAgICAgICAgbG9naW5EbGcucG9wdWxhdGVGcm9tQ29va2llcygpO1xyXG4gICAgICAgIGxvZ2luRGxnLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoTG9naW49KCkgPT4gIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSB0cnVlXCIpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgdXNpbmdDb29raWVzID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxvZ2luU3RhdGUgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIGtub3duIHN0YXRlIGFzIGxvZ2dlZCBvdXQsIHRoZW4gZG8gbm90aGluZyBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNyID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgdmFyIHB3ZCA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29va2llVXNlcj1cIiArIHVzciArIFwiIHVzaW5nQ29va2llcyA9IFwiICsgdXNpbmdDb29raWVzKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IGNhbGxVc3IsXHJcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IGNhbGxQd2QsXHJcbiAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlyb25SZXMuY29tcGxldGVzLnRoZW4oZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXoubG9naW5SZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBjYWxsVXNyLCBjYWxsUHdkLCB1c2luZ0Nvb2tpZXMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGl6Ll9yZWZyZXNoTG9naW5SZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dD0odXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkgID0+IHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICBpZiAodXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICB0aGlzLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb24oXCJsb2dvdXRcIiwge30sIHRoaXMuX2xvZ291dFJlc3BvbnNlLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbj0obG9naW5EbGcsIHVzciwgcHdkKSA9PiAge1xyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgXCJ1c2VyTmFtZVwiOiB1c3IsXHJcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcHdkLFxyXG4gICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgXCJkc3RcIjogdXRpbC5kYXlsaWdodFNhdmluZ3NUaW1lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlyb25SZXMuY29tcGxldGVzLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXoubG9naW5SZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCB1c3IsIHB3ZCwgbnVsbCwgbG9naW5EbGcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUFsbFVzZXJDb29raWVzPSgpID0+ICB7XHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpblJlc3BvbnNlPShyZXM/OiBhbnksIHVzcj86IGFueSwgcHdkPzogYW55LCB1c2luZ0Nvb2tpZXM/OiBhbnksIGxvZ2luRGxnPzogYW55KSAgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkxvZ2luXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpblJlc3BvbnNlOiB1c3I9XCIgKyB1c3IgKyBcIiBob21lTm9kZU92ZXJyaWRlOiBcIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1c3IgIT0gXCJhbm9ueW1vdXNcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IsIHVzcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCwgcHdkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxvZ2luRGxnKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbkRsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3ROb2RlOiBcIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZSBpcyBudWxsLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogc2V0IElEIHRvIGJlIHRoZSBwYWdlIHdlIHdhbnQgdG8gc2hvdyB1c2VyIHJpZ2h0IGFmdGVyIGxvZ2luICovXHJcbiAgICAgICAgICAgIHZhciBpZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXV0aWwuZW1wdHlTdHJpbmcocmVzLmhvbWVOb2RlT3ZlcnJpZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVPdmVycmlkZT1cIiArIHJlcy5ob21lTm9kZU92ZXJyaWRlKTtcclxuICAgICAgICAgICAgICAgIGlkID0gcmVzLmhvbWVOb2RlT3ZlcnJpZGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBsYXN0Tm9kZT1cIiArIHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlSWQ9XCIgKyBtZXRhNjQuaG9tZU5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShpZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiQ29va2llIGxvZ2luIGZhaWxlZC5cIikpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogYmxvdyBhd2F5IGZhaWxlZCBjb29raWUgY3JlZGVudGlhbHMgYW5kIHJlbG9hZCBwYWdlLCBzaG91bGQgcmVzdWx0IGluIGJyYW5kIG5ldyBwYWdlIGxvYWQgYXMgYW5vblxyXG4gICAgICAgICAgICAgICAgICogdXNlci5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjBcIik7XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJ1c2VyXCJdKSB7XHJcbiAgICB2YXIgdXNlcjogVXNlciA9IG5ldyBVc2VyKCk7XHJcbn1cclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHZpZXcuanNcIik7XHJcblxyXG5jbGFzcyBWaWV3IHtcclxuXHJcbiAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgdXBkYXRlU3RhdHVzQmFyID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghbWV0YTY0LmN1cnJlbnROb2RlRGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzdGF0dXNMaW5lID0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PT0gbWV0YTY0Lk1PREVfQURWQU5DRUQpIHtcclxuICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcImNvdW50OiBcIiArIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICBzdGF0dXNMaW5lICs9IFwiIFNlbGVjdGlvbnM6IFwiICsgdXRpbC5nZXRQcm9wZXJ0eUNvdW50KG1ldGE2NC5zZWxlY3RlZE5vZGVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIHBhcmFtZXRlciB3aGljaCwgaWYgc3VwcGxpZWQsIHNob3VsZCBiZSB0aGUgaWQgd2Ugc2Nyb2xsIHRvIHdoZW4gZmluYWxseSBkb25lIHdpdGggdGhlXHJcbiAgICAgKiByZW5kZXIuXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2hUcmVlUmVzcG9uc2UgPSAocmVzPzogYW55LCB0YXJnZXRJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBuZXdJZD86IGFueSkgPT4ge1xyXG5cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcblxyXG4gICAgICAgIGlmIChuZXdJZCkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZChuZXdJZCwgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVE9ETy0zOiBXaHkgd2Fzbid0IHRoaXMganVzdCBiYXNlZCBvbiB0YXJnZXRJZCA/IFRoaXMgaWYgY29uZGl0aW9uIGlzIHRvbyBjb25mdXNpbmcuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0SWQgJiYgcmVuZGVyUGFyZW50SWZMZWFmICYmIHJlcy5kaXNwbGF5ZWRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogbmV3SWQgaXMgb3B0aW9uYWwgYW5kIGlmIHNwZWNpZmllZCBtYWtlcyB0aGUgcGFnZSBzY3JvbGwgdG8gYW5kIGhpZ2hsaWdodCB0aGF0IG5vZGUgdXBvbiByZS1yZW5kZXJpbmcuXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2hUcmVlID0gKG5vZGVJZD86IGFueSwgcmVuZGVyUGFyZW50SWZMZWFmPzogYW55LCBuZXdJZD86IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgIG5vZGVJZCA9IG1ldGE2NC5jdXJyZW50Tm9kZUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uKFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcclxuICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogcmVuZGVyUGFyZW50SWZMZWFmID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICBpcm9uUmVzLmNvbXBsZXRlcy50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGl6LnJlZnJlc2hUcmVlUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgbm9kZUlkLCByZW5kZXJQYXJlbnRJZkxlYWYsIG5ld0lkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAqIHNjcm9sbFRvVG9wLCBhbmQgdGhlbiBzb21lIG90aGVyIGNvZGUgc2Nyb2xscyB0byBhIHNwZWNpZmljIGxvY2F0aW9uIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIuIHRoZVxyXG4gICAgICogJ3BlbmRpbmcnIGJvb2xlYW4gaGVyZSBpcyBhIGNydXRjaCBmb3Igbm93IHRvIGhlbHAgdmlzdWFsIGFwcGVhbCAoaS5lLiBzdG9wIGlmIGZyb20gc2Nyb2xsaW5nIHRvIG9uZSBwbGFjZVxyXG4gICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgKi9cclxuICAgIHNjcm9sbFRvU2VsZWN0ZWROb2RlID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXouc2Nyb2xsVG9TZWxOb2RlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IG5hdi5nZXRTZWxlY3RlZFBvbHlFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgLy8gdG9wIGluc3RlYWQuXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxtID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHRvZG8tMzogVGhlIGZvbGxvd2luZyB3YXMgaW4gYSBwb2x5bWVyIGV4YW1wbGUgKGNhbiBJIHVzZSB0aGlzPyk6IGFwcC4kLmhlYWRlclBhbmVsTWFpbi5zY3JvbGxUb1RvcCh0cnVlKTtcclxuICAgICAqL1xyXG4gICAgc2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpei5zY3JvbGxUb1NlbE5vZGVQZW5kaW5nKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0RWRpdFBhdGhEaXNwbGF5QnlJZCA9IChkb21JZCkgPT4ge1xyXG4gICAgICAgIHZhciBub2RlID0gZWRpdC5lZGl0Tm9kZTtcclxuICAgICAgICB2YXIgZSA9ICQoXCIjXCIgKyBkb21JZCk7XHJcbiAgICAgICAgaWYgKCFlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xyXG4gICAgICAgICAgICBlLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgIGUuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoRGlzcGxheSA9IFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRvZG8tMjogRG8gd2UgcmVhbGx5IG5lZWQgSUQgaW4gYWRkaXRpb24gdG8gUGF0aCBoZXJlP1xyXG4gICAgICAgICAgICAvLyBwYXRoRGlzcGxheSArPSBcIjxicj5JRDogXCIgKyBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoRGlzcGxheSArPSBcIjxicj5Nb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5odG1sKHBhdGhEaXNwbGF5KTtcclxuICAgICAgICAgICAgZS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dTZXJ2ZXJJbmZvID0gKCkgPT4ge1xyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uKFwiZ2V0U2VydmVySW5mb1wiLCB7fSk7XHJcblxyXG4gICAgICAgIGlyb25SZXMuY29tcGxldGVzLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhpcm9uUmVzLnJlc3BvbnNlLnNlcnZlckluZm8pKS5vcGVuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1widmlld1wiXSkge1xyXG4gICAgdmFyIHZpZXc6IFZpZXcgPSBuZXcgVmlldygpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZW51UGFuZWwuanNcIik7XHJcblxyXG5jbGFzcyBNZW51UGFuZWwge1xyXG5cclxuICAgIF9tYWtlVG9wTGV2ZWxNZW51ID0gKHRpdGxlOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1zdWJtZW51XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1tZW51LWhlYWRpbmdcIlxyXG4gICAgICAgIH0sIFwiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWFrZVNlY29uZExldmVsTGlzdChjb250ZW50KSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX21ha2VTZWNvbmRMZXZlbExpc3QgPSAoY29udGVudDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibWVudS1jb250ZW50IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICBcIm11bHRpXCI6IFwibXVsdGlcIlxyXG4gICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9tZW51SXRlbSA9IChuYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9uQ2xpY2s6IGFueSk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHtcclxuICAgICAgICAgICAgXCJpZFwiOiBpZCxcclxuICAgICAgICAgICAgXCJvbmNsaWNrXCI6IG9uQ2xpY2tcclxuICAgICAgICB9LCBuYW1lLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBfbWVudVRvZ2dsZUl0ZW0gPSAobmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrXHJcbiAgICAgICAgfSwgbmFtZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9tSWQ6IHN0cmluZyA9IFwibWFpbk5hdkJhclwiO1xyXG5cclxuICAgIGJ1aWxkID0gKCk6IHZvaWQgPT4ge1xyXG5cclxuICAgICAgICB2YXIgZWRpdE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiTW92ZVwiLCBcIm1vdmVTZWxOb2Rlc0J1dHRvblwiLCBcImVkaXQubW92ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJGaW5pc2ggTW92aW5nXCIsIFwiZmluaXNoTW92aW5nU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LmZpbmlzaE1vdmluZ1NlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlUGdCdXR0b25cIiwgXCIobmV3IFJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiRGVsZXRlXCIsIFwiZGVsZXRlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0LmRlbGV0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJDbGVhciBTZWxlY3Rpb25zXCIsIFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsIFwiZWRpdC5jbGVhclNlbGVjdGlvbnMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IEltcG9ydERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJFeHBvcnRcIiwgXCJvcGVuRXhwb3J0RGxnXCIsIFwiKG5ldyBFeHBvcnREbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICB2YXIgZWRpdE1lbnUgPSB0aGlzLl9tYWtlVG9wTGV2ZWxNZW51KFwiRWRpdFwiLCBlZGl0TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIlVwbG9hZCBmcm9tIEZpbGVcIiwgXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCBcImF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21GaWxlRGxnKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsIFwiYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbVVybERsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiRGVsZXRlIEF0dGFjaG1lbnRcIiwgXCJkZWxldGVBdHRhY2htZW50c0J1dHRvblwiLCBcImF0dGFjaG1lbnQuZGVsZXRlQXR0YWNobWVudCgpO1wiKTtcclxuICAgICAgICB2YXIgYXR0YWNobWVudE1lbnUgPSB0aGlzLl9tYWtlVG9wTGV2ZWxNZW51KFwiQXR0YWNoXCIsIGF0dGFjaG1lbnRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgc2hhcmluZ01lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiRWRpdCBOb2RlIFNoYXJpbmdcIiwgXCJlZGl0Tm9kZVNoYXJpbmdCdXR0b25cIiwgXCJzaGFyZS5lZGl0Tm9kZVNoYXJpbmcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkZpbmQgU2hhcmVkIFN1Ym5vZGVzXCIsIFwiZmluZFNoYXJlZE5vZGVzQnV0dG9uXCIsIFwic2hhcmUuZmluZFNoYXJlZE5vZGVzKCk7XCIpO1xyXG4gICAgICAgIHZhciBzaGFyaW5nTWVudSA9IHRoaXMuX21ha2VUb3BMZXZlbE1lbnUoXCJTaGFyZVwiLCBzaGFyaW5nTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHNlYXJjaE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiVGV4dCBTZWFyY2hcIiwgXCJzZWFyY2hEbGdCdXR0b25cIiwgXCIobmV3IFNlYXJjaERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJUaW1lbGluZVwiLCBcInRpbWVsaW5lQnV0dG9uXCIsIFwic3JjaC50aW1lbGluZSgpO1wiKTsvL1xyXG4gICAgICAgIHZhciBzZWFyY2hNZW51ID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIlNlYXJjaFwiLCBzZWFyY2hNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIlRvZ2dsZSBQcm9wZXJ0aWVzXCIsIFwicHJvcHNUb2dnbGVCdXR0b25cIiwgXCJwcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiUmVmcmVzaFwiLCBcInJlZnJlc2hQYWdlQnV0dG9uXCIsIFwibWV0YTY0LnJlZnJlc2goKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwicmVuZGVyLnNob3dOb2RlVXJsKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy90b2RvLTA6IGJ1Zzogc2VydmVyIGluZm8gbWVudSBpdGVtIGlzIHNob3dpbmcgdXAgKGFsdGhvdWdoIGNvcnJlY3RseSBkaXNhYmxlZCkgZm9yIG5vbi1hZG1pbiB1c2Vycy5cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJTZXJ2ZXIgSW5mb1wiLCBcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIFwidmlldy5zaG93U2VydmVySW5mbygpO1wiKTsgLy9cclxuICAgICAgICB2YXIgdmlld09wdGlvbnNNZW51ID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIlZpZXdcIiwgdmlld09wdGlvbnNNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHdoYXRldmVyIGlzIGNvbW1lbnRlZCBpcyBvbmx5IGNvbW1lbnRlZCBmb3IgcG9seW1lciBjb252ZXJzaW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIG15QWNjb3VudEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJDaGFuZ2UgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZFBnQnV0dG9uXCIsIFwiKG5ldyBDaGFuZ2VQYXNzd29yZERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJQcmVmZXJlbmNlc1wiLCBcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCBcIihuZXcgUHJlZnNEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiTWFuYWdlIEFjY291bnRcIiwgXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsIFwiKG5ldyBNYW5hZ2VBY2NvdW50RGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkluc2VydCBCb29rOiBXYXIgYW5kIFBlYWNlXCIsIFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIFwiIGVkaXQuaW5zZXJ0Qm9va1dhckFuZFBlYWNlKCk7XCIpOyAvL1xyXG4gICAgICAgIC8vIF9tZW51SXRlbShcIkZ1bGwgUmVwb3NpdG9yeSBFeHBvcnRcIiwgXCJmdWxsUmVwb3NpdG9yeUV4cG9ydFwiLCBcIlxyXG4gICAgICAgIC8vIGVkaXQuZnVsbFJlcG9zaXRvcnlFeHBvcnQoKTtcIikgKyAvL1xyXG4gICAgICAgIHZhciBteUFjY291bnRNZW51ID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgaGVscEl0ZW1zID0gLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJNYWluIE1lbnUgSGVscFwiLCBcIm1haW5NZW51SGVscFwiLCBcIm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgIHZhciBtYWluTWVudUhlbHAgPSB0aGlzLl9tYWtlVG9wTGV2ZWxNZW51KFwiSGVscC9Eb2NzXCIsIGhlbHBJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBjb250ZW50ID0gZWRpdE1lbnUgKyBhdHRhY2htZW50TWVudSArIHNoYXJpbmdNZW51ICsgdmlld09wdGlvbnNNZW51ICsgc2VhcmNoTWVudSArIG15QWNjb3VudE1lbnVcclxuICAgICAgICAgICAgKyBtYWluTWVudUhlbHA7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKHRoaXMuZG9tSWQsIGNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wibWVudVBhbmVsXCJdKSB7XHJcbiAgICB2YXIgbWVudVBhbmVsOiBNZW51UGFuZWwgPSBuZXcgTWVudVBhbmVsKCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRGlhbG9nQmFzZS5qc1wiKTtcblxuLypcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBkaWFsb2cgYm94ZXMuXG4gKlxuICogdG9kbzogd2hlbiByZWZhY3RvcmluZyBhbGwgZGlhbG9ncyB0byB0aGlzIG5ldyBiYXNlLWNsYXNzIGRlc2lnbiBJJ20gYWx3YXlzXG4gKiBjcmVhdGluZyBhIG5ldyBkaWFsb2cgZWFjaCB0aW1lLCBzbyB0aGUgbmV4dCBvcHRpbWl6YXRpb24gd2lsbCBiZSB0byBtYWtlXG4gKiBjZXJ0YWluIGRpYWxvZ3MgKGluZGVlZCBtb3N0IG9mIHRoZW0pIGJlIGFibGUgdG8gYmVoYXZlIGFzIHNpbmdsZXRvbnMgb25jZVxuICogdGhleSBoYXZlIGJlZW4gY29uc3RydWN0ZWQgd2hlcmUgdGhleSBtZXJlbHkgaGF2ZSB0byBiZSByZXNob3duIGFuZFxuICogcmVwb3B1bGF0ZWQgdG8gcmVvcGVuIG9uZSBvZiB0aGVtLCBhbmQgY2xvc2luZyBhbnkgb2YgdGhlbSBpcyBtZXJlbHkgZG9uZSBieVxuICogbWFraW5nIHRoZW0gaW52aXNpYmxlLlxuICovXG5jbGFzcyBEaWFsb2dCYXNlIHtcblxuICAgIGRhdGE6IGFueTtcbiAgICBidWlsdDogYm9vbGVhbjtcbiAgICBndWlkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9tSWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBXZSByZWdpc3RlciAndGhpcycgc28gd2UgY2FuIGRvIG1ldGE2NC5nZXRPYmplY3RCeUd1aWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAqIG9uIHRoZSBkaWFsb2cgYW5kIGJlIGFibGUgdG8gaGF2ZSAndGhpcydhdmFpbGFibGUgdG8gdGhlIGZ1bmN0aW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcyk7XG4gICAgICAgIG1ldGE2NC5yZWdpc3RlckRhdGFPYmplY3QodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgIH1cblxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfTtcblxuICAgIG9wZW4gPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogZ2V0IGNvbnRhaW5lciB3aGVyZSBhbGwgZGlhbG9ncyBhcmUgY3JlYXRlZCAodHJ1ZSBwb2x5bWVyIGRpYWxvZ3MpXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgbW9kYWxzQ29udGFpbmVyID0gdXRpbC5wb2x5RWxtKFwibW9kYWxzQ29udGFpbmVyXCIpO1xuXG4gICAgICAgIC8qIHN1ZmZpeCBkb21JZCBmb3IgdGhpcyBpbnN0YW5jZS9ndWlkICovXG4gICAgICAgIHZhciBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVE9ETy4gSU1QT1JUQU5UOiBuZWVkIHRvIHB1dCBjb2RlIGluIHRvIHJlbW92ZSB0aGlzIGRpYWxvZyBmcm9tIHRoZSBkb21cbiAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICogbWFwIGluIHRoaXMgbW9kdWxlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgLy9OT1RFOiBUaGlzIHdvcmtzLCBidXQgaXMgYW4gZXhhbXBsZSBvZiB3aGF0IE5PVCB0byBkbyBhY3R1YWxseS4gSW5zdGVhZCBhbHdheXNcbiAgICAgICAgLy9zZXQgdGhlc2UgcHJvcGVydGllcyBvbiB0aGUgJ3BvbHlFbG0ubm9kZScgYmVsb3cuXG4gICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAgICAgbW9kYWxzQ29udGFpbmVyLm5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICBub2RlLnN0eWxlLmJvcmRlciA9IFwiM3B4IHNvbGlkIGdyYXlcIjtcblxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpOyAvLyA8LS0tLSBpcyB0aGlzIG5lZWRlZCA/IHRvZG8tM1xuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5idWlsZCgpO1xuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZChpZCwgY29udGVudCk7XG4gICAgICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2hvd2luZyBkaWFsb2c6IFwiICsgaWQpO1xuXG4gICAgICAgIC8qIG5vdyBvcGVuIGFuZCBkaXNwbGF5IHBvbHltZXIgZGlhbG9nIHdlIGp1c3QgY3JlYXRlZCAqL1xuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbShpZCk7XG5cbiAgICAgICAgLy9BZnRlciB0aGUgVHlwZVNjcmlwdCBjb252ZXJzaW9uIEkgbm90aWNlZCBoYXZpbmcgYSBtb2RhbCBmbGFnIHdpbGwgY2F1c2VcbiAgICAgICAgLy9hbiBpbmZpbml0ZSBsb29wIChjb21wbGV0ZWx5IGhhbmcpIENocm9tZSBicm93c2VyLCBidXQgdGhpcyBpc3N1ZSBpcyBtb3N0IGxpa2VseVxuICAgICAgICAvL25vdCByZWxhdGVkIHRvIFR5cGVTY3JpcHQgYXQgYWxsLCBidXQgaSdtIGp1c3QgbWVudGlvbiBUUyBqdXN0IGluIGNhc2UsIGJlY2F1c2VcbiAgICAgICAgLy90aGF0J3Mgd2hlbiBJIG5vdGljZWQgaXQuIERpYWxvZ3MgYXJlIGZpbmUgYnV0IG5vdCBhIGRpYWxvZyBvbiB0b3Agb2YgYW5vdGhlciBkaWFsb2csIHdoaWNoIGlzXG4gICAgICAgIC8vdGhlIGNhc2Ugd2hlcmUgaXQgaGFuZ3MgaWYgbW9kZWw9dHJ1ZVxuICAgICAgICAvL3BvbHlFbG0ubm9kZS5tb2RhbCA9IHRydWU7XG5cbiAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5jb25zdHJhaW4oKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLmNlbnRlcigpO1xuICAgICAgICBwb2x5RWxtLm5vZGUub3BlbigpO1xuICAgIH1cblxuICAgIC8qIHRvZG86IG5lZWQgdG8gY2xlYW51cCB0aGUgcmVnaXN0ZXJlZCBJRHMgdGhhdCBhcmUgaW4gbWFwcyBmb3IgdGhpcyBkaWFsb2cgKi9cbiAgICBjYW5jZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQodGhpcy5kb21JZCkpO1xuICAgICAgICBwb2x5RWxtLm5vZGUuY2FuY2VsKCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGdldCB0aGUgdHJ1ZSBpZCB0aGF0IGlzIHNwZWNpZmljIHRvIHRoaXMgZGlhbG9nIChpLmUuIGd1aWRcbiAgICAgKiBzdWZmaXggYXBwZW5kZWQpXG4gICAgICovXG4gICAgaWQgPSAoaWQpOiBzdHJpbmcgPT4ge1xuICAgICAgICBpZiAoaWQgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8qIGlmIGRpYWxvZyBhbHJlYWR5IHN1ZmZpeGVkICovXG4gICAgICAgIGlmIChpZC5jb250YWlucyhcIl9kbGdJZFwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpZCArIFwiX2RsZ0lkXCIgKyB0aGlzLmRhdGEuZ3VpZDtcbiAgICB9XG5cbiAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICByZXR1cm4gcmVuZGVyLm1ha2VQYXNzd29yZEZpZWxkKHRleHQsIHRoaXMuaWQoaWQpKTtcbiAgICB9XG5cbiAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgXCJsYWJlbFwiOiBmaWVsZE5hbWUsXG4gICAgICAgICAgICBcImlkXCI6IGlkXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgIH1cblxuICAgIG1ha2VNZXNzYWdlQXJlYSA9IChtZXNzYWdlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1tZXNzYWdlXCJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwXCIsIGF0dHJzLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyB0b2RvOiB0aGVyZSdzIGEgbWFrZUJ1dHRvbiAoYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcykgdGhhdCBkb24ndCBoYXZlIHRoZVxuICAgIC8vIGVuY29kZUNhbGxiYWNrIGNhcGFiaWxpdHkgeWV0XG4gICAgbWFrZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBhdHRyaWJzID0ge1xuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChpZClcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhdHRyaWJzW1wib25DbGlja1wiXSA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgbWFrZUNsb3NlQnV0dG9uID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s/OiBhbnksIGN0eD86IGFueSk6IHN0cmluZyA9PiB7XG5cbiAgICAgICAgdmFyIGF0dHJpYnMgPSB7XG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgLy8gd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSBpcyByZXF1aXJlZCAobG9naWMgZmFpbHMgd2l0aG91dClcbiAgICAgICAgICAgIFwiZGlhbG9nLWNvbmZpcm1cIjogXCJkaWFsb2ctY29uZmlybVwiLFxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBiaW5kRW50ZXJLZXkgPSAoaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLmJpbmRFbnRlcktleSh0aGlzLmlkKGlkKSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHNldElucHV0VmFsID0gKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdmFsKSB7XG4gICAgICAgICAgICB2YWwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChpZCksIHZhbCk7XG4gICAgfVxuXG4gICAgZ2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIHJldHVybiB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoaWQpKS50cmltKCk7XG4gICAgfVxuXG4gICAgc2V0SHRtbCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5zZXRIdG1sKHRoaXMuaWQoaWQpLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBtYWtlUmFkaW9CdXR0b24gPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICBcIm5hbWVcIjogaWRcbiAgICAgICAgfSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG1ha2VIZWFkZXIgPSAodGV4dDogc3RyaW5nLCBpZD86IHN0cmluZywgY2VudGVyZWQ/OiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGF0dHJzID0ge1xuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRpYWxvZy1oZWFkZXIgXCIgKyAoY2VudGVyZWQgPyBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXRcIiA6IFwiXCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy9hZGQgaWQgaWYgb25lIHdhcyBwcm92aWRlZFxuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiaDJcIiwgYXR0cnMsIHRleHQpO1xuICAgIH1cblxuICAgIGZvY3VzID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFpZC5zdGFydHNXaXRoKFwiI1wiKSkge1xuICAgICAgICAgICAgaWQgPSBcIiNcIiArIGlkO1xuICAgICAgICB9XG4gICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDb25maXJtRGxnLmpzXCIpO1xuXG5jbGFzcyBDb25maXJtRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgc3VwZXIoXCJDb25maXJtRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBjb250ZW50OiBzdHJpbmcgPSB0aGlzLm1ha2VIZWFkZXIoXCJcIiwgXCJDb25maXJtRGxnVGl0bGVcIikgKyB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIlwiLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spXG4gICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIik7XG4gICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLnRpdGxlLCBcIkNvbmZpcm1EbGdUaXRsZVwiKTtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMuYnV0dG9uVGV4dCwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIpO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByb2dyZXNzRGxnLmpzXCIpO1xuXG5jbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgXCJpbmRldGVybWluYXRlXCI6IFwiaW5kZXRlcm1pbmF0ZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgIFwibWF4XCI6IFwiMTAwMFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoyODBweDsgbWFyZ2luOjI0cHg7XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiXG4gICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgYmFyQ29udGFpbmVyO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1lc3NhZ2VEbGcuanNcIik7XHJcblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbmNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpdGxlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnRpdGxlKSArIFwiPHA+XCIgKyB0aGlzLm1lc3NhZ2UgKyBcIjwvcD5cIjtcclxuICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBMb2dpbkRsZy5qc1wiKTtcblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5L2pxdWVyeS5kLnRzXCIgLz5cblxuLy9pbXBvcnQgeyBjbnN0IH0gZnJvbSBcIi4uL2Nuc3RcIjtcblxuLypcbk5vdGU6IFRoZSBqcXVlcnkgY29va2llIGxvb2tzIGZvciBqcXVlcnkgZC50cyBpbiB0aGUgcmVsYXRpdmUgbG9jYXRpb24gXCJcIi4uL2pxdWVyeVwiIHNvIGJld2FyZSBpZiB5b3VyXG50cnkgdG8gcmVvcmdhbml6ZSB0aGUgZm9sZGVyIHN0cnVjdHVyZSBJIGhhdmUgaW4gdHlwZWRlZnMsIHRoaW5ncyB3aWxsIGNlcnRhaW5seSBicmVha1xuKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUvanF1ZXJ5LmNvb2tpZS5kLnRzXCIgLz5cblxuY2xhc3MgTG9naW5EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJMb2dpbkRsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTG9naW5cIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJwYXNzd29yZFwiKTtcblxuICAgICAgICB2YXIgbG9naW5CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJMb2dpblwiLCBcImxvZ2luQnV0dG9uXCIsIHRoaXMubG9naW4sIHRoaXMpO1xuICAgICAgICB2YXIgcmVzZXRQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkZvcmdvdCBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIiwgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsTG9naW5CdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIobG9naW5CdXR0b24gKyByZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogU29jaWFsIExvZ2luIEJ1dHRvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogU2VlIHNlcnZlciBjb250cm9sbGVyLiBJbXBsZW1lbnRhdGlvbiBpcyBhYm91dCA5NSUgY29tcGxldGUsIGJ1dCBub3QgeWV0IGZ1bGx5IGNvbXBsZXRlIVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHR3aXR0ZXJCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUd2l0dGVyXCIsIFwidHdpdHRlckxvZ2luQnV0dG9uXCIsIFwidXNlci50d2l0dGVyTG9naW4oKTtcIik7XG4gICAgICAgIHZhciBzb2NpYWxCdXR0b25CYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAodHdpdHRlckJ1dHRvbik7XG5cbiAgICAgICAgdmFyIGRpdmlkZXIgPSBcIjxkaXY+PGgzPk9yIExvZ2luIFdpdGguLi48L2gzPjwvZGl2PlwiO1xuXG4gICAgICAgIHZhciBmb3JtID0gZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuXG4gICAgICAgIHZhciBtYWluQ29udGVudCA9IGZvcm07XG4gICAgICAgIC8qXG4gICAgICAgICAqIGNvbW1lbnRpbmcgdHdpdHRlciBsb2dpbiBkdXJpbmcgcG9seW1lciBjb252ZXJzaW9uICsgZGl2aWRlciArIHNvY2lhbEJ1dHRvbkJhclxuICAgICAgICAgKi9cblxuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIG1haW5Db250ZW50O1xuXG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwidXNlck5hbWVcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwicGFzc3dvcmRcIiwgdXNlci5sb2dpbik7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVGcm9tQ29va2llcygpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlRnJvbUNvb2tpZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciB1c3IgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9VU1IpO1xuICAgICAgICB2YXIgcHdkID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcblxuICAgICAgICBpZiAodXNyKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdXNyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHdkKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwicGFzc3dvcmRcIiwgcHdkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZ2luID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG4gICAgICAgIHZhciBwd2QgPSB0aGlzLmdldElucHV0VmFsKFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgdXNlci5sb2dpbih0aGlzLCB1c3IsIHB3ZCk7XG4gICAgfVxuXG4gICAgcmVzZXRQYXNzd29yZCA9ICgpOiBhbnkgPT4ge1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHZhciB1c3IgPSB0aGlzLmdldElucHV0VmFsKFwidXNlck5hbWVcIik7XG5cbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBSZXNldCBQYXNzd29yZFwiLFxuICAgICAgICAgICAgXCJSZXNldCB5b3VyIHBhc3N3b3JkID88cD5Zb3UnbGwgc3RpbGwgYmUgYWJsZSB0byBsb2dpbiB3aXRoIHlvdXIgb2xkIHBhc3N3b3JkIHVudGlsIHRoZSBuZXcgb25lIGlzIHNldC5cIixcbiAgICAgICAgICAgIFwiWWVzLCByZXNldC5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpei5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAobmV3IFJlc2V0UGFzc3dvcmREbGcodXNyKSkub3BlbigpO1xuICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNpZ251cERsZy5qc1wiKTtcblxuZGVjbGFyZSB2YXIgQlJBTkRJTkdfVElUTEU7XG5cbmNsYXNzIFNpZ251cERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2lnbnVwRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoQlJBTkRJTkdfVElUTEUgKyBcIiBTaWdudXBcIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwic2lnbnVwVXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIlBhc3N3b3JkXCIsIFwic2lnbnVwUGFzc3dvcmRcIikgKyAvL1xuICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWxcIiwgXCJzaWdudXBFbWFpbFwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJDYXB0Y2hhXCIsIFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICB2YXIgY2FwdGNoYUltYWdlID0gcmVuZGVyLnRhZyhcImRpdlwiLCAvL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhLWltYWdlXCIgLy9cbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICByZW5kZXIudGFnKFwiaW1nXCIsIC8vXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IFwiXCIvL1xuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJcIiwgZmFsc2UpKTtcblxuICAgICAgICB2YXIgc2lnbnVwQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2lnbnVwXCIsIFwic2lnbnVwQnV0dG9uXCIsIHRoaXMuc2lnbnVwLCB0aGlzKTtcbiAgICAgICAgdmFyIG5ld0NhcHRjaGFCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJUcnkgRGlmZmVyZW50IEltYWdlXCIsIFwidHJ5QW5vdGhlckNhcHRjaGFCdXR0b25cIixcbiAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaWdudXBCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaWdudXBCdXR0b24gKyBuZXdDYXB0Y2hhQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGNhcHRjaGFJbWFnZSArIGJ1dHRvbkJhcjtcblxuICAgICAgICAvKlxuICAgICAgICAgKiAkKFwiI1wiICsgXy5kb21JZCArIFwiLW1haW5cIikuY3NzKHsgXCJiYWNrZ3JvdW5kSW1hZ2VcIiA6IFwidXJsKC9pYm0tNzAyLWJyaWdodC5qcGcpO1wiIFwiYmFja2dyb3VuZC1yZXBlYXRcIiA6XG4gICAgICAgICAqIFwibm8tcmVwZWF0O1wiLCBcImJhY2tncm91bmQtc2l6ZVwiIDogXCIxMDAlIGF1dG9cIiB9KTtcbiAgICAgICAgICovXG4gICAgfVxuXG4gICAgc2lnbnVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwVXNlck5hbWVcIik7XG4gICAgICAgIHZhciBwYXNzd29yZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBQYXNzd29yZFwiKTtcbiAgICAgICAgdmFyIGVtYWlsID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cEVtYWlsXCIpO1xuICAgICAgICB2YXIgY2FwdGNoYSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG5cblxuICAgICAgICAvKiBubyByZWFsIHZhbGlkYXRpb24geWV0LCBvdGhlciB0aGFuIG5vbi1lbXB0eSAqL1xuICAgICAgICBpZiAoIXVzZXJOYW1lIHx8IHVzZXJOYW1lLmxlbmd0aCA9PSAwIHx8IC8vXG4gICAgICAgICAgICAhcGFzc3dvcmQgfHwgcGFzc3dvcmQubGVuZ3RoID09IDAgfHwgLy9cbiAgICAgICAgICAgICFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgIWNhcHRjaGEgfHwgY2FwdGNoYS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU29ycnksIHlvdSBjYW5ub3QgbGVhdmUgYW55IGZpZWxkcyBibGFuay5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbihcInNpZ251cFwiLCB7XG4gICAgICAgICAgICBcInVzZU5hbWVcIjogdXNlck5hbWUsXG4gICAgICAgICAgICBcInBhc3dvcmRcIjogcGFzc3dvcmQsXG4gICAgICAgICAgICBcIm1haWxcIjogZW1haWwsXG4gICAgICAgICAgICBcImNhdGNoYVwiOiBjYXB0Y2hhXG4gICAgICAgIH0sIHRoaXMuc2lnbnVwUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHNpZ251cFJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNpZ251cCBuZXcgdXNlclwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgIC8qIGNsb3NlIHRoZSBzaWdudXAgZGlhbG9nICovXG4gICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXG4gICAgICAgICAgICAgICAgXCJVc2VyIEluZm9ybWF0aW9uIEFjY2VwdGVkLjxwLz5DaGVjayB5b3VyIGVtYWlsIGZvciBzaWdudXAgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgIFwiU2lnbnVwXCJcbiAgICAgICAgICAgICkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyeUFub3RoZXJDYXB0Y2hhID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHZhciBuID0gdXRpbC5jdXJyZW50VGltZU1pbGxpcygpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIGVtYmVkIGEgdGltZSBwYXJhbWV0ZXIganVzdCB0byB0aHdhcnQgYnJvd3NlciBjYWNoaW5nLCBhbmQgZW5zdXJlIHNlcnZlciBhbmQgYnJvd3NlciB3aWxsIG5ldmVyIHJldHVybiB0aGUgc2FtZVxuICAgICAgICAgKiBpbWFnZSB0d2ljZS5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzcmMgPSBwb3N0VGFyZ2V0VXJsICsgXCJjYXB0Y2hhP3Q9XCIgKyBuO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSkuYXR0cihcInNyY1wiLCBzcmMpO1xuICAgIH1cblxuICAgIHBhZ2VJbml0U2lnbnVwUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnBhZ2VJbml0U2lnbnVwUGcoKTtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmlkKFwic2lnbnVwVXNlck5hbWVcIikpO1xuICAgIH1cbn1cbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcmVmc0RsZy5qc1wiKTtcclxuXHJcbmNsYXNzIFByZWZzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIlByZWZzRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkFjY291bnQgUGVmZXJlbmNlc1wiKTtcclxuXHJcbiAgICAgICAgdmFyIHJhZGlvQnV0dG9ucyA9IHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiU2ltcGxlXCIsIFwiZWRpdE1vZGVTaW1wbGVcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIkFkdmFuY2VkXCIsIFwiZWRpdE1vZGVBZHZhbmNlZFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHJhZGlvQnV0dG9uR3JvdXAgPSByZW5kZXIudGFnKFwicGFwZXItcmFkaW8tZ3JvdXBcIiwge1xyXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSxcclxuICAgICAgICAgICAgXCJzZWxlY3RlZFwiOiB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIilcclxuICAgICAgICB9LCByYWRpb0J1dHRvbnMpO1xyXG5cclxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gcmFkaW9CdXR0b25Hcm91cDtcclxuXHJcbiAgICAgICAgdmFyIGxlZ2VuZCA9IFwiPGxlZ2VuZD5FZGl0IE1vZGU6PC9sZWdlbmQ+XCI7XHJcbiAgICAgICAgdmFyIHJhZGlvQmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKGxlZ2VuZCArIGZvcm1Db250cm9scyk7XHJcblxyXG4gICAgICAgIHZhciBzYXZlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZVByZWZlcmVuY2VzQnV0dG9uXCIsIHRoaXMuc2F2ZVByZWZlcmVuY2VzLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVByZWZlcmVuY2VzID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcG9seUVsbS5ub2RlLnNlbGVjdGVkID09IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA/IG1ldGE2NC5NT0RFX1NJTVBMRVxyXG4gICAgICAgICAgICA6IG1ldGE2NC5NT0RFX0FEVkFOQ0VEO1xyXG4gICAgICAgIHV0aWwuanNvbihcInNhdmVVc2VyUHJlZmVyZW5jZXNcIiwge1xyXG4gICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB0aGlzLnNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUHJlZmVyZW5jZXNSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmluZyBQcmVmZXJlbmNlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICAgICAgLy8gdG9kby0yOiB0cnkgYW5kIG1haW50YWluIHNjcm9sbCBwb3NpdGlvbiA/IHRoaXMgaXMgZ29pbmcgdG8gYmUgYXN5bmMsIHNvIHdhdGNoIG91dC5cclxuICAgICAgICAgICAgLy8gdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSk7XHJcbiAgICAgICAgcG9seUVsbS5ub2RlLnNlbGVjdChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT0gbWV0YTY0Lk1PREVfU0lNUExFID8gdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpIDogdGhpc1xyXG4gICAgICAgICAgICAuaWQoXCJlZGl0TW9kZUFkdmFuY2VkXCIpKTtcclxuICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBNYW5hZ2VBY2NvdW50RGxnLmpzXCIpO1xyXG5cclxuLy9pbXBvcnQgX3ByZWZzIGZyb20gXCIuLi9wcmVmc1wiO1xyXG4vL2xldCBwcmVmcyA9IF9wcmVmcztcclxuXHJcbmNsYXNzIE1hbmFnZUFjY291bnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIk1hbmFnZUFjY291bnREbGdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTWFuYWdlIEFjY291bnRcIik7XHJcblxyXG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuICAgICAgICB2YXIgY2xvc2VBY2NvdW50QnV0dG9uID0gbWV0YTY0LmlzQWRtaW5Vc2VyID8gXCJBZG1pbiBDYW5ub3QgQ2xvc2UgQWNvdW50XCIgOiB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZSBBY2NvdW50XCIsIFwiY2xvc2VBY2NvdW50QnV0dG9uXCIsIFwicHJlZnMuY2xvc2VBY2NvdW50KCk7XCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGNsb3NlQWNjb3VudEJ1dHRvbik7XHJcblxyXG4gICAgICAgIHZhciBib3R0b21CdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYmFja0J1dHRvbik7XHJcbiAgICAgICAgdmFyIGJvdHRvbUJ1dHRvbkJhckRpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiY2xvc2UtYWNjb3VudC1iYXJcIlxyXG4gICAgICAgIH0sIGJvdHRvbUJ1dHRvbkJhcik7XHJcblxyXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBidXR0b25CYXIgKyBib3R0b21CdXR0b25CYXJEaXY7XHJcbiAgICB9XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRXhwb3J0RGxnLmpzXCIpO1xuXG5cbmNsYXNzIEV4cG9ydERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiRXhwb3J0IHRvIEZpbGUgTmFtZVwiLCBcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgIHZhciBleHBvcnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJFeHBvcnRcIiwgXCJleHBvcnROb2Rlc0J1dHRvblwiLCB0aGlzLmV4cG9ydE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGV4cG9ydEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgZXhwb3J0Tm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcodGFyZ2V0RmlsZU5hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuYW1lIGZvciB0aGUgZXhwb3J0IGZpbGUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgdXRpbC5qc29uKFwiZXhwb3J0VG9YbWxcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJ0YXJnZXRGaWxlTmFtZVwiOiB0YXJnZXRGaWxlTmFtZVxuICAgICAgICAgICAgfSwgdGhpcy5leHBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnRSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRXhwb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogSW1wb3J0RGxnLmpzXCIpO1xuXG5jbGFzcyBJbXBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiSW1wb3J0IFRhcmdldCBOb2RlIE5hbWVcIiwgXCJpbXBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICB2YXIgaW1wb3J0QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiSW1wb3J0XCIsIFwiaW1wb3J0Tm9kZXNCdXR0b25cIiwgdGhpcy5pbXBvcnROb2RlcywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEltcG9ydEJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihpbXBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIGltcG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgdmFyIHNvdXJjZUZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImltcG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNvdXJjZUZpbGVOYW1lKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmFtZSBmb3IgdGhlIGltcG9ydCBmaWxlLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgIHV0aWwuanNvbihcImltcG9ydFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICB9LCB0aGlzLmltcG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltcG9ydFJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbXBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hEbGcuanNcIik7XG5cbmNsYXNzIFNlYXJjaERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2VhcmNoRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2hcIik7XG5cbiAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hOb2Rlc0J1dHRvblwiLCB0aGlzLnNlYXJjaE5vZGVzLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlYXJjaFRhZ3NCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaCBUYWdzXCIsIFwic2VhcmNoVGFnc0J1dHRvblwiLCB0aGlzLnNlYXJjaFRhZ3MsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgc2VhcmNoVGFnc0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB0aGlzLmJpbmRFbnRlcktleShcInNlYXJjaFRleHRcIiwgc3JjaC5zZWFyY2hOb2RlcylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgc2VhcmNoTm9kZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KFwiamNyOmNvbnRlbnRcIik7XG4gICAgfVxuXG4gICAgc2VhcmNoVGFncyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICB9XG5cbiAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuanNvbihcIm5vZGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgXCJtb2RTb3J0RGVzY1wiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxuY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBwd2Q6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAqIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy5wYXNzQ29kZSA/IFwiUGFzc3dvcmQgUmVzZXRcIiA6IFwiQ2hhbmdlIFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJOZXcgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcblxyXG4gICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsQ2hhbmdlUGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHdkICYmIHRoaXMucHdkLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbihcImNoYW5nZVBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmV3UGFzc3dvcmRcIjogdGhpcy5wd2QsXHJcbiAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgfSwgdGhpcy5jaGFuZ2VQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlID0gKHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIHBhc3N3b3JkXCIsIHJlcykpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBcIlBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIG1zZyArPSBcIjxwPllvdSBtYXkgbm93IGxvZ2luIGFzIDxiPlwiICsgcmVzLnVzZXJcclxuICAgICAgICAgICAgICAgICAgICArIFwiPC9iPiB3aXRoIHlvdXIgbmV3IHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2csIFwiUGFzc3dvcmQgQ2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbG9naW4gY2FsbCBET0VTIHdvcmssIGJ1dCB0aGUgcmVhc29uIHdlIGRvbid0IGRvIHRoaXMgaXMgYmVjYXVzZSB0aGUgVVJMIHN0aWxsIGhhcyB0aGUgcGFzc0NvZGUgb24gaXQgYW5kIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy93YW50IHRvIGRpcmVjdCB0aGUgdXNlciB0byBhIHVybCB3aXRob3V0IHRoYXQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICB0aGlzLmZvY3VzKFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZXNldFBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxuY2xhc3MgUmVzZXRQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgeW91ciB1c2VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgYW5kIGEgY2hhbmdlLXBhc3N3b3JkIGxpbmsgd2lsbCBiZSBzZW50IHRvIHlvdVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZXNldCBteSBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpLnRyaW0oKTtcclxuICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgIGlmICh1c2VyTmFtZSAmJiBlbWFpbEFkZHJlc3MpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uKFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlc2V0IHBhc3N3b3JkXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdGhpcy51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURsZy5qc1wiKTtcbi8vaW1wb3J0IHsgY25zdCB9IGZyb20gXCIuLi9jbnN0XCI7XG5cbmNsYXNzIFVwbG9hZEZyb21GaWxlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICB2YXIgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcblxuICAgICAgICB2YXIgZm9ybUZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRm9yIG5vdyBJIGp1c3QgaGFyZC1jb2RlIGluIDcgZWRpdCBmaWVsZHMsIGJ1dCB3ZSBjb3VsZCB0aGVvcmV0aWNhbGx5IG1ha2UgdGhpcyBkeW5hbWljIHNvIHVzZXIgY2FuIGNsaWNrICdhZGQnXG4gICAgICAgICAqIGJ1dHRvbiBhbmQgYWRkIG5ldyBvbmVzIG9uZSBhdCBhIHRpbWUuIEp1c3Qgbm90IHRha2luZyB0aGUgdGltZSB0byBkbyB0aGF0IHlldC5cbiAgICAgICAgICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJmaWxlc1wiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLyogd3JhcCBpbiBESVYgdG8gZm9yY2UgdmVydGljYWwgYWxpZ24gKi9cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi1ib3R0b206IDEwcHg7XCJcbiAgICAgICAgICAgIH0sIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIiksXG4gICAgICAgICAgICBcInR5cGVcIjogXCJoaWRkZW5cIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVJZFwiXG4gICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEFjY29yZGluZyB0byBzb21lIG9ubGluZSBwb3N0cyBJIHNob3VsZCBoYXZlIG5lZWRlZCBkYXRhLWFqYXg9XCJmYWxzZVwiIG9uIHRoaXMgZm9ybSBidXQgaXQgaXMgd29ya2luZyBhcyBpc1xuICAgICAgICAgKiB3aXRob3V0IHRoYXQuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1cIiksXG4gICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgIFwiZW5jdHlwZVwiOiBcIm11bHRpcGFydC9mb3JtLWRhdGFcIixcbiAgICAgICAgICAgIFwiZGF0YS1hamF4XCI6IFwiZmFsc2VcIiAvLyBORVcgZm9yIG11bHRpcGxlIGZpbGUgdXBsb2FkIHN1cHBvcnQ/Pz9cbiAgICAgICAgfSwgZm9ybUZpZWxkcyk7XG5cbiAgICAgICAgdXBsb2FkRmllbGRDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRmllbGRDb250YWluZXJcIilcbiAgICAgICAgfSwgXCI8cD5VcGxvYWQgZnJvbSB5b3VyIGNvbXB1dGVyPC9wPlwiICsgZm9ybSk7XG5cbiAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAvKiBVcGxvYWQgZm9ybSBoYXMgaGlkZGVuIGlucHV0IGVsZW1lbnQgZm9yIG5vZGVJZCBwYXJhbWV0ZXIgKi9cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpKS5hdHRyKFwidmFsdWVcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBvbmx5IHBsYWNlIHdlIGRvIHNvbWV0aGluZyBkaWZmZXJlbnRseSBmcm9tIHRoZSBub3JtYWwgJ3V0aWwuanNvbigpJyBjYWxscyB0byB0aGUgc2VydmVyLCBiZWNhdXNlXG4gICAgICAgICAqIHRoaXMgaXMgaGlnaGx5IHNwZWNpYWxpemVkIGhlcmUgZm9yIGZvcm0gdXBsb2FkaW5nLCBhbmQgaXMgZGlmZmVyZW50IGZyb20gbm9ybWFsIGFqYXggY2FsbHMuXG4gICAgICAgICAqL1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoPEhUTUxGb3JtRWxlbWVudD4oJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtXCIpKVswXSkpO1xuXG4gICAgICAgIHZhciBwcm1zID0gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogcG9zdFRhcmdldFVybCArIFwidXBsb2FkXCIsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBybXMuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBybXMuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVwbG9hZCBmYWlsZWQuXCIpKS5vcGVuKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG4gICAgfVxufVxuIiwiXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tVXJsRGxnLmpzXCIpO1xuLy9pbXBvcnQgeyBjbnN0IH0gZnJvbSBcIi4uL2Nuc3RcIjtcblxuY2xhc3MgVXBsb2FkRnJvbVVybERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbVVybERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICB2YXIgdXBsb2FkUGF0aERpc3BsYXkgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxEaXYgPSBcIlwiO1xuXG4gICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRmllbGQgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVcGxvYWQgRnJvbSBVUkxcIiwgXCJ1cGxvYWRGcm9tVXJsXCIpO1xuICAgICAgICB1cGxvYWRGcm9tVXJsRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgfSwgdXBsb2FkRnJvbVVybEZpZWxkKTtcblxuICAgICAgICB2YXIgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIHVwbG9hZEZyb21VcmxEaXYgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgdXBsb2FkRmlsZU5vdyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdmFyIHNvdXJjZVVybCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1cGxvYWRGcm9tVXJsXCIpO1xuXG4gICAgICAgIC8qIGlmIHVwbG9hZGluZyBmcm9tIFVSTCAqL1xuICAgICAgICBpZiAoc291cmNlVXJsKSB7XG4gICAgICAgICAgICB1dGlsLmpzb24oXCJ1cGxvYWRGcm9tVXJsXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzb3VyY2VVcmxcIjogc291cmNlVXJsXG4gICAgICAgICAgICB9LCB0aGlzLnVwbG9hZEZyb21VcmxSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGxvYWRGcm9tVXJsUmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiVXBsb2FkIGZyb20gVVJMXCIsIHJlcykpIHtcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoXCJ1cGxvYWRGcm9tVXJsXCIpLCBcIlwiKTtcblxuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdE5vZGVEbGcuanNcIik7XG5cbmRlY2xhcmUgdmFyIGFjZTtcbi8vaW1wb3J0IHsgY25zdCB9IGZyb20gXCIuLi9jbnN0XCI7XG5cbi8qXG4gKiBFZGl0b3IgRGlhbG9nIChFZGl0cyBOb2RlcylcbiAqXG4gKi9cbmNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBmaWVsZElkVG9Qcm9wTWFwOiBhbnkgPSB7fTtcbiAgICBwcm9wRW50cmllczogQXJyYXk8UHJvcEVudHJ5PiA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUHJvcGVydHkgZmllbGRzIGFyZSBnZW5lcmF0ZWQgZHluYW1pY2FsbHkgYW5kIHRoaXMgbWFwcyB0aGUgRE9NIElEcyBvZiBlYWNoIGZpZWxkIHRvIHRoZSBwcm9wZXJ0eSBvYmplY3QgaXRcbiAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICB2YXIgc2F2ZU5vZGVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlTm9kZUJ1dHRvblwiLCB0aGlzLnNhdmVOb2RlLCB0aGlzKTtcbiAgICAgICAgdmFyIGFkZFByb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQWRkIFByb3BlcnR5XCIsIFwiYWRkUHJvcGVydHlCdXR0b25cIiwgdGhpcy5hZGRQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgdGhpcy5hZGRUYWdzUHJvcGVydHksIHRoaXMpO1xuICAgICAgICAvLyB0aGlzIHNwbGl0IHdvcmtzIGFmYWlrLCBidXQgSSBkb24ndCB3YW50IGl0IGVuYWJsZWQgeWV0LlxuICAgICAgICAvLyB2YXIgc3BsaXRDb250ZW50QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU3BsaXQgQ29udGVudFwiLFxuICAgICAgICAvLyBcInNwbGl0Q29udGVudEJ1dHRvblwiLCBcImVkaXQuc3BsaXRDb250ZW50KCk7XCIpO1xuICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxFZGl0QnV0dG9uXCIsIFwiZWRpdC5jYW5jZWxFZGl0KCk7XCIsIHRoaXMpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZU5vZGVCdXR0b24gKyBhZGRQcm9wZXJ0eUJ1dHRvbiArIGFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblxuXHQvKiArIHNwbGl0Q29udGVudEJ1dHRvbiAqLyArIGNhbmNlbEVkaXRCdXR0b24sIFwiYnV0dG9uc1wiKTtcblxuICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVJbnN0cnVjdGlvbnNcIilcbiAgICAgICAgfSkgKyByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAvLyB0b2RvLTA6IGNyZWF0ZSBDU1MgY2xhc3MgZm9yIHRoaXMuXG4gICAgICAgICAgICBzdHlsZTogXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7XCIgLy8gYm9yZGVyOjRweCBzb2xpZFxuICAgICAgICAgICAgLy8gbGlnaHRHcmF5O1wiXG4gICAgICAgIH0sIFwiTG9hZGluZy4uLlwiKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbmVyYXRlcyBhbGwgdGhlIEhUTUwgZWRpdCBmaWVsZHMgYW5kIHB1dHMgdGhlbSBpbnRvIHRoZSBET00gbW9kZWwgb2YgdGhlIHByb3BlcnR5IGVkaXRvciBkaWFsb2cgYm94LlxuICAgICAqXG4gICAgICovXG4gICAgcG9wdWxhdGVFZGl0Tm9kZVBnID0gKCkgPT4ge1xuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgLyogY2xlYXIgdGhpcyBtYXAgdG8gZ2V0IHJpZCBvZiBvbGQgcHJvcGVydGllcyAqL1xuICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgLyogZWRpdE5vZGUgd2lsbCBiZSBudWxsIGlmIHRoaXMgaXMgYSBuZXcgbm9kZSBiZWluZyBjcmVhdGVkICovXG4gICAgICAgIGlmIChlZGl0LmVkaXROb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgIC8qIGl0ZXJhdG9yIGZ1bmN0aW9uIHdpbGwgaGF2ZSB0aGUgd3JvbmcgJ3RoaXMnIHNvIHdlIHNhdmUgdGhlIHJpZ2h0IG9uZSAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgdmFyIGFjZUZpZWxkcyA9IFtdO1xuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBXYXJuaW5nIGVhY2ggaXRlcmF0b3IgbG9vcCBoYXMgaXRzIG93biAndGhpcydcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJC5lYWNoKGVkaXRPcmRlcmVkUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBwcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghcmVuZGVyLmFsbG93UHJvcGVydHlUb0Rpc3BsYXkocHJvcC5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgZWRpdCBmaWVsZCBcIiArIGZpZWxkSWQgKyBcIiBmb3IgcHJvcGVydHkgXCIgKyBwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSBwcm9wLnZhbHVlcyAmJiBwcm9wLnZhbHVlcy5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNCaW5hcnlQcm9wID0gcmVuZGVyLmlzQmluYXJ5UHJvcGVydHkocHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgIGxldCBwcm9wRW50cnk6IFByb3BFbnRyeSA9IG5ldyBQcm9wRW50cnkoZmllbGRJZCwgcHJvcCwgaXNNdWx0aSwgaXNSZWFkT25seVByb3AsIGlzQmluYXJ5UHJvcCwgbnVsbCk7XG5cbiAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgdGhpei5wcm9wRW50cmllcy5wdXNoKHByb3BFbnRyeSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAoIWlzUmVhZE9ubHlQcm9wICYmICFpc0JpbmFyeVByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gdGhpei5tYWtlUHJvcGVydHlFZGl0QnV0dG9uQmFyKHByb3AsIGZpZWxkSWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGJ1dHRvbkJhcjtcblxuICAgICAgICAgICAgICAgIGlmIChpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZU11bHRpUHJvcEVkaXRvcihwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZVNpbmdsZVByb3BFZGl0b3IocHJvcEVudHJ5LCBhY2VGaWVsZHMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB8fCBlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcInByb3BlcnR5RWRpdExpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbUhpZGRlblwiKVxuICAgICAgICAgICAgICAgICAgICAvLyBcInN0eWxlXCIgOiBcImRpc3BsYXk6IFwiKyAoIXJkT25seSB8fCBtZXRhNjQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiaW5saW5lXCIgOiBcIm5vbmVcIilcbiAgICAgICAgICAgICAgICB9LCBmaWVsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiBFZGl0aW5nIGEgbmV3IG5vZGUgKi9cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0b2RvLTA6IHRoaXMgZW50aXJlIGJsb2NrIG5lZWRzIHJldmlldyBub3cgKHJlZGVzaWduKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIG5ldyBub2RlLlwiKTtcblxuICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRJZCA9IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGFjZUZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJhY2UtZWRpdC1wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBhY2VGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IFwiXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5ldyBOb2RlIE5hbWVcIlxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogSSBjYW4gcmVtb3ZlIHRoaXMgZGl2IG5vdyA/XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge30sIGZpZWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vSSdtIG5vdCBxdWl0ZSByZWFkeSB0byBhZGQgdGhpcyBidXR0b24geWV0LlxuICAgICAgICAvLyB2YXIgdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgIC8vICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnRvZ2dsZVNob3dSZWFkT25seSgpO1wiIC8vXG4gICAgICAgIC8vIH0sIC8vXG4gICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAvL1xuICAgICAgICAvLyBmaWVsZHMgKz0gdG9nZ2xlUmVhZG9ubHlWaXNCdXR0b247XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQodGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLCBmaWVsZHMpO1xuXG4gICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjZUZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChhY2VGaWVsZHNbaV0uaWQpO1xuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShhY2VGaWVsZHNbaV0udmFsLnVuZW5jb2RlSHRtbCgpKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgIFwiWW91IG1heSBsZWF2ZSB0aGlzIGZpZWxkIGJsYW5rIGFuZCBhIHVuaXF1ZSBJRCB3aWxsIGJlIGFzc2lnbmVkLiBZb3Ugb25seSBuZWVkIHRvIHByb3ZpZGUgYSBuYW1lIGlmIHlvdSB3YW50IHRoaXMgbm9kZSB0byBoYXZlIGEgbW9yZSBtZWFuaW5nZnVsIFVSTC5cIlxuICAgICAgICAgICAgOiAvL1xuICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpKS5odG1sKGluc3RyKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBBbGxvdyBhZGRpbmcgb2YgbmV3IHByb3BlcnRpZXMgYXMgbG9uZyBhcyB0aGlzIGlzIGEgc2F2ZWQgbm9kZSB3ZSBhcmUgZWRpdGluZywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIHN0YXJ0XG4gICAgICAgICAqIG1hbmFnaW5nIG5ldyBwcm9wZXJ0aWVzIG9uIHRoZSBjbGllbnQgc2lkZS4gV2UgbmVlZCBhIGdlbnVpbmUgbm9kZSBhbHJlYWR5IHNhdmVkIG9uIHRoZSBzZXJ2ZXIgYmVmb3JlIHdlIGFsbG93XG4gICAgICAgICAqIGFueSBwcm9wZXJ0eSBlZGl0aW5nIHRvIGhhcHBlbi5cbiAgICAgICAgICovXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUJ1dHRvblwiKSwgIWVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKTtcblxuICAgICAgICB2YXIgdGFnc1Byb3BFeGlzdHMgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJ0YWdzXCIsIGVkaXQuZWRpdE5vZGUpICE9IG51bGw7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGFzVGFnc1Byb3A6IFwiICsgdGFnc1Byb3ApO1xuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkVGFnc1Byb3BlcnR5QnV0dG9uXCIpLCAhdGFnc1Byb3BFeGlzdHMpO1xuICAgIH1cblxuICAgIHRvZ2dsZVNob3dSZWFkT25seSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLy8gYWxlcnQoXCJub3QgeWV0IGltcGxlbWVudGVkLlwiKTtcbiAgICAgICAgLy8gc2VlIHNhdmVFeGlzdGluZ05vZGUgZm9yIGhvdyB0byBpdGVyYXRlIGFsbCBwcm9wZXJ0aWVzLCBhbHRob3VnaCBJIHdvbmRlciB3aHkgSSBkaWRuJ3QganVzdCB1c2UgYSBtYXAvc2V0IG9mXG4gICAgICAgIC8vIHByb3BlcnRpZXMgZWxlbWVudHNcbiAgICAgICAgLy8gaW5zdGVhZCBzbyBJIGRvbid0IG5lZWQgdG8gcGFyc2UgYW55IERPTSBvciBkb21JZHMgaW5vcmRlciB0byBpdGVyYXRlIG92ZXIgdGhlIGxpc3Qgb2YgdGhlbT8/Pz9cbiAgICB9XG5cbiAgICBhZGRQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0ID0gbmV3IEVkaXRQcm9wZXJ0eURsZyh0aGlzKTtcbiAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0Lm9wZW4oKTtcbiAgICB9XG5cbiAgICBhZGRUYWdzUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoZWRpdC5lZGl0Tm9kZSwgXCJ0YWdzXCIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IFwidGFnc1wiLFxuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogXCJcIlxuICAgICAgICB9O1xuICAgICAgICB1dGlsLmpzb24oXCJzYXZlUHJvcGVydHlcIiwgcG9zdERhdGEsIHRoaXMuYWRkVGFnc1Byb3BlcnR5UmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkFkZCBUYWdzIFByb3BlcnR5XCIsIHJlcykpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UocmVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2ZSBwcm9wZXJ0aWVzXCIsIHJlcyk7XG5cbiAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5kb21JZCAhPSBcIkVkaXROb2RlRGxnXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOb3RlOiBmaWVsZElkIHBhcmFtZXRlciBpcyBhbHJlYWR5IGRpYWxvZy1zcGVjaWZpYyBhbmQgZG9lc24ndCBuZWVkIGlkKCkgd3JhcHBlciBmdW5jdGlvblxuICAgICAqL1xuICAgIG1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIgPSAocHJvcDogYW55LCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gXCJcIjtcblxuICAgICAgICB2YXIgY2xlYXJCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmNsZWFyUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgfSwgLy9cbiAgICAgICAgICAgIFwiQ2xlYXJcIik7XG5cbiAgICAgICAgdmFyIGFkZE11bHRpQnV0dG9uID0gXCJcIjtcbiAgICAgICAgdmFyIGRlbGV0ZUJ1dHRvbiA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHByb3AubmFtZSAhPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRm9yIG5vdyB3ZSBqdXN0IGdvIHdpdGggdGhlIGRlc2lnbiB3aGVyZSB0aGUgYWN0dWFsIGNvbnRlbnQgcHJvcGVydHkgY2Fubm90IGJlIGRlbGV0ZWQuIFVzZXIgY2FuIGxlYXZlXG4gICAgICAgICAgICAgKiBjb250ZW50IGJsYW5rIGJ1dCBub3QgZGVsZXRlIGl0LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWxldGVCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuZGVsZXRlUHJvcGVydHkoJ1wiICsgcHJvcC5uYW1lICsgXCInKTtcIiAvL1xuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIkRlbFwiKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEkgZG9uJ3QgdGhpbmsgaXQgcmVhbGx5IG1ha2VzIHNlbnNlIHRvIGFsbG93IGEgamNyOmNvbnRlbnQgcHJvcGVydHkgdG8gYmUgbXVsdGl2YWx1ZWQuIEkgbWF5IGJlIHdyb25nIGJ1dFxuICAgICAgICAgICAgICogdGhpcyBpcyBteSBjdXJyZW50IGFzc3VtcHRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy90b2RvLTA6IFRoZXJlJ3MgYSBidWcgaW4gZWRpdGluZyBtdWx0aXBsZS12YWx1ZWQgcHJvcGVydGllcywgYW5kIHNvIGknbSBqdXN0IHR1cm5pbmcgaXQgb2ZmIGZvciBub3dcbiAgICAgICAgICAgIC8vd2hpbGUgaSBjb21wbGV0ZSB0ZXN0aW5nIG9mIHRoZSByZXN0IG9mIHRoZSBhcHAuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gYWRkTXVsdGlCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgLy8gICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGlzLmd1aWQgKyBcIikuYWRkU3ViUHJvcGVydHkoJ1wiICsgZmllbGRJZCArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgIC8vIH0sIC8vXG4gICAgICAgICAgICAvLyAgICAgXCJBZGQgTXVsdGlcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWxsQnV0dG9ucyA9IGFkZE11bHRpQnV0dG9uICsgY2xlYXJCdXR0b24gKyBkZWxldGVCdXR0b247XG4gICAgICAgIGlmIChhbGxCdXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGFsbEJ1dHRvbnMsIFwicHJvcGVydHktZWRpdC1idXR0b24tYmFyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnV0dG9uQmFyID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2ZpZWxkSWRdLnByb3BlcnR5O1xuXG4gICAgICAgIHZhciBpc011bHRpID0gdXRpbC5pc09iamVjdChwcm9wLnZhbHVlcyk7XG5cbiAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgaWYgKCFpc011bHRpKSB7XG4gICAgICAgICAgICBwcm9wLnZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgIHByb3AudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogbm93IGFkZCBuZXcgZW1wdHkgcHJvcGVydHkgYW5kIHBvcHVsYXRlIGl0IG9udG8gdGhlIHNjcmVlblxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICogcmVyZW5kZXJpbmcgdGhlIGVudGlyZSBlZGl0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZWxldGVzIHRoZSBwcm9wZXJ0eSBvZiB0aGUgc3BlY2lmaWVkIG5hbWUgb24gdGhlIG5vZGUgYmVpbmcgZWRpdGVkLCBidXQgZmlyc3QgZ2V0cyBjb25maXJtYXRpb24gZnJvbSB1c2VyXG4gICAgICovXG4gICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIHRoZSBQcm9wZXJ0eTogXCIgKyBwcm9wTmFtZSwgXCJZZXMsIGRlbGV0ZS5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJkZWxldGVQcm9wZXJ0eVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgXCJwcm9wTmFtZVwiOiBwcm9wTmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIG5vdCBzdXJlIGlmICd0aGlzJyB3aWxsIGJlIGNvcnJlY3QgaGVyZSAodXNpbmcgX3RoaXMgdW50aWwgSSBjaGVjaylcbiAgICAgICAgICAgIHRoaXouZGVsZXRlUHJvcGVydHlSZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBwcm9wTmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnksIHByb3BlcnR5VG9EZWxldGU6IGFueSkgPT4ge1xuXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBwcm9wZXJ0eVwiLCByZXMpKSB7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiByZW1vdmUgZGVsZXRlZCBwcm9wZXJ0eSBmcm9tIGNsaWVudCBzaWRlIHN0b3JhZ2UsIHNvIHdlIGNhbiByZS1yZW5kZXIgc2NyZWVuIHdpdGhvdXQgbWFraW5nIGFub3RoZXIgY2FsbCB0b1xuICAgICAgICAgICAgICogc2VydmVyXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHByb3BzLmRlbGV0ZVByb3BlcnR5RnJvbUxvY2FsRGF0YShwcm9wZXJ0eVRvRGVsZXRlKTtcblxuICAgICAgICAgICAgLyogbm93IGp1c3QgcmUtcmVuZGVyIHNjcmVlbiBmcm9tIGxvY2FsIHZhcmlhYmxlcyAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVFZGl0Tm9kZVBnKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclByb3BlcnR5ID0gKGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCldO1xuICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHNjYW4gZm9yIGFsbCBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBmaWVsZHMgYW5kIGNsZWFyIHRoZW0gKi9cbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGlmICghdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQgKyBcIl9zdWJQcm9wXCIgKyBjb3VudGVyKSwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIGZvciBub3cganVzdCBsZXQgc2VydmVyIHNpZGUgY2hva2Ugb24gaW52YWxpZCB0aGluZ3MuIEl0IGhhcyBlbm91Z2ggc2VjdXJpdHkgYW5kIHZhbGlkYXRpb24gdG8gYXQgbGVhc3QgcHJvdGVjdFxuICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgKi9cbiAgICBzYXZlTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICogSWYgZWRpdGluZyBhbiB1bnNhdmVkIG5vZGUgaXQncyB0aW1lIHRvIHJ1biB0aGUgaW5zZXJ0Tm9kZSwgb3IgY3JlYXRlU3ViTm9kZSwgd2hpY2ggYWN0dWFsbHkgc2F2ZXMgb250byB0aGVcbiAgICAgICAgICogc2VydmVyLCBhbmQgd2lsbCBpbml0aWF0ZSBmdXJ0aGVyIGVkaXRpbmcgbGlrZSBmb3IgcHJvcGVydGllcywgZXRjLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVOZXdOb2RlLlwiKTtcblxuICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgIHRoaXMuc2F2ZU5ld05vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBFbHNlIHdlIGFyZSBlZGl0aW5nIGEgc2F2ZWQgbm9kZSwgd2hpY2ggaXMgYWxyZWFkeSBzYXZlZCBvbiBzZXJ2ZXIuXG4gICAgICAgICAqL1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZS5cIik7XG4gICAgICAgICAgICB0aGlzLnNhdmVFeGlzdGluZ05vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVOZXdOb2RlID0gKG5ld05vZGVOYW1lPzogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgIG5ld05vZGVOYW1lID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJZiB3ZSBkaWRuJ3QgY3JlYXRlIHRoZSBub2RlIHdlIGFyZSBpbnNlcnRpbmcgdW5kZXIsIGFuZCBuZWl0aGVyIGRpZCBcImFkbWluXCIsIHRoZW4gd2UgbmVlZCB0byBzZW5kIG5vdGlmaWNhdGlvblxuICAgICAgICAgKiBlbWFpbCB1cG9uIHNhdmluZyB0aGlzIG5ldyBub2RlLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1ldGE2NC51c2VyTmFtZSAhPSBlZGl0LnBhcmVudE9mTmV3Tm9kZS5jcmVhdGVkQnkgJiYgLy9cbiAgICAgICAgICAgIGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAhPSBcImFkbWluXCIpIHtcbiAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICB1dGlsLmpzb24oXCJpbnNlcnROb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0TmFtZVwiOiBlZGl0Lm5vZGVJbnNlcnRUYXJnZXQubmFtZSxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lXG4gICAgICAgICAgICB9LCBlZGl0Lmluc2VydE5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsLmpzb24oXCJjcmVhdGVTdWJOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LnBhcmVudE9mTmV3Tm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lXG4gICAgICAgICAgICB9LCBlZGl0LmNyZWF0ZVN1Yk5vZGVSZXNwb25zZSwgZWRpdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlRXhpc3RpbmdOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGVcIik7XG5cbiAgICAgICAgLyogaG9sZHMgbGlzdCBvZiBwcm9wZXJ0aWVzIHRvIHNlbmQgdG8gc2VydmVyLiBFYWNoIG9uZSBoYXZpbmcgbmFtZSt2YWx1ZSBwcm9wZXJ0aWVzICovXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMucHJvcEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4OiBudW1iZXIsIHByb3A6IGFueSkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgLyogSWdub3JlIHRoaXMgcHJvcGVydHkgaWYgaXQncyBvbmUgdGhhdCBjYW5ub3QgYmUgZWRpdGVkIGFzIHRleHQgKi9cbiAgICAgICAgICAgIGlmIChwcm9wLnJlYWRPbmx5IHx8IHByb3AuYmluYXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKCFwcm9wLm11bHRpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbm9uLW11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtwcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIElEOiBcIiArIHByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQocHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGNoYW5nZWQ6IHByb3BOYW1lPVwiICsgcHJvcC5wcm9wZXJ0eS5uYW1lICsgXCIgcHJvcFZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGRpZG4ndCBjaGFuZ2U6IFwiICsgcHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogRWxzZSB0aGlzIGlzIGEgTVVMVEkgcHJvcGVydHkgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFscyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKHByb3Auc3ViUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBzdWJQcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgQWNlIEVkaXRvciBmb3Igc3ViUHJvcCBJRDogXCIgKyBzdWJQcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJTZXR0aW5nW1wiICsgcHJvcFZhbCArIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIHN1YlByb3BbXCIgKyBpbmRleCArIFwiXSBvZiBcIiArIHByb3AubmFtZSArIFwiIHZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVzXCI6IHByb3BWYWxzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7Ly8gZW5kIGl0ZXJhdG9yXG5cbiAgICAgICAgLyogaWYgYW55dGhpbmcgY2hhbmdlZCwgc2F2ZSB0byBzZXJ2ZXIgKi9cbiAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb24oXCJzYXZlTm9kZVwiLCBwb3N0RGF0YSwgZWRpdC5zYXZlTm9kZVJlc3BvbnNlLCBlZGl0LCB7XG4gICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIGNoYW5nZWQuIE5vdGhpbmcgdG8gc2F2ZS5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlTXVsdGlQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5KTogc3RyaW5nID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgTXVsdGkgRWRpdG9yOiBQcm9wZXJ0eSBtdWx0aS10eXBlOiBuYW1lPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIiBjb3VudD1cIlxuICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcyA9IFtdO1xuXG4gICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgIGlmICghcHJvcExpc3QgfHwgcHJvcExpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHByb3BMaXN0ID0gW107XG4gICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKHByb3BFbnRyeS5pZCArIFwiX3N1YlByb3BcIiArIGkpO1xuXG4gICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gKGkgPT0gMCA/IHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lIDogXCIqXCIpICsgXCIuXCIgKyBpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzLnB1c2goc3ViUHJvcCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogYW55LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHkgc2luZ2xlLXR5cGU6IFwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICB2YXIgbGFiZWwgPSByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgPyBwcm9wVmFsIDogJyc7XG4gICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsU3RyLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1ha2luZyBzaW5nbGUgcHJvcCBlZGl0b3I6IHByb3BbXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiXSB2YWxbXCIgKyBwcm9wRW50cnkucHJvcGVydHkudmFsXG4gICAgICAgICAgICArIFwiXSBmaWVsZElkPVwiICsgcHJvcEVudHJ5LmlkKTtcblxuICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogRWRpdFByb3BlcnR5RGxnLmpzXCIpO1xuLy9pbXBvcnQgeyBjbnN0IH0gZnJvbSBcIi4uL2Nuc3RcIjtcbi8qXG4gKiBQcm9wZXJ0eSBFZGl0b3IgRGlhbG9nIChFZGl0cyBOb2RlIFByb3BlcnRpZXMpXG4gKi9cbmNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgcHJpdmF0ZSBlZGl0Tm9kZURsZzogYW55O1xuXG4gICAgY29uc3RydWN0b3IoZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICBzdXBlcihcIkVkaXRQcm9wZXJ0eURsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRWRpdCBOb2RlIFByb3BlcnR5XCIpO1xuXG4gICAgICAgIHZhciBzYXZlUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNhdmVcIiwgXCJzYXZlUHJvcGVydHlCdXR0b25cIiwgdGhpcy5zYXZlUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVQcm9wZXJ0eUJ1dHRvbiArIGNhbmNlbEVkaXRCdXR0b24pO1xuXG4gICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpXG4gICAgICAgICAgICAgICAgKyBcIicgY2xhc3M9J3BhdGgtZGlzcGxheS1pbi1lZGl0b3InPjwvZGl2PlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVQcm9wZXJ0eUVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBmaWVsZCA9ICcnO1xuXG4gICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZpZWxkUHJvcE5hbWVJZCA9IFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wTmFtZUlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChmaWVsZFByb3BOYW1lSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5hbWVcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBQcm9wZXJ0eSBWYWx1ZSBGaWVsZCAqL1xuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcFZhbHVlSWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSB0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlZhbHVlXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQodGhpcy5pZChcImFkZFByb3BlcnR5RmllbGRDb250YWluZXJcIiksIGZpZWxkKTtcbiAgICB9XG5cbiAgICBzYXZlUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWVEYXRhID0gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlOYW1lVGV4dENvbnRlbnRcIikpO1xuICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIikpO1xuXG4gICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgIG5vZGVJZDogZWRpdC5lZGl0Tm9kZS5pZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lRGF0YSxcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHByb3BlcnR5VmFsdWVEYXRhXG4gICAgICAgIH07XG4gICAgICAgIHV0aWwuanNvbihcInNhdmVQcm9wZXJ0eVwiLCBwb3N0RGF0YSwgdGhpcy5zYXZlUHJvcGVydHlSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyogV2FybmluZzogZG9uJ3QgY29uZnVzZSB3aXRoIEVkaXROb2RlRGxnICovXG4gICAgc2F2ZVByb3BlcnR5UmVzcG9uc2UgPSAocmVzOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgfVxufVxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2hhcmVUb1BlcnNvbkRsZy5qc1wiKTtcblxuY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2hhcmVUb1BlcnNvbkRsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2hhcmUgTm9kZSB0byBQZXJzb25cIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgdmFyIHNoYXJlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTaGFyZVwiLCBcInNoYXJlTm9kZVRvUGVyc29uQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QZXJzb24sXG4gICAgICAgICAgICB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgXCI8cD5FbnRlciB0aGUgdXNlcm5hbWUgb2YgdGhlIHBlcnNvbiB5b3Ugd2FudCB0byBzaGFyZSB0aGlzIG5vZGUgd2l0aDo8L3A+XCIgKyBmb3JtQ29udHJvbHNcbiAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIHNoYXJlTm9kZVRvUGVyc29uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgIGlmICghdGFyZ2V0VXNlcikge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgdXNlcm5hbWVcIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICovXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHV0aWwuanNvbihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IHRhcmdldFVzZXIsXG4gICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl1cbiAgICAgICAgfSwgdGhpei5yZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uLCB0aGl6KTtcbiAgICB9XG5cbiAgICByZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlNoYXJlIE5vZGUgd2l0aCBQZXJzb25cIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2hhcmluZ0RsZy5qc1wiKTtcblxuY2xhc3MgU2hhcmluZ0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiU2hhcmluZ0RsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTm9kZSBTaGFyaW5nXCIpO1xuXG4gICAgICAgIHZhciBzaGFyZVdpdGhQZXJzb25CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB3aXRoIFBlcnNvblwiLCBcInNoYXJlTm9kZVRvUGVyc29uUGdCdXR0b25cIixcbiAgICAgICAgICAgIHRoaXMuc2hhcmVOb2RlVG9QZXJzb25QZywgdGhpcyk7XG4gICAgICAgIHZhciBtYWtlUHVibGljQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2hhcmUgdG8gUHVibGljXCIsIFwic2hhcmVOb2RlVG9QdWJsaWNCdXR0b25cIiwgdGhpcy5zaGFyZU5vZGVUb1B1YmxpYyxcbiAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVNoYXJpbmdCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaGFyZVdpdGhQZXJzb25CdXR0b24gKyBtYWtlUHVibGljQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J1wiICsgdGhpcy5pZChcInNoYXJlTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvZGl2PlwiICsgLy9cbiAgICAgICAgICAgIFwiPGRpdiBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICsgdGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIikgKyBcIic+PC9kaXY+XCI7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdldHMgcHJpdmlsZWdlcyBmcm9tIHNlcnZlciBhbmQgZGlzcGxheXMgaW4gR1VJIGFsc28uIEFzc3VtZXMgZ3VpIGlzIGFscmVhZHkgYXQgY29ycmVjdCBwYWdlLlxuICAgICAqL1xuICAgIHJlbG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIG5vZGUgc2hhcmluZyBpbmZvLlwiKTtcblxuICAgICAgICB1dGlsLmpzb24oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhhbmRsZXMgZ2V0Tm9kZVByaXZpbGVnZXMgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgKlxuICAgICAqIHJlcy5hY2xFbnRyaWVzID0gbGlzdCBvZiBBY2Nlc3NDb250cm9sRW50cnlJbmZvLmphdmEganNvbiBvYmplY3RzXG4gICAgICovXG4gICAgZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLnBvcHVsYXRlU2hhcmluZ1BnKHJlcyk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGdvdHRlbiBiYWNrIGZyb20gdGhlIHNlcnZlciBjb250YWluaW5nIEFDTCBpbmZvIHNvIHdlIGNhbiBwb3B1bGF0ZSB0aGUgc2hhcmluZyBwYWdlIGluIHRoZSBndWlcbiAgICAgKi9cbiAgICBwb3B1bGF0ZVNoYXJpbmdQZyA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAkLmVhY2gocmVzLmFjbEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4LCBhY2xFbnRyeSkge1xuICAgICAgICAgICAgaHRtbCArPSBcIjxoND5Vc2VyOiBcIiArIGFjbEVudHJ5LnByaW5jaXBhbE5hbWUgKyBcIjwvaDQ+XCI7XG4gICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtbGlzdFwiXG4gICAgICAgICAgICB9LCBUaGlzLnJlbmRlckFjbFByaXZpbGVnZXMoYWNsRW50cnkucHJpbmNpcGFsTmFtZSwgYWNsRW50cnkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICB2YXIgcHVibGljQXBwZW5kQXR0cnMgPSB7XG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpei5ndWlkICsgXCIpLnB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkKCk7XCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIixcbiAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChyZXMucHVibGljQXBwZW5kKSB7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRvZG86IHVzZSBhY3R1YWwgcG9seW1lciBwYXBlci1jaGVja2JveCBoZXJlICovXG4gICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgXCJmb3JcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQodGhpcy5pZChcInNoYXJpbmdMaXN0RmllbGRDb250YWluZXJcIiksIGh0bWwpO1xuICAgIH1cblxuICAgIHB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFVzaW5nIG9uQ2xpY2sgb24gdGhlIGVsZW1lbnQgQU5EIHRoaXMgdGltZW91dCBpcyB0aGUgb25seSBoYWNrIEkgY291bGQgZmluZCB0byBnZXQgZ2V0IHdoYXQgYW1vdW50cyB0byBhIHN0YXRlXG4gICAgICAgICAqIGNoYW5nZSBsaXN0ZW5lciBvbiBhIHBhcGVyLWNoZWNrYm94LiBUaGUgZG9jdW1lbnRlZCBvbi1jaGFuZ2UgbGlzdGVuZXIgc2ltcGx5IGRvZXNuJ3Qgd29yayBhbmQgYXBwZWFycyB0byBiZVxuICAgICAgICAgKiBzaW1wbHkgYSBidWcgaW4gZ29vZ2xlIGNvZGUgQUZBSUsuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGl6LmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpKTtcblxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIHV0aWwuanNvbihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogcG9seUVsbS5ub2RlLmNoZWNrZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgMjUwKTtcbiAgICB9XG5cbiAgICByZW1vdmVQcml2aWxlZ2UgPSAocHJpbmNpcGFsOiBhbnksIHByaXZpbGVnZTogYW55KTogdm9pZCA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICovXG4gICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIHV0aWwuanNvbihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IHByaW5jaXBhbCxcbiAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICB9LCB0aGlzLnJlbW92ZVByaXZpbGVnZVJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IGFueSk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHV0aWwuanNvbihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXG4gICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmVuZGVyQWNsUHJpdmlsZWdlcyA9IChwcmluY2lwYWw6IGFueSwgYWNsRW50cnk6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICQuZWFjaChhY2xFbnRyeS5wcml2aWxlZ2VzLCBmdW5jdGlvbihpbmRleCwgcHJpdmlsZWdlKSB7XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpei5ndWlkICsgXCIpLnJlbW92ZVByaXZpbGVnZSgnXCIgKyBwcmluY2lwYWwgKyBcIicsICdcIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lXG4gICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgdmFyIHJvdyA9IHJlbmRlci5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgIHJvdyArPSBcIjxiPlwiICsgcHJpbmNpcGFsICsgXCI8L2I+IGhhcyBwcml2aWxlZ2UgPGI+XCIgKyBwcml2aWxlZ2UucHJpdmlsZWdlTmFtZSArIFwiPC9iPiBvbiB0aGlzIG5vZGUuXCI7XG5cbiAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWVudHJ5XCJcbiAgICAgICAgICAgIH0sIHJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIChuZXcgU2hhcmVUb1BlcnNvbkRsZygpKS5vcGVuKCk7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2hhcmluZyBub2RlIHRvIHB1YmxpYy5cIik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQWRkIHByaXZpbGVnZSBhbmQgdGhlbiByZWxvYWQgc2hhcmUgbm9kZXMgZGlhbG9nIGZyb20gc2NyYXRjaCBkb2luZyBhbm90aGVyIGNhbGxiYWNrIHRvIHNlcnZlclxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHV0aWwuanNvbihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IFwiZXZlcnlvbmVcIixcbiAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCJdXG4gICAgICAgIH0sIHRoaXMucmVsb2FkLCB0aGlzKTtcbiAgICB9XG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFJlbmFtZU5vZGVEbGcuanNcIik7XG5cbmNsYXNzIFJlbmFtZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJSZW5hbWVOb2RlRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJSZW5hbWUgTm9kZVwiKTtcblxuICAgICAgICB2YXIgY3VyTm9kZU5hbWVEaXNwbGF5ID0gXCI8aDMgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2gzPlwiO1xuICAgICAgICB2YXIgY3VyTm9kZVBhdGhEaXNwbGF5ID0gXCI8aDQgY2xhc3M9J3BhdGgtZGlzcGxheScgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSArIFwiJz48L2g0PlwiO1xuXG4gICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbnRlciBuZXcgbmFtZSBmb3IgdGhlIG5vZGVcIiwgXCJuZXdOb2RlTmFtZUVkaXRGaWVsZFwiKTtcblxuICAgICAgICB2YXIgcmVuYW1lTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZUJ1dHRvblwiLCB0aGlzLnJlbmFtZU5vZGUsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZW5hbWVOb2RlQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlbmFtZU5vZGVCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgY3VyTm9kZU5hbWVEaXNwbGF5ICsgY3VyTm9kZVBhdGhEaXNwbGF5ICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIHJlbmFtZU5vZGUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHZhciBuZXdOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKG5ld05hbWUpKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSBuZXcgbm9kZSBuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2VsZWN0IGEgbm9kZSB0byByZW5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKiBpZiBubyBub2RlIGJlbG93IHRoaXMgbm9kZSwgcmV0dXJucyBudWxsICovXG4gICAgICAgIHZhciBub2RlQmVsb3cgPSBlZGl0LmdldE5vZGVCZWxvdyhoaWdobGlnaHROb2RlKTtcblxuICAgICAgICB2YXIgcmVuYW1pbmdSb290Tm9kZSA9IChoaWdobGlnaHROb2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVJZCk7XG5cbiAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICBcIm5ld05hbWVcIjogbmV3TmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG5cbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXoucmVuYW1lTm9kZVJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIHJlbmFtaW5nUm9vdE5vZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5hbWVOb2RlUmVzcG9uc2UgPSAocmVzOiBhbnksIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiUmVuYW1lIG5vZGVcIiwgcmVzKSkge1xuICAgICAgICAgICAgaWYgKHJlbmFtaW5nUGFnZVJvb3QpIHtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UsIHJlcy5uZXdJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyBoaWdobGlnaHROb2RlLnBhdGgpO1xuICAgIH1cbn1cbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2hSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5cclxudmFyIHNlYXJjaFJlc3VsdHNQYW5lbCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBfID0ge1xyXG4gICAgICAgIGRvbUlkOiBcInNlYXJjaFJlc3VsdHNQYW5lbFwiLFxyXG4gICAgICAgIHRhYklkOiBcInNlYXJjaFRhYk5hbWVcIixcclxuICAgICAgICB2aXNpYmxlOiBmYWxzZSxcclxuXHJcbiAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gXCI8aDIgaWQ9J3NlYXJjaFBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJChcIiNzZWFyY2hQYWdlVGl0bGVcIikuaHRtbChzcmNoLnNlYXJjaFBhZ2VUaXRsZSk7XHJcbiAgICAgICAgICAgIHNyY2gucG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZShzcmNoLnNlYXJjaFJlc3VsdHMsIFwic2VhcmNoUmVzdWx0c1ZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gXztcclxufSAoKTtcclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHRpbWVsaW5lUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxudmFyIHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuICAgIHZhciBfID0ge1xyXG4gICAgICAgIGRvbUlkOiBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCIsXHJcbiAgICAgICAgdGFiSWQ6IFwidGltZWxpbmVUYWJOYW1lXCIsXHJcbiAgICAgICAgdmlzaWJsZTogZmFsc2UsXHJcblxyXG4gICAgICAgIGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSd0aW1lbGluZVZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBfO1xyXG59ICgpO1xyXG4iXX0=