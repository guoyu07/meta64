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
    function Cnst() {
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
    }
    return Cnst;
}());
if (!window["cnst"]) {
    var cnst = new Cnst();
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
        this._ajaxCounter = 0;
        this.daylightSavingsTime = (new Date().dst()) ? true : false;
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
    }
    Util.prototype.assertNotNull = function (varName) {
        if (typeof eval(varName) === 'undefined') {
            (new MessageDlg("Variable not found: " + varName)).open();
        }
    };
    Util.prototype.toJson = function (obj) {
        return JSON.stringify(obj, null, 4);
    };
    Util.prototype.getParameterByName = function (name, url) {
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
    Util.prototype.inherit = function (parent, child) {
        child.prototype.constructor = child;
        child.prototype = Object.create(parent.prototype);
        return child.prototype;
    };
    Util.prototype.initProgressMonitor = function () {
        setInterval(this.progressInterval, 1000);
    };
    Util.prototype.json = function (postName, postData, callback, callbackThis, callbackPayload) {
        if (callbackThis === window) {
            console.log("PROBABLE BUG: json call for " + postName + " used global 'window' as 'this', which is almost never going to be correct.");
        }
        var ironAjax;
        var ironRequest;
        var thiz = this;
        try {
            if (this.offline) {
                console.log("offline: ignoring call for " + postName);
                return;
            }
            if (this.logAjax) {
                console.log("JSON-POST: [" + postName + "]" + JSON.stringify(postData));
            }
            ironAjax = Polymer.dom(this.root).querySelector("#ironAjax");
            ironAjax.url = postTargetUrl + postName;
            ironAjax.verbose = true;
            ironAjax.body = JSON.stringify(postData);
            ironAjax.method = "POST";
            ironAjax.contentType = "application/json";
            ironAjax.handleAs = "json";
            ironAjax.debounceDuration = "300";
            this._ajaxCounter++;
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
    Util.prototype.ajaxReady = function (requestName) {
        if (this._ajaxCounter > 0) {
            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
            return false;
        }
        return true;
    };
    Util.prototype.isAjaxWaiting = function () {
        return this._ajaxCounter > 0;
    };
    Util.prototype.delayedFocus = function (id) {
        setTimeout(function () {
            $(id).focus();
        }, 500);
        setTimeout(function () {
            $(id).focus();
        }, 1000);
    };
    Util.prototype.checkSuccess = function (opFriendlyName, res) {
        if (!res.success) {
            (new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
        }
        return res.success;
    };
    Util.prototype.addAll = function (obj, a) {
        for (var i = 0; i < a.length; i++) {
            if (!a[i]) {
                console.error("null element in addAll at idx=" + i);
            }
            else {
                obj[a[i]] = true;
            }
        }
    };
    Util.prototype.nullOrUndef = function (obj) {
        return obj === null || obj === undefined;
    };
    Util.prototype.getUidForId = function (map, id) {
        var uid = map[id];
        if (!uid) {
            uid = meta64.nextUid++;
            map[id] = uid;
        }
        return uid;
    };
    Util.prototype.elementExists = function (id) {
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
    Util.prototype.getTextAreaValById = function (id) {
        var domElm = this.domElm(id);
        return domElm.value;
    };
    Util.prototype.domElm = function (id) {
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
    Util.prototype.poly = function (id) {
        return this.polyElm(id).node;
    };
    Util.prototype.polyElm = function (id) {
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
    Util.prototype.getRequiredElement = function (id) {
        var e = $(id);
        if (e == null) {
            console.log("getRequiredElement. Required element id not found: " + id);
        }
        return e;
    };
    Util.prototype.isObject = function (obj) {
        return obj && obj.length != 0;
    };
    Util.prototype.currentTimeMillis = function () {
        return new Date().getMilliseconds();
    };
    Util.prototype.emptyString = function (val) {
        return !val || val.length == 0;
    };
    Util.prototype.getInputVal = function (id) {
        return this.polyElm(id).node.value;
    };
    Util.prototype.setInputVal = function (id, val) {
        if (val == null) {
            val = "";
        }
        var elm = this.polyElm(id);
        if (elm) {
            elm.node.value = val;
        }
        return elm != null;
    };
    Util.prototype.bindEnterKey = function (id, func) {
        this.bindKey(id, func, 13);
    };
    Util.prototype.bindKey = function (id, func, keyCode) {
        $(id).keypress(function (e) {
            if (e.which == keyCode) {
                func();
                return false;
            }
        });
    };
    Util.prototype.anyEmpty = function (p1, p2, p3, p4) {
        for (var i = 0; i < arguments.length; i++) {
            var val = arguments[i];
            if (!val || val.length == 0)
                return true;
        }
        return false;
    };
    Util.prototype.changeOrAddClass = function (elm, oldClass, newClass) {
        var elmement = $(elm);
        elmement.toggleClass(oldClass, false);
        elmement.toggleClass(newClass, true);
    };
    Util.prototype.verifyType = function (obj, type, msg) {
        if (typeof obj !== type) {
            (new MessageDlg(msg)).open();
            return false;
        }
        return true;
    };
    Util.prototype.setHtmlEnhanced = function (id, content) {
        if (content == null) {
            content = "";
        }
        var elm = this.domElm(id);
        var polyElm = Polymer.dom(elm);
        polyElm.node.innerHTML = content;
        Polymer.dom.flush();
        Polymer.updateStyles();
        return elm;
    };
    Util.prototype.setHtml = function (id, content) {
        if (content == null) {
            content = "";
        }
        var elm = this.domElm(id);
        var polyElm = Polymer.dom(elm);
        polyElm.node.innerHTML = content;
    };
    Util.prototype.getPropertyCount = function (obj) {
        var count = 0;
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    };
    Util.prototype.printObject = function (obj) {
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
    Util.prototype.printKeys = function (obj) {
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
    Util.prototype.setEnablement = function (elmId, enable) {
        var domElm = null;
        if (typeof elmId == "string") {
            domElm = this.domElm(elmId);
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
    Util.prototype.setVisibility = function (elmId, vis) {
        var domElm = null;
        if (typeof elmId == "string") {
            domElm = this.domElm(elmId);
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
        this.uploadNode = null;
    }
    Attachment.prototype.openUploadFromFileDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.uploadNode = node;
        (new UploadFromFileDlg()).open();
    };
    Attachment.prototype.openUploadFromUrlDlg = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            this.uploadNode = null;
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.uploadNode = node;
        (new UploadFromUrlDlg()).open();
    };
    Attachment.prototype.deleteAttachment = function () {
        var node = meta64.getHighlightedNode();
        var thiz = this;
        if (node) {
            (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.", function () {
                util.json("deleteAttachment", {
                    "nodeId": node.id
                }, thiz.deleteAttachmentResponse, thiz, node.uid);
            })).open();
        }
    };
    Attachment.prototype.deleteAttachmentResponse = function (res, uid) {
        if (util.checkSuccess("Delete attachment", res)) {
            meta64.removeBinaryByUid(uid);
            meta64.goToMainPage(true);
        }
    };
    return Attachment;
}());
if (!window["attachment"]) {
    var attachment = new Attachment();
}
console.log("running module: edit.js");
var Edit = (function () {
    function Edit() {
        this.showReadOnlyProperties = true;
        this.nodesToMove = null;
        this.parentOfNewNode = null;
        this.editingUnsavedNode = false;
        this.sendNotificationPendingSave = false;
        this.editNode = null;
        this.editNodeDlgInst = null;
        this.nodeInsertTarget = null;
    }
    Edit.prototype._insertBookResponse = function (res) {
        console.log("insertBookResponse running.");
        util.checkSuccess("Insert Book", res);
        view.refreshTree(null, false);
        meta64.selectTab("mainTabName");
        view.scrollToSelectedNode();
    };
    Edit.prototype._deleteNodesResponse = function (res) {
        if (util.checkSuccess("Delete node", res)) {
            meta64.clearSelectedNodes();
            view.refreshTree(null, false);
        }
    };
    Edit.prototype._initNodeEditResponse = function (res) {
        if (util.checkSuccess("Editing node", res)) {
            var node = res.nodeInfo;
            var isRep = node.name.startsWith("rep:") || node.path.contains("/rep:");
            var editingAllowed = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }
            if (editingAllowed) {
                this.editNode = res.nodeInfo;
                this.editNodeDlgInst = new EditNodeDlg();
                this.editNodeDlgInst.open();
            }
            else {
                (new MessageDlg("You cannot edit nodes that you don't own.")).open();
            }
        }
    };
    Edit.prototype._moveNodesResponse = function (res) {
        if (util.checkSuccess("Move nodes", res)) {
            this.nodesToMove = null;
            view.refreshTree(null, false);
        }
    };
    Edit.prototype._setNodePositionResponse = function (res) {
        if (util.checkSuccess("Change node position", res)) {
            meta64.refresh();
        }
    };
    Edit.prototype._splitContentResponse = function (res) {
        if (util.checkSuccess("Split content", res)) {
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    Edit.prototype.isEditAllowed = function (node) {
        return meta64.editMode && node.path != "/" &&
            (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node))
            && !props.isNonOwnedNode(node);
    };
    Edit.prototype.isInsertAllowed = function (node) {
        return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
    };
    Edit.prototype.startEditingNewNode = function () {
        this.editingUnsavedNode = false;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.saveNewNode("");
    };
    Edit.prototype.startEditingNewNodeWithName = function () {
        this.editingUnsavedNode = true;
        this.editNode = null;
        debugger;
        this.editNodeDlgInst = new EditNodeDlg();
        this.editNodeDlgInst.open();
    };
    Edit.prototype.insertNodeResponse = function (res) {
        if (util.checkSuccess("Insert node", res)) {
            meta64.initNode(res.newNode);
            meta64.highlightNode(res.newNode, true);
            this.runEditNode(res.newNode.uid);
        }
    };
    Edit.prototype.createSubNodeResponse = function (res) {
        if (util.checkSuccess("Create subnode", res)) {
            meta64.initNode(res.newNode);
            this.runEditNode(res.newNode.uid);
        }
    };
    Edit.prototype.saveNodeResponse = function (res, payload) {
        if (util.checkSuccess("Save node", res)) {
            view.refreshTree(null, false, payload.savedId);
            meta64.selectTab("mainTabName");
        }
    };
    Edit.prototype.editMode = function () {
        meta64.editMode = meta64.editMode ? false : true;
        render.renderPageFromData();
        view.scrollToSelectedNode();
    };
    Edit.prototype.splitContent = function () {
        var nodeBelow = this.getNodeBelow(this.editNode);
        util.json("splitNode", {
            "nodeId": this.editNode.id,
            "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id)
        }, this._splitContentResponse, this);
    };
    Edit.prototype.cancelEdit = function () {
        if (meta64.treeDirty) {
            meta64.goToMainPage(true);
        }
        else {
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    Edit.prototype.moveNodeUp = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (node) {
            var nodeAbove = this.getNodeAbove(node);
            if (nodeAbove == null) {
                return;
            }
            util.json("setNodePosition", {
                "parentNodeId": meta64.currentNodeId,
                "nodeId": node.name,
                "siblingId": nodeAbove.name
            }, this._setNodePositionResponse, this);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    Edit.prototype.moveNodeDown = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (node) {
            var nodeBelow = this.getNodeBelow(node);
            if (nodeBelow == null) {
                return;
            }
            util.json("setNodePosition", {
                "parentNodeId": meta64.currentNodeData.node.id,
                "nodeId": nodeBelow.name,
                "siblingId": node.name
            }, this._setNodePositionResponse, this);
        }
        else {
            console.log("idToNodeMap does not contain " + uid);
        }
    };
    Edit.prototype.getNodeAbove = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        if (ordinal <= 0)
            return null;
        return meta64.currentNodeData.children[ordinal - 1];
    };
    Edit.prototype.getNodeBelow = function (node) {
        var ordinal = meta64.getOrdinalOfNode(node);
        console.log("ordinal = " + ordinal);
        if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
            return null;
        return meta64.currentNodeData.children[ordinal + 1];
    };
    Edit.prototype.runEditNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            this.editNode = null;
            (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
            return;
        }
        this.editingUnsavedNode = false;
        util.json("initNodeEdit", {
            "nodeId": node.id
        }, this._initNodeEditResponse, this);
    };
    Edit.prototype.insertNode = function (uid) {
        this.parentOfNewNode = meta64.currentNode;
        if (!this.parentOfNewNode) {
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
            this.nodeInsertTarget = node;
            this.startEditingNewNode();
        }
    };
    Edit.prototype.createSubNodeUnderHighlight = function () {
        this.parentOfNewNode = meta64.getHighlightedNode();
        if (!this.parentOfNewNode) {
            (new MessageDlg("Tap a node to insert under.")).open();
            return;
        }
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    };
    Edit.prototype.replyToComment = function (uid) {
        this.createSubNode(uid);
    };
    Edit.prototype.createSubNode = function (uid) {
        if (!uid) {
            this.parentOfNewNode = meta64.currentNode;
        }
        else {
            this.parentOfNewNode = meta64.uidToNodeMap[uid];
            if (!this.parentOfNewNode) {
                console.log("Unknown nodeId in createSubNode: " + uid);
                return;
            }
        }
        this.nodeInsertTarget = null;
        this.startEditingNewNode();
    };
    Edit.prototype.clearSelections = function () {
        meta64.clearSelectedNodes();
        render.renderPageFromData();
        meta64.selectTab("mainTabName");
    };
    Edit.prototype.deleteSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
            return;
        }
        var thiz = this;
        (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.", function () {
            util.json("deleteNodes", {
                "nodeIds": selNodesArray
            }, thiz._deleteNodesResponse, thiz);
        })).open();
    };
    Edit.prototype.moveSelNodes = function () {
        var selNodesArray = meta64.getSelectedNodeIdsArray();
        if (!selNodesArray || selNodesArray.length == 0) {
            (new MessageDlg("You have not selected any nodes. Select nodes to move first.")).open();
            return;
        }
        var thiz = this;
        (new ConfirmDlg("Confirm Move", "Move " + selNodesArray.length + " node(s) to a new location ?", "Yes, move.", function () {
            thiz.nodesToMove = selNodesArray;
            meta64.selectedNodes = {};
            (new MessageDlg("Identified nodes to move.<p/>To actually move these nodes, browse to the target location, then click 'Finish Moving'<p/>" +
                "The nodes will then be moved to the end of the list of subnodes under the target node. (i.e. The target you select will become the new parent of the nodes)"))
                .open();
            meta64.refreshAllGuiEnablement();
        })).open();
    };
    Edit.prototype.finishMovingSelNodes = function () {
        var thiz = this;
        (new ConfirmDlg("Confirm Move", "Move " + thiz.nodesToMove.length + " node(s) to selected location ?", "Yes, move.", function () {
            var highlightNode = meta64.getHighlightedNode();
            util.json("moveNodes", {
                "targetNodeId": highlightNode.id,
                "targetChildId": highlightNode != null ? highlightNode.id : null,
                "nodeIds": thiz.nodesToMove
            }, thiz._moveNodesResponse, thiz);
        })).open();
    };
    Edit.prototype.insertBookWarAndPeace = function () {
        var thiz = this;
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
    return Edit;
}());
if (!window["edit"]) {
    var edit = new Edit();
}
console.log("running module: meta64.js");
var Meta64 = (function () {
    function Meta64() {
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
    }
    Meta64.prototype.updateMainMenuPanel = function () {
        console.log("building main menu panel");
        menuPanel.build();
        menuPanel.init();
    };
    Meta64.prototype.registerDataObject = function (data) {
        if (!data.guid) {
            data.guid = ++this.nextGuid;
            this.dataObjMap[data.guid] = data;
        }
    };
    Meta64.prototype.getObjectByGuid = function (guid) {
        var ret = this.dataObjMap[guid];
        if (!ret) {
            console.log("data object not found: guid=" + guid);
        }
        return ret;
    };
    Meta64.prototype.encodeOnClick = function (callback, ctx) {
        if (typeof callback == "string") {
            return callback;
        }
        else if (typeof callback == "function") {
            this.registerDataObject(callback);
            if (ctx) {
                this.registerDataObject(ctx);
                return "meta64.runCallback(" + callback.guid + "," + ctx.guid + ");";
            }
            else {
                return "meta64.runCallback(" + callback.guid + ");";
            }
        }
    };
    Meta64.prototype.runCallback = function (guid, ctx) {
        var dataObj = this.getObjectByGuid(guid);
        if (dataObj.callback) {
            dataObj.callback();
        }
        else if (typeof dataObj == 'function') {
            if (ctx) {
                var thiz = this.getObjectByGuid(ctx);
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
    Meta64.prototype.inSimpleMode = function () {
        return this.editModeOption === this.MODE_SIMPLE;
    };
    Meta64.prototype.refresh = function () {
        this.goToMainPage(true, true);
    };
    Meta64.prototype.goToMainPage = function (rerender, forceServerRefresh) {
        if (forceServerRefresh) {
            this.treeDirty = true;
        }
        if (rerender || this.treeDirty) {
            if (this.treeDirty) {
                view.refreshTree(null, true);
            }
            else {
                render.renderPageFromData();
            }
            this.refreshAllGuiEnablement();
        }
        else {
            view.scrollToSelectedNode();
        }
    };
    Meta64.prototype.selectTab = function (pageName) {
        var ironPages = document.querySelector("#mainIronPages");
        ironPages.select(pageName);
    };
    Meta64.prototype.changePage = function (pg, data) {
        if (typeof pg.tabId === 'undefined') {
            console.log("oops, wrong object type passed to changePage function.");
            return null;
        }
        var paperTabs = document.querySelector("#mainPaperTabs");
        paperTabs.select(pg.tabId);
    };
    Meta64.prototype.isNodeBlackListed = function (node) {
        if (!this.inSimpleMode())
            return false;
        var prop;
        for (prop in this.simpleModeNodePrefixBlackList) {
            if (this.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && node.name.startsWith(prop)) {
                return true;
            }
        }
        return false;
    };
    Meta64.prototype.getSelectedNodeUidsArray = function () {
        var selArray = [], idx = 0, uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = uid;
            }
        }
        return selArray;
    };
    Meta64.prototype.getSelectedNodeIdsArray = function () {
        var selArray = [], idx = 0, uid;
        if (!this.selectedNodes) {
            console.log("no selected nodes.");
        }
        else {
            console.log("selectedNode count: " + util.getPropertyCount(this.selectedNodes));
        }
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                var node = this.uidToNodeMap[uid];
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
    Meta64.prototype.getSelectedNodesArray = function () {
        var selArray = [], idx = 0, uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                selArray[idx++] = this.uidToNodeMap[uid];
            }
        }
        return selArray;
    };
    Meta64.prototype.clearSelectedNodes = function () {
        this.selectedNodes = {};
    };
    Meta64.prototype.updateNodeInfoResponse = function (res, node) {
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
    Meta64.prototype.updateNodeInfo = function (node) {
        var ironRes = util.json("getNodePrivileges", {
            "nodeId": node.id,
            "includeAcl": false,
            "includeOwners": true
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.updateNodeInfoResponse(ironRes.response, node);
        });
    };
    Meta64.prototype.getNodeFromId = function (id) {
        return this.idToNodeMap[id];
    };
    Meta64.prototype.getPathOfUid = function (uid) {
        var node = this.uidToNodeMap[uid];
        if (!node) {
            return "[path error. invalid uid: " + uid + "]";
        }
        else {
            return node.path;
        }
    };
    Meta64.prototype.getHighlightedNode = function () {
        var ret = this.parentUidToFocusNodeMap[this.currentNodeUid];
        return ret;
    };
    Meta64.prototype.highlightRowById = function (id, scroll) {
        var node = this.getNodeFromId(id);
        if (node) {
            this.highlightNode(node, scroll);
        }
        else {
            console.log("highlightRowById failed to find id: " + id);
        }
    };
    Meta64.prototype.highlightNode = function (node, scroll) {
        if (!node)
            return;
        var doneHighlighting = false;
        var curHighlightedNode = this.parentUidToFocusNodeMap[this.currentNodeUid];
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
            this.parentUidToFocusNodeMap[this.currentNodeUid] = node;
            var rowElmId = node.uid + "_row";
            var rowElm = $("#" + rowElmId);
            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        }
        if (scroll) {
            view.scrollToSelectedNode();
        }
    };
    Meta64.prototype.refreshAllGuiEnablement = function () {
        var selNodeCount = util.getPropertyCount(this.selectedNodes);
        var highlightNode = this.getHighlightedNode();
        var selNodeIsMine = highlightNode != null && highlightNode.createdBy === meta64.userName;
        util.setEnablement("navLogoutButton", !this.isAnonUser);
        util.setEnablement("openSignupPgButton", this.isAnonUser);
        util.setEnablement("openExportDlg", this.isAdminUser);
        util.setEnablement("openImportDlg", this.isAdminUser);
        var propsToggle = this.currentNode && !this.isAnonUser;
        util.setEnablement("propsToggleButton", propsToggle);
        var allowEditMode = this.currentNode && !this.isAnonUser;
        util.setEnablement("editModeButton", allowEditMode);
        util.setEnablement("upLevelButton", this.currentNode && nav.parentVisibleToUser());
        util.setEnablement("moveSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("deleteSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("clearSelectionsButton", !this.isAnonUser && selNodeCount > 0);
        util.setEnablement("moveSelNodesButton", !this.isAnonUser && selNodeCount > 0 && selNodeIsMine);
        util.setEnablement("finishMovingSelNodesButton", !this.isAnonUser && edit.nodesToMove != null && selNodeIsMine);
        util.setEnablement("changePasswordPgButton", !this.isAnonUser);
        util.setEnablement("accountPreferencesButton", !this.isAnonUser);
        util.setEnablement("manageAccountButton", !this.isAnonUser);
        util.setEnablement("insertBookWarAndPeaceButton", this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
        util.setEnablement("uploadFromFileButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("uploadFromUrlButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("deleteAttachmentsButton", !this.isAnonUser && highlightNode != null
            && highlightNode.hasBinary && selNodeIsMine);
        util.setEnablement("editNodeSharingButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("renameNodePgButton", !this.isAnonUser && highlightNode != null && selNodeIsMine);
        util.setEnablement("searchDlgButton", !this.isAnonUser && highlightNode != null);
        util.setEnablement("timelineButton", !this.isAnonUser && highlightNode != null);
        util.setEnablement("showServerInfoButton", this.isAdminUser);
        util.setEnablement("showFullNodeUrlButton", highlightNode != null);
        util.setEnablement("refreshPageButton", !this.isAnonUser);
        util.setEnablement("findSharedNodesButton", !this.isAnonUser && highlightNode != null);
        util.setVisibility("openImportDlg", this.isAdminUser && selNodeIsMine);
        util.setVisibility("openExportDlg", this.isAdminUser && selNodeIsMine);
        util.setVisibility("navHomeButton", !this.isAnonUser);
        util.setVisibility("editModeButton", allowEditMode);
        util.setVisibility("upLevelButton", meta64.currentNode && nav.parentVisibleToUser());
        util.setVisibility("insertBookWarAndPeaceButton", this.isAdminUser || user.isTestUserAccount() && selNodeIsMine);
        util.setVisibility("propsToggleButton", !this.isAnonUser);
        util.setVisibility("openLoginDlgButton", this.isAnonUser);
        util.setVisibility("navLogoutButton", !this.isAnonUser);
        util.setVisibility("openSignupPgButton", this.isAnonUser);
        Polymer.dom.flush();
        Polymer.updateStyles();
    };
    Meta64.prototype.getSingleSelectedNode = function () {
        var uid;
        for (uid in this.selectedNodes) {
            if (this.selectedNodes.hasOwnProperty(uid)) {
                return this.uidToNodeMap[uid];
            }
        }
        return null;
    };
    Meta64.prototype.getOrdinalOfNode = function (node) {
        if (!this.currentNodeData || !this.currentNodeData.children)
            return -1;
        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            if (node.id === this.currentNodeData.children[i].id) {
                return i;
            }
        }
        return -1;
    };
    Meta64.prototype.setCurrentNodeData = function (data) {
        this.currentNodeData = data;
        this.currentNode = data.node;
        this.currentNodeUid = data.node.uid;
        this.currentNodeId = data.node.id;
        this.currentNodePath = data.node.path;
    };
    Meta64.prototype.anonPageLoadResponse = function (res) {
        if (res.renderNodeResponse) {
            util.setVisibility("mainNodeContent", true);
            render.renderPageFromData(res.renderNodeResponse);
            this.refreshAllGuiEnablement();
        }
        else {
            util.setVisibility("mainNodeContent", false);
            console.log("setting listview to: " + res.content);
            util.setHtmlEnhanced("listView", res.content);
        }
        render.renderMainPageControls();
    };
    Meta64.prototype.removeBinaryByUid = function (uid) {
        for (var i = 0; i < this.currentNodeData.children.length; i++) {
            var node = this.currentNodeData.children[i];
            if (node.uid === uid) {
                node.hasBinary = false;
                break;
            }
        }
    };
    Meta64.prototype.initNode = function (node) {
        if (!node) {
            console.log("initNode has null node");
            return;
        }
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        node.properties = props.getPropertiesInEditingOrder(node.properties);
        node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        node.lastModified = props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node);
        this.uidToNodeMap[node.uid] = node;
        this.idToNodeMap[node.id] = node;
    };
    Meta64.prototype.initConstants = function () {
        util.addAll(this.simpleModePropertyBlackList, [
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
        util.addAll(this.readOnlyPropertyList, [
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
        util.addAll(this.binaryPropertyList, [jcrCnst.BIN_DATA]);
    };
    Meta64.prototype.initApp = function () {
        if (this.appInitialized)
            return;
        console.log("initApp running.");
        this.appInitialized = true;
        var tabs = util.poly("mainIronPages");
        var thiz = this;
        tabs.addEventListener("iron-select", function () {
            thiz.tabChangeEvent(tabs.selected);
        });
        this.initConstants();
        this.displaySignupMessage();
        $(window).bind("beforeunload", function () {
            return "Leave Meta64 ?";
        });
        this.deviceWidth = $(window).width();
        this.deviceHeight = $(window).height();
        user.refreshLogin();
        this.updateMainMenuPanel();
        this.refreshAllGuiEnablement();
        util.initProgressMonitor();
        this.processUrlParams();
    };
    Meta64.prototype.processUrlParams = function () {
        var passCode = util.getParameterByName("passCode");
        if (passCode) {
            setTimeout(function () {
                (new ChangePasswordDlg(passCode)).open();
            }, 100);
        }
    };
    Meta64.prototype.tabChangeEvent = function (tabName) {
        if (tabName == "searchTabName") {
            srch.searchTabActivated();
        }
    };
    Meta64.prototype.displaySignupMessage = function () {
        var signupResponse = $("#signupCodeResponse").text();
        if (signupResponse === "ok") {
            (new MessageDlg("Signup complete. You may now login.")).open();
        }
    };
    Meta64.prototype.screenSizeChange = function () {
        if (this.currentNodeData) {
            if (meta64.currentNode.imgId) {
                render.adjustImageSize(meta64.currentNode);
            }
            $.each(this.currentNodeData.children, function (i, node) {
                if (node.imgId) {
                    render.adjustImageSize(node);
                }
            });
        }
    };
    Meta64.prototype.orientationHandler = function (event) {
    };
    Meta64.prototype.loadAnonPageHome = function (ignoreUrl) {
        util.json("anonPageLoad", {
            "ignoreUrl": ignoreUrl
        }, this.anonPageLoadResponse, this);
    };
    return Meta64;
}());
if (!window["meta64"]) {
    var meta64 = new Meta64();
}
console.log("running module: nav.js");
var Nav = (function () {
    function Nav() {
        this._UID_ROWID_SUFFIX = "_row";
    }
    Nav.prototype.openMainMenuHelp = function () {
        window.open(window.location.origin + "?id=/meta64/public/help", "_blank");
    };
    Nav.prototype.displayingHome = function () {
        if (meta64.isAnonUser) {
            return meta64.currentNodeId === meta64.anonUserLandingPageNode;
        }
        else {
            return meta64.currentNodeId === meta64.homeNodeId;
        }
    };
    Nav.prototype.parentVisibleToUser = function () {
        return !this.displayingHome();
    };
    Nav.prototype.upLevelResponse = function (res, id) {
        if (!res || !res.node) {
            (new MessageDlg("No data is visible to you above this node.")).open();
        }
        else {
            render.renderPageFromData(res);
            meta64.highlightRowById(id, true);
            meta64.refreshAllGuiEnablement();
        }
    };
    Nav.prototype.navUpLevel = function () {
        if (!this.parentVisibleToUser()) {
            return;
        }
        var ironRes = util.json("renderNode", {
            "nodeId": meta64.currentNodeId,
            "upLevel": 1
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.upLevelResponse(ironRes.response, meta64.currentNodeId);
        });
    };
    Nav.prototype.getSelectedDomElement = function () {
        var currentSelNode = meta64.getHighlightedNode();
        if (currentSelNode) {
            var node = meta64.uidToNodeMap[currentSelNode.uid];
            if (node) {
                console.log("found highlighted node.id=" + node.id);
                var nodeId = node.uid + this._UID_ROWID_SUFFIX;
                return util.domElm(nodeId);
            }
        }
        return null;
    };
    Nav.prototype.getSelectedPolyElement = function () {
        try {
            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {
                var node = meta64.uidToNodeMap[currentSelNode.uid];
                if (node) {
                    console.log("found highlighted node.id=" + node.id);
                    var nodeId = node.uid + this._UID_ROWID_SUFFIX;
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
    Nav.prototype.clickOnNodeRow = function (rowElm, uid) {
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
    Nav.prototype.openNode = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        meta64.highlightNode(node, true);
        if (!node) {
            (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
        }
        else {
            view.refreshTree(node.id, false);
        }
    };
    Nav.prototype.toggleNodeSel = function (uid) {
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
    Nav.prototype.navHomeResponse = function (res) {
        meta64.clearSelectedNodes();
        render.renderPageFromData(res);
        view.scrollToTop();
        meta64.refreshAllGuiEnablement();
    };
    Nav.prototype.navHome = function () {
        if (meta64.isAnonUser) {
            meta64.loadAnonPageHome(true);
        }
        else {
            util.json("renderNode", {
                "nodeId": meta64.homeNodeId
            }, this.navHomeResponse);
        }
    };
    Nav.prototype.navPublicHome = function () {
        meta64.loadAnonPageHome(true);
    };
    Nav.prototype.toggleMainMenu = function () {
    };
    return Nav;
}());
if (!window["nav"]) {
    var nav = new Nav();
}
console.log("running module: prefs.js");
var Prefs = (function () {
    function Prefs() {
    }
    Prefs.prototype.closeAccountResponse = function () {
        $(window).off("beforeunload");
        window.location.href = window.location.origin;
    };
    Prefs.prototype.closeAccount = function () {
        var thiz = this;
        (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function () {
            (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function () {
                user.deleteAllUserCookies();
                util.json("closeAccount", {}, thiz.closeAccountResponse);
            })).open();
        })).open();
    };
    return Prefs;
}());
if (!window["prefs"]) {
    var prefs = new Prefs();
}
console.log("running module: props.js");
var Props = (function () {
    function Props() {
    }
    Props.prototype.propsToggle = function () {
        meta64.showProperties = meta64.showProperties ? false : true;
        render.renderPageFromData();
        view.scrollToSelectedNode();
        meta64.selectTab("mainTabName");
    };
    Props.prototype.deletePropertyFromLocalData = function (propertyName) {
        for (var i = 0; i < edit.editNode.properties.length; i++) {
            if (propertyName === edit.editNode.properties[i].name) {
                edit.editNode.properties.splice(i, 1);
                break;
            }
        }
    };
    Props.prototype.getPropertiesInEditingOrder = function (props) {
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
    Props.prototype.renderProperties = function (properties) {
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
    Props.prototype.getNodeProperty = function (propertyName, node) {
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
    Props.prototype.getNodePropertyVal = function (propertyName, node) {
        var prop = this.getNodeProperty(propertyName, node);
        return prop ? prop.value : null;
    };
    Props.prototype.isNonOwnedNode = function (node) {
        var createdBy = this.getNodePropertyVal(jcrCnst.CREATED_BY, node);
        if (!createdBy) {
            createdBy = "admin";
        }
        return createdBy != meta64.userName;
    };
    Props.prototype.isNonOwnedCommentNode = function (node) {
        var commentBy = this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy != meta64.userName;
    };
    Props.prototype.isOwnedCommentNode = function (node) {
        var commentBy = this.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        return commentBy != null && commentBy == meta64.userName;
    };
    Props.prototype.renderProperty = function (property) {
        if (!property.values) {
            if (!property.value || property.value.length == 0) {
                return "";
            }
            return render.wrapHtml(property.htmlValue);
        }
        else {
            return this.renderPropertyValues(property.values);
        }
    };
    Props.prototype.renderPropertyValues = function (values) {
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
    return Props;
}());
if (!window["props"]) {
    var props = new Props();
}
console.log("running module: render.js");
var Render = (function () {
    function Render() {
        this._debug = false;
    }
    Render.prototype._getEmptyPagePrompt = function () {
        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
    };
    Render.prototype._renderBinary = function (node) {
        if (node.binaryIsImage) {
            return this.makeImageTag(node);
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
    Render.prototype.buidPage = function (pg, data) {
        console.log("buildPage: pg.domId=" + pg.domId);
        if (!pg.built || data) {
            pg.build(data);
            pg.built = true;
        }
        if (pg.init) {
            pg.init(data);
        }
    };
    Render.prototype.buildRowHeader = function (node, showPath, showName) {
        var commentBy = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
        var headerText = "";
        if (cnst.SHOW_PATH_ON_ROWS) {
            headerText += "<div class='path-display'>Path: " + this.formatPath(node) + "</div>";
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
        headerText = this.tag("div", {
            "class": "header-text"
        }, headerText);
        return headerText;
    };
    Render.prototype.injectCodeFormatting = function (content) {
        if (content.contains("<code")) {
            meta64.codeFormatDirty = true;
            content = this.encodeLanguages(content);
            content = content.replaceAll("</code>", "</pre>");
        }
        return content;
    };
    Render.prototype.injectSubstitutions = function (content) {
        return content.replaceAll("{{locationOrigin}}", window.location.origin);
    };
    Render.prototype.encodeLanguages = function (content) {
        var langs = ["js", "html", "htm", "css"];
        for (var i = 0; i < langs.length; i++) {
            content = content.replaceAll("<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
        }
        content = content.replaceAll("<code>", "<pre class='prettyprint'>");
        return content;
    };
    Render.prototype.renderNodeContent = function (node, showPath, showName, renderBinary, rowStyling, showHeader) {
        var ret = this.getTopRightImageTag(node);
        ret += showHeader ? this.buildRowHeader(node, showPath, showName) : "";
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
                        jcrContent = this.injectCodeFormatting(jcrContent);
                        jcrContent = this.injectSubstitutions(jcrContent);
                        if (rowStyling) {
                            ret += this.tag("div", {
                                "class": "jcr-content"
                            }, jcrContent);
                        }
                        else {
                            ret += this.tag("div", {
                                "class": "jcr-root-content"
                            }, "<a href='https://github.com/Clay-Ferguson/meta64'><img src='/fork-me-on-github.png' class='corner-style'/></a>"
                                + jcrContent);
                        }
                    }
                    else {
                        if (rowStyling) {
                            ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                            ret += this.tag("script", {
                                "type": "text/markdown"
                            }, jcrContent);
                        }
                        else {
                            ret += "<marked-element sanitize='true'><div class='markdown-html'>";
                            ret += this.tag("script", {
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
            var binary = this._renderBinary(node);
            if (ret.contains(cnst.INSERT_ATTACHMENT)) {
                ret = ret.replaceAll(cnst.INSERT_ATTACHMENT, binary);
            }
            else {
                ret += binary;
            }
        }
        var tags = props.getNodePropertyVal(jcrCnst.TAGS, node);
        if (tags) {
            ret += this.tag("div", {
                "class": "tags-content"
            }, "Tags: " + tags);
        }
        return ret;
    };
    Render.prototype.renderNodeAsListItem = function (node, index, count, rowCount) {
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
        var buttonBarHtmlRet = this.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
        var bkgStyle = this.getNodeBkgImageStyle(node);
        var cssId = uid + "_row";
        return this.tag("div", {
            "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
            "onClick": "nav.clickOnNodeRow(this, '" + uid + "');",
            "id": cssId,
            "style": bkgStyle
        }, buttonBarHtmlRet + this.tag("div", {
            "id": uid + "_content"
        }, this.renderNodeContent(node, true, true, true, true, true)));
    };
    Render.prototype.showNodeUrl = function () {
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
    Render.prototype.getTopRightImageTag = function (node) {
        var topRightImg = props.getNodePropertyVal('img.top.right', node);
        var topRightImgTag = "";
        if (topRightImg) {
            topRightImgTag = this.tag("img", {
                "src": topRightImg,
                "class": "top-right-image"
            }, "", false);
        }
        return topRightImgTag;
    };
    Render.prototype.getNodeBkgImageStyle = function (node) {
        var bkgImg = props.getNodePropertyVal('img.node.bkg', node);
        var bkgImgStyle = "";
        if (bkgImg) {
            bkgImgStyle = "background-image: url(" + bkgImg + ");";
        }
        return bkgImgStyle;
    };
    Render.prototype.centeredButtonBar = function (buttons, classes) {
        classes = classes || "";
        return this.tag("div", {
            "class": "horizontal center-justified layout " + classes
        }, buttons);
    };
    Render.prototype.buttonBar = function (buttons, classes) {
        classes = classes || "";
        return this.tag("div", {
            "class": "horizontal left-justified layout " + classes
        }, buttons);
    };
    Render.prototype.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
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
            replyButton = this.tag("paper-button", {
                "raised": "raised",
                "onClick": "edit.replyToComment('" + node.uid + "');"
            }, "Reply");
        }
        var buttonCount = 0;
        if (this.nodeHasChildren(node.uid)) {
            buttonCount++;
            openButton = this.tag("paper-button", {
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
            selButton = this.tag("paper-checkbox", css, "");
            if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                buttonCount++;
                createSubNodeButton = this.tag("paper-button", {
                    "id": "addNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + node.uid + "');"
                }, "Add");
            }
            if (cnst.INS_ON_TOOLBAR && !commentBy) {
                buttonCount++;
                insertNodeButton = this.tag("paper-button", {
                    "id": "insertNodeButtonId" + node.uid,
                    "raised": "raised",
                    "onClick": "edit.insertNode('" + node.uid + "');"
                }, "Ins");
            }
        }
        if (meta64.editMode && editingAllowed) {
            buttonCount++;
            editNodeButton = this.tag("paper-button", {
                "raised": "raised",
                "onClick": "edit.runEditNode('" + node.uid + "');"
            }, "Edit");
            if (meta64.currentNode.childrenOrdered && !commentBy) {
                if (canMoveUp) {
                    buttonCount++;
                    moveNodeUpButton = this.tag("paper-button", {
                        "raised": "raised",
                        "onClick": "edit.moveNodeUp('" + node.uid + "');"
                    }, "Up");
                }
                if (canMoveDown) {
                    buttonCount++;
                    moveNodeDownButton = this.tag("paper-button", {
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
        return allButtons.length > 0 ? this.makeHorizontalFieldSet(allButtons) : "";
    };
    Render.prototype.makeHorizontalFieldSet = function (content, extraClasses) {
        return this.tag("div", {
            "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
        }, content, true);
    };
    Render.prototype.makeHorzControlGroup = function (content) {
        return this.tag("div", {
            "class": "horizontal layout"
        }, content, true);
    };
    Render.prototype.makeRadioButton = function (label, id) {
        return this.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    };
    Render.prototype.nodeHasChildren = function (uid) {
        var node = meta64.uidToNodeMap[uid];
        if (!node) {
            console.log("Unknown nodeId in nodeHasChildren: " + uid);
            return false;
        }
        else {
            return node.hasChildren;
        }
    };
    Render.prototype.formatPath = function (node) {
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
    Render.prototype.wrapHtml = function (text) {
        return "<div>" + text + "</div>";
    };
    Render.prototype.renderMainPageControls = function () {
        var html = '';
        var hasContent = html.length > 0;
        if (hasContent) {
            util.setHtmlEnhanced("mainPageControls", html);
        }
        util.setVisibility("#mainPageControls", hasContent);
    };
    Render.prototype.renderPageFromData = function (data) {
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
        this.renderMainPageControls();
        meta64.treeDirty = false;
        if (newData) {
            meta64.uidToNodeMap = {};
            meta64.idToNodeMap = {};
            meta64.selectedNodes = {};
            meta64.initNode(data.node);
            meta64.setCurrentNodeData(data);
        }
        var propCount = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;
        if (this._debug) {
            console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
        }
        var output = '';
        var bkgStyle = this.getNodeBkgImageStyle(data.node);
        var mainNodeContent = this.renderNodeContent(data.node, true, true, true, false, true);
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
                replyButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.replyToComment('" + data.node.uid + "');"
                }, "Reply");
            }
            if (meta64.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                createSubNodeButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.createSubNode('" + uid + "');"
                }, "Add");
            }
            if (edit.isEditAllowed(data.node)) {
                editNodeButton = this.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "edit.runEditNode('" + uid + "');"
                }, "Edit");
            }
            var focusNode = meta64.getHighlightedNode();
            var selected = focusNode && focusNode.uid === uid;
            if (createSubNodeButton || editNodeButton || replyButton) {
                buttonBar = this.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
            }
            var content = this.tag("div", {
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
        this.renderMainPageControls();
        var rowCount = 0;
        if (data.children) {
            var childCount = data.children.length;
            var rowCount = 0;
            for (var i = 0; i < data.children.length; i++) {
                var node = data.children[i];
                var row = this.generateRow(i, node, newData, childCount, rowCount);
                if (row.length != 0) {
                    output += row;
                    rowCount++;
                }
            }
        }
        if (edit.isInsertAllowed(data.node)) {
            if (rowCount == 0 && !meta64.isAnonUser) {
                output = this._getEmptyPagePrompt();
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
    Render.prototype.generateRow = function (i, node, newData, childCount, rowCount) {
        if (meta64.isNodeBlackListed(node))
            return "";
        if (newData) {
            meta64.initNode(node);
            if (this._debug) {
                console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
            }
        }
        rowCount++;
        var row = this.renderNodeAsListItem(node, i, childCount, rowCount);
        return row;
    };
    Render.prototype.getUrlForNodeAttachment = function (node) {
        return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
    };
    Render.prototype.adjustImageSize = function (node) {
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
    Render.prototype.makeImageTag = function (node) {
        var src = this.getUrlForNodeAttachment(node);
        node.imgId = "imgUid_" + node.uid;
        if (node.width && node.height) {
            if (node.width > meta64.deviceWidth - 50) {
                var width = meta64.deviceWidth - 50;
                var height = width * node.height / node.width;
                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": width + "px",
                    "height": height + "px"
                }, null, false);
            }
            else {
                return this.tag("img", {
                    "src": src,
                    "id": node.imgId,
                    "width": node.width + "px",
                    "height": node.height + "px"
                }, null, false);
            }
        }
        else {
            return this.tag("img", {
                "src": src,
                "id": node.imgId
            }, null, false);
        }
    };
    Render.prototype.tag = function (tag, attributes, content, closeTag) {
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
    Render.prototype.makeTextArea = function (fieldName, fieldId) {
        return this.tag("paper-textarea", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makeEditField = function (fieldName, fieldId) {
        return this.tag("paper-input", {
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makePasswordField = function (fieldName, fieldId) {
        return this.tag("paper-input", {
            "type": "password",
            "name": fieldId,
            "label": fieldName,
            "id": fieldId
        }, "", true);
    };
    Render.prototype.makeButton = function (text, id, callback) {
        var attribs = {
            "raised": "raised",
            "id": id
        };
        if (callback != undefined) {
            attribs["onClick"] = callback;
        }
        return this.tag("paper-button", attribs, text, true);
    };
    Render.prototype.makeBackButton = function (text, id, domId, callback) {
        if (callback === undefined) {
            callback = "";
        }
        return this.tag("paper-button", {
            "raised": "raised",
            "id": id,
            "onClick": "meta64.cancelDialog('" + domId + "');" + callback
        }, text, true);
    };
    Render.prototype.allowPropertyToDisplay = function (propName) {
        if (!meta64.inSimpleMode())
            return true;
        return meta64.simpleModePropertyBlackList[propName] == null;
    };
    Render.prototype.isReadOnlyProperty = function (propName) {
        return meta64.readOnlyPropertyList[propName];
    };
    Render.prototype.isBinaryProperty = function (propName) {
        return meta64.binaryPropertyList[propName];
    };
    Render.prototype.sanitizePropertyName = function (propName) {
        if (meta64.editModeOption === "simple") {
            return propName === jcrCnst.CONTENT ? "Content" : propName;
        }
        else {
            return propName;
        }
    };
    return Render;
}());
if (!window["render"]) {
    var render = new Render();
}
console.log("running module: search.js");
var Srch = (function () {
    function Srch() {
        this._UID_ROWID_SUFFIX = "_srch_row";
        this.searchNodes = null;
        this.searchPageTitle = "Search Results";
        this.timelinePageTitle = "Timeline";
        this.searchResults = null;
        this.timelineResults = null;
        this.highlightRowNode = null;
        this.identToUidMap = {};
        this.uidToNodeMap = {};
    }
    Srch.prototype.numSearchResults = function () {
        return srch.searchResults != null &&
            srch.searchResults.searchResults != null &&
            srch.searchResults.searchResults.length != null ?
            srch.searchResults.searchResults.length : 0;
    };
    Srch.prototype.searchTabActivated = function () {
        if (this.numSearchResults() == 0 && !meta64.isAnonUser) {
            (new SearchDlg()).open();
        }
    };
    Srch.prototype.searchNodesResponse = function (res) {
        this.searchResults = res;
        var content = searchResultsPanel.build();
        util.setHtmlEnhanced("searchResultsPanel", content);
        searchResultsPanel.init();
        meta64.changePage(searchResultsPanel);
    };
    Srch.prototype.timelineResponse = function (res) {
        this.timelineResults = res;
        var content = timelineResultsPanel.build();
        util.setHtmlEnhanced("timelineResultsPanel", content);
        timelineResultsPanel.init();
        meta64.changePage(timelineResultsPanel);
    };
    Srch.prototype.timeline = function () {
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
        }, this.timelineResponse);
    };
    Srch.prototype.initSearchNode = function (node) {
        node.uid = util.getUidForId(this.identToUidMap, node.id);
        this.uidToNodeMap[node.uid] = node;
    };
    Srch.prototype.populateSearchResultsPage = function (data, viewName) {
        var output = '';
        var childCount = data.searchResults.length;
        var rowCount = 0;
        var thiz = this;
        $.each(data.searchResults, function (i, node) {
            if (meta64.isNodeBlackListed(node))
                return;
            thiz.initSearchNode(node);
            rowCount++;
            output += thiz.renderSearchResultAsListItem(node, i, childCount, rowCount);
        });
        util.setHtmlEnhanced(viewName, output);
    };
    Srch.prototype.renderSearchResultAsListItem = function (node, index, count, rowCount) {
        var uid = node.uid;
        console.log("renderSearchResult: " + uid);
        var cssId = uid + this._UID_ROWID_SUFFIX;
        var buttonBarHtml = this.makeButtonBarHtml("" + uid);
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
    Srch.prototype.makeButtonBarHtml = function (uid) {
        var gotoButton = render.makeButton("Go to Node", uid, "srch.clickSearchNode('" + uid + "');");
        return render.makeHorizontalFieldSet(gotoButton);
    };
    Srch.prototype.clickOnSearchResultRow = function (rowElm, uid) {
        this.unhighlightRow();
        this.highlightRowNode = this.uidToNodeMap[uid];
        util.changeOrAddClass(rowElm, "inactive-row", "active-row");
    };
    Srch.prototype.clickSearchNode = function (uid) {
        srch.highlightRowNode = srch.uidToNodeMap[uid];
        view.refreshTree(srch.highlightRowNode.id, true);
        meta64.selectTab("mainTabName");
    };
    Srch.prototype.unhighlightRow = function () {
        if (!this.highlightRowNode) {
            return;
        }
        var nodeId = this.highlightRowNode.uid + this._UID_ROWID_SUFFIX;
        var elm = util.domElm(nodeId);
        if (elm) {
            util.changeOrAddClass(elm, "active-row", "inactive-row");
        }
    };
    return Srch;
}());
if (!window["srch"]) {
    var srch = new Srch();
}
console.log("running module: user.js");
var Share = (function () {
    function Share() {
        this.sharingNode = null;
    }
    Share.prototype._findSharedNodesResponse = function (res) {
        srch.searchNodesResponse(res);
    };
    Share.prototype.editNodeSharing = function () {
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("No node is selected.")).open();
            return;
        }
        this.sharingNode = node;
        (new SharingDlg()).open();
    };
    Share.prototype.findSharedNodes = function () {
        var focusNode = meta64.getHighlightedNode();
        if (focusNode == null) {
            return;
        }
        srch.searchPageTitle = "Shared Nodes";
        util.json("getSharedNodes", {
            "nodeId": focusNode.id
        }, this._findSharedNodesResponse, this);
    };
    return Share;
}());
if (!window["share"]) {
    var share = new Share();
}
console.log("running module: user.js");
var User = (function () {
    function User() {
    }
    User.prototype._refreshLoginResponse = function (res) {
        console.log("refreshLoginResponse");
        if (res.success) {
            user.setStateVarsUsingLoginResponse(res);
            user.setTitleUsingLoginResponse(res);
        }
        meta64.loadAnonPageHome(false);
    };
    User.prototype._logoutResponse = function (res) {
        window.location.href = window.location.origin;
    };
    User.prototype._twitterLoginResponse = function (res) {
        console.log("twitter Login response recieved.");
    };
    User.prototype.isTestUserAccount = function () {
        return meta64.userName.toLowerCase() === "adam" ||
            meta64.userName.toLowerCase() === "bob" ||
            meta64.userName.toLowerCase() === "cory" ||
            meta64.userName.toLowerCase() === "dan";
    };
    User.prototype.setTitleUsingLoginResponse = function (res) {
        var title = BRANDING_TITLE;
        if (!meta64.isAnonUser) {
            title += " - " + res.userName;
        }
        $("#headerAppName").html(title);
    };
    User.prototype.setStateVarsUsingLoginResponse = function (res) {
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
    User.prototype.twitterLogin = function () {
        (new MessageDlg("not yet implemented.")).open();
        return;
    };
    User.prototype.openSignupPg = function () {
        (new SignupDlg()).open();
    };
    User.prototype.writeCookie = function (name, val) {
        $.cookie(name, val, {
            expires: 365,
            path: '/'
        });
    };
    User.prototype.openLoginPg = function () {
        var loginDlg = new LoginDlg();
        loginDlg.populateFromCookies();
        loginDlg.open();
    };
    User.prototype.refreshLogin = function () {
        console.log("refreshLogin.");
        var thiz = this;
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
    User.prototype.logout = function (updateLoginStateCookie) {
        if (meta64.isAnonUser) {
            return;
        }
        $(window).off("beforeunload");
        if (updateLoginStateCookie) {
            this.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
        }
        util.json("logout", {}, this._logoutResponse, this);
    };
    User.prototype.login = function (loginDlg, usr, pwd) {
        var thiz = this;
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
    User.prototype.deleteAllUserCookies = function () {
        $.removeCookie(cnst.COOKIE_LOGIN_USR);
        $.removeCookie(cnst.COOKIE_LOGIN_PWD);
        $.removeCookie(cnst.COOKIE_LOGIN_STATE);
    };
    User.prototype.loginResponse = function (res, usr, pwd, usingCookies, loginDlg) {
        if (util.checkSuccess("Login", res)) {
            console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);
            if (usr != "anonymous") {
                this.writeCookie(cnst.COOKIE_LOGIN_USR, usr);
                this.writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                this.writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
            }
            if (loginDlg) {
                loginDlg.cancel();
            }
            this.setStateVarsUsingLoginResponse(res);
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
            this.setTitleUsingLoginResponse(res);
        }
        else {
            if (usingCookies) {
                (new MessageDlg("Cookie login failed.")).open();
                $.removeCookie(cnst.COOKIE_LOGIN_USR);
                $.removeCookie(cnst.COOKIE_LOGIN_PWD);
                this.writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
                location.reload();
            }
        }
    };
    return User;
}());
if (!window["user"]) {
    var user = new User();
}
console.log("running module: view.js");
var View = (function () {
    function View() {
        this.scrollToSelNodePending = false;
    }
    View.prototype.updateStatusBar = function () {
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
    View.prototype.refreshTreeResponse = function (res, targetId, renderParentIfLeaf, newId) {
        render.renderPageFromData(res);
        if (newId) {
            meta64.highlightRowById(newId, true);
        }
        else {
            if (targetId && renderParentIfLeaf && res.displayedParent) {
                meta64.highlightRowById(targetId, true);
            }
            else {
                this.scrollToSelectedNode();
            }
        }
        meta64.refreshAllGuiEnablement();
    };
    View.prototype.refreshTree = function (nodeId, renderParentIfLeaf, newId) {
        if (!nodeId) {
            nodeId = meta64.currentNodeId;
        }
        console.log("Refreshing tree: nodeId=" + nodeId);
        var ironRes = util.json("renderNode", {
            "nodeId": nodeId,
            "renderParentIfLeaf": renderParentIfLeaf ? true : false
        });
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.refreshTreeResponse(ironRes.response, nodeId, renderParentIfLeaf, newId);
        });
    };
    View.prototype.scrollToSelectedNode = function () {
        this.scrollToSelNodePending = true;
        var thiz = this;
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
    View.prototype.scrollToTop = function () {
        if (this.scrollToSelNodePending)
            return;
        var thiz = this;
        setTimeout(function () {
            if (thiz.scrollToSelNodePending)
                return;
            var elm = util.polyElm("mainPaperTabs");
            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                elm.node.scrollIntoView();
            }
        }, 1000);
    };
    View.prototype.initEditPathDisplayById = function (domId) {
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
    View.prototype.showServerInfo = function () {
        var ironRes = util.json("getServerInfo", {});
        ironRes.completes.then(function () {
            (new MessageDlg(ironRes.response.serverInfo)).open();
        });
    };
    return View;
}());
if (!window["view"]) {
    var view = new View();
}
console.log("running module: menuPanel.js");
var MenuPanel = (function () {
    function MenuPanel() {
        this.domId = "mainNavBar";
    }
    MenuPanel.prototype._makeTopLevelMenu = function (title, content) {
        return render.tag("paper-submenu", {
            "class": "meta64-menu-heading"
        }, "<paper-item class='menu-trigger'>" + title + "</paper-item>" +
            this._makeSecondLevelList(content), true);
    };
    MenuPanel.prototype._makeSecondLevelList = function (content) {
        return render.tag("paper-menu", {
            "class": "menu-content my-menu-section",
            "multi": "multi"
        }, content, true);
    };
    MenuPanel.prototype._menuItem = function (name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    };
    MenuPanel.prototype._menuToggleItem = function (name, id, onClick) {
        return render.tag("paper-item", {
            "id": id,
            "onclick": onClick
        }, name, true);
    };
    MenuPanel.prototype.build = function () {
        var editMenuItems = this._menuItem("Move", "moveSelNodesButton", "edit.moveSelNodes();") +
            this._menuItem("Finish Moving", "finishMovingSelNodesButton", "edit.finishMovingSelNodes();") +
            this._menuItem("Rename", "renameNodePgButton", "(new RenameNodeDlg()).open();") +
            this._menuItem("Delete", "deleteSelNodesButton", "edit.deleteSelNodes();") +
            this._menuItem("Clear Selections", "clearSelectionsButton", "edit.clearSelections();") +
            this._menuItem("Import", "openImportDlg", "(new ImportDlg()).open();") +
            this._menuItem("Export", "openExportDlg", "(new ExportDlg()).open();");
        var editMenu = this._makeTopLevelMenu("Edit", editMenuItems);
        var attachmentMenuItems = this._menuItem("Upload from File", "uploadFromFileButton", "attachment.openUploadFromFileDlg();") +
            this._menuItem("Upload from URL", "uploadFromUrlButton", "attachment.openUploadFromUrlDlg();") +
            this._menuItem("Delete Attachment", "deleteAttachmentsButton", "attachment.deleteAttachment();");
        var attachmentMenu = this._makeTopLevelMenu("Attach", attachmentMenuItems);
        var sharingMenuItems = this._menuItem("Edit Node Sharing", "editNodeSharingButton", "share.editNodeSharing();") +
            this._menuItem("Find Shared Subnodes", "findSharedNodesButton", "share.findSharedNodes();");
        var sharingMenu = this._makeTopLevelMenu("Share", sharingMenuItems);
        var searchMenuItems = this._menuItem("Text Search", "searchDlgButton", "(new SearchDlg()).open();") +
            this._menuItem("Timeline", "timelineButton", "srch.timeline();");
        var searchMenu = this._makeTopLevelMenu("Search", searchMenuItems);
        var viewOptionsMenuItems = this._menuItem("Toggle Properties", "propsToggleButton", "props.propsToggle();") +
            this._menuItem("Refresh", "refreshPageButton", "meta64.refresh();") +
            this._menuItem("Show URL", "showFullNodeUrlButton", "render.showNodeUrl();") +
            this._menuItem("Server Info", "showServerInfoButton", "view.showServerInfo();");
        var viewOptionsMenu = this._makeTopLevelMenu("View", viewOptionsMenuItems);
        var myAccountItems = this._menuItem("Change Password", "changePasswordPgButton", "(new ChangePasswordDlg()).open();") +
            this._menuItem("Preferences", "accountPreferencesButton", "(new PrefsDlg()).open();") +
            this._menuItem("Manage Account", "manageAccountButton", "(new ManageAccountDlg()).open();") +
            this._menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", " edit.insertBookWarAndPeace();");
        var myAccountMenu = this._makeTopLevelMenu("Account", myAccountItems);
        var helpItems = this._menuItem("Main Menu Help", "mainMenuHelp", "nav.openMainMenuHelp();");
        var mainMenuHelp = this._makeTopLevelMenu("Help/Docs", helpItems);
        var content = editMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + myAccountMenu
            + mainMenuHelp;
        util.setHtmlEnhanced(this.domId, content);
    };
    MenuPanel.prototype.init = function () {
        meta64.refreshAllGuiEnablement();
    };
    return MenuPanel;
}());
if (!window["menuPanel"]) {
    var menuPanel = new MenuPanel();
}
console.log("running module: DialogBase.js");
var DialogBase = (function () {
    function DialogBase(domId) {
        this.domId = domId;
        this.data = {};
        meta64.registerDataObject(this);
        meta64.registerDataObject(this.data);
    }
    DialogBase.prototype.init = function () {
    };
    DialogBase.prototype.open = function () {
        var modalsContainer = util.polyElm("modalsContainer");
        var id = this.id(this.domId);
        var node = document.createElement("paper-dialog");
        node.setAttribute("id", id);
        modalsContainer.node.appendChild(node);
        node.style.border = "3px solid gray";
        Polymer.dom.flush();
        Polymer.updateStyles();
        var content = this.build();
        util.setHtmlEnhanced(id, content);
        this.built = true;
        if (this.init) {
            this.init();
        }
        console.log("Showing dialog: " + id);
        var polyElm = util.polyElm(id);
        polyElm.node.refit();
        polyElm.node.constrain();
        polyElm.node.center();
        polyElm.node.open();
    };
    DialogBase.prototype.cancel = function () {
        var polyElm = util.polyElm(this.id(this.domId));
        polyElm.node.cancel();
    };
    DialogBase.prototype.id = function (id) {
        if (id == null)
            return null;
        if (id.contains("_dlgId")) {
            return id;
        }
        return id + "_dlgId" + this.data.guid;
    };
    DialogBase.prototype.makePasswordField = function (text, id) {
        return render.makePasswordField(text, this.id(id));
    };
    DialogBase.prototype.makeEditField = function (fieldName, id) {
        id = this.id(id);
        return render.tag("paper-input", {
            "name": id,
            "label": fieldName,
            "id": id
        }, "", true);
    };
    DialogBase.prototype.makeMessageArea = function (message, id) {
        var attrs = {
            "class": "dialog-message"
        };
        if (id) {
            attrs["id"] = this.id(id);
        }
        return render.tag("p", attrs, message);
    };
    DialogBase.prototype.makeButton = function (text, id, callback, ctx) {
        var attribs = {
            "raised": "raised",
            "id": this.id(id)
        };
        if (callback != undefined) {
            attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
        }
        return render.tag("paper-button", attribs, text, true);
    };
    DialogBase.prototype.makeCloseButton = function (text, id, callback, ctx) {
        var attribs = {
            "raised": "raised",
            "dialog-confirm": "dialog-confirm",
            "id": this.id(id)
        };
        if (callback != undefined) {
            attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
        }
        return render.tag("paper-button", attribs, text, true);
    };
    DialogBase.prototype.bindEnterKey = function (id, callback) {
        util.bindEnterKey(this.id(id), callback);
    };
    DialogBase.prototype.setInputVal = function (id, val) {
        if (!val) {
            val = "";
        }
        util.setInputVal(this.id(id), val);
    };
    DialogBase.prototype.getInputVal = function (id) {
        return util.getInputVal(this.id(id)).trim();
    };
    DialogBase.prototype.setHtml = function (text, id) {
        util.setHtml(this.id(id), text);
    };
    DialogBase.prototype.makeRadioButton = function (label, id) {
        id = this.id(id);
        return render.tag("paper-radio-button", {
            "id": id,
            "name": id
        }, label);
    };
    DialogBase.prototype.makeHeader = function (text, id, centered) {
        var attrs = {
            "class": "dialog-header " + (centered ? "horizontal center-justified layout" : "")
        };
        if (id) {
            attrs["id"] = this.id(id);
        }
        return render.tag("h2", attrs, text);
    };
    DialogBase.prototype.focus = function (id) {
        if (!id.startsWith("#")) {
            id = "#" + id;
        }
        id = this.id(id);
        setTimeout(function () {
            $(id).focus();
        }, 1000);
    };
    return DialogBase;
}());
console.log("running module: ConfirmDlg.js");
var ConfirmDlg = (function (_super) {
    __extends(ConfirmDlg, _super);
    function ConfirmDlg(title, message, buttonText, callback) {
        _super.call(this, "ConfirmDlg");
        this.title = title;
        this.message = message;
        this.buttonText = buttonText;
        this.callback = callback;
    }
    ConfirmDlg.prototype.build = function () {
        var content = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");
        var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.callback)
            + this.makeCloseButton("No", "ConfirmDlgNoButton");
        content += render.centeredButtonBar(buttons);
        return content;
    };
    ConfirmDlg.prototype.init = function () {
        this.setHtml(this.title, "ConfirmDlgTitle");
        this.setHtml(this.message, "ConfirmDlgMessage");
        this.setHtml(this.buttonText, "ConfirmDlgYesButton");
    };
    return ConfirmDlg;
}(DialogBase));
console.log("running module: ProgressDlg.js");
var ProgressDlg = (function (_super) {
    __extends(ProgressDlg, _super);
    function ProgressDlg() {
        _super.call(this, "ProgressDlg");
    }
    ProgressDlg.prototype.build = function () {
        var header = this.makeHeader("Processing Request", "", true);
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
    return ProgressDlg;
}(DialogBase));
console.log("running module: MessageDlg.js");
var MessageDlg = (function (_super) {
    __extends(MessageDlg, _super);
    function MessageDlg(message, title, callback) {
        _super.call(this, "MessageDlg");
        this.message = message;
        this.title = title;
        this.callback = callback;
        if (this.title == null) {
            this.title = "Message";
        }
        this.title = title;
    }
    MessageDlg.prototype.build = function () {
        var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
        content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
        return content;
    };
    return MessageDlg;
}(DialogBase));
console.log("running module: LoginDlg.js");
var LoginDlg = (function (_super) {
    __extends(LoginDlg, _super);
    function LoginDlg() {
        _super.call(this, "LoginDlg");
    }
    LoginDlg.prototype.build = function () {
        var header = this.makeHeader("Login");
        var formControls = this.makeEditField("User", "userName") +
            this.makePasswordField("Password", "password");
        var loginButton = this.makeButton("Login", "loginButton", this.login, this);
        var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", this.resetPassword, this);
        var backButton = this.makeCloseButton("Close", "cancelLoginButton");
        var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
        var twitterButton = this.makeButton("Twitter", "twitterLoginButton", "user.twitterLogin();");
        var socialButtonBar = render.makeHorzControlGroup(twitterButton);
        var divider = "<div><h3>Or Login With...</h3></div>";
        var form = formControls + buttonBar;
        var mainContent = form;
        var content = header + mainContent;
        this.bindEnterKey("userName", user.login);
        this.bindEnterKey("password", user.login);
        return content;
    };
    LoginDlg.prototype.init = function () {
        this.populateFromCookies();
    };
    LoginDlg.prototype.populateFromCookies = function () {
        var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
        var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);
        if (usr) {
            this.setInputVal("userName", usr);
        }
        if (pwd) {
            this.setInputVal("password", pwd);
        }
    };
    LoginDlg.prototype.login = function () {
        var usr = this.getInputVal("userName");
        var pwd = this.getInputVal("password");
        user.login(this, usr, pwd);
    };
    LoginDlg.prototype.resetPassword = function () {
        var thiz = this;
        var usr = this.getInputVal("userName");
        (new ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
            thiz.cancel();
            (new ResetPasswordDlg(usr)).open();
        })).open();
    };
    return LoginDlg;
}(DialogBase));
console.log("running module: SignupDlg.js");
var SignupDlg = (function (_super) {
    __extends(SignupDlg, _super);
    function SignupDlg() {
        _super.call(this, "SignupDlg");
    }
    SignupDlg.prototype.build = function () {
        var header = this.makeHeader(BRANDING_TITLE + " Signup");
        var formControls = this.makeEditField("User", "signupUserName") +
            this.makePasswordField("Password", "signupPassword") +
            this.makeEditField("Email", "signupEmail") +
            this.makeEditField("Captcha", "signupCaptcha");
        var captchaImage = render.tag("div", {
            "class": "captcha-image"
        }, render.tag("img", {
            "id": this.id("captchaImage"),
            "class": "captcha",
            "src": ""
        }, "", false));
        var signupButton = this.makeButton("Signup", "signupButton", this.signup, this);
        var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton", this.tryAnotherCaptcha, this);
        var backButton = this.makeCloseButton("Close", "cancelSignupButton");
        var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);
        return header + formControls + captchaImage + buttonBar;
    };
    SignupDlg.prototype.signup = function () {
        var userName = this.getInputVal("signupUserName");
        var password = this.getInputVal("signupPassword");
        var email = this.getInputVal("signupEmail");
        var captcha = this.getInputVal("signupCaptcha");
        if (util.anyEmpty(userName, password, email, captcha)) {
            (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
            return;
        }
        util.json("signup", {
            "useName": userName,
            "pasword": password,
            "mail": email,
            "catcha": captcha
        }, this.signupResponse, this);
    };
    SignupDlg.prototype.signupResponse = function (res) {
        if (util.checkSuccess("Signup new user", res)) {
            this.cancel();
            (new MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
        }
    };
    SignupDlg.prototype.tryAnotherCaptcha = function () {
        var n = util.currentTimeMillis();
        var src = postTargetUrl + "captcha?t=" + n;
        $("#" + this.id("captchaImage")).attr("src", src);
    };
    SignupDlg.prototype.pageInitSignupPg = function () {
        this.tryAnotherCaptcha();
    };
    SignupDlg.prototype.init = function () {
        this.pageInitSignupPg();
        util.delayedFocus("#" + this.id("signupUserName"));
    };
    return SignupDlg;
}(DialogBase));
console.log("running module: PrefsDlg.js");
var PrefsDlg = (function (_super) {
    __extends(PrefsDlg, _super);
    function PrefsDlg() {
        _super.call(this, "PrefsDlg");
    }
    PrefsDlg.prototype.build = function () {
        var header = this.makeHeader("Account Peferences");
        var radioButtons = this.makeRadioButton("Simple", "editModeSimple") +
            this.makeRadioButton("Advanced", "editModeAdvanced");
        var radioButtonGroup = render.tag("paper-radio-group", {
            "id": this.id("simpleModeRadioGroup"),
            "selected": this.id("editModeSimple")
        }, radioButtons);
        var formControls = radioButtonGroup;
        var legend = "<legend>Edit Mode:</legend>";
        var radioBar = render.makeHorzControlGroup(legend + formControls);
        var saveButton = this.makeCloseButton("Save", "savePreferencesButton", this.savePreferences, this);
        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var buttonBar = render.centeredButtonBar(saveButton + backButton);
        return header + radioBar + buttonBar;
    };
    PrefsDlg.prototype.savePreferences = function () {
        var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE
            : meta64.MODE_ADVANCED;
        util.json("saveUserPreferences", {
            "userPreferences": {
                "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED
            }
        }, this.savePreferencesResponse, this);
    };
    PrefsDlg.prototype.savePreferencesResponse = function (res) {
        if (util.checkSuccess("Saving Preferences", res)) {
            meta64.selectTab("mainTabName");
            meta64.refresh();
        }
    };
    PrefsDlg.prototype.init = function () {
        var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
        polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this
            .id("editModeAdvanced"));
        Polymer.dom.flush();
    };
    return PrefsDlg;
}(DialogBase));
console.log("running module: ManageAccountDlg.js");
var ManageAccountDlg = (function (_super) {
    __extends(ManageAccountDlg, _super);
    function ManageAccountDlg() {
        _super.call(this, "ManageAccountDlg");
    }
    ManageAccountDlg.prototype.build = function () {
        var header = this.makeHeader("Manage Account");
        var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
        var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
        var buttonBar = render.centeredButtonBar(closeAccountButton);
        var bottomButtonBar = render.centeredButtonBar(backButton);
        var bottomButtonBarDiv = render.tag("div", {
            "class": "close-account-bar"
        }, bottomButtonBar);
        return header + buttonBar + bottomButtonBarDiv;
    };
    return ManageAccountDlg;
}(DialogBase));
console.log("running module: ExportDlg.js");
var ExportDlg = (function (_super) {
    __extends(ExportDlg, _super);
    function ExportDlg() {
        _super.call(this, "ExportDlg");
    }
    ExportDlg.prototype.build = function () {
        var header = this.makeHeader("Export to XML");
        var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");
        var exportButton = this.makeButton("Export", "exportNodesButton", this.exportNodes, this);
        var backButton = this.makeCloseButton("Close", "cancelExportButton");
        var buttonBar = render.centeredButtonBar(exportButton + backButton);
        return header + formControls + buttonBar;
    };
    ExportDlg.prototype.exportNodes = function () {
        var highlightNode = meta64.getHighlightedNode();
        var targetFileName = this.getInputVal("exportTargetNodeName");
        if (util.emptyString(targetFileName)) {
            (new MessageDlg("Please enter a name for the export file.")).open();
            return;
        }
        if (highlightNode) {
            util.json("exportToXml", {
                "nodeId": highlightNode.id,
                "targetFileName": targetFileName
            }, this.exportResponse, this);
        }
    };
    ExportDlg.prototype.exportResponse = function (res) {
        if (util.checkSuccess("Export", res)) {
            (new MessageDlg("Export Successful.")).open();
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    return ExportDlg;
}(DialogBase));
console.log("running module: ImportDlg.js");
var ImportDlg = (function (_super) {
    __extends(ImportDlg, _super);
    function ImportDlg() {
        _super.call(this, "ImportDlg");
    }
    ImportDlg.prototype.build = function () {
        var header = this.makeHeader("Import from XML");
        var formControls = this.makeEditField("Import Target Node Name", "importTargetNodeName");
        var importButton = this.makeButton("Import", "importNodesButton", this.importNodes, this);
        var backButton = this.makeCloseButton("Close", "cancelImportButton");
        var buttonBar = render.centeredButtonBar(importButton + backButton);
        return header + formControls + buttonBar;
    };
    ImportDlg.prototype.importNodes = function () {
        var highlightNode = meta64.getHighlightedNode();
        var sourceFileName = this.getInputVal("importTargetNodeName");
        if (util.emptyString(sourceFileName)) {
            (new MessageDlg("Please enter a name for the import file.")).open();
            return;
        }
        if (highlightNode) {
            util.json("import", {
                "nodeId": highlightNode.id,
                "sourceFileName": sourceFileName
            }, this.importResponse, this);
        }
    };
    ImportDlg.prototype.importResponse = function (res) {
        if (util.checkSuccess("Import", res)) {
            (new MessageDlg("Import Successful.")).open();
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }
    };
    return ImportDlg;
}(DialogBase));
console.log("running module: SearchDlg.js");
var SearchDlg = (function (_super) {
    __extends(SearchDlg, _super);
    function SearchDlg() {
        _super.call(this, "SearchDlg");
    }
    SearchDlg.prototype.build = function () {
        var header = this.makeHeader("Search");
        var instructions = this.makeMessageArea("Enter some text to find. All sub-nodes under the selected node are included in the search.");
        var formControls = this.makeEditField("Search", "searchText");
        var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes, this);
        var searchTagsButton = this.makeCloseButton("Search Tags", "searchTagsButton", this.searchTags, this);
        var backButton = this.makeCloseButton("Close", "cancelSearchButton");
        var buttonBar = render.centeredButtonBar(searchButton + searchTagsButton + backButton);
        var content = header + instructions + formControls + buttonBar;
        this.bindEnterKey("searchText", srch.searchNodes);
        return content;
    };
    SearchDlg.prototype.searchNodes = function () {
        return this.searchProperty("jcr:content");
    };
    SearchDlg.prototype.searchTags = function () {
        return this.searchProperty(jcrCnst.TAGS);
    };
    SearchDlg.prototype.searchProperty = function (searchProp) {
        if (!util.ajaxReady("searchNodes")) {
            return;
        }
        var node = meta64.getHighlightedNode();
        if (!node) {
            (new MessageDlg("No node is selected to search under.")).open();
            return;
        }
        var searchText = this.getInputVal("searchText");
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
    SearchDlg.prototype.init = function () {
        util.delayedFocus(this.id("searchText"));
    };
    return SearchDlg;
}(DialogBase));
console.log("running module: ChangePasswordDlg.js");
var ChangePasswordDlg = (function (_super) {
    __extends(ChangePasswordDlg, _super);
    function ChangePasswordDlg(passCode) {
        _super.call(this, "ChangePasswordDlg");
        this.passCode = passCode;
    }
    ChangePasswordDlg.prototype.build = function () {
        var header = this.makeHeader(this.passCode ? "Password Reset" : "Change Password");
        var message = render.tag("p", {}, "Enter your new password below...");
        var formControls = this.makePasswordField("New Password", "changePassword1");
        var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton", this.changePassword, this);
        var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");
        var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);
        return header + message + formControls + buttonBar;
    };
    ChangePasswordDlg.prototype.changePassword = function () {
        this.pwd = this.getInputVal("changePassword1").trim();
        if (this.pwd && this.pwd.length >= 4) {
            util.json("changePassword", {
                "newPassword": this.pwd,
                "passCode": this.passCode
            }, this.changePasswordResponse, this);
        }
        else {
            (new MessageDlg("Invalid password(s).")).open();
        }
    };
    ChangePasswordDlg.prototype.changePasswordResponse = function (res) {
        if (util.checkSuccess("Change password", res)) {
            var msg = "Password changed successfully.";
            if (this.passCode) {
                msg += "<p>You may now login as <b>" + res.user
                    + "</b> with your new password.";
            }
            var thiz = this;
            (new MessageDlg(msg, "Password Change", function () {
                if (thiz.passCode) {
                    window.location.href = window.location.origin;
                }
            })).open();
        }
    };
    ChangePasswordDlg.prototype.init = function () {
        this.focus("changePassword1");
    };
    return ChangePasswordDlg;
}(DialogBase));
console.log("running module: ResetPasswordDlg.js");
var ResetPasswordDlg = (function (_super) {
    __extends(ResetPasswordDlg, _super);
    function ResetPasswordDlg(user) {
        _super.call(this, "ResetPasswordDlg");
        this.user = user;
    }
    ResetPasswordDlg.prototype.build = function () {
        var header = this.makeHeader("Reset Password");
        var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");
        var formControls = this.makeEditField("User", "userName") +
            this.makeEditField("Email Address", "emailAddress");
        var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton", this.resetPassword, this);
        var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");
        var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);
        return header + message + formControls + buttonBar;
    };
    ResetPasswordDlg.prototype.resetPassword = function () {
        var userName = this.getInputVal("userName").trim();
        var emailAddress = this.getInputVal("emailAddress").trim();
        if (userName && emailAddress) {
            util.json("resetPassword", {
                "user": userName,
                "email": emailAddress
            }, this.resetPasswordResponse, this);
        }
        else {
            (new MessageDlg("Oops. Try that again.")).open();
        }
    };
    ResetPasswordDlg.prototype.resetPasswordResponse = function (res) {
        if (util.checkSuccess("Reset password", res)) {
            (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
        }
    };
    ResetPasswordDlg.prototype.init = function () {
        if (this.user) {
            this.setInputVal("userName", this.user);
        }
    };
    return ResetPasswordDlg;
}(DialogBase));
console.log("running module: UploadFromFileDlg.js");
var UploadFromFileDlg = (function (_super) {
    __extends(UploadFromFileDlg, _super);
    function UploadFromFileDlg() {
        _super.call(this, "UploadFromFileDlg");
    }
    UploadFromFileDlg.prototype.build = function () {
        var header = this.makeHeader("Upload File Attachment");
        var uploadPathDisplay = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += render.tag("div", {
                "id": this.id("uploadPathDisplay"),
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
            "id": this.id("uploadFormNodeId"),
            "type": "hidden",
            "name": "nodeId"
        }, "", true);
        var form = render.tag("form", {
            "id": this.id("uploadForm"),
            "method": "POST",
            "enctype": "multipart/form-data",
            "data-ajax": "false"
        }, formFields);
        uploadFieldContainer = render.tag("div", {
            "id": this.id("uploadFieldContainer")
        }, "<p>Upload from your computer</p>" + form);
        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");
        var buttonBar = render.centeredButtonBar(uploadButton + backButton);
        return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
    };
    UploadFromFileDlg.prototype.uploadFileNow = function () {
        $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
        var data = new FormData(($("#" + this.id("uploadForm"))[0]));
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
    UploadFromFileDlg.prototype.init = function () {
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    };
    return UploadFromFileDlg;
}(DialogBase));
console.log("running module: UploadFromUrlDlg.js");
var UploadFromUrlDlg = (function (_super) {
    __extends(UploadFromUrlDlg, _super);
    function UploadFromUrlDlg() {
        _super.call(this, "UploadFromUrlDlg");
    }
    UploadFromUrlDlg.prototype.build = function () {
        var header = this.makeHeader("Upload File Attachment");
        var uploadPathDisplay = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            uploadPathDisplay += render.tag("div", {
                "id": this.id("uploadPathDisplay"),
                "class": "path-display-in-editor"
            }, "");
        }
        var uploadFieldContainer = "";
        var uploadFromUrlDiv = "";
        var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
        uploadFromUrlDiv = render.tag("div", {}, uploadFromUrlField);
        var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
        var backButton = this.makeCloseButton("Close", "closeUploadButton");
        var buttonBar = render.centeredButtonBar(uploadButton + backButton);
        return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
    };
    UploadFromUrlDlg.prototype.uploadFileNow = function () {
        var sourceUrl = this.getInputVal("uploadFromUrl");
        if (sourceUrl) {
            util.json("uploadFromUrl", {
                "nodeId": attachment.uploadNode.id,
                "sourceUrl": sourceUrl
            }, this.uploadFromUrlResponse, this);
        }
    };
    UploadFromUrlDlg.prototype.uploadFromUrlResponse = function (res) {
        if (util.checkSuccess("Upload from URL", res)) {
            meta64.refresh();
        }
    };
    UploadFromUrlDlg.prototype.init = function () {
        util.setInputVal(this.id("uploadFromUrl"), "");
        $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
    };
    return UploadFromUrlDlg;
}(DialogBase));
console.log("running module: EditNodeDlg.js");
var EditNodeDlg = (function (_super) {
    __extends(EditNodeDlg, _super);
    function EditNodeDlg() {
        _super.call(this, "EditNodeDlg");
        this.fieldIdToPropMap = {};
        this.propEntries = new Array();
        debugger;
        this.fieldIdToPropMap = {};
        this.propEntries = new Array();
    }
    EditNodeDlg.prototype.build = function () {
        var header = this.makeHeader("Edit Node");
        var saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", this.saveNode, this);
        var addPropertyButton = this.makeButton("Add Property", "addPropertyButton", this.addProperty, this);
        var addTagsPropertyButton = this.makeButton("Add Tags Property", "addTagsPropertyButton", this.addTagsProperty, this);
        var cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", "edit.cancelEdit();", this);
        var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton
            + cancelEditButton, "buttons");
        var width = window.innerWidth * 0.6;
        var height = window.innerHeight * 0.4;
        var internalMainContent = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            internalMainContent += render.tag("div", {
                id: this.id("editNodePathDisplay"),
                "class": "path-display-in-editor"
            });
        }
        internalMainContent += render.tag("div", {
            id: this.id("editNodeInstructions")
        }) + render.tag("div", {
            id: this.id("propertyEditFieldContainer"),
            style: "padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll;"
        }, "Loading...");
        return header + internalMainContent + buttonBar;
    };
    EditNodeDlg.prototype.populateEditNodePg = function () {
        debugger;
        view.initEditPathDisplayById(this.id("editNodePathDisplay"));
        var fields = "";
        var counter = 0;
        this.fieldIdToPropMap = {};
        this.propEntries = new Array();
        if (edit.editNode) {
            console.log("Editing existing node.");
            var _this = this;
            var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode.properties);
            var aceFields = [];
            $.each(editOrderedProps, function (index, prop) {
                if (!render.allowPropertyToDisplay(prop.name)) {
                    console.log("Hiding property: " + prop.name);
                    return;
                }
                var fieldId = _this.id("editNodeTextContent" + index);
                console.log("Creating edit field " + fieldId + " for property " + prop.name);
                var isMulti = prop.values && prop.values.length > 0;
                var isReadOnlyProp = render.isReadOnlyProperty(prop.name);
                var isBinaryProp = render.isBinaryProperty(prop.name);
                var propEntry = new PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);
                _this.fieldIdToPropMap[fieldId] = propEntry;
                _this.propEntries.push(propEntry);
                var buttonBar = "";
                if (!isReadOnlyProp && !isBinaryProp) {
                    buttonBar = _this.makePropertyEditButtonBar(prop, fieldId);
                }
                var field = buttonBar;
                if (isMulti) {
                    field += _this.makeMultiPropEditor(propEntry);
                }
                else {
                    field += _this.makeSinglePropEditor(propEntry, aceFields);
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
                var aceFieldId = this.id("newNodeNameId");
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
                    "id": this.id("newNodeNameId"),
                    "label": "New Node Name"
                }, '', true);
                fields += render.tag("div", {}, field);
            }
        }
        util.setHtmlEnhanced(this.id("propertyEditFieldContainer"), fields);
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
        $("#" + this.id("editNodeInstructions")).html(instr);
        util.setVisibility("#" + this.id("addPropertyButton"), !edit.editingUnsavedNode);
        var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
        util.setVisibility("#" + this.id("addTagsPropertyButton"), !tagsPropExists);
    };
    EditNodeDlg.prototype.toggleShowReadOnly = function () {
    };
    EditNodeDlg.prototype.addProperty = function () {
        this.editPropertyDlgInst = new EditPropertyDlg(this);
        this.editPropertyDlgInst.open();
    };
    EditNodeDlg.prototype.addTagsProperty = function () {
        if (props.getNodePropertyVal(edit.editNode, "tags")) {
            return;
        }
        var postData = {
            nodeId: edit.editNode.id,
            propertyName: "tags",
            propertyValue: ""
        };
        util.json("saveProperty", postData, this.addTagsPropertyResponse, this);
    };
    EditNodeDlg.prototype.addTagsPropertyResponse = function (res) {
        if (util.checkSuccess("Add Tags Property", res)) {
            this.savePropertyResponse(res);
        }
    };
    EditNodeDlg.prototype.savePropertyResponse = function (res) {
        util.checkSuccess("Save properties", res);
        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;
        if (this.domId != "EditNodeDlg") {
            console.log("error: incorrect object for EditNodeDlg");
        }
        this.populateEditNodePg();
    };
    EditNodeDlg.prototype.makePropertyEditButtonBar = function (prop, fieldId) {
        var buttonBar = "";
        var clearButton = render.tag("paper-button", {
            "raised": "raised",
            "onClick": "meta64.getObjectByGuid(" + this.guid + ").clearProperty('" + fieldId + "');"
        }, "Clear");
        var addMultiButton = "";
        var deleteButton = "";
        if (prop.name !== jcrCnst.CONTENT) {
            deleteButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "meta64.getObjectByGuid(" + this.guid + ").deleteProperty('" + prop.name + "');"
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
    EditNodeDlg.prototype.addSubProperty = function (fieldId) {
        var prop = this.fieldIdToPropMap[fieldId].property;
        var isMulti = util.isObject(prop.values);
        if (!isMulti) {
            prop.values = [];
            prop.values.push(prop.value);
            prop.value = null;
        }
        prop.values.push("");
        this.populateEditNodePg();
    };
    EditNodeDlg.prototype.deleteProperty = function (propName) {
        var _this = this;
        (new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
            _this.deletePropertyImmediate(propName);
        })).open();
    };
    EditNodeDlg.prototype.deletePropertyImmediate = function (propName) {
        var ironRes = util.json("deleteProperty", {
            "nodeId": edit.editNode.id,
            "propName": propName
        });
        var _this = this;
        ironRes.completes.then(function () {
            _this.deletePropertyResponse(ironRes.response, propName);
        });
    };
    EditNodeDlg.prototype.deletePropertyResponse = function (res, propertyToDelete) {
        if (util.checkSuccess("Delete property", res)) {
            props.deletePropertyFromLocalData(propertyToDelete);
            meta64.treeDirty = true;
            this.populateEditNodePg();
        }
    };
    EditNodeDlg.prototype.clearProperty = function (fieldId) {
        if (!cnst.USE_ACE_EDITOR) {
            util.setInputVal(this.id(fieldId), "");
        }
        else {
            var editor = meta64.aceEditorsById[this.id(fieldId)];
            if (editor) {
                editor.setValue("");
            }
        }
        var counter = 0;
        while (counter < 1000) {
            if (!cnst.USE_ACE_EDITOR) {
                if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
                    break;
                }
            }
            else {
                var editor = meta64.aceEditorsById[this.id(fieldId + "_subProp" + counter)];
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
    EditNodeDlg.prototype.saveNode = function () {
        if (edit.editingUnsavedNode) {
            console.log("saveNewNode.");
            this.saveNewNode();
        }
        else {
            console.log("saveExistingNode.");
            this.saveExistingNode();
        }
    };
    EditNodeDlg.prototype.saveNewNode = function (newNodeName) {
        if (!newNodeName) {
            newNodeName = util.getInputVal(this.id("newNodeNameId"));
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
    EditNodeDlg.prototype.saveExistingNode = function () {
        console.log("saveExistingNode");
        var propertiesList = [];
        var _this = this;
        $.each(this.propEntries, function (index, prop) {
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
    EditNodeDlg.prototype.makeMultiPropEditor = function (propEntry) {
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
            var id = this.id(propEntry.id + "_subProp" + i);
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
    EditNodeDlg.prototype.makeSinglePropEditor = function (propEntry, aceFields) {
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
    EditNodeDlg.prototype.init = function () {
        debugger;
        console.log("EditNodeDlg.init");
        this.populateEditNodePg();
    };
    return EditNodeDlg;
}(DialogBase));
console.log("running module: EditPropertyDlg.js");
var EditPropertyDlg = (function (_super) {
    __extends(EditPropertyDlg, _super);
    function EditPropertyDlg(editNodeDlg) {
        _super.call(this, "EditPropertyDlg");
    }
    EditPropertyDlg.prototype.build = function () {
        var header = this.makeHeader("Edit Node Property");
        var savePropertyButton = this.makeCloseButton("Save", "savePropertyButton", this.saveProperty, this);
        var cancelEditButton = this.makeCloseButton("Cancel", "editPropertyPgCloseButton");
        var buttonBar = render.centeredButtonBar(savePropertyButton + cancelEditButton);
        var internalMainContent = "";
        if (cnst.SHOW_PATH_IN_DLGS) {
            internalMainContent += "<div id='" + this.id("editPropertyPathDisplay")
                + "' class='path-display-in-editor'></div>";
        }
        internalMainContent += "<div id='" + this.id("addPropertyFieldContainer") + "'></div>";
        return header + internalMainContent + buttonBar;
    };
    EditPropertyDlg.prototype.populatePropertyEdit = function () {
        var field = '';
        {
            var fieldPropNameId = "addPropertyNameTextContent";
            field += render.tag("paper-textarea", {
                "name": fieldPropNameId,
                "id": this.id(fieldPropNameId),
                "placeholder": "Enter property name",
                "label": "Name"
            }, "", true);
        }
        {
            var fieldPropValueId = "addPropertyValueTextContent";
            field += render.tag("paper-textarea", {
                "name": fieldPropValueId,
                "id": this.id(fieldPropValueId),
                "placeholder": "Enter property text",
                "label": "Value"
            }, "", true);
        }
        view.initEditPathDisplayById(this.id("editPropertyPathDisplay"));
        util.setHtmlEnhanced(this.id("addPropertyFieldContainer"), field);
    };
    EditPropertyDlg.prototype.saveProperty = function () {
        var propertyNameData = util.getInputVal(this.id("addPropertyNameTextContent"));
        var propertyValueData = util.getInputVal(this.id("addPropertyValueTextContent"));
        var postData = {
            nodeId: edit.editNode.id,
            propertyName: propertyNameData,
            propertyValue: propertyValueData
        };
        util.json("saveProperty", postData, this.savePropertyResponse, this);
    };
    EditPropertyDlg.prototype.savePropertyResponse = function (res) {
        util.checkSuccess("Save properties", res);
        edit.editNode.properties.push(res.propertySaved);
        meta64.treeDirty = true;
        if (this.editNodeDlg.domId != "EditNodeDlg") {
            console.log("error: incorrect object for EditNodeDlg");
        }
        this.editNodeDlg.populateEditNodePg();
    };
    EditPropertyDlg.prototype.init = function () {
        this.populatePropertyEdit();
    };
    return EditPropertyDlg;
}(DialogBase));
console.log("running module: ShareToPersonDlg.js");
var ShareToPersonDlg = (function (_super) {
    __extends(ShareToPersonDlg, _super);
    function ShareToPersonDlg() {
        _super.call(this, "ShareToPersonDlg");
    }
    ShareToPersonDlg.prototype.build = function () {
        var header = this.makeHeader("Share Node to Person");
        var formControls = this.makeEditField("User to Share With", "shareToUserName");
        var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", this.shareNodeToPerson, this);
        var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
        var buttonBar = render.centeredButtonBar(shareButton + backButton);
        return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
            + buttonBar;
    };
    ShareToPersonDlg.prototype.shareNodeToPerson = function () {
        var targetUser = this.getInputVal("shareToUserName");
        if (!targetUser) {
            (new MessageDlg("Please enter a username")).open();
            return;
        }
        meta64.treeDirty = true;
        var thiz = this;
        util.json("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": targetUser,
            "privileges": ["read", "write", "addChildren", "nodeTypeManagement"]
        }, thiz.reloadFromShareWithPerson, thiz);
    };
    ShareToPersonDlg.prototype.reloadFromShareWithPerson = function (res) {
        if (util.checkSuccess("Share Node with Person", res)) {
            (new SharingDlg()).open();
        }
    };
    return ShareToPersonDlg;
}(DialogBase));
console.log("running module: SharingDlg.js");
var SharingDlg = (function (_super) {
    __extends(SharingDlg, _super);
    function SharingDlg() {
        _super.call(this, "SharingDlg");
    }
    SharingDlg.prototype.build = function () {
        var header = this.makeHeader("Node Sharing");
        var shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton", this.shareNodeToPersonPg, this);
        var makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", this.shareNodeToPublic, this);
        var backButton = this.makeCloseButton("Close", "closeSharingButton");
        var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
        var width = window.innerWidth * 0.6;
        var height = window.innerHeight * 0.4;
        var internalMainContent = "<div id='" + this.id("shareNodeNameDisplay") + "'></div>" +
            "<div style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
            + this.id("sharingListFieldContainer") + "'></div>";
        return header + internalMainContent + buttonBar;
    };
    SharingDlg.prototype.init = function () {
        this.reload();
    };
    SharingDlg.prototype.reload = function () {
        console.log("Loading node sharing info.");
        util.json("getNodePrivileges", {
            "nodeId": share.sharingNode.id,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse, this);
    };
    SharingDlg.prototype.getNodePrivilegesResponse = function (res) {
        this.populateSharingPg(res);
    };
    SharingDlg.prototype.populateSharingPg = function (res) {
        var html = "";
        var This = this;
        $.each(res.aclEntries, function (index, aclEntry) {
            html += "<h4>User: " + aclEntry.principalName + "</h4>";
            html += render.tag("div", {
                "class": "privilege-list"
            }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
        });
        var thiz = this;
        var publicAppendAttrs = {
            "onClick": "meta64.getObjectByGuid(" + thiz.guid + ").publicCommentingChanged();",
            "name": "allowPublicCommenting",
            "id": this.id("allowPublicCommenting")
        };
        if (res.publicAppend) {
            publicAppendAttrs["checked"] = "checked";
        }
        html += render.tag("paper-checkbox", publicAppendAttrs, "", false);
        html += render.tag("label", {
            "for": this.id("allowPublicCommenting")
        }, "Allow public commenting under this node.", true);
        util.setHtmlEnhanced(this.id("sharingListFieldContainer"), html);
    };
    SharingDlg.prototype.publicCommentingChanged = function () {
        var thiz = this;
        setTimeout(function () {
            var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));
            meta64.treeDirty = true;
            util.json("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "publicAppend": polyElm.node.checked ? "true" : "false"
            });
        }, 250);
    };
    SharingDlg.prototype.removePrivilege = function (principal, privilege) {
        meta64.treeDirty = true;
        util.json("removePrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": principal,
            "privilege": privilege
        }, this.removePrivilegeResponse, this);
    };
    SharingDlg.prototype.removePrivilegeResponse = function (res) {
        util.json("getNodePrivileges", {
            "nodeId": share.sharingNode.path,
            "includeAcl": true,
            "includeOwners": true
        }, this.getNodePrivilegesResponse, this);
    };
    SharingDlg.prototype.renderAclPrivileges = function (principal, aclEntry) {
        var ret = "";
        var thiz = this;
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
    SharingDlg.prototype.shareNodeToPersonPg = function () {
        (new ShareToPersonDlg()).open();
    };
    SharingDlg.prototype.shareNodeToPublic = function () {
        console.log("Sharing node to public.");
        meta64.treeDirty = true;
        util.json("addPrivilege", {
            "nodeId": share.sharingNode.id,
            "principal": "everyone",
            "privileges": ["read"]
        }, this.reload, this);
    };
    return SharingDlg;
}(DialogBase));
console.log("running module: RenameNodeDlg.js");
var RenameNodeDlg = (function (_super) {
    __extends(RenameNodeDlg, _super);
    function RenameNodeDlg() {
        _super.call(this, "RenameNodeDlg");
    }
    RenameNodeDlg.prototype.build = function () {
        var header = this.makeHeader("Rename Node");
        var curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
        var curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";
        var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");
        var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", this.renameNode, this);
        var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
        var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);
        return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
    };
    RenameNodeDlg.prototype.renameNode = function () {
        var newName = this.getInputVal("newNodeNameEditField");
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
        var thiz = this;
        ironRes.completes.then(function () {
            thiz.renameNodeResponse(ironRes.response, renamingRootNode);
        });
    };
    RenameNodeDlg.prototype.renameNodeResponse = function (res, renamingPageRoot) {
        if (util.checkSuccess("Rename node", res)) {
            if (renamingPageRoot) {
                view.refreshTree(res.newId, true);
            }
            else {
                view.refreshTree(null, false, res.newId);
            }
        }
    };
    RenameNodeDlg.prototype.init = function () {
        var highlightNode = meta64.getHighlightedNode();
        if (!highlightNode) {
            return;
        }
        $("#" + this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
        $("#" + this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
    };
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
    console.log("Module ready: searchResultsPanel.js");
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
    console.log("Module ready: timelineResultsPanel.js");
    return _;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL2FwcC50cyIsIi4uL3RzL2Nuc3QudHMiLCIuLi90cy9tb2RlbHMudHMiLCIuLi90cy91dGlsLnRzIiwiLi4vdHMvamNyQ25zdC50cyIsIi4uL3RzL2F0dGFjaG1lbnQudHMiLCIuLi90cy9lZGl0LnRzIiwiLi4vdHMvbWV0YTY0LnRzIiwiLi4vdHMvbmF2LnRzIiwiLi4vdHMvcHJlZnMudHMiLCIuLi90cy9wcm9wcy50cyIsIi4uL3RzL3JlbmRlci50cyIsIi4uL3RzL3NlYXJjaC50cyIsIi4uL3RzL3NoYXJlLnRzIiwiLi4vdHMvdXNlci50cyIsIi4uL3RzL3ZpZXcudHMiLCIuLi90cy9tZW51LnRzIiwiLi4vdHMvZGxnL2Jhc2UvRGlhbG9nQmFzZS50cyIsIi4uL3RzL2RsZy9Db25maXJtRGxnLnRzIiwiLi4vdHMvZGxnL1Byb2dyZXNzRGxnLnRzIiwiLi4vdHMvZGxnL01lc3NhZ2VEbGcudHMiLCIuLi90cy9kbGcvTG9naW5EbGcudHMiLCIuLi90cy9kbGcvU2lnbnVwRGxnLnRzIiwiLi4vdHMvZGxnL1ByZWZzRGxnLnRzIiwiLi4vdHMvZGxnL01hbmFnZUFjY291bnREbGcudHMiLCIuLi90cy9kbGcvRXhwb3J0RGxnLnRzIiwiLi4vdHMvZGxnL0ltcG9ydERsZy50cyIsIi4uL3RzL2RsZy9TZWFyY2hEbGcudHMiLCIuLi90cy9kbGcvQ2hhbmdlUGFzc3dvcmREbGcudHMiLCIuLi90cy9kbGcvUmVzZXRQYXNzd29yZERsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tRmlsZURsZy50cyIsIi4uL3RzL2RsZy9VcGxvYWRGcm9tVXJsRGxnLnRzIiwiLi4vdHMvZGxnL0VkaXROb2RlRGxnLnRzIiwiLi4vdHMvZGxnL0VkaXRQcm9wZXJ0eURsZy50cyIsIi4uL3RzL2RsZy9TaGFyZVRvUGVyc29uRGxnLnRzIiwiLi4vdHMvZGxnL1NoYXJpbmdEbGcudHMiLCIuLi90cy9kbGcvUmVuYW1lTm9kZURsZy50cyIsIi4uL3RzL3BhbmVsL3NlYXJjaFJlc3VsdHNQYW5lbC50cyIsIi4uL3RzL3BhbmVsL3RpbWVsaW5lUmVzdWx0c1BhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsWUFBWSxDQUFDO0FBUWIsSUFBSSxRQUFRLEdBQUcsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7SUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ2pELE1BQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU1GO0FBRUEsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBR3pDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFJekMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFVBQVMsQ0FB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O1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG4vLyB2YXIgb25yZXNpemUgPSB3aW5kb3cub25yZXNpemU7XG4vLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbihldmVudCkgeyBpZiAodHlwZW9mIG9ucmVzaXplID09PSAnZnVuY3Rpb24nKSBvbnJlc2l6ZSgpOyAvKiogLi4uICovIH1cblxudmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24ob2JqZWN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCB8fCB0eXBlb2YgKG9iamVjdCkgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdC5hdHRhY2hFdmVudCkge1xuICAgICAgICBvYmplY3QuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtcIm9uXCIgKyB0eXBlXSA9IGNhbGxiYWNrO1xuICAgIH1cbn07XG5cbi8qXG4gKiBXQVJOSU5HOiBUaGlzIGlzIGNhbGxlZCBpbiByZWFsdGltZSB3aGlsZSB1c2VyIGlzIHJlc2l6aW5nIHNvIGFsd2F5cyB0aHJvdHRsZSBiYWNrIGFueSBwcm9jZXNzaW5nIHNvIHRoYXQgeW91IGRvbid0XG4gKiBkbyBhbnkgYWN0dWFsIHByb2Nlc3NpbmcgaW4gaGVyZSB1bmxlc3MgeW91IHdhbnQgaXQgVkVSWSBsaXZlLCBiZWNhdXNlIGl0IGlzLlxuICovXG5mdW5jdGlvbiB3aW5kb3dSZXNpemUoKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJXaW5kb3dSZXNpemU6IHc9XCIgKyB3aW5kb3cuaW5uZXJXaWR0aCArIFwiIGg9XCIgKyB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5hZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHdpbmRvd1Jlc2l6ZSk7XG5cbi8vIFRoaXMgaXMgb3VyIHRlbXBsYXRlIGVsZW1lbnQgaW4gaW5kZXguaHRtbFxudmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKTtcblxuLy8gTGlzdGVuIGZvciB0ZW1wbGF0ZSBib3VuZCBldmVudCB0byBrbm93IHdoZW4gYmluZGluZ3Ncbi8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYXBwIHJlYWR5IGV2ZW50IScpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2x5bWVyLXJlYWR5JywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xufSk7XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBjbnN0LmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgY29va2llUHJlZml4O1xyXG5cclxuLy90b2RvLTA6IHR5cGVzY3JpcHQgd2lsbCBub3cgbGV0IHVzIGp1c3QgZG8gdGhpczogY29uc3QgdmFyPSd2YWx1ZSc7XHJcbmNsYXNzIENuc3Qge1xyXG4gICAgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgIENPT0tJRV9MT0dJTl9VU1I6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Vc3JcIjtcclxuICAgIENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgIC8qXHJcbiAgICAgKiBsb2dpblN0YXRlPVwiMFwiIGlmIHVzZXIgbG9nZ2VkIG91dCBpbnRlbnRpb25hbGx5LiBsb2dpblN0YXRlPVwiMVwiIGlmIGxhc3Qga25vd24gc3RhdGUgb2YgdXNlciB3YXMgJ2xvZ2dlZCBpbidcclxuICAgICAqL1xyXG4gICAgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgIEJSOiBcIjxkaXYgY2xhc3M9J3ZlcnQtc3BhY2UnPjwvZGl2PlwiO1xyXG4gICAgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBJTlNfT05fVE9PTEJBUjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICogb24uXHJcbiAgICAgKi9cclxuICAgIFVTRV9BQ0VfRURJVE9SOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcImNuc3RcIl0pIHtcclxuICAgIHZhciBjbnN0OiBDbnN0ID0gbmV3IENuc3QoKTtcclxufVxyXG4iLCJcbmNsYXNzIFByb3BFbnRyeSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyBwcm9wZXJ0eTogUHJvcGVydHlJbmZvLCAvL1xuICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgIHB1YmxpYyByZWFkT25seTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIGJpbmFyeTogYm9vbGVhbiwgLy9cbiAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICB9XG59XG5cbmNsYXNzIFN1YlByb3Age1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICB9XG59XG5cbmNsYXNzIE5vZGVJbmZvIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHBhdGg6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHByaW1hcnlUeXBlTmFtZTogc3RyaW5nLCAvL1xuICAgICAgICBwdWJsaWMgcHJvcGVydGllczogUHJvcGVydHlJbmZvW10sIC8vXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZHJlbjogYm9vbGVhbiwvL1xuICAgICAgICBwdWJsaWMgaGFzQmluYXJ5OiBib29sZWFuLC8vXG4gICAgICAgIHB1YmxpYyBiaW5hcnlJc0ltYWdlOiBib29sZWFuLCAvL1xuICAgICAgICBwdWJsaWMgYmluVmVyOiBudW1iZXIsIC8vXG4gICAgICAgIHB1YmxpYyB3aWR0aDogbnVtYmVyLCAvL1xuICAgICAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIsIC8vXG4gICAgICAgIHB1YmxpYyBjaGlsZHJlbk9yZGVyZWQ6IGJvb2xlYW4pIHtcbiAgICB9XG59XG5cbmNsYXNzIFByb3BlcnR5SW5mbyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IG51bWJlciwgLy9cbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgLy9cbiAgICAgICAgcHVibGljIHZhbHVlOiBzdHJpbmcsIC8vXG4gICAgICAgIHB1YmxpYyB2YWx1ZXM6IHN0cmluZ1tdLCAvL1xuICAgICAgICBwdWJsaWMgaHRtbFZhbHVlOiBzdHJpbmcpIHtcbiAgICB9XG59XG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXRpbC5qc1wiKTtcclxuXHJcbi8vdG9kby0wOiBuZWVkIHRvIGZpbmQgdGhlIERlZmluaXRlbHlUeXBlZCBmaWxlIGZvciBQb2x5bWVyLlxyXG5kZWNsYXJlIHZhciBQb2x5bWVyO1xyXG5kZWNsYXJlIHZhciAkOyAvLzwtLS0tLS0tLS0tLS0tdGhpcyB3YXMgYSB3aWxkYXNzIGd1ZXNzLlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XHJcblxyXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XHJcbn1cclxuXHJcbmludGVyZmFjZSBfSGFzU2VsZWN0IHtcclxuICAgIHNlbGVjdD86IGFueTtcclxufVxyXG5cclxuaW50ZXJmYWNlIF9IYXNSb290IHtcclxuICAgIHJvb3Q/OiBhbnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXJyYXkgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vV0FSTklORzogVGhlc2UgcHJvdG90eXBlIGZ1bmN0aW9ucyBtdXN0IGJlIGRlZmluZWQgb3V0c2lkZSBhbnkgZnVuY3Rpb25zLlxyXG5pbnRlcmZhY2UgQXJyYXk8VD4ge1xyXG5cdFx0XHRcdGNsb25lKCk6IEFycmF5PFQ+O1xyXG5cdFx0XHRcdGluZGV4T2ZJdGVtQnlQcm9wKHByb3BOYW1lLCBwcm9wVmFsKTogbnVtYmVyO1xyXG5cdFx0XHRcdGFycmF5TW92ZUl0ZW0oZnJvbUluZGV4LCB0b0luZGV4KTogdm9pZDtcclxuXHRcdFx0XHRpbmRleE9mT2JqZWN0KG9iajogYW55KTogbnVtYmVyO1xyXG59O1xyXG5cclxuQXJyYXkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwKTtcclxufTtcclxuXHJcbkFycmF5LnByb3RvdHlwZS5pbmRleE9mSXRlbUJ5UHJvcCA9IGZ1bmN0aW9uKHByb3BOYW1lLCBwcm9wVmFsKSB7XHJcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaV1bcHJvcE5hbWVdID09PSBwcm9wVmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufTtcclxuXHJcbi8qIG5lZWQgdG8gdGVzdCBhbGwgY2FsbHMgdG8gdGhpcyBtZXRob2QgYmVjYXVzZSBpIG5vdGljZWQgZHVyaW5nIFR5cGVTY3JpcHQgY29udmVyc2lvbiBpIHdhc24ndCBldmVuIHJldHVybmluZ1xyXG5hIHZhbHVlIGZyb20gdGhpcyBmdW5jdGlvbiEgdG9kby0wXHJcbiovXHJcbkFycmF5LnByb3RvdHlwZS5hcnJheU1vdmVJdGVtID0gZnVuY3Rpb24oZnJvbUluZGV4LCB0b0luZGV4KSB7XHJcbiAgICB0aGlzLnNwbGljZSh0b0luZGV4LCAwLCB0aGlzLnNwbGljZShmcm9tSW5kZXgsIDEpWzBdKTtcclxufTtcclxuXHJcbmlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZPYmplY3QgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERhdGUgcHJvdG90eXBlXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmludGVyZmFjZSBEYXRlIHtcclxuXHRcdFx0XHRzdGRUaW1lem9uZU9mZnNldCgpOiBudW1iZXI7XHJcblx0XHRcdFx0ZHN0KCk6IGJvb2xlYW47XHJcbn07XHJcblxyXG5EYXRlLnByb3RvdHlwZS5zdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGphbiA9IG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICB2YXIganVsID0gbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLCA2LCAxKTtcclxuICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG59XHJcblxyXG5EYXRlLnByb3RvdHlwZS5kc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgPCB0aGlzLnN0ZFRpbWV6b25lT2Zmc2V0KCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RyaW5nIHByb3RvdHlwZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5pbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgIHN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgc3RyaXBJZlN0YXJ0c1dpdGgoc3RyOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb250YWlucyhzdHI6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICByZXBsYWNlQWxsKGZpbmQ6IHN0cmluZywgcmVwbGFjZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdW5lbmNvZGVIdG1sKCk6IHN0cmluZztcclxuICAgIGVzY2FwZUZvckF0dHJpYigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5zdHJpcElmU3RhcnRzV2l0aCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnN0cmlwSWZTdGFydHNXaXRoID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRzV2l0aChzdHIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1YnN0cmluZyhzdHIubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAodHlwZW9mIFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc3RyKSAhPSAtMTtcclxuICAgIH07XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsICE9ICdmdW5jdGlvbicpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhcIiZcIikpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKCcmYW1wOycsICcmJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmd0OycsICc+JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJmx0OycsICc8JykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJnF1b3Q7JywgJ1wiJykvL1xyXG4gICAgICAgICAgICAucmVwbGFjZUFsbCgnJiMzOTsnLCBcIidcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgIT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5lc2NhcGVGb3JBdHRyaWIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVXRpbCB7XHJcblxyXG4gICAgbG9nQWpheDpib29sZWFuID0gZmFsc2U7XHJcbiAgICB0aW1lb3V0TWVzc2FnZVNob3duOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgIG9mZmxpbmU6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHdhaXRDb3VudGVyOm51bWJlciA9IDA7XHJcbiAgICBwZ3JzRGxnOmFueSA9IG51bGw7XHJcblxyXG4gICAgLy90aGlzIGJsb3dzIHRoZSBoZWxsIHVwLCBub3Qgc3VyZSB3aHkuXHJcbiAgICAvL1x0T2JqZWN0LnByb3RvdHlwZS50b0pzb24gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLCBudWxsLCA0KTtcclxuICAgIC8vXHR9O1xyXG5cclxuICAgIGFzc2VydE5vdE51bGwodmFyTmFtZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXZhbCh2YXJOYW1lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVmFyaWFibGUgbm90IGZvdW5kOiBcIiArIHZhck5hbWUpKS5vcGVuKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qXHJcblx0ICogV2UgdXNlIHRoaXMgdmFyaWFibGUgdG8gZGV0ZXJtaW5lIGlmIHdlIGFyZSB3YWl0aW5nIGZvciBhbiBhamF4IGNhbGwsIGJ1dCB0aGUgc2VydmVyIGFsc28gZW5mb3JjZXMgdGhhdCBlYWNoXHJcblx0ICogc2Vzc2lvbiBpcyBvbmx5IGFsbG93ZWQgb25lIGNvbmN1cnJlbnQgY2FsbCBhbmQgc2ltdWx0YW5lb3VzIGNhbGxzIHdvdWxkIGp1c3QgXCJxdWV1ZSB1cFwiLlxyXG5cdCAqL1xyXG4gICAgX2FqYXhDb3VudGVyOm51bWJlciA9IDA7XHJcblxyXG5cclxuICAgICAgICBkYXlsaWdodFNhdmluZ3NUaW1lOmJvb2xlYW49IChuZXcgRGF0ZSgpLmRzdCgpKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgdG9Kc29uKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFRoaXMgY2FtZSBmcm9tIGhlcmU6XHJcblx0XHQgKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG5cdFx0ICovXHJcbiAgICAgICAgZ2V0UGFyYW1ldGVyQnlOYW1lKG5hbWU/OiBhbnksIHVybD86IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIXVybClcclxuICAgICAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIG5hbWUgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzWzJdKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBTZXRzIHVwIGFuIGluaGVyaXRhbmNlIHJlbGF0aW9uc2hpcCBzbyB0aGF0IGNoaWxkIGluaGVyaXRzIGZyb20gcGFyZW50LCBhbmQgdGhlbiByZXR1cm5zIHRoZSBwcm90b3R5cGUgb2YgdGhlXHJcblx0XHQgKiBjaGlsZCBzbyB0aGF0IG1ldGhvZHMgY2FuIGJlIGFkZGVkIHRvIGl0LCB3aGljaCB3aWxsIGJlaGF2ZSBsaWtlIG1lbWJlciBmdW5jdGlvbnMgaW4gY2xhc3NpYyBPT1Agd2l0aFxyXG5cdFx0ICogaW5oZXJpdGFuY2UgaGllcmFyY2hpZXMuXHJcblx0XHQgKi9cclxuICAgICAgICBpbmhlcml0KHBhcmVudCwgY2hpbGQpIHtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wcm90b3R5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0UHJvZ3Jlc3NNb25pdG9yKCkge1xyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLnByb2dyZXNzSW50ZXJ2YWwsIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvZ3Jlc3NJbnRlcnZhbCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGlzV2FpdGluZyA9IHRoaXMuaXNBamF4V2FpdGluZygpO1xyXG4gICAgICAgICAgICBpZiAoaXNXYWl0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhaXRDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53YWl0Q291bnRlciA+PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBncnNEbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wZ3JzRGxnID0gbmV3IFByb2dyZXNzRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGdyc0RsZy5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWl0Q291bnRlciA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZ3JzRGxnLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGdyc0RsZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIElmIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBuZWVkcyBhICd0aGlzJyBjb250ZXh0IGZvciB0aGUgY2FsbCwgdGhlbiBwYXNzIHRoZSAndGhpcycgaW4gdGhlIGNhbGxiYWNrVGhpc1xyXG5cdFx0ICogcGFyYW1ldGVyLlxyXG5cdFx0ICpcclxuXHRcdCAqIGNhbGxiYWNrUGF5bG9hZCBpcyBwYXNzZWQgdG8gY2FsbGJhY2sgYXMgaXRzIGxhc3QgcGFyYW1ldGVyXHJcblx0XHQgKlxyXG5cdFx0ICogdG9kby0zOiB0aGlzIG1ldGhvZCBnb3QgdG9vIGxvbmcuIE5lZWQgdG8gbm90IGlubGluZSB0aGVzZSBmdW5jdGlvbiBkZWZpbml0aW9uc1xyXG5cdFx0ICovXHJcbiAgICAgICAganNvbihwb3N0TmFtZTogYW55LCBwb3N0RGF0YTogYW55LCBjYWxsYmFjaz86IGFueSwgY2FsbGJhY2tUaGlzPzogYW55LCBjYWxsYmFja1BheWxvYWQ/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXM9PT13aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJPQkFCTEUgQlVHOiBqc29uIGNhbGwgZm9yIFwiK3Bvc3ROYW1lK1wiIHVzZWQgZ2xvYmFsICd3aW5kb3cnIGFzICd0aGlzJywgd2hpY2ggaXMgYWxtb3N0IG5ldmVyIGdvaW5nIHRvIGJlIGNvcnJlY3QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaXJvbkFqYXg7XHJcbiAgICAgICAgICAgIHZhciBpcm9uUmVxdWVzdDtcclxuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9mZmxpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9mZmxpbmU6IGlnbm9yaW5nIGNhbGwgZm9yIFwiICsgcG9zdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2dBamF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU09OLVBPU1Q6IFtcIiArIHBvc3ROYW1lICsgXCJdXCIgKyBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIERvIG5vdCBkZWxldGUsIHJlc2VhcmNoIHRoaXMgd2F5Li4uICovXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgaXJvbkFqYXggPSB0aGlzLiQkKFwiI215SXJvbkFqYXhcIik7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogSSBoYWQgdG8gZm9yY2UgJ3RoaXMucm9vdCcgdG8gYmUgYWNjZXB0YWJsZSB1c2luZyBpbnRlcmZhY2UsIHdoeT8/IGlzIHRoaXMgY29ycmVjdD9cclxuICAgICAgICAgICAgICAgIGlyb25BamF4ID0gUG9seW1lci5kb20oKDxfSGFzUm9vdD50aGlzKS5yb290KS5xdWVyeVNlbGVjdG9yKFwiI2lyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnVybCA9IHBvc3RUYXJnZXRVcmwgKyBwb3N0TmFtZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LnZlcmJvc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguYm9keSA9IEpTT04uc3RyaW5naWZ5KHBvc3REYXRhKTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4Lm1ldGhvZCA9IFwiUE9TVFwiO1xyXG4gICAgICAgICAgICAgICAgaXJvbkFqYXguY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWZ5IGFueSB1cmwgcGFyYW1zIHRoaXMgd2F5OlxyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgucGFyYW1zPSd7XCJhbHRcIjpcImpzb25cIiwgXCJxXCI6XCJjaHJvbWVcIn0nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmhhbmRsZUFzID0gXCJqc29uXCI7IC8vIGhhbmRsZS1hcyAoaXMgcHJvcClcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGlzIG5vdCBhIHJlcXVpcmVkIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgICAgICAvLyBpcm9uQWpheC5vblJlc3BvbnNlID0gXCJ1dGlsLmlyb25BamF4UmVzcG9uc2VcIjsgLy8gb24tcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIC8vIChpc1xyXG4gICAgICAgICAgICAgICAgLy8gcHJvcClcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmRlYm91bmNlRHVyYXRpb24gPSBcIjMwMFwiOyAvLyBkZWJvdW5jZS1kdXJhdGlvbiAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWpheENvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIGlyb25SZXF1ZXN0ID0gaXJvbkFqYXguZ2VuZXJhdGVSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIkZhaWxlZCBzdGFydGluZyByZXF1ZXN0OiBcIiArIHBvc3ROYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogTm90ZXNcclxuXHRcdFx0ICogPHA+XHJcblx0XHRcdCAqIElmIHVzaW5nIHRoZW4gZnVuY3Rpb246IHByb21pc2UudGhlbihzdWNjZXNzRnVuY3Rpb24sIGZhaWxGdW5jdGlvbik7XHJcblx0XHRcdCAqIDxwPlxyXG5cdFx0XHQgKiBJIHRoaW5rIHRoZSB3YXkgdGhlc2UgcGFyYW1ldGVycyBnZXQgcGFzc2VkIGludG8gZG9uZS9mYWlsIGZ1bmN0aW9ucywgaXMgYmVjYXVzZSB0aGVyZSBhcmUgcmVzb2x2ZS9yZWplY3RcclxuXHRcdFx0ICogbWV0aG9kcyBnZXR0aW5nIGNhbGxlZCB3aXRoIHRoZSBwYXJhbWV0ZXJzLiBCYXNpY2FsbHkgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvICdyZXNvbHZlJyBnZXQgZGlzdHJpYnV0ZWRcclxuXHRcdFx0ICogdG8gYWxsIHRoZSB3YWl0aW5nIG1ldGhvZHMganVzdCBsaWtlIGFzIGlmIHRoZXkgd2VyZSBzdWJzY3JpYmluZyBpbiBhIHB1Yi9zdWIgbW9kZWwuIFNvIHRoZSAncHJvbWlzZSdcclxuXHRcdFx0ICogcGF0dGVybiBpcyBzb3J0IG9mIGEgcHViL3N1YiBtb2RlbCBpbiBhIHdheVxyXG5cdFx0XHQgKiA8cD5cclxuXHRcdFx0ICogVGhlIHJlYXNvbiB0byByZXR1cm4gYSAncHJvbWlzZS5wcm9taXNlKCknIG1ldGhvZCBpcyBzbyBubyBvdGhlciBjb2RlIGNhbiBjYWxsIHJlc29sdmUvcmVqZWN0IGJ1dCBjYW5cclxuXHRcdFx0ICogb25seSByZWFjdCB0byBhIGRvbmUvZmFpbC9jb21wbGV0ZS5cclxuXHRcdFx0ICogPHA+XHJcblx0XHRcdCAqIGRlZmVycmVkLndoZW4ocHJvbWlzZTEsIHByb21pc2UyKSBjcmVhdGVzIGEgbmV3IHByb21pc2UgdGhhdCBiZWNvbWVzICdyZXNvbHZlZCcgb25seSB3aGVuIGFsbCBwcm9taXNlc1xyXG5cdFx0XHQgKiBhcmUgcmVzb2x2ZWQuIEl0J3MgYSBiaWcgXCJhbmQgY29uZGl0aW9uXCIgb2YgcmVzb2x2ZW1lbnQsIGFuZCBpZiBhbnkgb2YgdGhlIHByb21pc2VzIHBhc3NlZCB0byBpdCBlbmQgdXBcclxuXHRcdFx0ICogZmFpbGluZywgaXQgZmFpbHMgdGhpcyBcIkFORGVkXCIgb25lIGFsc28uXHJcblx0XHRcdCAqL1xyXG4gICAgICAgICAgICBpcm9uUmVxdWVzdC5jb21wbGV0ZXMudGhlbigvL1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBTdWNjZXNzXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6Ll9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnByb2dyZXNzSW50ZXJ2YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGl6LmxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIEpTT04tUkVTVUxUOiBcIiArIHBvc3ROYW1lICsgXCJcXG4gICAgSlNPTi1SRVNVTFQtREFUQTogXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGlyb25SZXF1ZXN0LnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyBpcyB1Z2x5IGJlY2F1c2UgaXQgY292ZXJzIGFsbCBmb3VyIGNhc2VzIGJhc2VkIG9uIHR3byBib29sZWFucywgYnV0IGl0J3Mgc3RpbGwgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzaW1wbGVzdCB3YXkgdG8gZG8gdGhpcy4gV2UgaGF2ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgbWF5IG9yIG1heSBub3Qgc3BlY2lmeSBhICd0aGlzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYW5kIGFsd2F5cyBjYWxscyB3aXRoIHRoZSAncmVwb25zZScgcGFyYW0gYW5kIG9wdGlvbmFsbHkgYSBjYWxsYmFja1BheWxvYWQgcGFyYW0uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1BheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tUaGlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tUaGlzLCBpcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIGlyb25SZXF1ZXN0LnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhpcm9uUmVxdWVzdC5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJGYWlsZWQgaGFuZGxpbmcgcmVzdWx0IG9mOiBcIiArIHBvc3ROYW1lICsgXCIgZXg9XCIgKyBleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBGYWlsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6Ll9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnByb2dyZXNzSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiB1dGlsLmpzb25cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXJvblJlcXVlc3Quc3RhdHVzID09IFwiNDAzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiBkZXRlY3RlZCBpbiB1dGlsLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoub2ZmbGluZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGl6LnRpbWVvdXRNZXNzYWdlU2hvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnRpbWVvdXRNZXNzYWdlU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlc3Npb24gdGltZWQgb3V0LiBQYWdlIHdpbGwgcmVmcmVzaC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gXCJTZXJ2ZXIgcmVxdWVzdCBmYWlsZWQuXFxuXFxuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBjYXRjaCBibG9jayBzaG91bGQgZmFpbCBzaWxlbnRseSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiU3RhdHVzOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1c1RleHQgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnICs9IFwiQ29kZTogXCIgKyBpcm9uUmVxdWVzdC5zdGF0dXMgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB0aGlzIGNhdGNoIGJsb2NrIHNob3VsZCBhbHNvIGZhaWwgc2lsZW50bHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogVGhpcyB3YXMgc2hvd2luZyBcImNsYXNzQ2FzdEV4Y2VwdGlvblwiIHdoZW4gSSB0aHJldyBhIHJlZ3VsYXIgXCJFeGNlcHRpb25cIiBmcm9tIHNlcnZlciBzbyBmb3Igbm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEknbSBqdXN0IHR1cm5pbmcgdGhpcyBvZmYgc2luY2UgaXRzJyBub3QgZGlzcGxheWluZyB0aGUgY29ycmVjdCBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXNnICs9IFwiUmVzcG9uc2U6IFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5leGNlcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1zZykpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkZhaWxlZCBwcm9jZXNzaW5nIHNlcnZlci1zaWRlIGZhaWwgb2Y6IFwiICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlyb25SZXF1ZXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWpheFJlYWR5KHJlcXVlc3ROYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hamF4Q291bnRlciA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSWdub3JpbmcgcmVxdWVzdHM6IFwiICsgcmVxdWVzdE5hbWUgKyBcIi4gQWpheCBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNBamF4V2FpdGluZygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FqYXhDb3VudGVyID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNldCBmb2N1cyB0byBlbGVtZW50IGJ5IGlkIChpZCBtdXN0IHN0YXJ0IHdpdGggIykgKi9cclxuICAgICAgICBkZWxheWVkRm9jdXMoaWQpIHtcclxuICAgICAgICAgICAgLyogc28gdXNlciBzZWVzIHRoZSBmb2N1cyBmYXN0IHdlIHRyeSBhdCAuNSBzZWNvbmRzICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgLyogd2UgdHJ5IGFnYWluIGEgZnVsbCBzZWNvbmQgbGF0ZXIuIE5vcm1hbGx5IG5vdCByZXF1aXJlZCwgYnV0IG5ldmVyIHVuZGVzaXJhYmxlICovXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKGlkKS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGNvdWxkIGhhdmUgcHV0IHRoaXMgbG9naWMgaW5zaWRlIHRoZSBqc29uIG1ldGhvZCBpdHNlbGYsIGJ1dCBJIGNhbiBmb3JzZWUgY2FzZXMgd2hlcmUgd2UgZG9uJ3Qgd2FudCBhXHJcblx0XHQgKiBtZXNzYWdlIHRvIGFwcGVhciB3aGVuIHRoZSBqc29uIHJlc3BvbnNlIHJldHVybnMgc3VjY2Vzcz09ZmFsc2UsIHNvIHdlIHdpbGwgaGF2ZSB0byBjYWxsIGNoZWNrU3VjY2VzcyBpbnNpZGVcclxuXHRcdCAqIGV2ZXJ5IHJlc3BvbnNlIG1ldGhvZCBpbnN0ZWFkLCBpZiB3ZSB3YW50IHRoYXQgcmVzcG9uc2UgdG8gcHJpbnQgYSBtZXNzYWdlIHRvIHRoZSB1c2VyIHdoZW4gZmFpbCBoYXBwZW5zLlxyXG5cdFx0ICpcclxuXHRcdCAqIHJlcXVpcmVzOiByZXMuc3VjY2VzcyByZXMubWVzc2FnZVxyXG5cdFx0ICovXHJcbiAgICAgICAgY2hlY2tTdWNjZXNzKG9wRnJpZW5kbHlOYW1lLCByZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG9wRnJpZW5kbHlOYW1lICsgXCIgZmFpbGVkOiBcIiArIHJlcy5tZXNzYWdlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3VjY2VzcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGFkZHMgYWxsIGFycmF5IG9iamVjdHMgdG8gb2JqIGFzIGEgc2V0ICovXHJcbiAgICAgICAgYWRkQWxsKG9iaiwgYSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghYVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJudWxsIGVsZW1lbnQgaW4gYWRkQWxsIGF0IGlkeD1cIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbYVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBudWxsT3JVbmRlZihvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIFdlIGhhdmUgdG8gYmUgYWJsZSB0byBtYXAgYW55IGlkZW50aWZpZXIgdG8gYSB1aWQsIHRoYXQgd2lsbCBiZSByZXBlYXRhYmxlLCBzbyB3ZSBoYXZlIHRvIHVzZSBhIGxvY2FsXHJcblx0XHQgKiAnaGFzaHNldC10eXBlJyBpbXBsZW1lbnRhdGlvblxyXG5cdFx0ICovXHJcbiAgICAgICAgZ2V0VWlkRm9ySWQobWFwLCBpZCkge1xyXG4gICAgICAgICAgICAvKiBsb29rIGZvciB1aWQgaW4gbWFwICovXHJcbiAgICAgICAgICAgIHZhciB1aWQgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBtZXRhNjQubmV4dFVpZCsrO1xyXG4gICAgICAgICAgICAgICAgbWFwW2lkXSA9IHVpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdWlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxlbWVudEV4aXN0cyhpZCkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBlICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUYWtlcyB0ZXh0YXJlYSBkb20gSWQgKCMgb3B0aW9uYWwpIGFuZCByZXR1cm5zIGl0cyB2YWx1ZSAqL1xyXG4gICAgICAgIGdldFRleHRBcmVhVmFsQnlJZChpZCkge1xyXG4gICAgICAgICAgICB2YXIgZG9tRWxtOiBIVE1MRWxlbWVudCA9IHRoaXMuZG9tRWxtKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuICg8SFRNTElucHV0RWxlbWVudD5kb21FbG0pLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGRvbUVsbShpZCkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvbHkoaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9seUVsbShpZCkubm9kZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBwb2x5RWxtKGlkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aChcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuY29udGFpbnMoXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludmFsaWQgIyBpbiBkb21FbG1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgaWYgKCFlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbUVsbSBFcnJvci4gUmVxdWlyZWQgZWxlbWVudCBpZCBub3QgZm91bmQ6IFwiICsgaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUG9seW1lci5kb20oZSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBHZXRzIHRoZSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kXHJcblx0XHQgKi9cclxuICAgICAgICBnZXRSZXF1aXJlZEVsZW1lbnQoaWQpIHtcclxuICAgICAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzT2JqZWN0KG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5sZW5ndGggIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRUaW1lTWlsbGlzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVtcHR5U3RyaW5nKHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIXZhbCB8fCB2YWwubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRJbnB1dFZhbChpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb2x5RWxtKGlkKS5ub2RlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgd2FzIGZvdW5kLCBvciBmYWxzZSBpZiBlbGVtZW50IG5vdCBmb3VuZCAqL1xyXG4gICAgICAgIHNldElucHV0VmFsKGlkLCB2YWwpIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB0aGlzLnBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWxtICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiaW5kRW50ZXJLZXkoaWQsIGZ1bmMpIHtcclxuICAgICAgICAgICAgdGhpcy5iaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiaW5kS2V5KGlkLCBmdW5jLCBrZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICQoaWQpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IGtleUNvZGUpIHsgLy8gMTM9PWVudGVyIGtleSBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhbnlFbXB0eShwMT86IGFueSwgcDI/OiBhbnksIHAzPzogYW55LCBwND86IGFueSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICghdmFsIHx8IHZhbC5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBSZW1vdmVkIG9sZENsYXNzIGZyb20gZWxlbWVudCBhbmQgcmVwbGFjZXMgd2l0aCBuZXdDbGFzcywgYW5kIGlmIG9sZENsYXNzIGlzIG5vdCBwcmVzZW50IGl0IHNpbXBseSBhZGRzXHJcblx0XHQgKiBuZXdDbGFzcy4gSWYgb2xkIGNsYXNzIGV4aXN0ZWQsIGluIHRoZSBsaXN0IG9mIGNsYXNzZXMsIHRoZW4gdGhlIG5ldyBjbGFzcyB3aWxsIG5vdyBiZSBhdCB0aGF0IHBvc2l0aW9uLiBJZlxyXG5cdFx0ICogb2xkIGNsYXNzIGRpZG4ndCBleGlzdCwgdGhlbiBuZXcgQ2xhc3MgaXMgYWRkZWQgYXQgZW5kIG9mIGNsYXNzIGxpc3QuXHJcblx0XHQgKi9cclxuICAgICAgICBjaGFuZ2VPckFkZENsYXNzKGVsbSwgb2xkQ2xhc3MsIG5ld0NsYXNzKSB7XHJcbiAgICAgICAgICAgIHZhciBlbG1lbWVudCA9ICQoZWxtKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3Mob2xkQ2xhc3MsIGZhbHNlKTtcclxuICAgICAgICAgICAgZWxtZW1lbnQudG9nZ2xlQ2xhc3MobmV3Q2xhc3MsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogZGlzcGxheXMgbWVzc2FnZSAobXNnKSBvZiBvYmplY3QgaXMgbm90IG9mIHNwZWNpZmllZCB0eXBlXHJcblx0XHQgKi9cclxuICAgICAgICB2ZXJpZnlUeXBlKG9iaiwgdHlwZSwgbXNnKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2V0cyBodG1sIGFuZCByZXR1cm5zIERPTSBlbGVtZW50ICovXHJcbiAgICAgICAgc2V0SHRtbEVuaGFuY2VkKGlkLCBjb250ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gdGhpcy5kb21FbG0oaWQpO1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IFBvbHltZXIuZG9tKGVsbSk7XHJcbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgLy8gTm90IHN1cmUgeWV0LCBpZiB0aGVzZSB0d28gYXJlIHJlcXVpcmVkLlxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVsbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldEh0bWwoaWQsIGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB0aGlzLmRvbUVsbShpZCk7XHJcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gUG9seW1lci5kb20oZWxtKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRQcm9wZXJ0eUNvdW50KG9iaikge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvcDtcclxuXHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuXHRcdCAqL1xyXG4gICAgICAgIHByaW50T2JqZWN0KG9iaikge1xyXG4gICAgICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5W1wiICsgY291bnQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSAnJztcclxuICAgICAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gayArIFwiICwgXCIgKyB2ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVyclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyAqL1xyXG4gICAgICAgIHByaW50S2V5cyhvYmopIHtcclxuICAgICAgICAgICAgaWYgKCFvYmopXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmFsID0gJyc7XHJcbiAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJywnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsICs9IGs7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgZW5hYmxlZCBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBzZXRFbmFibGVtZW50KGVsbUlkLCBlbmFibGUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkb21FbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGRvbUVsbSA9IHRoaXMuZG9tRWxtKGVsbUlkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbUVsbSA9IGVsbUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9tRWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0VmlzaWJpbGl0eSBjb3VsZG4ndCBmaW5kIGl0ZW06IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbmFibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGRvbUVsbS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGRvbUVsbS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBNYWtlcyBlbGVJZCB2aXNpYmxlIGJhc2VkIG9uIHZpcyBmbGFnXHJcblx0XHQgKlxyXG5cdFx0ICogZWxlSWQgY2FuIGJlIGEgRE9NIGVsZW1lbnQgb3IgdGhlIElEIG9mIGEgZG9tIGVsZW1lbnQsIHdpdGggb3Igd2l0aG91dCBsZWFkaW5nICNcclxuXHRcdCAqL1xyXG4gICAgICAgIHNldFZpc2liaWxpdHkoZWxtSWQsIHZpcykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGRvbUVsbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxtSWQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZG9tRWxtID0gdGhpcy5kb21FbG0oZWxtSWQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tRWxtID0gZWxtSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkb21FbG0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXRWaXNpYmlsaXR5IGNvdWxkbid0IGZpbmQgaXRlbTogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh2aXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hvd2luZyBlbGVtZW50OiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIGRvbUVsbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaGlkaW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZG9tRWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF3aW5kb3dbXCJ1dGlsXCJdKSB7XHJcbiAgICAgICAgdmFyIHV0aWw6IFV0aWwgPSBuZXcgVXRpbCgpO1xyXG4gICAgfVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBqY3JDbnN0LmpzXCIpO1xyXG5cclxuY2xhc3MgSmNyQ25zdCB7XHJcblxyXG4gICAgQ09NTUVOVF9CWTogc3RyaW5nID0gXCJjb21tZW50QnlcIjtcclxuICAgIFBVQkxJQ19BUFBFTkQ6IHN0cmluZyA9IFwicHVibGljQXBwZW5kXCI7XHJcbiAgICBQUklNQVJZX1RZUEU6IHN0cmluZyA9IFwiamNyOnByaW1hcnlUeXBlXCI7XHJcbiAgICBQT0xJQ1k6IHN0cmluZyA9IFwicmVwOnBvbGljeVwiO1xyXG5cclxuICAgIE1JWElOX1RZUEVTOiBzdHJpbmcgPSBcImpjcjptaXhpblR5cGVzXCI7XHJcblxyXG4gICAgRU1BSUxfQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgRU1BSUxfUkVDSVA6IHN0cmluZyA9IFwicmVjaXBcIjtcclxuICAgIEVNQUlMX1NVQkpFQ1Q6IHN0cmluZyA9IFwic3ViamVjdFwiO1xyXG5cclxuICAgIENSRUFURUQ6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRcIjtcclxuICAgIENSRUFURURfQlk6IHN0cmluZyA9IFwiamNyOmNyZWF0ZWRCeVwiO1xyXG4gICAgQ09OVEVOVDogc3RyaW5nID0gXCJqY3I6Y29udGVudFwiO1xyXG4gICAgVEFHUzogc3RyaW5nID0gXCJ0YWdzXCI7XHJcbiAgICBVVUlEOiBzdHJpbmcgPSBcImpjcjp1dWlkXCI7XHJcbiAgICBMQVNUX01PRElGSUVEOiBzdHJpbmcgPSBcImpjcjpsYXN0TW9kaWZpZWRcIjtcclxuICAgIExBU1RfTU9ESUZJRURfQlk6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZEJ5XCI7XHJcblxyXG4gICAgRElTQUJMRV9JTlNFUlQ6IHN0cmluZyA9IFwiZGlzYWJsZUluc2VydFwiO1xyXG5cclxuICAgIFVTRVI6IHN0cmluZyA9IFwidXNlclwiO1xyXG4gICAgUFdEOiBzdHJpbmcgPSBcInB3ZFwiO1xyXG4gICAgRU1BSUw6IHN0cmluZyA9IFwiZW1haWxcIjtcclxuICAgIENPREU6IHN0cmluZyA9IFwiY29kZVwiO1xyXG5cclxuICAgIEJJTl9WRVI6IHN0cmluZyA9IFwiYmluVmVyXCI7XHJcbiAgICBCSU5fREFUQTogc3RyaW5nID0gXCJqY3JEYXRhXCI7XHJcbiAgICBCSU5fTUlNRTogc3RyaW5nID0gXCJqY3I6bWltZVR5cGVcIjtcclxuXHJcbiAgICBJTUdfV0lEVEg6IHN0cmluZyA9IFwiaW1nV2lkdGhcIjtcclxuICAgIElNR19IRUlHSFQ6IHN0cmluZyA9IFwiaW1nSGVpZ2h0XCI7XHJcbn1cclxuXHJcbmlmICghd2luZG93W1wiamNyQ25zdFwiXSkge1xyXG4gICAgdmFyIGpjckNuc3Q6IEpjckNuc3QgPSBuZXcgSmNyQ25zdCgpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBhdHRhY2htZW50LmpzXCIpO1xyXG5cclxuY2xhc3MgQXR0YWNobWVudCB7XHJcblxyXG4gICAgLyogTm9kZSBiZWluZyB1cGxvYWRlZCB0byAqL1xyXG4gICAgdXBsb2FkTm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICBvcGVuVXBsb2FkRnJvbUZpbGVEbGcoKSA6dm9pZHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURsZygpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblVwbG9hZEZyb21VcmxEbGcoKSA6dm9pZHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVBdHRhY2htZW50KCkgOnZvaWQge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIHZhciB0aGl6OiBBdHRhY2htZW50ID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZSBBdHRhY2htZW50XCIsIFwiRGVsZXRlIHRoZSBBdHRhY2htZW50IG9uIHRoZSBOb2RlP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uKFwiZGVsZXRlQXR0YWNobWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWRcclxuICAgICAgICAgICAgICAgICAgICB9LCB0aGl6LmRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgdGhpeiwgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlKHJlczogYW55LCB1aWQ6IGFueSkgIDp2b2lke1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBhdHRhY2htZW50XCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlbW92ZUJpbmFyeUJ5VWlkKHVpZCk7XHJcbiAgICAgICAgICAgIC8vIGZvcmNlIHJlLXJlbmRlciBmcm9tIGxvY2FsIGRhdGEuXHJcbiAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcImF0dGFjaG1lbnRcIl0pIHtcclxuICAgIHZhciBhdHRhY2htZW50OiBBdHRhY2htZW50ID0gbmV3IEF0dGFjaG1lbnQoKTtcclxufVxyXG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBlZGl0LmpzXCIpO1xyXG5cclxuY2xhc3MgRWRpdCB7XHJcblxyXG4gICAgX2luc2VydEJvb2tSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0Qm9va1Jlc3BvbnNlIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBCb29rXCIsIHJlcyk7XHJcbiAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBfZGVsZXRlTm9kZXNSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXROb2RlRWRpdFJlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRWRpdGluZyBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSByZXMubm9kZUluZm87XHJcblxyXG4gICAgICAgICAgICB2YXIgaXNSZXAgPSBub2RlLm5hbWUuc3RhcnRzV2l0aChcInJlcDpcIikgfHwgLyogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnPyAqL25vZGUucGF0aC5jb250YWlucyhcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSBhbmQgd2UgYXJlIHRoZSBjb21tZW50ZXIgKi9cclxuICAgICAgICAgICAgdmFyIGVkaXRpbmdBbGxvd2VkID0gcHJvcHMuaXNPd25lZENvbW1lbnROb2RlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgZWRpdGluZ0FsbG93ZWQgPSAobWV0YTY0LmlzQWRtaW5Vc2VyIHx8ICFpc1JlcCkgJiYgIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXRpbmdBbGxvd2VkKSB7XHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHQgKiBTZXJ2ZXIgd2lsbCBoYXZlIHNlbnQgdXMgYmFjayB0aGUgcmF3IHRleHQgY29udGVudCwgdGhhdCBzaG91bGQgYmUgbWFya2Rvd24gaW5zdGVhZCBvZiBhbnkgSFRNTCwgc29cclxuXHRcdFx0XHQgKiB0aGF0IHdlIGNhbiBkaXNwbGF5IHRoaXMgYW5kIHNhdmUuXHJcblx0XHRcdFx0ICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdE5vZGVEbGdJbnN0Lm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBjYW5ub3QgZWRpdCBub2RlcyB0aGF0IHlvdSBkb24ndCBvd24uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX21vdmVOb2Rlc1Jlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiTW92ZSBub2Rlc1wiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXNUb01vdmUgPSBudWxsOyAvLyByZXNldFxyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3NldE5vZGVQb3NpdGlvblJlc3BvbnNlKHJlczogdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBub2RlIHBvc2l0aW9uXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3NwbGl0Q29udGVudFJlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1JlYWRPbmx5UHJvcGVydGllczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvKlxyXG4gICAgICogTm9kZSBJRCBhcnJheSBvZiBub2RlcyB0aGF0IGFyZSByZWFkeSB0byBiZSBtb3ZlZCB3aGVuIHVzZXIgY2xpY2tzICdGaW5pc2ggTW92aW5nJ1xyXG4gICAgICovXHJcbiAgICBub2Rlc1RvTW92ZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICBwYXJlbnRPZk5ld05vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIGluZGljYXRlcyBlZGl0b3IgaXMgZGlzcGxheWluZyBhIG5vZGUgdGhhdCBpcyBub3QgeWV0IHNhdmVkIG9uIHRoZSBzZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgZWRpdGluZ1Vuc2F2ZWROb2RlOiBhbnkgPSBmYWxzZTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbm9kZSAoTm9kZUluZm8uamF2YSkgdGhhdCBpcyBiZWluZyBjcmVhdGVkIHVuZGVyIHdoZW4gbmV3IG5vZGUgaXMgY3JlYXRlZFxyXG4gICAgICovXHJcbiAgICBzZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmU6IGFueSA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBOb2RlIGJlaW5nIGVkaXRlZFxyXG4gICAgICpcclxuICAgICAqIHRvZG8tMjogdGhpcyBhbmQgc2V2ZXJhbCBvdGhlciB2YXJpYWJsZXMgY2FuIG5vdyBiZSBtb3ZlZCBpbnRvIHRoZSBkaWFsb2cgY2xhc3M/IElzIHRoYXQgZ29vZCBvciBiYWRcclxuICAgICAqIGNvdXBsaW5nL3Jlc3BvbnNpYmlsaXR5P1xyXG4gICAgICovXHJcbiAgICBlZGl0Tm9kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiBJbnN0YW5jZSBvZiBFZGl0Tm9kZURpYWxvZzogRm9yIG5vdyBjcmVhdGluZyBuZXcgb25lIGVhY2ggdGltZSAqL1xyXG4gICAgZWRpdE5vZGVEbGdJbnN0OiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0eXBlPU5vZGVJbmZvLmphdmFcclxuICAgICAqXHJcbiAgICAgKiBXaGVuIGluc2VydGluZyBhIG5ldyBub2RlLCB0aGlzIGhvbGRzIHRoZSBub2RlIHRoYXQgd2FzIGNsaWNrZWQgb24gYXQgdGhlIHRpbWUgdGhlIGluc2VydCB3YXMgcmVxdWVzdGVkLCBhbmRcclxuICAgICAqIGlzIHNlbnQgdG8gc2VydmVyIGZvciBvcmRpbmFsIHBvc2l0aW9uIGFzc2lnbm1lbnQgb2YgbmV3IG5vZGUuIEFsc28gaWYgdGhpcyB2YXIgaXMgbnVsbCwgaXQgaW5kaWNhdGVzIHdlIGFyZVxyXG4gICAgICogY3JlYXRpbmcgaW4gYSAnY3JlYXRlIHVuZGVyIHBhcmVudCcgbW9kZSwgdmVyc3VzIG5vbi1udWxsIG1lYW5pbmcgJ2luc2VydCBpbmxpbmUnIHR5cGUgb2YgaW5zZXJ0LlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgbm9kZUluc2VydFRhcmdldDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICBpc0VkaXRBbGxvd2VkKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQuZWRpdE1vZGUgJiYgbm9kZS5wYXRoICE9IFwiL1wiICYmXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAoIXByb3BzLmlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB8fCBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSkpIC8vXHJcbiAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBiZXN0IHdlIGNhbiBkbyBoZXJlIGlzIGFsbG93IHRoZSBkaXNhYmxlSW5zZXJ0IHByb3AgdG8gYmUgYWJsZSB0byB0dXJuIHRoaW5ncyBvZmYsIG5vZGUgYnkgbm9kZSAqL1xyXG4gICAgaXNJbnNlcnRBbGxvd2VkKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5ESVNBQkxFX0lOU0VSVCwgbm9kZSkgPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEVkaXRpbmdOZXdOb2RlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lZGl0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcoKTtcclxuICAgICAgICB0aGlzLmVkaXROb2RlRGxnSW5zdC5zYXZlTmV3Tm9kZShcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogY2FsbGVkIHRvIGRpc3BsYXkgZWRpdG9yIHRoYXQgd2lsbCBjb21lIHVwIEJFRk9SRSBhbnkgbm9kZSBpcyBzYXZlZCBvbnRvIHRoZSBzZXJ2ZXIsIHNvIHRoYXQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqIGFueSBzYXZlIGlzIHBlcmZvcm1lZCB3ZSB3aWxsIGhhdmUgdGhlIGNvcnJlY3Qgbm9kZSBuYW1lLCBhdCBsZWFzdC5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIHZlcnNpb24gaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQsIGFuZCBjdXJyZW50bHkgdGhpcyBtZWFucyAnZWRpdGluZ1Vuc2F2ZWROb2RlJyBpcyBub3QgY3VycmVudGx5IGV2ZXJcclxuICAgICAqIHRyaWdnZXJlZC4gVGhlIG5ldyBhcHByb2FjaCBub3cgdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvICdyZW5hbWUnIG5vZGVzIGlzIHRvIGp1c3QgY3JlYXRlIG9uZSB3aXRoIGFcclxuICAgICAqIHJhbmRvbSBuYW1lIGFuIGxldCB1c2VyIHN0YXJ0IGVkaXRpbmcgcmlnaHQgYXdheSBhbmQgdGhlbiByZW5hbWUgdGhlIG5vZGUgSUYgYSBjdXN0b20gbm9kZSBuYW1lIGlzIG5lZWRlZC5cclxuICAgICAqXHJcbiAgICAgKiBXaGF0IHRoaXMgbWVhbnMgaXMgaWYgd2UgY2FsbCB0aGlzIGZ1bmN0aW9uIChzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUpIGluc3RlYWQgb2YgJ3N0YXJ0RWRpdGluZ05ld05vZGUoKSdcclxuICAgICAqIHRoYXQgd2lsbCBjYXVzZSB0aGUgR1VJIHRvIGFsd2F5cyBwcm9tcHQgZm9yIHRoZSBub2RlIG5hbWUgYmVmb3JlIGNyZWF0aW5nIHRoZSBub2RlLiBUaGlzIHdhcyB0aGUgb3JpZ2luYWxcclxuICAgICAqIGZ1bmN0aW9uYWxpdHkgYW5kIHN0aWxsIHdvcmtzLlxyXG4gICAgICovXHJcbiAgICBzdGFydEVkaXRpbmdOZXdOb2RlV2l0aE5hbWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5lZGl0aW5nVW5zYXZlZE5vZGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIHRoaXMuZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0Tm9kZURsZ0luc3Qub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluc2VydE5vZGVSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkluc2VydCBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlKTtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVN1Yk5vZGVSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNyZWF0ZSBzdWJub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5FZGl0Tm9kZShyZXMubmV3Tm9kZS51aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzYXZlTm9kZVJlc3BvbnNlKHJlczogYW55LCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRNb2RlKCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5lZGl0TW9kZSA9IG1ldGE2NC5lZGl0TW9kZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAvLyB0b2RvLTM6IHJlYWxseSBlZGl0IG1vZGUgYnV0dG9uIG5lZWRzIHRvIGJlIHNvbWUga2luZCBvZiBidXR0b25cclxuICAgICAgICAvLyB0aGF0IGNhbiBzaG93IGFuIG9uL29mZiBzdGF0ZS5cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU2luY2UgZWRpdCBtb2RlIHR1cm5zIG9uIGxvdHMgb2YgYnV0dG9ucywgdGhlIGxvY2F0aW9uIG9mIHRoZSBub2RlIHdlIGFyZSB2aWV3aW5nIGNhbiBjaGFuZ2Ugc28gbXVjaCBpdFxyXG4gICAgICAgICAqIGdvZXMgY29tcGxldGVseSBvZmZzY3JlZW4gb3V0IG9mIHZpZXcsIHNvIHdlIHNjcm9sbCBpdCBiYWNrIGludG8gdmlldyBldmVyeSB0aW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwbGl0Q29udGVudCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbm9kZUJlbG93OiBOb2RlSW5mbyA9IHRoaXMuZ2V0Tm9kZUJlbG93KHRoaXMuZWRpdE5vZGUpO1xyXG4gICAgICAgIHV0aWwuanNvbihcInNwbGl0Tm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHRoaXMuZWRpdE5vZGUuaWQsXHJcbiAgICAgICAgICAgIFwibm9kZUJlbG93SWRcIjogKG5vZGVCZWxvdyA9PSBudWxsID8gbnVsbCA6IG5vZGVCZWxvdy5pZClcclxuICAgICAgICB9LCB0aGlzLl9zcGxpdENvbnRlbnRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsRWRpdCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC50cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZU5vZGVVcCh1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlQWJvdmUgPSB0aGlzLmdldE5vZGVBYm92ZShub2RlKTtcclxuICAgICAgICAgICAgaWYgKG5vZGVBYm92ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGVBYm92ZS5uYW1lXHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3NldE5vZGVQb3NpdGlvblJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTm9kZURvd24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZUJlbG93ID0gdGhpcy5nZXROb2RlQmVsb3cobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChub2RlQmVsb3cgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb24oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUJlbG93Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBub2RlLm5hbWVcclxuICAgICAgICAgICAgfSwgdGhpcy5fc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWRUb05vZGVNYXAgZG9lcyBub3QgY29udGFpbiBcIiArIHVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGFib3ZlIHRoZSBzcGVjaWZpZWQgbm9kZSBvciBudWxsIGlmIG5vZGUgaXMgaXRzZWxmIHRoZSB0b3Agbm9kZVxyXG4gICAgICovXHJcbiAgICBnZXROb2RlQWJvdmUobm9kZSk6IGFueSB7XHJcbiAgICAgICAgdmFyIG9yZGluYWwgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICBpZiAob3JkaW5hbCA8PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdGhlIG5vZGUgYmVsb3cgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIGJvdHRvbSBub2RlXHJcbiAgICAgKi9cclxuICAgIGdldE5vZGVCZWxvdyhub2RlOiBhbnkpOiBOb2RlSW5mbyB7XHJcbiAgICAgICAgdmFyIG9yZGluYWwgPSBtZXRhNjQuZ2V0T3JkaW5hbE9mTm9kZShub2RlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9yZGluYWwgPSBcIiArIG9yZGluYWwpO1xyXG4gICAgICAgIGlmIChvcmRpbmFsID09IC0xIHx8IG9yZGluYWwgPj0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bb3JkaW5hbCArIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZ1bGxSZXBvc2l0b3J5RXhwb3J0OiBmdW5jdGlvbigpIHtcclxuICAgIC8vICAgICB1dGlsLmpzb24oXCJleHBvcnRUb1htbFwiLCB7XHJcbiAgICAvLyAgICAgICAgIFwibm9kZUlkXCI6IFwiL1wiXHJcbiAgICAvLyAgICAgfSwgdGhpcy5fZXhwb3J0UmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgLy8gfSxcclxuXHJcbiAgICBydW5FZGl0Tm9kZSh1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHZhciBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gZWRpdE5vZGVDbGljazogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdXRpbC5qc29uKFwiaW5pdE5vZGVFZGl0XCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZFxyXG4gICAgICAgIH0sIHRoaXMuX2luaXROb2RlRWRpdFJlc3BvbnNlLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnNlcnROb2RlKHVpZDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIHBhcmVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSBnZXQgdGhlIG5vZGUgc2VsZWN0ZWQgZm9yIHRoZSBpbnNlcnQgcG9zaXRpb24gYnkgdXNpbmcgdGhlIHVpZCBpZiBvbmUgd2FzIHBhc3NlZCBpbiBvciB1c2luZyB0aGVcclxuICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgbm9kZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0VGFyZ2V0ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5zdGFydEVkaXRpbmdOZXdOb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVN1Yk5vZGVVbmRlckhpZ2hsaWdodCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJlbnRPZk5ld05vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcmVudE9mTmV3Tm9kZSkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJUYXAgYSBub2RlIHRvIGluc2VydCB1bmRlci5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5ub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXJ0RWRpdGluZ05ld05vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXBseVRvQ29tbWVudCh1aWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU3ViTm9kZSh1aWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVN1Yk5vZGUodWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIElmIG5vIHVpZCBwcm92aWRlZCB3ZSBkZWFmdWx0IHRvIGNyZWF0aW5nIGEgbm9kZSB1bmRlciB0aGUgY3VycmVudGx5IHZpZXdlZCBub2RlIChwYXJlbnQgb2YgY3VycmVudCBwYWdlKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LmN1cnJlbnROb2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50T2ZOZXdOb2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gbm9kZUlkIGluIGNyZWF0ZVN1Yk5vZGU6IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5ub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXJ0RWRpdGluZ05ld05vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclNlbGVjdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFdlIGNvdWxkIHdyaXRlIGNvZGUgdGhhdCBvbmx5IHNjYW5zIGZvciBhbGwgdGhlIFwiU0VMXCIgYnV0dG9ucyBhbmQgdXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlbSwgYnV0IGZvciBub3dcclxuICAgICAgICAgKiB3ZSB0YWtlIHRoZSBzaW1wbGUgYXBwcm9hY2ggYW5kIGp1c3QgcmUtcmVuZGVyIHRoZSBwYWdlLiBUaGVyZSBpcyBubyBjYWxsIHRvIHRoZSBzZXJ2ZXIsIHNvIHRoaXMgaXNcclxuICAgICAgICAgKiBhY3R1YWxseSB2ZXJ5IGVmZmljaWVudC5cclxuICAgICAgICAgKi9cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBEZWxldGUgdGhlIHNpbmdsZSBub2RlIGlkZW50aWZpZWQgYnkgJ3VpZCcgcGFyYW1ldGVyIGlmIHVpZCBwYXJhbWV0ZXIgaXMgcGFzc2VkLCBhbmQgaWYgdWlkIHBhcmFtZXRlciBpcyBub3RcclxuICAgICAqIHBhc3NlZCB0aGVuIHVzZSB0aGUgbm9kZSBzZWxlY3Rpb25zIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25zIG9uIHRoZSBwYWdlLlxyXG4gICAgICovXHJcbiAgICBkZWxldGVTZWxOb2RlcygpOiB2b2lkIHtcclxuICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgIGlmICghc2VsTm9kZXNBcnJheSB8fCBzZWxOb2Rlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBkZWxldGUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZVwiLCBcIkRlbGV0ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSA/XCIsIFwiWWVzLCBkZWxldGUuXCIsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uKFwiZGVsZXRlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBzZWxOb2Rlc0FycmF5XHJcbiAgICAgICAgICAgICAgICB9LCB0aGl6Ll9kZWxldGVOb2Rlc1Jlc3BvbnNlLCB0aGl6KTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlU2VsTm9kZXMoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHZhciBzZWxOb2Rlc0FycmF5ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCk7XHJcbiAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIHRvIG1vdmUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgIFwiQ29uZmlybSBNb3ZlXCIsXHJcbiAgICAgICAgICAgIFwiTW92ZSBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSB0byBhIG5ldyBsb2NhdGlvbiA/XCIsXHJcbiAgICAgICAgICAgIFwiWWVzLCBtb3ZlLlwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXoubm9kZXNUb01vdmUgPSBzZWxOb2Rlc0FycmF5O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTsgLy8gY2xlYXIgc2VsZWN0aW9ucy5cclxuICAgICAgICAgICAgICAgIC8vIE5vIGxvbmdlciBuZWVkXHJcbiAgICAgICAgICAgICAgICAvLyBvciB3YW50IGFueSBzZWxlY3Rpb25zLlxyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiSWRlbnRpZmllZCBub2RlcyB0byBtb3ZlLjxwLz5UbyBhY3R1YWxseSBtb3ZlIHRoZXNlIG5vZGVzLCBicm93c2UgdG8gdGhlIHRhcmdldCBsb2NhdGlvbiwgdGhlbiBjbGljayAnRmluaXNoIE1vdmluZyc8cC8+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIFwiVGhlIG5vZGVzIHdpbGwgdGhlbiBiZSBtb3ZlZCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIHN1Ym5vZGVzIHVuZGVyIHRoZSB0YXJnZXQgbm9kZS4gKGkuZS4gVGhlIHRhcmdldCB5b3Ugc2VsZWN0IHdpbGwgYmVjb21lIHRoZSBuZXcgcGFyZW50IG9mIHRoZSBub2RlcylcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmlzaE1vdmluZ1NlbE5vZGVzKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCB0aGl6ID0gdGhpcztcclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIE1vdmVcIiwgXCJNb3ZlIFwiICsgdGhpei5ub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHRvIHNlbGVjdGVkIGxvY2F0aW9uID9cIixcclxuICAgICAgICAgICAgXCJZZXMsIG1vdmUuXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBGb3Igbm93LCB3ZSB3aWxsIGp1c3QgY3JhbSB0aGUgbm9kZXMgb250byB0aGUgZW5kIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgKiBwYWdlLiBMYXRlciBvbiB3ZSBjYW4gZ2V0IG1vcmUgc3BlY2lmaWMgYWJvdXQgYWxsb3dpbmcgcHJlY2lzZSBkZXN0aW5hdGlvbiBsb2NhdGlvbiBmb3IgbW92ZWRcclxuICAgICAgICAgICAgICAgICAqIG5vZGVzLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb24oXCJtb3ZlTm9kZXNcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Tm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRDaGlsZElkXCI6IGhpZ2hsaWdodE5vZGUgIT0gbnVsbCA/IGhpZ2hsaWdodE5vZGUuaWQgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiB0aGl6Lm5vZGVzVG9Nb3ZlXHJcbiAgICAgICAgICAgICAgICB9LCB0aGl6Ll9tb3ZlTm9kZXNSZXNwb25zZSwgdGhpeik7XHJcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5zZXJ0Qm9va1dhckFuZFBlYWNlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybVwiLCBcIkluc2VydCBib29rIFdhciBhbmQgUGVhY2U/PHAvPldhcm5pbmc6IFlvdSBzaG91bGQgaGF2ZSBhbiBFTVBUWSBub2RlIHNlbGVjdGVkIG5vdywgdG8gc2VydmUgYXMgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgYm9vayFcIiwgXCJZZXMsIGluc2VydCBib29rLlwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGluc2VydGluZyB1bmRlciB3aGF0ZXZlciBub2RlIHVzZXIgaGFzIGZvY3VzZWQgKi9cclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb24oXCJpbnNlcnRCb29rXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9va05hbWVcIjogXCJXYXIgYW5kIFBlYWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0cnVuY2F0ZWRcIjogdXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpXHJcbiAgICAgICAgICAgICAgICB9LCB0aGl6Ll9pbnNlcnRCb29rUmVzcG9uc2UsIHRoaXopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJlZGl0XCJdKSB7XHJcbiAgICB2YXIgZWRpdDogRWRpdCA9IG5ldyBFZGl0KCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWV0YTY0LmpzXCIpO1xyXG5cclxuLyoqXHJcbiAqIE1haW4gQXBwbGljYXRpb24gaW5zdGFuY2UsIGFuZCBjZW50cmFsIHJvb3QgbGV2ZWwgb2JqZWN0IGZvciBhbGwgY29kZSwgYWx0aG91Z2ggZWFjaCBtb2R1bGUgZ2VuZXJhbGx5IGNvbnRyaWJ1dGVzIG9uZVxyXG4gKiBzaW5nbGV0b24gdmFyaWFibGUgdG8gdGhlIGdsb2JhbCBzY29wZSwgd2l0aCBhIG5hbWUgdXN1YWxseSBpZGVudGljYWwgdG8gdGhhdCBmaWxlLlxyXG4gKi9cclxuY2xhc3MgTWV0YTY0IHtcclxuXHJcbiAgICBhcHBJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGN1clVybFBhdGg6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcblxyXG4gICAgY29kZUZvcm1hdERpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBzZXJ2ZXJNYXJrZG93bjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICBuZXh0R3VpZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKiBuYW1lIG9mIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlciAqL1xyXG4gICAgdXNlck5hbWU6IHN0cmluZyA9IFwiYW5vbnltb3VzXCI7XHJcblxyXG4gICAgLyogc2NyZWVuIGNhcGFiaWxpdGllcyAqL1xyXG4gICAgZGV2aWNlV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICBkZXZpY2VIZWlnaHQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLypcclxuICAgICAqIFVzZXIncyByb290IG5vZGUuIFRvcCBsZXZlbCBvZiB3aGF0IGxvZ2dlZCBpbiB1c2VyIGlzIGFsbG93ZWQgdG8gc2VlLlxyXG4gICAgICovXHJcbiAgICBob21lTm9kZUlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgaG9tZU5vZGVQYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzcGVjaWZpZXMgaWYgdGhpcyBpcyBhZG1pbiB1c2VyLlxyXG4gICAgICovXHJcbiAgICBpc0FkbWluVXNlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qIGFsd2F5cyBzdGFydCBvdXQgYXMgYW5vbiB1c2VyIHVudGlsIGxvZ2luICovXHJcbiAgICBpc0Fub25Vc2VyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBzaWduYWxzIHRoYXQgZGF0YSBoYXMgY2hhbmdlZCBhbmQgdGhlIG5leHQgdGltZSB3ZSBnbyB0byB0aGUgbWFpbiB0cmVlIHZpZXcgd2luZG93IHdlIG5lZWQgdG8gcmVmcmVzaCBkYXRhXHJcbiAgICAgKiBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAqL1xyXG4gICAgdHJlZURpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZS51aWQgdmFsdWVzIHRvIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICpcclxuICAgICAqIFRoZSBvbmx5IGNvbnRyYWN0IGFib3V0IHVpZCB2YWx1ZXMgaXMgdGhhdCB0aGV5IGFyZSB1bmlxdWUgaW5zb2ZhciBhcyBhbnkgb25lIG9mIHRoZW0gYWx3YXlzIG1hcHMgdG8gdGhlIHNhbWVcclxuICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICovXHJcbiAgICB1aWRUb05vZGVNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qIE1hcHMgZnJvbSB0aGUgRE9NIElEIHRvIHRoZSBlZGl0b3IgamF2YXNjcmlwdCBpbnN0YW5jZSAoQWNlIEVkaXRvciBpbnN0YW5jZSkgKi9cclxuICAgIGFjZUVkaXRvcnNCeUlkOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogbWFwcyBub2RlLmlkIHZhbHVlcyB0byBOb2RlSW5mby5qYXZhIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgaWRUb05vZGVNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qIGNvdW50ZXIgZm9yIGxvY2FsIHVpZHMgKi9cclxuICAgIG5leHRVaWQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgLypcclxuICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICogbmV4dFVpZCBhcyB0aGUgY291bnRlci5cclxuICAgICAqL1xyXG4gICAgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIFVuZGVyIGFueSBnaXZlbiBub2RlLCB0aGVyZSBjYW4gYmUgb25lIGFjdGl2ZSAnc2VsZWN0ZWQnIG5vZGUgdGhhdCBoYXMgdGhlIGhpZ2hsaWdodGluZywgYW5kIHdpbGwgYmUgc2Nyb2xsZWRcclxuICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAqIHNlbGVjdGVkIG5vZGUgKE5vZGVJbmZvIG9iamVjdClcIiwgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyZW50IG5vZGUgdWlkLCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjdXJyZW50bHlcclxuICAgICAqIHNlbGVjdGVkIG5vZGUgd2l0aGluIHRoYXQgcGFyZW50LiBOb3RlIHRoaXMgJ3NlbGVjdGlvbiBzdGF0ZScgaXMgb25seSBzaWduaWZpY2FudCBvbiB0aGUgY2xpZW50LCBhbmQgb25seSBmb3JcclxuICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBkZXRlcm1pbmVzIGlmIHdlIHNob3VsZCByZW5kZXIgYWxsIHRoZSBlZGl0aW5nIGJ1dHRvbnMgb24gZWFjaCByb3dcclxuICAgICAqL1xyXG4gICAgZWRpdE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiBVc2VyLXNlbGVjdGFibGUgdXNlci1hY2NvdW50IG9wdGlvbnMgZWFjaCB1c2VyIGNhbiBzZXQgb24gaGlzIGFjY291bnQgKi9cclxuICAgIE1PREVfQURWQU5DRUQ6IHN0cmluZyA9IFwiYWR2YW5jZWRcIjtcclxuICAgIE1PREVfU0lNUExFOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgIC8qIGNhbiBiZSAnc2ltcGxlJyBvciAnYWR2YW5jZWQnICovXHJcbiAgICBlZGl0TW9kZU9wdGlvbjogc3RyaW5nID0gXCJzaW1wbGVcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgICogdG9nZ2xlZCBieSBidXR0b24sIGFuZCBob2xkcyBpZiB3ZSBhcmUgZ29pbmcgdG8gc2hvdyBwcm9wZXJ0aWVzIG9yIG5vdCBvbiBlYWNoIG5vZGUgaW4gdGhlIG1haW4gdmlld1xyXG4gICAgICovXHJcbiAgICBzaG93UHJvcGVydGllczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBMaXN0IG9mIG5vZGUgcHJlZml4ZXMgdG8gZmxhZyBub2RlcyB0byBub3QgYWxsb3cgdG8gYmUgc2hvd24gaW4gdGhlIHBhZ2UgaW4gc2ltcGxlIG1vZGVcclxuICAgICAqL1xyXG4gICAgc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3Q6IGFueSA9IHtcclxuICAgICAgICBcInJlcDpcIjogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIHJlYWRPbmx5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICBiaW5hcnlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIGFsbCBub2RlIHVpZHMgdG8gdHJ1ZSBpZiBzZWxlY3RlZCwgb3RoZXJ3aXNlIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZGVsZXRlZCAobm90IGV4aXN0aW5nKVxyXG4gICAgICovXHJcbiAgICBzZWxlY3RlZE5vZGVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKiBSZW5kZXJOb2RlUmVzcG9uc2UuamF2YSBvYmplY3QgKi9cclxuICAgIGN1cnJlbnROb2RlRGF0YTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKlxyXG4gICAgICogYWxsIHZhcmlhYmxlcyBkZXJpdmFibGUgZnJvbSBjdXJyZW50Tm9kZURhdGEsIGJ1dCBzdG9yZWQgZGlyZWN0bHkgZm9yIHNpbXBsZXIgY29kZS9hY2Nlc3NcclxuICAgICAqL1xyXG4gICAgY3VycmVudE5vZGU6IGFueSA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZVVpZDogYW55ID0gbnVsbDtcclxuICAgIGN1cnJlbnROb2RlSWQ6IGFueSA9IG51bGw7XHJcbiAgICBjdXJyZW50Tm9kZVBhdGg6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyogTWFwcyBmcm9tIGd1aWQgdG8gRGF0YSBPYmplY3QgKi9cclxuICAgIGRhdGFPYmpNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIHVwZGF0ZU1haW5NZW51UGFuZWwoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidWlsZGluZyBtYWluIG1lbnUgcGFuZWxcIik7XHJcbiAgICAgICAgbWVudVBhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgbWVudVBhbmVsLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlcyBhICdndWlkJyBvbiB0aGlzIG9iamVjdCwgYW5kIG1ha2VzIGRhdGFPYmpNYXAgYWJsZSB0byBsb29rIHVwIHRoZSBvYmplY3QgdXNpbmcgdGhhdCBndWlkIGluIHRoZVxyXG4gICAgICogZnV0dXJlLlxyXG4gICAgICovXHJcbiAgICByZWdpc3RlckRhdGFPYmplY3QoZGF0YSkge1xyXG4gICAgICAgIGlmICghZGF0YS5ndWlkKSB7XHJcbiAgICAgICAgICAgIGRhdGEuZ3VpZCA9ICsrdGhpcy5uZXh0R3VpZDtcclxuICAgICAgICAgICAgdGhpcy5kYXRhT2JqTWFwW2RhdGEuZ3VpZF0gPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRPYmplY3RCeUd1aWQoZ3VpZCkge1xyXG4gICAgICAgIHZhciByZXQgPSB0aGlzLmRhdGFPYmpNYXBbZ3VpZF07XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhIG9iamVjdCBub3QgZm91bmQ6IGd1aWQ9XCIgKyBndWlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogSWYgY2FsbGJhY2sgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgYSBzY3JpcHQgdG8gcnVuLCBvciBpZiBpdCdzIGEgZnVuY3Rpb24gb2JqZWN0IHRoYXQgd2lsbCBiZVxyXG4gICAgICogdGhlIGZ1bmN0aW9uIHRvIHJ1bi5cclxuICAgICAqXHJcbiAgICAgKiBXaGVuZXZlciB3ZSBhcmUgYnVpbGRpbmcgYW4gb25DbGljayBzdHJpbmcsIGFuZCB3ZSBoYXZlIHRoZSBhY3R1YWwgZnVuY3Rpb24sIHJhdGhlciB0aGFuIHRoZSBuYW1lIG9mIHRoZVxyXG4gICAgICogZnVuY3Rpb24gKGkuZS4gd2UgaGF2ZSB0aGUgZnVuY3Rpb24gb2JqZWN0IGFuZCBub3QgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gd2UgaGFuZGUgdGhhdCBieSBhc3NpZ25pbmcgYSBndWlkXHJcbiAgICAgKiB0byB0aGUgZnVuY3Rpb24gb2JqZWN0LCBhbmQgdGhlbiBlbmNvZGUgYSBjYWxsIHRvIHJ1biB0aGF0IGd1aWQgYnkgY2FsbGluZyBydW5DYWxsYmFjay4gVGhlcmUgaXMgYSBsZXZlbCBvZlxyXG4gICAgICogaW5kaXJlY3Rpb24gaGVyZSwgYnV0IHRoaXMgaXMgdGhlIHNpbXBsZXN0IGFwcHJvYWNoIHdoZW4gd2UgbmVlZCB0byBiZSBhYmxlIHRvIG1hcCBmcm9tIGEgc3RyaW5nIHRvIGFcclxuICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIGN0eD1jb250ZXh0LCB3aGljaCBpcyB0aGUgJ3RoaXMnIHRvIGNhbGwgd2l0aCBpZiB3ZSBoYXZlIGEgZnVuY3Rpb24sIGFuZCBoYXZlIGEgJ3RoaXMnIGNvbnRleHQgdG8gYmluZCB0byBpdC5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgICAgICB9IC8vXHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRGF0YU9iamVjdChjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3R4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRGF0YU9iamVjdChjdHgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibWV0YTY0LnJ1bkNhbGxiYWNrKFwiICsgY2FsbGJhY2suZ3VpZCArIFwiLFwiICsgY3R4Lmd1aWQgKyBcIik7XCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJtZXRhNjQucnVuQ2FsbGJhY2soXCIgKyBjYWxsYmFjay5ndWlkICsgXCIpO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJ1bkNhbGxiYWNrKGd1aWQsIGN0eCkge1xyXG4gICAgICAgIHZhciBkYXRhT2JqID0gdGhpcy5nZXRPYmplY3RCeUd1aWQoZ3VpZCk7XHJcblxyXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gb2JqZWN0LCB3ZSBleHBlY3QgaXQgdG8gaGF2ZSBhICdjYWxsYmFjaycgcHJvcGVydHlcclxuICAgICAgICAvLyB0aGF0IGlzIGEgZnVuY3Rpb25cclxuICAgICAgICBpZiAoZGF0YU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICBkYXRhT2JqLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIG9yIGVsc2Ugc29tZXRpbWVzIHRoZSByZWdpc3RlcmVkIG9iamVjdCBpdHNlbGYgaXMgdGhlIGZ1bmN0aW9uLFxyXG4gICAgICAgIC8vIHdoaWNoIGlzIG9rIHRvb1xyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhT2JqID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzLmdldE9iamVjdEJ5R3VpZChjdHgpO1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsKHRoaXopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iaigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJ1bmFibGUgdG8gZmluZCBjYWxsYmFjayBvbiByZWdpc3RlcmVkIGd1aWQ6IFwiICsgZ3VpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluU2ltcGxlTW9kZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lZGl0TW9kZU9wdGlvbiA9PT0gdGhpcy5NT0RFX1NJTVBMRTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKCkge1xyXG4gICAgICAgIHRoaXMuZ29Ub01haW5QYWdlKHRydWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdvVG9NYWluUGFnZShyZXJlbmRlcj86IGJvb2xlYW4sIGZvcmNlU2VydmVyUmVmcmVzaD86IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgaWYgKGZvcmNlU2VydmVyUmVmcmVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVyZW5kZXIgfHwgdGhpcy50cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudHJlZURpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBub3QgcmUtcmVuZGVyaW5nIHBhZ2UgKGVpdGhlciBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBkYXRhLCB0aGVuIHdlIGp1c3QgbmVlZCB0byBsaXR0ZXJhbGx5IHN3aXRjaFxyXG4gICAgICAgICAqIHBhZ2UgaW50byB2aXNpYmxlLCBhbmQgc2Nyb2xsIHRvIG5vZGUpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VGFiKHBhZ2VOYW1lKSB7XHJcbiAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAoPF9IYXNTZWxlY3Q+aXJvblBhZ2VzKS5zZWxlY3QocGFnZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgKiBtZXRob2RzIGFyZSBvZiBjb3Vyc2Ugc2luZ2xldG9ucyB0aGF0IGFjY2VwdCB0aGlzIGRhdGEgcGFyYW1ldGVyIGZvciBhbnkgb3B0ZXJhdGlvbnMuIChvbGRzY2hvb2wgd2F5IG9mIGRvaW5nXHJcbiAgICAgKiBPT1Agd2l0aCAndGhpcycgYmVpbmcgZmlyc3QgcGFyYW1ldGVyIGFsd2F5cykuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogZWFjaCBkYXRhIGluc3RhbmNlIGlzIHJlcXVpcmVkIHRvIGhhdmUgYSBndWlkIG51bWJlcmljIHByb3BlcnR5LCB1bmlxdWUgdG8gaXQuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjaGFuZ2VQYWdlKHBnPzogYW55LCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwZy50YWJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvb3BzLCB3cm9uZyBvYmplY3QgdHlwZSBwYXNzZWQgdG8gY2hhbmdlUGFnZSBmdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHVzaW5nIG1haW5Jcm9uUGFnZXM/PyAqL1xyXG4gICAgICAgIHZhciBwYXBlclRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgKDxfSGFzU2VsZWN0PnBhcGVyVGFicykuc2VsZWN0KHBnLnRhYklkKTtcclxuICAgIH1cclxuXHJcbiAgICBpc05vZGVCbGFja0xpc3RlZChub2RlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHZhciBwcm9wO1xyXG4gICAgICAgIGZvciAocHJvcCBpbiB0aGlzLnNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0Lmhhc093blByb3BlcnR5KHByb3ApICYmIG5vZGUubmFtZS5zdGFydHNXaXRoKHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSgpIHtcclxuICAgICAgICB2YXIgc2VsQXJyYXkgPSBbXSwgaWR4ID0gMCwgdWlkO1xyXG5cclxuICAgICAgICBmb3IgKHVpZCBpbiB0aGlzLnNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdGVkTm9kZUlkc0FycmF5KCkge1xyXG4gICAgICAgIHZhciBzZWxBcnJheSA9IFtdLCBpZHggPSAwLCB1aWQ7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gc2VsZWN0ZWQgbm9kZXMuXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWROb2RlIGNvdW50OiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudCh0aGlzLnNlbGVjdGVkTm9kZXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodWlkIGluIHRoaXMuc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5hYmxlIHRvIGZpbmQgdWlkVG9Ob2RlTWFwIGZvciB1aWQ9XCIgKyB1aWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxBcnJheVtpZHgrK10gPSBub2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBHZXRzIHNlbGVjdGVkIG5vZGVzIGFzIE5vZGVJbmZvLmphdmEgb2JqZWN0cyBhcnJheSAqL1xyXG4gICAgZ2V0U2VsZWN0ZWROb2Rlc0FycmF5KCkge1xyXG4gICAgICAgIHZhciBzZWxBcnJheSA9IFtdLCBpZHggPSAwLCB1aWQ7XHJcbiAgICAgICAgZm9yICh1aWQgaW4gdGhpcy5zZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZXMuaGFzT3duUHJvcGVydHkodWlkKSkge1xyXG4gICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdGhpcy51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VsQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTZWxlY3RlZE5vZGVzKCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKSB7XHJcbiAgICAgICAgdmFyIG93bmVyQnVmID0gJyc7XHJcbiAgICAgICAgdmFyIG1pbmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHJlcy5vd25lcnMpIHtcclxuICAgICAgICAgICAgJC5lYWNoKHJlcy5vd25lcnMsIGZ1bmN0aW9uKGluZGV4LCBvd25lcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lckJ1ZiArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3duZXIgPT09IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IG93bmVyO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIG5vZGUub3duZXIgPSBvd25lckJ1ZjtcclxuICAgICAgICAgICAgdmFyIGVsbSA9ICQoXCIjb3duZXJEaXNwbGF5XCIgKyBub2RlLnVpZCk7XHJcbiAgICAgICAgICAgIGVsbS5odG1sKFwiIChNYW5hZ2VyOiBcIiArIG93bmVyQnVmICsgXCIpXCIpO1xyXG4gICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJjcmVhdGVkLWJ5LW90aGVyXCIsIFwiY3JlYXRlZC1ieS1tZVwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG0sIFwiY3JlYXRlZC1ieS1tZVwiLCBcImNyZWF0ZWQtYnktb3RoZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTm9kZUluZm8obm9kZSkge1xyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uKFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICBcImluY2x1ZGVBY2xcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiaW5jbHVkZU93bmVyc1wiOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICBpcm9uUmVzLmNvbXBsZXRlcy50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGl6LnVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgbm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogUmV0dXJucyB0aGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBub2RlLmlkIHZhbHVlICovXHJcbiAgICBnZXROb2RlRnJvbUlkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRUb05vZGVNYXBbaWRdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGhPZlVpZCh1aWQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIltwYXRoIGVycm9yLiBpbnZhbGlkIHVpZDogXCIgKyB1aWQgKyBcIl1cIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5wYXRoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRIaWdobGlnaHRlZE5vZGUoKSB7XHJcbiAgICAgICAgdmFyIHJldCA9IHRoaXMucGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbdGhpcy5jdXJyZW50Tm9kZVVpZF07XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRSb3dCeUlkKGlkLCBzY3JvbGwpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUZyb21JZChpZCk7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHROb2RlKG5vZGUsIHNjcm9sbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaWdobGlnaHRSb3dCeUlkIGZhaWxlZCB0byBmaW5kIGlkOiBcIiArIGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIEltcG9ydGFudDogV2Ugd2FudCB0aGlzIHRvIGJlIHRoZSBvbmx5IG1ldGhvZCB0aGF0IGNhbiBzZXQgdmFsdWVzIG9uICdwYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCcsIGFuZCBhbHdheXNcclxuICAgICAqIHNldHRpbmcgdGhhdCB2YWx1ZSBzaG91bGQgZ28gdGhydSB0aGlzIGZ1bmN0aW9uLlxyXG4gICAgICovXHJcbiAgICBoaWdobGlnaHROb2RlKG5vZGUsIHNjcm9sbCkge1xyXG4gICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgZG9uZUhpZ2hsaWdodGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICB2YXIgY3VySGlnaGxpZ2h0ZWROb2RlID0gdGhpcy5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcFt0aGlzLmN1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICBpZiAoY3VySGlnaGxpZ2h0ZWROb2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJIaWdobGlnaHRlZE5vZGUudWlkID09PSBub2RlLnVpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbHJlYWR5IGhpZ2hsaWdodGVkLlwiKTtcclxuICAgICAgICAgICAgICAgIGRvbmVIaWdobGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvd0VsbUlkID0gY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvd0VsbSA9ICQoXCIjXCIgKyByb3dFbG1JZCk7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZG9uZUhpZ2hsaWdodGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW3RoaXMuY3VycmVudE5vZGVVaWRdID0gbm9kZTtcclxuXHJcbiAgICAgICAgICAgIHZhciByb3dFbG1JZCA9IG5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgIHZhciByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3Mocm93RWxtLCBcImluYWN0aXZlLXJvd1wiLCBcImFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlYWxseSBuZWVkIHRvIHVzZSBwdWIvc3ViIGV2ZW50IHRvIGJyb2FkY2FzdCBlbmFibGVtZW50LCBhbmQgbGV0IGVhY2ggY29tcG9uZW50IGRvIHRoaXMgaW5kZXBlbmRlbnRseSBhbmRcclxuICAgICAqIGRlY291cGxlXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCkge1xyXG5cclxuICAgICAgICAvKiBtdWx0aXBsZSBzZWxlY3Qgbm9kZXMgKi9cclxuICAgICAgICB2YXIgc2VsTm9kZUNvdW50ID0gdXRpbC5nZXRQcm9wZXJ0eUNvdW50KHRoaXMuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSB0aGlzLmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIHZhciBzZWxOb2RlSXNNaW5lID0gaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIGhpZ2hsaWdodE5vZGUuY3JlYXRlZEJ5ID09PSBtZXRhNjQudXNlck5hbWU7XHJcblxyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJvcGVuRXhwb3J0RGxnXCIsIHRoaXMuaXNBZG1pblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5JbXBvcnREbGdcIiwgdGhpcy5pc0FkbWluVXNlcik7XHJcblxyXG4gICAgICAgIHZhciBwcm9wc1RvZ2dsZSA9IHRoaXMuY3VycmVudE5vZGUgJiYgIXRoaXMuaXNBbm9uVXNlcjtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBwcm9wc1RvZ2dsZSk7XHJcblxyXG4gICAgICAgIHZhciBhbGxvd0VkaXRNb2RlID0gdGhpcy5jdXJyZW50Tm9kZSAmJiAhdGhpcy5pc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cExldmVsQnV0dG9uXCIsIHRoaXMuY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZVNlbE5vZGVzQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJkZWxldGVTZWxOb2Rlc0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2xlYXJTZWxlY3Rpb25zQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZVNlbE5vZGVzQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgc2VsTm9kZUNvdW50ID4gMCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5pc2hNb3ZpbmdTZWxOb2Rlc0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIGVkaXQubm9kZXNUb01vdmUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgdGhpcy5pc0FkbWluVXNlciB8fCB1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGxcclxuICAgICAgICAgICAgJiYgaGlnaGxpZ2h0Tm9kZS5oYXNCaW5hcnkgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hEbGdCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCB0aGlzLmlzQWRtaW5Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93RnVsbE5vZGVVcmxCdXR0b25cIiwgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJmaW5kU2hhcmVkTm9kZXNCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG5cclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuSW1wb3J0RGxnXCIsIHRoaXMuaXNBZG1pblVzZXIgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkV4cG9ydERsZ1wiLCB0aGlzLmlzQWRtaW5Vc2VyICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkhvbWVCdXR0b25cIiwgIXRoaXMuaXNBbm9uVXNlcik7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXBMZXZlbEJ1dHRvblwiLCBtZXRhNjQuY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIHRoaXMuaXNBZG1pblVzZXIgfHwgdXNlci5pc1Rlc3RVc2VyQWNjb3VudCgpICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInByb3BzVG9nZ2xlQnV0dG9uXCIsICF0aGlzLmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5Mb2dpbkRsZ0J1dHRvblwiLCB0aGlzLmlzQW5vblVzZXIpO1xyXG4gICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm5hdkxvZ291dEJ1dHRvblwiLCAhdGhpcy5pc0Fub25Vc2VyKTtcclxuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgdGhpcy5pc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTsgLy8gPC0tLS0gaXMgdGhpcyBuZWVkZWQgPyB0b2RvLTNcclxuICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNpbmdsZVNlbGVjdGVkTm9kZSgpIHtcclxuICAgICAgICB2YXIgdWlkO1xyXG4gICAgICAgIGZvciAodWlkIGluIHRoaXMuc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZm91bmQgYSBzaW5nbGUgU2VsIE5vZGVJRDogXCIgKyBub2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyogbm9kZSA9IE5vZGVJbmZvLmphdmEgb2JqZWN0ICovXHJcbiAgICBnZXRPcmRpbmFsT2ZOb2RlKG5vZGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudE5vZGVEYXRhIHx8ICF0aGlzLmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlkID09PSB0aGlzLmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltpXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnROb2RlRGF0YShkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZURhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBkYXRhLm5vZGU7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZVVpZCA9IGRhdGEubm9kZS51aWQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZUlkID0gZGF0YS5ub2RlLmlkO1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGVQYXRoID0gZGF0YS5ub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgYW5vblBhZ2VMb2FkUmVzcG9uc2UocmVzKSB7XHJcblxyXG4gICAgICAgIGlmIChyZXMucmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgbGlzdHZpZXcgdG86IFwiICsgcmVzLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZChcImxpc3RWaWV3XCIsIHJlcy5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVuZGVyLnJlbmRlck1haW5QYWdlQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVCaW5hcnlCeVVpZCh1aWQpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmIChub2RlLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLmhhc0JpbmFyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHVwZGF0ZXMgY2xpZW50IHNpZGUgbWFwcyBhbmQgY2xpZW50LXNpZGUgaWRlbnRpZmllciBmb3IgbmV3IG5vZGUsIHNvIHRoYXQgdGhpcyBub2RlIGlzICdyZWNvZ25pemVkJyBieSBjbGllbnRcclxuICAgICAqIHNpZGUgY29kZVxyXG4gICAgICovXHJcbiAgICBpbml0Tm9kZShub2RlKSB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5pdE5vZGUgaGFzIG51bGwgbm9kZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGFzc2lnbiBhIHByb3BlcnR5IGZvciBkZXRlY3RpbmcgdGhpcyBub2RlIHR5cGUsIEknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHVzaW5nIHNvbWUga2luZCBvZiBjdXN0b20gSlNcclxuICAgICAgICAgKiBwcm90b3R5cGUtcmVsYXRlZCBhcHByb2FjaFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5vZGUudWlkID0gdXRpbC5nZXRVaWRGb3JJZCh0aGlzLmlkZW50VG9VaWRNYXAsIG5vZGUuaWQpO1xyXG4gICAgICAgIG5vZGUucHJvcGVydGllcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihub2RlLnByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEZvciB0aGVzZSB0d28gcHJvcGVydGllcyB0aGF0IGFyZSBhY2Nlc3NlZCBmcmVxdWVudGx5IHdlIGdvIGFoZWFkIGFuZCBsb29rdXAgdGhlIHByb3BlcnRpZXMgaW4gdGhlXHJcbiAgICAgICAgICogcHJvcGVydHkgYXJyYXksIGFuZCBhc3NpZ24gdGhlbSBkaXJlY3RseSBhcyBub2RlIG9iamVjdCBwcm9wZXJ0aWVzIHNvIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UsIGFuZCBhbHNvXHJcbiAgICAgICAgICogc2ltcGxpZnkgY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBub2RlLmNyZWF0ZWRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgIG5vZGUubGFzdE1vZGlmaWVkID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuTEFTVF9NT0RJRklFRCwgbm9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMudWlkVG9Ob2RlTWFwW25vZGUudWlkXSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy5pZFRvTm9kZU1hcFtub2RlLmlkXSA9IG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENvbnN0YW50cygpIHtcclxuICAgICAgICB1dGlsLmFkZEFsbCh0aGlzLnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdCwgWyAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0Lk1JWElOX1RZUEVTLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QT0xJQ1ksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuSU1HX0hFSUdIVCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9EQVRBLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9NSU1FLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFVCTElDX0FQUEVORF0pO1xyXG5cclxuICAgICAgICB1dGlsLmFkZEFsbCh0aGlzLnJlYWRPbmx5UHJvcGVydHlMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LlVVSUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ1JFQVRFRCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5DUkVBVEVEX0JZLCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuTEFTVF9NT0RJRklFRF9CWSwvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICBqY3JDbnN0LkJJTl9WRVIsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX0RBVEEsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgIGpjckNuc3QuQ09NTUVOVF9CWSwgLy9cclxuICAgICAgICAgICAgamNyQ25zdC5QVUJMSUNfQVBQRU5EXSk7XHJcblxyXG4gICAgICAgIHV0aWwuYWRkQWxsKHRoaXMuYmluYXJ5UHJvcGVydHlMaXN0LCBbamNyQ25zdC5CSU5fREFUQV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRBcHAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbml0QXBwIHJ1bm5pbmcuXCIpO1xyXG4gICAgICAgIHRoaXMuYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgdGFicyA9IHV0aWwucG9seShcIm1haW5Jcm9uUGFnZXNcIik7XHJcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgIHRhYnMuYWRkRXZlbnRMaXN0ZW5lcihcImlyb24tc2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGl6LnRhYkNoYW5nZUV2ZW50KHRhYnMuc2VsZWN0ZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRDb25zdGFudHMoKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXlTaWdudXBNZXNzYWdlKCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiBob3cgZG9lcyBvcmllbnRhdGlvbmNoYW5nZSBuZWVkIHRvIHdvcmsgZm9yIHBvbHltZXI/IFBvbHltZXIgZGlzYWJsZWRcclxuICAgICAgICAgKiAkKHdpbmRvdykub24oXCJvcmllbnRhdGlvbmNoYW5nZVwiLCBfLm9yaWVudGF0aW9uSGFuZGxlcik7XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgICQod2luZG93KS5iaW5kKFwiYmVmb3JldW5sb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJMZWF2ZSBNZXRhNjQgP1wiO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEkgdGhvdWdodCB0aGlzIHdhcyBhIGdvb2QgaWRlYSwgYnV0IGFjdHVhbGx5IGl0IGRlc3Ryb3lzIHRoZSBzZXNzaW9uLCB3aGVuIHRoZSB1c2VyIGlzIGVudGVyaW5nIGFuXHJcbiAgICAgICAgICogXCJpZD1cXG15XFxwYXRoXCIgdHlwZSBvZiB1cmwgdG8gb3BlbiBhIHNwZWNpZmljIG5vZGUuIE5lZWQgdG8gcmV0aGluayB0aGlzLiBCYXNpY2FsbHkgZm9yIG5vdyBJJ20gdGhpbmtpbmdcclxuICAgICAgICAgKiBnb2luZyB0byBhIGRpZmZlcmVudCB1cmwgc2hvdWxkbid0IGJsb3cgdXAgdGhlIHNlc3Npb24sIHdoaWNoIGlzIHdoYXQgJ2xvZ291dCcgZG9lcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICQod2luZG93KS5vbihcInVubG9hZFwiLCBmdW5jdGlvbigpIHsgdXNlci5sb2dvdXQoZmFsc2UpOyB9KTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgdGhpcy5kZXZpY2VXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgY2FsbCBjaGVja3MgdGhlIHNlcnZlciB0byBzZWUgaWYgd2UgaGF2ZSBhIHNlc3Npb24gYWxyZWFkeSwgYW5kIGdldHMgYmFjayB0aGUgbG9naW4gaW5mb3JtYXRpb24gZnJvbVxyXG4gICAgICAgICAqIHRoZSBzZXNzaW9uLCBhbmQgdGhlbiByZW5kZXJzIHBhZ2UgY29udGVudCwgYWZ0ZXIgdGhhdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB1c2VyLnJlZnJlc2hMb2dpbigpO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIENoZWNrIGZvciBzY3JlZW4gc2l6ZSBpbiBhIHRpbWVyLiBXZSBkb24ndCB3YW50IHRvIG1vbml0b3IgYWN0dWFsIHNjcmVlbiByZXNpemUgZXZlbnRzIGJlY2F1c2UgaWYgYSB1c2VyXHJcbiAgICAgICAgICogaXMgZXhwYW5kaW5nIGEgd2luZG93IHdlIGJhc2ljYWxseSB3YW50IHRvIGxpbWl0IHRoZSBDUFUgYW5kIGNoYW9zIHRoYXQgd291bGQgZW5zdWUgaWYgd2UgdHJpZWQgdG8gYWRqdXN0XHJcbiAgICAgICAgICogdGhpbmdzIGV2ZXJ5IHRpbWUgaXQgY2hhbmdlcy4gU28gd2UgdGhyb3R0bGUgYmFjayB0byBvbmx5IHJlb3JnYW5pemluZyB0aGUgc2NyZWVuIG9uY2UgcGVyIHNlY29uZC4gVGhpc1xyXG4gICAgICAgICAqIHRpbWVyIGlzIGEgdGhyb3R0bGUgc29ydCBvZi4gWWVzIEkga25vdyBob3cgdG8gbGlzdGVuIGZvciBldmVudHMuIE5vIEknbSBub3QgZG9pbmcgaXQgd3JvbmcgaGVyZS4gVGhpc1xyXG4gICAgICAgICAqIHRpbWVyIGlzIGNvcnJlY3QgaW4gdGhpcyBjYXNlIGFuZCBiZWhhdmVzIHN1cGVyaW9yIHRvIGV2ZW50cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFBvbHltZXItPmRpc2FibGVcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHNldEludGVydmFsKGZ1bmN0aW9uKCkgeyB2YXIgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGlmICh3aWR0aCAhPSBfLmRldmljZVdpZHRoKSB7IC8vIGNvbnNvbGUubG9nKFwiU2NyZWVuIHdpZHRoIGNoYW5nZWQ6IFwiICsgd2lkdGgpO1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXy5kZXZpY2VXaWR0aCA9IHdpZHRoOyBfLmRldmljZUhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIF8uc2NyZWVuU2l6ZUNoYW5nZSgpOyB9IH0sIDE1MDApO1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1haW5NZW51UGFuZWwoKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcblxyXG4gICAgICAgIHV0aWwuaW5pdFByb2dyZXNzTW9uaXRvcigpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2Nlc3NVcmxQYXJhbXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9jZXNzVXJsUGFyYW1zKCkge1xyXG4gICAgICAgIHZhciBwYXNzQ29kZSA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwicGFzc0NvZGVcIik7XHJcbiAgICAgICAgaWYgKHBhc3NDb2RlKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENoYW5nZVBhc3N3b3JkRGxnKHBhc3NDb2RlKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0YWJDaGFuZ2VFdmVudCh0YWJOYW1lKSB7XHJcbiAgICAgICAgaWYgKHRhYk5hbWUgPT0gXCJzZWFyY2hUYWJOYW1lXCIpIHtcclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hUYWJBY3RpdmF0ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheVNpZ251cE1lc3NhZ2UoKSB7XHJcbiAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChzaWdudXBSZXNwb25zZSA9PT0gXCJva1wiKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNpZ251cCBjb21wbGV0ZS4gWW91IG1heSBub3cgbG9naW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNjcmVlblNpemVDaGFuZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGVEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmN1cnJlbnROb2RlLmltZ0lkKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG1ldGE2NC5jdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgIG9yaWVudGF0aW9uSGFuZGxlcihldmVudCkge1xyXG4gICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbikge1xyXG4gICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAoZXZlbnQub3JpZW50YXRpb24gPT09ICdsYW5kc2NhcGUnKSB7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2FkQW5vblBhZ2VIb21lKGlnbm9yZVVybCkge1xyXG4gICAgICAgIHV0aWwuanNvbihcImFub25QYWdlTG9hZFwiLCB7XHJcbiAgICAgICAgICAgIFwiaWdub3JlVXJsXCI6IGlnbm9yZVVybFxyXG4gICAgICAgIH0sIHRoaXMuYW5vblBhZ2VMb2FkUmVzcG9uc2UsIHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcIm1ldGE2NFwiXSkge1xyXG4gICAgdmFyIG1ldGE2NDogTWV0YTY0ID0gbmV3IE1ldGE2NCgpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBuYXYuanNcIik7XHJcblxyXG5jbGFzcyBOYXYge1xyXG4gICAgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgIG9wZW5NYWluTWVudUhlbHAoKSB7XHJcbiAgICAgICAgd2luZG93Lm9wZW4od2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPS9tZXRhNjQvcHVibGljL2hlbHBcIiwgXCJfYmxhbmtcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheWluZ0hvbWUoKSB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcmVudFZpc2libGVUb1VzZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmRpc3BsYXlpbmdIb21lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBMZXZlbFJlc3BvbnNlKHJlcywgaWQpIHtcclxuICAgICAgICBpZiAoIXJlcyB8fCAhcmVzLm5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gZGF0YSBpcyB2aXNpYmxlIHRvIHlvdSBhYm92ZSB0aGlzIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG4gICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZChpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZVcExldmVsKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMucGFyZW50VmlzaWJsZVRvVXNlcigpKSB7XHJcbiAgICAgICAgICAgIC8vIEFscmVhZHkgYXQgcm9vdC4gQ2FuJ3QgZ28gdXAuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uKFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICBcInVwTGV2ZWxcIjogMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpei51cExldmVsUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgbWV0YTY0LmN1cnJlbnROb2RlSWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICovXHJcbiAgICBnZXRTZWxlY3RlZERvbUVsZW1lbnQoKSB7XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGdldCBub2RlIGJ5IG5vZGUgaWRlbnRpZmllciAqL1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZvdW5kIGhpZ2hsaWdodGVkIG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZUlkID0gbm9kZS51aWQgKyB0aGlzLl9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb29raW5nIHVwIHVzaW5nIGVsZW1lbnQgaWQ6IFwiK25vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0dXJuIG9mIHJvdyBzZWxlY3Rpb24gRE9NIGVsZW1lbnQgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICovXHJcbiAgICBnZXRTZWxlY3RlZFBvbHlFbGVtZW50KCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50U2VsTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWxOb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogZ2V0IG5vZGUgYnkgbm9kZSBpZGVudGlmaWVyICovXHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZm91bmQgaGlnaGxpZ2h0ZWQgbm9kZS5pZD1cIiArIG5vZGUuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVJZCA9IG5vZGUudWlkICsgdGhpcy5fVUlEX1JPV0lEX1NVRkZJWDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgdXAgdXNpbmcgZWxlbWVudCBpZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCBmYWlsZWQuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja09uTm9kZVJvdyhyb3dFbG0sIHVpZCkge1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbGlja09uTm9kZVJvdyByZWNpZXZlZCB1aWQgdGhhdCBkb2Vzbid0IG1hcCB0byBhbnkgbm9kZS4gdWlkPVwiICsgdWlkKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBzZXRzIHdoaWNoIG5vZGUgaXMgc2VsZWN0ZWQgb24gdGhpcyBwYWdlIChpLmUuIHBhcmVudCBub2RlIG9mIHRoaXMgcGFnZSBiZWluZyB0aGUgJ2tleScpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlKSB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpZiBub2RlLm93bmVyIGlzIGN1cnJlbnRseSBudWxsLCB0aGF0IG1lYW5zIHdlIGhhdmUgbm90IHJldHJpZXZlIHRoZSBvd25lciBmcm9tIHRoZSBzZXJ2ZXIgeWV0LCBidXRcclxuICAgICAgICAgICAgICogaWYgbm9uLW51bGwgaXQncyBhbHJlYWR5IGRpc3BsYXlpbmcgYW5kIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUub3duZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyB1cGRhdGVOb2RlSW5mb1wiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51cGRhdGVOb2RlSW5mbyhub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuTm9kZSh1aWQpIHtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gb3Blbk5vZGU6IFwiICsgdWlkKSkub3BlbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobm9kZS5pZCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdW5mb3J0dW5hdGVseSB3ZSBoYXZlIHRvIHJlbHkgb24gb25DbGljaywgYmVjYXVzZSBvZiB0aGUgZmFjdCB0aGF0IGV2ZW50cyB0byBjaGVja2JveGVzIGRvbid0IGFwcGVhciB0byB3b3JrXHJcbiAgICAgKiBpbiBQb2xtZXIgYXQgYWxsLCBhbmQgc2luY2Ugb25DbGljayBydW5zIEJFRk9SRSB0aGUgc3RhdGUgY2hhbmdlIGlzIGNvbXBsZXRlZCwgdGhhdCBpcyB0aGUgcmVhc29uIGZvciB0aGVcclxuICAgICAqIHNpbGx5IGxvb2tpbmcgYXN5bmMgdGltZXIgaGVyZS5cclxuICAgICAqL1xyXG4gICAgdG9nZ2xlTm9kZVNlbCh1aWQpIHtcclxuICAgICAgICB2YXIgdG9nZ2xlQnV0dG9uID0gdXRpbC5wb2x5RWxtKHVpZCArIFwiX3NlbFwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uLm5vZGUuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmlldy51cGRhdGVTdGF0dXNCYXIoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZIb21lUmVzcG9uc2UocmVzKSB7XHJcbiAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2SG9tZSgpIHtcclxuICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUodHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsLmpzb24oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkXHJcbiAgICAgICAgICAgIH0sIHRoaXMubmF2SG9tZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmF2UHVibGljSG9tZSgpIHtcclxuICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVNYWluTWVudSgpIHtcclxuICAgICAgICAvL3ZhciBwYXBlckRyYXdlclBhbmVsID0gdXRpbC5wb2x5RWxtKFwicGFwZXJEcmF3ZXJQYW5lbFwiKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB0aGlzIHRvZ2dsZVBhbmVsIGZ1bmN0aW9uIGRvZXMgYWJzb2x1dGVseSBub3RoaW5nLCBhbmQgSSB0aGluayB0aGlzIGlzIHByb2JhYmx5IGEgYnVnIG9uIHRoZSBnb29nbGVcclxuICAgICAgICAgKiBwb2x5bWVyIGNvZGUsIGJlY2F1c2UgaXQgc2hvdWxkIGFsd2F5cyB3b3JrLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vcGFwZXJEcmF3ZXJQYW5lbC5ub2RlLnRvZ2dsZVBhbmVsKCk7XHJcbiAgICB9XHJcbn1cclxuaWYgKCF3aW5kb3dbXCJuYXZcIl0pIHtcclxuICAgIHZhciBuYXY6IE5hdiA9IG5ldyBOYXYoKTtcclxufVxyXG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJlZnMuanNcIik7XHJcblxyXG5jbGFzcyBQcmVmcyB7XHJcblxyXG4gICAgY2xvc2VBY2NvdW50UmVzcG9uc2UoKTogdm9pZCB7XHJcbiAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG5cclxuICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VBY2NvdW50KCk6IHZvaWQge1xyXG4gICAgICAgIC8vdG9kby0wOiBzZWUgaWYgdGhlcmUncyBhIGJldHRlciB3YXkgdG8gZG8gdGhpei5cclxuICAgICAgICB2YXIgdGhpejogUHJlZnMgPSB0aGlzO1xyXG5cclxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPaCBObyFcIiwgXCJDbG9zZSB5b3VyIEFjY291bnQ/PHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJPbmUgbW9yZSBDbGlja1wiLCBcIllvdXIgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYW5kIGNhbiBuZXZlciBiZSByZWNvdmVyZWQuPHA+IEFyZSB5b3Ugc3VyZT9cIiwgXCJZZXMsIENsb3NlIEFjY291bnQuXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uKFwiY2xvc2VBY2NvdW50XCIsIHt9LCB0aGl6LmNsb3NlQWNjb3VudFJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInByZWZzXCJdKSB7XHJcbiAgICB2YXIgcHJlZnM6IFByZWZzID0gbmV3IFByZWZzKCk7XHJcbn1cclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJvcHMuanNcIik7XHJcblxyXG5jbGFzcyBQcm9wcyB7XHJcblxyXG4gICAgLypcclxuICAgICAqIFRvZ2dsZXMgZGlzcGxheSBvZiBwcm9wZXJ0aWVzIGluIHRoZSBndWkuXHJcbiAgICAgKi9cclxuICAgIHByb3BzVG9nZ2xlKCkge1xyXG4gICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAvLyBzZXREYXRhSWNvblVzaW5nSWQoXCIjZWRpdE1vZGVCdXR0b25cIiwgZWRpdE1vZGUgPyBcImVkaXRcIiA6XHJcbiAgICAgICAgLy8gXCJmb3JiaWRkZW5cIik7XHJcblxyXG4gICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgIC8vIHZhciBlbG0gPSAkKFwiI3Byb3BzVG9nZ2xlQnV0dG9uXCIpO1xyXG4gICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZ3JpZFwiLCBtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG4gICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzW2ldLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogU29ydHMgcHJvcHMgaW5wdXQgYXJyYXkgaW50byB0aGUgcHJvcGVyIG9yZGVyIHRvIHNob3cgZm9yIGVkaXRpbmcuIFNpbXBsZSBhbGdvcml0aG0gZmlyc3QgZ3JhYnMgJ2pjcjpjb250ZW50J1xyXG4gICAgICogbm9kZSBhbmQgcHV0cyBpdCBvbiB0aGUgdG9wLCBhbmQgdGhlbiBkb2VzIHNhbWUgZm9yICdqY3RDbnN0LlRBR1MnXHJcbiAgICAgKi9cclxuICAgIGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihwcm9wcykge1xyXG4gICAgICAgIHZhciBwcm9wc05ldyA9IHByb3BzLmNsb25lKCk7XHJcbiAgICAgICAgdmFyIHRhcmdldElkeCA9IDA7XHJcblxyXG4gICAgICAgIHZhciB0YWdJZHggPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5DT05URU5UKTtcclxuICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHByb3BzTmV3LmFycmF5TW92ZUl0ZW0odGFnSWR4LCB0YXJnZXRJZHgrKyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YWdJZHggPSBwcm9wc05ldy5pbmRleE9mSXRlbUJ5UHJvcChcIm5hbWVcIiwgamNyQ25zdC5UQUdTKTtcclxuICAgICAgICBpZiAodGFnSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHByb3BzTmV3LmFycmF5TW92ZUl0ZW0odGFnSWR4LCB0YXJnZXRJZHgrKyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHByb3BlcnRpZXMgd2lsbCBiZSBudWxsIG9yIGEgbGlzdCBvZiBQcm9wZXJ0eUluZm8gb2JqZWN0cy5cclxuICAgICAqXHJcbiAgICAgKiB0b2RvLTM6IEkgY2FuIGRvIG11Y2ggYmV0dGVyIGluIHRoaXMgbWV0aG9kLCBJIGp1c3QgaGF2ZW4ndCBoYWQgdGltZSB0byBjbGVhbiBpdCB1cC4gdGhpcyBtZXRob2QgaXMgdWdseS5cclxuICAgICAqL1xyXG4gICAgcmVuZGVyUHJvcGVydGllcyhwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IFwiPHRhYmxlIGNsYXNzPSdwcm9wZXJ0eS10ZXh0Jz5cIjtcclxuICAgICAgICAgICAgdmFyIHByb3BDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBkb24ndCBuZWVkIG9yIHdhbnQgYSB0YWJsZSBoZWFkZXIsIGJ1dCBKUXVlcnkgZGlzcGxheXMgYW4gZXJyb3IgaW4gdGhlIEpTIGNvbnNvbGUgaWYgaXQgY2FuJ3QgZmluZFxyXG4gICAgICAgICAgICAgKiB0aGUgPHRoZWFkPiBlbGVtZW50LiBTbyB3ZSBwcm92aWRlIGVtcHR5IHRhZ3MgaGVyZSwganVzdCB0byBtYWtlIEpRdWVyeSBoYXBweS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHJldCArPSBcIjx0aGVhZD48dHI+PHRoPjwvdGg+PHRoPjwvdGg+PC90cj48L3RoZWFkPlwiO1xyXG5cclxuICAgICAgICAgICAgcmV0ICs9IFwiPHRib2R5PlwiO1xyXG4gICAgICAgICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wZXJ0eS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPHRyIGNsYXNzPSdwcm9wLXRhYmxlLXJvdyc+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjx0ZCBjbGFzcz0ncHJvcC10YWJsZS1uYW1lLWNvbCc+XCIgKyByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcGVydHkubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyBcIjwvdGQ+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0JpbmFyeVByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPHRkIGNsYXNzPSdwcm9wLXRhYmxlLXZhbC1jb2wnPltiaW5hcnldPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFwcm9wZXJ0eS52YWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHByb3BlcnR5Lmh0bWxWYWx1ZSA/IHByb3BlcnR5Lmh0bWxWYWx1ZSA6IHByb3BlcnR5LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8dGQgY2xhc3M9J3Byb3AtdGFibGUtdmFsLWNvbCc+XCIgKyByZW5kZXIud3JhcEh0bWwodmFsKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8dGQgY2xhc3M9J3Byb3AtdGFibGUtdmFsLWNvbCc+XCIgKyBwcm9wcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3BDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0ICs9IFwiPC90Ym9keT48L3RhYmxlPlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBicnV0ZSBmb3JjZSBzZWFyY2hlcyBvbiBub2RlIChOb2RlSW5mby5qYXZhKSBvYmplY3QgcHJvcGVydGllcyBsaXN0LCBhbmQgcmV0dXJucyB0aGUgZmlyc3QgcHJvcGVydHlcclxuICAgICAqIChQcm9wZXJ0eUluZm8uamF2YSkgd2l0aCBuYW1lIG1hdGNoaW5nIHByb3BlcnR5TmFtZSwgZWxzZSBudWxsLlxyXG4gICAgICovXHJcbiAgICBnZXROb2RlUHJvcGVydHkocHJvcGVydHlOYW1lLCBub2RlKSB7XHJcbiAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IG5vZGUucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgaWYgKHByb3AubmFtZSA9PT0gcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlUHJvcGVydHlWYWwocHJvcGVydHlOYW1lLCBub2RlKSB7XHJcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmdldE5vZGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIG5vZGUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wID8gcHJvcC52YWx1ZSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgdHJ1cyBpZiB0aGlzIGlzIGEgY29tbWVudCBub2RlLCB0aGF0IHRoZSBjdXJyZW50IHVzZXIgZG9lc24ndCBvd24uIFVzZWQgdG8gZGlzYWJsZSBcImVkaXRcIiwgXCJkZWxldGVcIixcclxuICAgICAqIGV0Yy4gb24gdGhlIEdVSS5cclxuICAgICAqL1xyXG4gICAgaXNOb25Pd25lZE5vZGUobm9kZSkge1xyXG4gICAgICAgIHZhciBjcmVhdGVkQnkgPSB0aGlzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBkb24ndCBrbm93IHdobyBvd25zIHRoaXMgbm9kZSBhc3N1bWUgdGhlIGFkbWluIG93bnMgaXQuXHJcbiAgICAgICAgaWYgKCFjcmVhdGVkQnkpIHtcclxuICAgICAgICAgICAgY3JlYXRlZEJ5ID0gXCJhZG1pblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGhpcyBpcyBPUiBjb25kaXRpb24gYmVjYXVzZSBvZiBjcmVhdGVkQnkgaXMgbnVsbCB3ZSBhc3N1bWUgd2UgZG8gbm90IG93biBpdCAqL1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgKiBldGMuIG9uIHRoZSBHVUkuXHJcbiAgICAgKi9cclxuICAgIGlzTm9uT3duZWRDb21tZW50Tm9kZShub2RlKSB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRCeSA9IHRoaXMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNPd25lZENvbW1lbnROb2RlKG5vZGUpIHtcclxuICAgICAgICB2YXIgY29tbWVudEJ5ID0gdGhpcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICByZXR1cm4gY29tbWVudEJ5ICE9IG51bGwgJiYgY29tbWVudEJ5ID09IG1ldGE2NC51c2VyTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgcHJvcGVydHkgdmFsdWUsIGV2ZW4gaWYgbXVsdGlwbGUgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICByZW5kZXJQcm9wZXJ0eShwcm9wZXJ0eSkge1xyXG4gICAgICAgIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWUgfHwgcHJvcGVydHkudmFsdWUubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMTogbWFrZSBzdXJlIHRoaXMgd3JhcEh0bWwgaXNuJ3QgY3JlYXRpbmcgYW4gdW5uZWNlc3NhcnkgRElWIGVsZW1lbnQuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIud3JhcEh0bWwocHJvcGVydHkuaHRtbFZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVZhbHVlcyhwcm9wZXJ0eS52YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJQcm9wZXJ0eVZhbHVlcyh2YWx1ZXMpIHtcclxuICAgICAgICB2YXIgcmV0ID0gXCI8ZGl2PlwiO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgJC5lYWNoKHZhbHVlcywgZnVuY3Rpb24oaSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9IGNuc3QuQlI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci53cmFwSHRtbCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0ICs9IFwiPC9kaXY+XCI7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJwcm9wc1wiXSkge1xyXG4gICAgdmFyIHByb3BzOiBQcm9wcyA9IG5ldyBQcm9wcygpO1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHJlbmRlci5qc1wiKTtcclxuXHJcbmRlY2xhcmUgdmFyIHBvc3RUYXJnZXRVcmw7XHJcbmRlY2xhcmUgdmFyIHByZXR0eVByaW50O1xyXG5cclxuY2xhc3MgUmVuZGVyIHtcclxuICAgIF9kZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHQvKlxyXG5cdCAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcblx0ICogd2FudCB0byBnaXZlIHRoZW0gc29tZSBpbnN0cnVjdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIGFkZCBjb250ZW50LlxyXG5cdCAqL1xyXG4gICAgX2dldEVtcHR5UGFnZVByb21wdCgpIHtcclxuICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgIH1cclxuXHJcbiAgICBfcmVuZGVyQmluYXJ5KG5vZGUpIHtcclxuXHRcdC8qXHJcblx0XHQgKiBJZiB0aGlzIGlzIGFuIGltYWdlIHJlbmRlciB0aGUgaW1hZ2UgZGlyZWN0bHkgb250byB0aGUgcGFnZSBhcyBhIHZpc2libGUgaW1hZ2VcclxuXHRcdCAqL1xyXG4gICAgICAgIGlmIChub2RlLmJpbmFyeUlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZUltYWdlVGFnKG5vZGUpO1xyXG4gICAgICAgIH1cclxuXHRcdC8qXHJcblx0XHQgKiBJZiBub3QgYW4gaW1hZ2Ugd2UgcmVuZGVyIGEgbGluayB0byB0aGUgYXR0YWNobWVudCwgc28gdGhhdCBpdCBjYW4gYmUgZG93bmxvYWRlZC5cclxuXHRcdCAqL1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgYW5jaG9yID0gcmVuZGVyLnRhZyhcImFcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJocmVmXCI6IHJlbmRlci5nZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKVxyXG4gICAgICAgICAgICB9LCBcIltEb3dubG9hZCBBdHRhY2htZW50XVwiKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJiaW5hcnktbGlua1wiXHJcbiAgICAgICAgICAgIH0sIGFuY2hvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBJbXBvcnRhbnQgbGl0dGxlIG1ldGhvZCBoZXJlLiBBbGwgR1VJIHBhZ2UvZGl2cyBhcmUgY3JlYXRlZCB1c2luZyB0aGlzIHNvcnQgb2Ygc3BlY2lmaWNhdGlvbiBoZXJlIHRoYXQgdGhleVxyXG4gICAgICogYWxsIG11c3QgaGF2ZSBhICdidWlsZCcgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZpcnN0IHRpbWUgb25seSwgYW5kIHRoZW4gdGhlICdpbml0JyBtZXRob2QgY2FsbGVkIGJlZm9yZSBlYWNoXHJcbiAgICAgKiB0aW1lIHRoZSBjb21wb25lbnQgZ2V0cyBkaXNwbGF5ZWQgd2l0aCBuZXcgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogSWYgJ2RhdGEnIGlzIHByb3ZpZGVkLCB0aGlzIGlzIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWRQYWdlKHBnLCBkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidWlsZFBhZ2U6IHBnLmRvbUlkPVwiICsgcGcuZG9tSWQpO1xyXG5cclxuICAgICAgICBpZiAoIXBnLmJ1aWx0IHx8IGRhdGEpIHtcclxuICAgICAgICAgICAgcGcuYnVpbGQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBnLmJ1aWx0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwZy5pbml0KSB7XHJcbiAgICAgICAgICAgIHBnLmluaXQoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ1aWxkUm93SGVhZGVyKG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSkge1xyXG4gICAgICAgIHZhciBjb21tZW50QnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuXHJcbiAgICAgICAgdmFyIGhlYWRlclRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfT05fUk9XUykge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIHRoaXMuZm9ybWF0UGF0aChub2RlKSArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdj5cIjtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRCeSkge1xyXG4gICAgICAgICAgICB2YXIgY2xhenogPSAoY29tbWVudEJ5ID09PSBtZXRhNjQudXNlck5hbWUpID8gXCJjcmVhdGVkLWJ5LW1lXCIgOiBcImNyZWF0ZWQtYnktb3RoZXJcIjtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNvbW1lbnQgQnk6IFwiICsgY29tbWVudEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgfSAvL1xyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUuY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgICAgIHZhciBjbGF6eiA9IChub2RlLmNyZWF0ZWRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8c3BhbiBjbGFzcz0nXCIgKyBjbGF6eiArIFwiJz5DcmVhdGVkIEJ5OiBcIiArIG5vZGUuY3JlYXRlZEJ5ICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gaWQ9J293bmVyRGlzcGxheVwiICsgbm9kZS51aWQgKyBcIic+PC9zcGFuPlwiO1xyXG4gICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiICBNb2Q6IFwiICsgbm9kZS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBvbiByb290IG5vZGUgbmFtZSB3aWxsIGJlIGVtcHR5IHN0cmluZyBzbyBkb24ndCBzaG93IHRoYXRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGNvbW1lbnRpbmc6IEkgZGVjaWRlZCB1c2VycyB3aWxsIHVuZGVyc3RhbmQgdGhlIHBhdGggYXMgYSBzaW5nbGUgbG9uZyBlbnRpdHkgd2l0aCBsZXNzIGNvbmZ1c2lvbiB0aGFuXHJcbiAgICAgICAgICogYnJlYWtpbmcgb3V0IHRoZSBuYW1lIGZvciB0aGVtLiBUaGV5IGFscmVhZHkgdW5zZXJzdGFuZCBpbnRlcm5ldCBVUkxzLiBUaGlzIGlzIHRoZSBzYW1lIGNvbmNlcHQuIE5vIG5lZWRcclxuICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgIXNob3dQYXRoIGNvbmRpdGlvbiBoZXJlIGlzIGJlY2F1c2UgaWYgd2UgYXJlIHNob3dpbmcgdGhlIHBhdGggdGhlbiB0aGUgZW5kIG9mIHRoYXQgaXMgYWx3YXlzIHRoZVxyXG4gICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHNob3dOYW1lICYmICFzaG93UGF0aCAmJiBub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIk5hbWU6IFwiICsgbm9kZS5uYW1lICsgXCIgW3VpZD1cIiArIG5vZGUudWlkICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXJUZXh0ID0gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaGVhZGVyLXRleHRcIlxyXG4gICAgICAgIH0sIGhlYWRlclRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUGVnZG93biBtYXJrZG93biBwcm9jZXNzb3Igd2lsbCBjcmVhdGUgPGNvZGU+IGJsb2NrcyBhbmQgdGhlIGNsYXNzIGlmIHByb3ZpZGVkLCBzbyBpbiBvcmRlciB0byBnZXQgZ29vZ2xlXHJcbiAgICAgKiBwcmV0dGlmaWVyIHRvIHByb2Nlc3MgaXQgdGhlIHJlc3Qgb2YgdGhlIHdheSAod2hlbiB3ZSBjYWxsIHByZXR0eVByaW50KCkgZm9yIHRoZSB3aG9sZSBwYWdlKSB3ZSBub3cgcnVuXHJcbiAgICAgKiBhbm90aGVyIHN0YWdlIG9mIHRyYW5zZm9ybWF0aW9uIHRvIGdldCB0aGUgPHByZT4gdGFnIHB1dCBpbiB3aXRoICdwcmV0dHlwcmludCcgZXRjLlxyXG4gICAgICovXHJcbiAgICBpbmplY3RDb2RlRm9ybWF0dGluZyhjb250ZW50KSB7XHJcblxyXG4gICAgICAgIC8vIGV4YW1wbGUgbWFya2Rvd246XHJcbiAgICAgICAgLy8gYGBganNcclxuICAgICAgICAvLyB2YXIgeCA9IDEwO1xyXG4gICAgICAgIC8vIHZhciB5ID0gXCJ0ZXN0XCI7XHJcbiAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgLy9cclxuICAgICAgICBpZiAoY29udGVudC5jb250YWlucyhcIjxjb2RlXCIpKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gdGhpcy5lbmNvZGVMYW5ndWFnZXMoY29udGVudCk7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5qZWN0U3Vic3RpdHV0aW9ucyhjb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZUFsbChcInt7bG9jYXRpb25PcmlnaW59fVwiLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICBlbmNvZGVMYW5ndWFnZXMoY29udGVudCkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0xOiBuZWVkIHRvIHByb3ZpZGUgc29tZSB3YXkgb2YgaGF2aW5nIHRoZXNlIGxhbmd1YWdlIHR5cGVzIGNvbmZpZ3VyYWJsZSBpbiBhIHByb3BlcnRpZXMgZmlsZVxyXG4gICAgICAgICAqIHNvbWV3aGVyZSwgYW5kIGZpbGwgb3V0IGEgbG90IG1vcmUgZmlsZSB0eXBlcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgbGFuZ3MgPSBbXCJqc1wiLCBcImh0bWxcIiwgXCJodG1cIiwgXCJjc3NcIl07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlQWxsKFwiPGNvZGUgY2xhc3M9XFxcIlwiICsgbGFuZ3NbaV0gKyBcIlxcXCI+XCIsIC8vXHJcbiAgICAgICAgICAgICAgICBcIjw/cHJldHRpZnkgbGFuZz1cIiArIGxhbmdzW2ldICsgXCI/PjxwcmUgY2xhc3M9J3ByZXR0eXByaW50Jz5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2VBbGwoXCI8Y29kZT5cIiwgXCI8cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZW5kZXJzIGVhY2ggbm9kZSBpbiB0aGUgbWFpbiB3aW5kb3cuIFRoZSByZW5kZXJpbmcgaW4gaGVyZSBpcyB2ZXJ5IGNlbnRyYWwgdG8gdGhlXHJcbiAgICAgKiBhcHAgYW5kIGlzIHdoYXQgdGhlIHVzZXIgc2VlcyBjb3ZlcmluZyA5MCUgb2YgdGhlIHNjcmVlbiBtb3N0IG9mIHRoZSB0aW1lLiBUaGUgXCJjb250ZW50KiBub2Rlcy5cclxuICAgICAqXHJcbiAgICAgKiBub2RlOiBKU09OIG9mIE5vZGVJbmZvLmphdmFcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHNob3dQYXRoLCBzaG93TmFtZSwgcmVuZGVyQmluYXJ5LCByb3dTdHlsaW5nLCBzaG93SGVhZGVyKSB7XHJcbiAgICAgICAgdmFyIHJldDogc3RyaW5nID0gdGhpcy5nZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTI6IGVuYWJsZSBoZWFkZXJUZXh0IHdoZW4gYXBwcm9wcmlhdGUgaGVyZSAqL1xyXG4gICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gdGhpcy5idWlsZFJvd0hlYWRlcihub2RlLCBzaG93UGF0aCwgc2hvd05hbWUpIDogXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKG1ldGE2NC5zaG93UHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50UHJvcCA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQsIG5vZGUpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbnRlbnRQcm9wOiBcIiArIGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRQcm9wKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGpjckNvbnRlbnQgPSBwcm9wcy5yZW5kZXJQcm9wZXJ0eShjb250ZW50UHJvcCk7XHJcbiAgICAgICAgICAgICAgICBqY3JDb250ZW50ID0gXCI8ZGl2PlwiICsgamNyQ29udGVudCArIFwiPC9kaXY+XCJcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoamNyQ29udGVudC5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhNjQuc2VydmVyTWFya2Rvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgamNyQ29udGVudCA9IHRoaXMuaW5qZWN0Q29kZUZvcm1hdHRpbmcoamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpjckNvbnRlbnQgPSB0aGlzLmluamVjdFN1YnN0aXR1dGlvbnMoamNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3Itcm9vdC1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvYmFibHkgY291bGQgdXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJpbWcudG9wLnJpZ2h0XCIgZmVhdHVyZSBmb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoQWxzbyBuZWVkIHRvIG1ha2UgdGhpcyBhIGNvbmZpZ3VyYWJsZSBvcHRpb24sIGJlY2F1c2Ugb3RoZXIgY2xvbmVzIG9mIG1ldGE2NCBkb24ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdhbnQgbXkgZ2l0aHViIGxpbmshKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL0NsYXktRmVyZ3Vzb24vbWV0YTY0Jz48aW1nIHNyYz0nL2ZvcmstbWUtb24tZ2l0aHViLnBuZycgY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiBJIHNwZW50IGhvdXJzIHRyeWluZyB0byBnZXQgbWFya2VkLWVsZW1lbnQgdG8gd29yay4gVW5zdWNjZXNzZnVsIHN0aWxsLCBzbyBJIGp1c3QgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAqIHNlcnZlck1hcmtkb3duIGZsYWcgdGhhdCBJIGNhbiBzZXQgdG8gdHJ1ZSwgYW5kIHR1cm4gdGhpcyBleHBlcmltZW50YWwgZmVhdHVyZSBvZmYgZm9yIG5vdy5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGFsdGVybmF0ZSBhdHRyaWJ1dGUgd2F5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpjckNvbnRlbnQgPSBqY3JDb250ZW50LnJlcGxhY2VBbGwoXCInXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwie3txdW90fX1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2Rvd249J1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gamNyQ29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyArIFwiJz48ZGl2IGNsYXNzPSdtYXJrZG93bi1odG1sIGpjci1jb250ZW50Jz5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0ICs9IFwiPC9kaXY+PC9tYXJrZWQtZWxlbWVudD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBcIjxtYXJrZWQtZWxlbWVudCBzYW5pdGl6ZT0ndHJ1ZSc+PGRpdiBjbGFzcz0nbWFya2Rvd24taHRtbCc+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGhpcy50YWcoXCJzY3JpcHRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRleHQvbWFya2Rvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgamNyQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8bWFya2VkLWVsZW1lbnQgc2FuaXRpemU9J3RydWUnPjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwnPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IHRoaXMudGFnKFwic2NyaXB0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0L21hcmtkb3duXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvYmFibHkgY291bGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImltZy50b3AucmlnaHRcIiBmZWF0dXJlIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyBpZiB3ZSB3YW50ZWQgdG8uIG9vcHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vQ2xheS1GZXJndXNvbi9tZXRhNjQnPjxpbWcgc3JjPScvZm9yay1tZS1vbi1naXRodWIucG5nJyBjbGFzcz0nY29ybmVyLXN0eWxlJy8+PC9hPlwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCI8L2Rpdj48L21hcmtlZC1lbGVtZW50PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiPGRpdj5bTm8gQ29udGVudCBUZXh0XTwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSAvKiBcIjxicj5cIiArICovcHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIChqY3JDb250ZW50Lmxlbmd0aCA+IDApIHsgaWYgKHJvd1N0eWxpbmcpIHsgcmV0ICs9IHRoaXMudGFnKFwiZGl2XCIsIHsgXCJjbGFzc1wiIDogXCJqY3ItY29udGVudFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgKiBqY3JDb250ZW50KTsgfSBlbHNlIHsgcmV0ICs9IHRoaXMudGFnKFwiZGl2XCIsIHsgXCJjbGFzc1wiIDogXCJqY3Itcm9vdC1jb250ZW50XCIgfSwgLy8gcHJvYmFibHkgY291bGRcclxuICAgICAgICAgICAgICAgICAqIFwiaW1nLnRvcC5yaWdodFwiIGZlYXR1cmUgZm9yIHRoaXMgLy8gaWYgd2Ugd2FudGVkIHRvLiBvb3BzLiBcIjxhXHJcbiAgICAgICAgICAgICAgICAgKiBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vQ2xheS1GZXJndXNvbi9tZXRhNjQnPjxpbWcgc3JjPScvZm9yay1tZS1vbi1naXRodWIucG5nJ1xyXG4gICAgICAgICAgICAgICAgICogY2xhc3M9J2Nvcm5lci1zdHlsZScvPjwvYT5cIiArIGpjckNvbnRlbnQpOyB9IH1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gXCJSb290IE5vZGVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IC8qIFwiPGJyPlwiICsgKi9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVuZGVyQmluYXJ5ICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgIHZhciBiaW5hcnkgPSB0aGlzLl9yZW5kZXJCaW5hcnkobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXZSBhcHBlbmQgdGhlIGJpbmFyeSBpbWFnZSBvciByZXNvdXJjZSBsaW5rIGVpdGhlciBhdCB0aGUgZW5kIG9mIHRoZSB0ZXh0IG9yIGF0IHRoZSBsb2NhdGlvbiB3aGVyZVxyXG4gICAgICAgICAgICAgKiB0aGUgdXNlciBoYXMgcHV0IHt7aW5zZXJ0LWF0dGFjaG1lbnR9fSBpZiB0aGV5IGFyZSB1c2luZyB0aGF0IHRvIG1ha2UgdGhlIGltYWdlIGFwcGVhciBpbiBhIHNwZWNpZmljXHJcbiAgICAgICAgICAgICAqIGxvY2F0aW8gaW4gdGhlIGNvbnRlbnQgdGV4dC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChyZXQuY29udGFpbnMoY25zdC5JTlNFUlRfQVRUQUNITUVOVCkpIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IHJldC5yZXBsYWNlQWxsKGNuc3QuSU5TRVJUX0FUVEFDSE1FTlQsIGJpbmFyeSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gYmluYXJ5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGFncyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlRBR1MsIG5vZGUpO1xyXG4gICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgIHJldCArPSB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidGFncy1jb250ZW50XCJcclxuICAgICAgICAgICAgfSwgXCJUYWdzOiBcIiArIHRhZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBtZXRob2QgZm9yIHJlbmRlcmluZyBlYWNoIG5vZGUgKGxpa2UgYSByb3cpIG9uIHRoZSBtYWluIEhUTUwgcGFnZSB0aGF0IGRpc3BsYXlzIG5vZGVcclxuICAgICAqIGNvbnRlbnQuIFRoaXMgZ2VuZXJhdGVzIHRoZSBIVE1MIGZvciBhIHNpbmdsZSByb3cvbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBub2RlIGlzIGEgTm9kZUluZm8uamF2YSBKU09OXHJcbiAgICAgKi9cclxuICAgIHJlbmRlck5vZGVBc0xpc3RJdGVtKG5vZGUsIGluZGV4LCBjb3VudCwgcm93Q291bnQpIHtcclxuXHJcbiAgICAgICAgdmFyIHVpZCA9IG5vZGUudWlkO1xyXG4gICAgICAgIHZhciBjYW5Nb3ZlVXAgPSBpbmRleCA+IDAgJiYgcm93Q291bnQgPiAxO1xyXG4gICAgICAgIHZhciBjYW5Nb3ZlRG93biA9IGluZGV4IDwgY291bnQgLSAxO1xyXG5cclxuICAgICAgICB2YXIgaXNSZXAgPSBub2RlLm5hbWUuc3RhcnRzV2l0aChcInJlcDpcIikgfHwgLypcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuIGJ1Zz9cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAqL25vZGUucGF0aC5jb250YWlucyhcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICB2YXIgZWRpdGluZ0FsbG93ZWQgPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICBlZGl0aW5nQWxsb3dlZCA9IChtZXRhNjQuaXNBZG1pblVzZXIgfHwgIWlzUmVwKSAmJiAhcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBOb2RlIFJvd1tcIiArIGluZGV4ICsgXCJdIGVkaXRpbmdBbGxvd2VkPVwiK2VkaXRpbmdBbGxvd2VkKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBpZiBub3Qgc2VsZWN0ZWQgYnkgYmVpbmcgdGhlIG5ldyBjaGlsZCwgdGhlbiB3ZSB0cnkgdG8gc2VsZWN0IGJhc2VkIG9uIGlmIHRoaXMgbm9kZSB3YXMgdGhlIGxhc3Qgb25lXHJcbiAgICAgICAgICogY2xpY2tlZCBvbiBmb3IgdGhpcyBwYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdDogW1wiICsgcGFyZW50SWRUb0ZvY3VzSWRNYXBbY3VycmVudE5vZGVJZF1cclxuICAgICAgICAvLyArXCJdPT1bXCIrIG5vZGUuaWQgKyBcIl1cIilcclxuICAgICAgICB2YXIgZm9jdXNOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgIHZhciBzZWxlY3RlZCA9IChmb2N1c05vZGUgJiYgZm9jdXNOb2RlLnVpZCA9PT0gdWlkKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhckh0bWxSZXQgPSB0aGlzLm1ha2VSb3dCdXR0b25CYXJIdG1sKG5vZGUsIGNhbk1vdmVVcCwgY2FuTW92ZURvd24sIGVkaXRpbmdBbGxvd2VkKTtcclxuICAgICAgICB2YXIgYmtnU3R5bGUgPSB0aGlzLmdldE5vZGVCa2dJbWFnZVN0eWxlKG5vZGUpO1xyXG5cclxuICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3dcIiArIChzZWxlY3RlZCA/IFwiIGFjdGl2ZS1yb3dcIiA6IFwiIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibmF2LmNsaWNrT25Ob2RlUm93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsIC8vXHJcbiAgICAgICAgICAgIFwiaWRcIjogY3NzSWQsXHJcbiAgICAgICAgICAgIFwic3R5bGVcIjogYmtnU3R5bGVcclxuICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgIGJ1dHRvbkJhckh0bWxSZXQgKyB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCB0aGlzLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd05vZGVVcmwoKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBtdXN0IGZpcnN0IGNsaWNrIG9uIGEgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhdGggPSBub2RlLnBhdGguc3RyaXBJZlN0YXJ0c1dpdGgoXCIvcm9vdFwiKTtcclxuICAgICAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgcGF0aDtcclxuICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcblxyXG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJVUkwgdXNpbmcgcGF0aDogPGJyPlwiICsgdXJsO1xyXG4gICAgICAgIHZhciB1dWlkID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwiamNyOnV1aWRcIiwgbm9kZSk7XHJcbiAgICAgICAgaWYgKHV1aWQpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSArPSBcIjxwPlVSTCBmb3IgVVVJRDogPGJyPlwiICsgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgdXVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIChuZXcgTWVzc2FnZURsZyhtZXNzYWdlLCBcIlVSTCBvZiBOb2RlXCIpKS5vcGVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VG9wUmlnaHRJbWFnZVRhZyhub2RlKSB7XHJcbiAgICAgICAgdmFyIHRvcFJpZ2h0SW1nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKCdpbWcudG9wLnJpZ2h0Jywgbm9kZSk7XHJcbiAgICAgICAgdmFyIHRvcFJpZ2h0SW1nVGFnID0gXCJcIjtcclxuICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgdG9wUmlnaHRJbWdUYWcgPSB0aGlzLnRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcInNyY1wiOiB0b3BSaWdodEltZyxcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJ0b3AtcmlnaHQtaW1hZ2VcIlxyXG4gICAgICAgICAgICB9LCBcIlwiLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3BSaWdodEltZ1RhZztcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlQmtnSW1hZ2VTdHlsZShub2RlKSB7XHJcbiAgICAgICAgdmFyIGJrZ0ltZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgdmFyIGJrZ0ltZ1N0eWxlID0gXCJcIjtcclxuICAgICAgICBpZiAoYmtnSW1nKSB7XHJcbiAgICAgICAgICAgIGJrZ0ltZ1N0eWxlID0gXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBia2dJbWcgKyBcIik7XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBia2dJbWdTdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zPzogYW55LCBjbGFzc2VzPzogYW55KSB7XHJcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXQgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgYnV0dG9uQmFyKGJ1dHRvbnMsIGNsYXNzZXMpIHtcclxuICAgICAgICBjbGFzc2VzID0gY2xhc3NlcyB8fCBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsZWZ0LWp1c3RpZmllZCBsYXlvdXQgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgfSwgYnV0dG9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpIHtcclxuXHJcbiAgICAgICAgdmFyIGNyZWF0ZWRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgIHZhciBjb21tZW50QnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICB2YXIgcHVibGljQXBwZW5kID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgbm9kZSk7XHJcblxyXG4gICAgICAgIHZhciBvcGVuQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgc2VsQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGVkaXROb2RlQnV0dG9uID0gXCJcIjtcclxuICAgICAgICB2YXIgbW92ZU5vZGVVcEJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgdmFyIG1vdmVOb2RlRG93bkJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGluc2VydE5vZGVCdXR0b24gPSBcIlwiO1xyXG4gICAgICAgIHZhciByZXBseUJ1dHRvbiA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAqIG9yIGhhdmluZyBiZWVuIGFkZGVkIGFzIGNvbW1lbnQgYnkgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5yZXBseVRvQ29tbWVudCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCIgLy9cclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQ291bnQgPSAwO1xyXG5cclxuICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICBpZiAodGhpcy5ub2RlSGFzQ2hpbGRyZW4obm9kZS51aWQpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBvcGVuQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhpZ2hsaWdodC1idXR0b25cIixcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJuYXYub3Blbk5vZGUoJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLy9cclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiT3BlblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgaW4gZWRpdCBtb2RlIHdlIGFsd2F5cyBhdCBsZWFzdCBjcmVhdGUgdGhlIHBvdGVudGlhbCAoYnV0dG9ucykgZm9yIGEgdXNlciB0byBpbnNlcnQgY29udGVudCwgYW5kIGlmXHJcbiAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgKiBpbnRlbGxpZ2VuY2UgdG8gd2hlbiB0byBzaG93IHRoZXNlIGJ1dHRvbnMgb3Igbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFZGl0aW5nIGFsbG93ZWQ6IFwiICsgbm9kZUlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIG5vZGVJZCBcIiArIG5vZGUudWlkICsgXCIgc2VsZWN0ZWQ9XCIgKyBzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3NzID0gc2VsZWN0ZWQgPyB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm5hdi50b2dnbGVOb2RlU2VsKCdcIiArIG5vZGUudWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIlxyXG4gICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJuYXYudG9nZ2xlTm9kZVNlbCgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzZWxCdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIGNzcywgXCJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY25zdC5JTlNfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0Tm9kZUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaW5zZXJ0Tm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQuaW5zZXJ0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiSW5zXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlICYmIGVkaXRpbmdBbGxvd2VkKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgZWRpdE5vZGVCdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCAvL1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5ydW5FZGl0Tm9kZSgnXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiRWRpdFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FuTW92ZVVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVVcEJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwiZWRpdC5tb3ZlTm9kZVVwKCdcIiArIG5vZGUudWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiVXBcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJlZGl0Lm1vdmVOb2RlRG93bignXCIgKyBub2RlLnVpZCArIFwiJyk7XCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkRuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGkgd2lsbCBiZSBmaW5kaW5nIGEgcmV1c2FibGUvRFJZIHdheSBvZiBkb2luZyB0b29sdG9wcyBzb29uLCB0aGlzIGlzIGp1c3QgbXkgZmlyc3QgZXhwZXJpbWVudC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIGluc2VydE5vZGVUb29sdGlwID0gXCJcIjtcclxuICAgICAgICAvL1x0XHRcdCB0aGlzLnRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAvL1x0XHRcdCB9LCBcIklOU0VSVFMgYSBuZXcgbm9kZSBhdCB0aGUgY3VycmVudCB0cmVlIHBvc2l0aW9uLiBBcyBhIHNpYmxpbmcgb24gdGhpcyBsZXZlbC5cIik7XHJcblxyXG4gICAgICAgIHZhciBhZGROb2RlVG9vbHRpcCA9IFwiXCI7XHJcbiAgICAgICAgLy9cdFx0XHQgdGhpcy50YWcoXCJwYXBlci10b29sdGlwXCIsIHtcclxuICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICB2YXIgYWxsQnV0dG9ucyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICsgYWRkTm9kZVRvb2x0aXAgKyBlZGl0Tm9kZUJ1dHRvbiArIG1vdmVOb2RlVXBCdXR0b24gKyBtb3ZlTm9kZURvd25CdXR0b24gKyByZXBseUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMubWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zKSA6IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUhvcml6b250YWxGaWVsZFNldChjb250ZW50Pzogc3RyaW5nLCBleHRyYUNsYXNzZXM/OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgLyogTm93IGJ1aWxkIGVudGlyZSBjb250cm9sIGJhciAqL1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcImRpdlwiLCAvL1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIiArIChleHRyYUNsYXNzZXMgPyAoXCIgXCIgKyBleHRyYUNsYXNzZXMpIDogXCJcIilcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUhvcnpDb250cm9sR3JvdXAoY29udGVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGxheW91dFwiXHJcbiAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZVJhZGlvQnV0dG9uKGxhYmVsLCBpZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLXJhZGlvLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBpZFxyXG4gICAgICAgIH0sIGxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBub2RlSWQgKHNlZSBtYWtlTm9kZUlkKCkpIE5vZGVJbmZvIG9iamVjdCBoYXMgJ2hhc0NoaWxkcmVuJyB0cnVlXHJcbiAgICAgKi9cclxuICAgIG5vZGVIYXNDaGlsZHJlbih1aWQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBub2RlSGFzQ2hpbGRyZW46IFwiICsgdWlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRQYXRoKG5vZGUpIHtcclxuICAgICAgICB2YXIgcGF0aCA9IG5vZGUucGF0aDtcclxuXHJcbiAgICAgICAgLyogd2UgaW5qZWN0IHNwYWNlIGluIGhlcmUgc28gdGhpcyBzdHJpbmcgY2FuIHdyYXAgYW5kIG5vdCBhZmZlY3Qgd2luZG93IHNpemVzIGFkdmVyc2VseSwgb3IgbmVlZCBzY3JvbGxpbmcgKi9cclxuICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlQWxsKFwiL1wiLCBcIiAvIFwiKTtcclxuICAgICAgICB2YXIgc2hvcnRQYXRoID0gcGF0aC5sZW5ndGggPCA1MCA/IHBhdGggOiBwYXRoLnN1YnN0cmluZygwLCA0MCkgKyBcIi4uLlwiO1xyXG5cclxuICAgICAgICB2YXIgbm9Sb290UGF0aCA9IHNob3J0UGF0aDtcclxuICAgICAgICBpZiAobm9Sb290UGF0aC5zdGFydHNXaXRoKFwiL3Jvb3RcIikpIHtcclxuICAgICAgICAgICAgbm9Sb290UGF0aCA9IG5vUm9vdFBhdGguc3Vic3RyaW5nKDAsIDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJldCA9IG1ldGE2NC5pc0FkbWluVXNlciA/IHNob3J0UGF0aCA6IG5vUm9vdFBhdGg7XHJcbiAgICAgICAgcmV0ICs9IFwiIFtcIiArIG5vZGUucHJpbWFyeVR5cGVOYW1lICsgXCJdXCI7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB3cmFwSHRtbCh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIFwiPGRpdj5cIiArIHRleHQgKyBcIjwvZGl2PlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBFYWNoIHBhZ2UgY2FuIHNob3cgYnV0dG9ucyBhdCB0aGUgdG9wIG9mIGl0IChub3QgbWFpbiBoZWFkZXIgYnV0dG9ucyBidXQgYWRkaXRpb25hbCBidXR0b25zIGp1c3QgZm9yIHRoYXRcclxuICAgICAqIHBhZ2Ugb25seSwgYW5kIHRoaXMgZ2VuZXJhdGVzIHRoYXQgY29udGVudCBmb3IgdGhhdCBlbnRpcmUgY29udHJvbCBiYXIuXHJcbiAgICAgKi9cclxuICAgIHJlbmRlck1haW5QYWdlQ29udHJvbHMoKSB7XHJcbiAgICAgICAgdmFyIGh0bWwgPSAnJztcclxuXHJcbiAgICAgICAgdmFyIGhhc0NvbnRlbnQgPSBodG1sLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgaWYgKGhhc0NvbnRlbnQpIHtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQoXCJtYWluUGFnZUNvbnRyb2xzXCIsIGh0bWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI21haW5QYWdlQ29udHJvbHNcIiwgaGFzQ29udGVudClcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVuZGVycyBwYWdlIGFuZCBhbHdheXMgYWxzbyB0YWtlcyBjYXJlIG9mIHNjcm9sbGluZyB0byBzZWxlY3RlZCBub2RlIGlmIHRoZXJlIGlzIG9uZSB0byBzY3JvbGwgdG9cclxuICAgICAqL1xyXG4gICAgcmVuZGVyUGFnZUZyb21EYXRhKGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBtZXRhNjQuY29kZUZvcm1hdERpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKClcIik7XHJcblxyXG4gICAgICAgIHZhciBuZXdEYXRhID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld0RhdGEgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhIHx8ICFkYXRhLm5vZGUpIHtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChcIk5vIGNvbnRlbnQgaXMgYXZhaWxhYmxlIGhlcmUuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJNYWluUGFnZUNvbnRyb2xzKCk7XHJcbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICBtZXRhNjQudWlkVG9Ob2RlTWFwID0ge307XHJcbiAgICAgICAgICAgIG1ldGE2NC5pZFRvTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSSdtIGNob29zaW5nIHRvIHJlc2V0IHNlbGVjdGVkIG5vZGVzIHdoZW4gYSBuZXcgcGFnZSBsb2FkcywgYnV0IHRoaXMgaXMgbm90IGEgcmVxdWlyZW1lbnQuIEkganVzdFxyXG4gICAgICAgICAgICAgKiBkb24ndCBoYXZlIGEgXCJjbGVhciBzZWxlY3Rpb25zXCIgZmVhdHVyZSB3aGljaCB3b3VsZCBiZSBuZWVkZWQgc28gdXNlciBoYXMgYSB3YXkgdG8gY2xlYXIgb3V0LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2V0Q3VycmVudE5vZGVEYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHByb3BDb3VudCA9IG1ldGE2NC5jdXJyZW50Tm9kZS5wcm9wZXJ0aWVzID8gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMubGVuZ3RoIDogMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2RlYnVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVOREVSIE5PREU6IFwiICsgZGF0YS5ub2RlLmlkICsgXCIgcHJvcENvdW50PVwiICsgcHJvcENvdW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvdXRwdXQgPSAnJztcclxuICAgICAgICB2YXIgYmtnU3R5bGUgPSB0aGlzLmdldE5vZGVCa2dJbWFnZVN0eWxlKGRhdGEubm9kZSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTk9URTogbWFpbk5vZGVDb250ZW50IGlzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFnZSBjb250ZW50LCBhbmQgaXMgYWx3YXlzIHRoZSBub2RlIGRpc3BsYXllZCBhdCB0aGUgdG9cclxuICAgICAgICAgKiBvZiB0aGUgcGFnZSBhYm92ZSBhbGwgdGhlIG90aGVyIG5vZGVzIHdoaWNoIGFyZSBpdHMgY2hpbGQgbm9kZXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIG1haW5Ob2RlQ29udGVudCA9IHRoaXMucmVuZGVyTm9kZUNvbnRlbnQoZGF0YS5ub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluTm9kZUNvbnRlbnQ6IFwiK21haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgIGlmIChtYWluTm9kZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgdWlkID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgdmFyIGNzc0lkID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgZWRpdE5vZGVCdXR0b24gPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciByZXBseUJ1dHRvbiA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRhdGEubm9kZS5wYXRoPVwiK2RhdGEubm9kZS5wYXRoKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpc05vbk93bmVkQ29tbWVudE5vZGU9XCIrcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKGRhdGEubm9kZSkpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWROb2RlKGRhdGEubm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNyZWF0ZWRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgIHZhciBjb21tZW50QnkgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICB2YXIgcHVibGljQXBwZW5kID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFNob3cgUmVwbHkgYnV0dG9uIGlmIHRoaXMgaXMgYSBwdWJsaWNseSBhcHBlbmRhYmxlIG5vZGUgYW5kIG5vdCBjcmVhdGVkIGJ5IGN1cnJlbnQgdXNlcixcclxuICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBpZiAocHVibGljQXBwZW5kICYmIGNyZWF0ZWRCeSAhPSBtZXRhNjQudXNlck5hbWUgJiYgY29tbWVudEJ5ICE9IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJlZGl0LnJlcGx5VG9Db21tZW50KCdcIiArIGRhdGEubm9kZS51aWQgKyBcIicpO1wiIC8vXHJcbiAgICAgICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGUgJiYgY25zdC5ORVdfT05fVE9PTEJBUiAmJiBlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVTdWJOb2RlQnV0dG9uID0gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFwiaWRcIiA6IFwiYWRkTm9kZUJ1dHRvbklkXCIgKyBub2RlLnVpZCxcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQuY3JlYXRlU3ViTm9kZSgnXCIgKyB1aWQgKyBcIicpO1wiXHJcbiAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogQWRkIGVkaXQgYnV0dG9uIGlmIGVkaXQgbW9kZSBhbmQgdGhpcyBpc24ndCB0aGUgcm9vdCAqL1xyXG4gICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRoaXMudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcImVkaXQucnVuRWRpdE5vZGUoJ1wiICsgdWlkICsgXCInKTtcIlxyXG4gICAgICAgICAgICAgICAgfSwgXCJFZGl0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgIHZhciBmb2N1c05vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgIC8vIHZhciByb3dIZWFkZXIgPSB0aGlzLmJ1aWxkUm93SGVhZGVyKGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFyID0gdGhpcy5tYWtlSG9yaXpvbnRhbEZpZWxkU2V0KGNyZWF0ZVN1Yk5vZGVCdXR0b24gKyBlZGl0Tm9kZUJ1dHRvbiArIHJlcGx5QnV0dG9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IChzZWxlY3RlZCA/IFwibWFpbk5vZGVDb250ZW50U3R5bGUgYWN0aXZlLXJvd1wiIDogXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBpbmFjdGl2ZS1yb3dcIiksXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJuYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJ1wiICsgdWlkICsgXCInKTtcIixcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQmFyICsgbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLnNob3coKTtcclxuICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVwZGF0ZSBzdGF0dXMgYmFyLlwiKTtcclxuICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBwYWdlIGNvbnRyb2xzLlwiKTtcclxuICAgICAgICB0aGlzLnJlbmRlck1haW5QYWdlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb3VudCA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoaWxkQ291bnQ6IFwiICsgY2hpbGRDb3VudCk7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb25cclxuICAgICAgICAgICAgICogdGhlIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGRhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZVJvdyhpLCBub2RlLCBuZXdEYXRhLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHJvdztcclxuICAgICAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWRpdC5pc0luc2VydEFsbG93ZWQoZGF0YS5ub2RlKSkge1xyXG4gICAgICAgICAgICBpZiAocm93Q291bnQgPT0gMCAmJiAhbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2dldEVtcHR5UGFnZVByb21wdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZChcImxpc3RWaWV3XCIsIG91dHB1dCk7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuY29kZUZvcm1hdERpcnR5KSB7XHJcbiAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRPRE8tMzogSW5zdGVhZCBvZiBjYWxsaW5nIHNjcmVlblNpemVDaGFuZ2UgaGVyZSBpbW1lZGlhdGVseSwgaXQgd291bGQgYmUgYmV0dGVyIHRvIHNldCB0aGUgaW1hZ2Ugc2l6ZXNcclxuICAgICAgICAgKiBleGFjdGx5IG9uIHRoZSBhdHRyaWJ1dGVzIG9mIGVhY2ggaW1hZ2UsIGFzIHRoZSBIVE1MIHRleHQgaXMgcmVuZGVyZWQgYmVmb3JlIHdlIGV2ZW4gY2FsbFxyXG4gICAgICAgICAqIHNldEh0bWxFbmhhbmNlZEJ5SWQsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG1ldGE2NC5zY3JlZW5TaXplQ2hhbmdlKCk7XHJcblxyXG4gICAgICAgIGlmICghbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlUm93KGksIG5vZGUsIG5ld0RhdGEsIGNoaWxkQ291bnQsIHJvd0NvdW50KSB7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobmV3RGF0YSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIFJFTkRFUiBST1dbXCIgKyBpICsgXCJdOiBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd0NvdW50Kys7IC8vIHdhcm5pbmc6IHRoaXMgaXMgdGhlIGxvY2FsIHZhcmlhYmxlL3BhcmFtZXRlclxyXG4gICAgICAgIHZhciByb3cgPSB0aGlzLnJlbmRlck5vZGVBc0xpc3RJdGVtKG5vZGUsIGksIGNoaWxkQ291bnQsIHJvd0NvdW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvd1tcIiArIHJvd0NvdW50ICsgXCJdPVwiICsgcm93KTtcclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpIHtcclxuICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHNlZSBhbHNvOiBtYWtlSW1hZ2VUYWcoKSAqL1xyXG4gICAgYWRqdXN0SW1hZ2VTaXplKG5vZGUpIHtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9ICQoXCIjXCIgKyBub2RlLmltZ0lkKTtcclxuICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgIC8vIHZhciB3aWR0aCA9IGVsbS5hdHRyKFwid2lkdGhcIik7XHJcbiAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSBlbG0uYXR0cihcImhlaWdodFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgKiB3aGljaCB3ZSB3YW50LCBidXQgdGhlbiB3ZSBhbHNvIGxpbWl0IGl0IHdpdGggbWF4LXdpZHRoIHNvIG9uIHNtYWxsZXIgc2NyZWVuIGRldmljZXMgb3Igc21hbGxcclxuICAgICAgICAgICAgICAgICAqIHdpbmRvdyByZXNpemluZ3MgZXZlbiBvbiBkZXNrdG9wIGJyb3dzZXJzIHRoZSBpbWFnZSB3aWxsIGFsd2F5cyBiZSBlbnRpcmVseSB2aXNpYmxlIGFuZCBub3RcclxuICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vIHZhciBtYXhXaWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwO1xyXG4gICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogRE8gTk9UIERFTEVURSAoZm9yIGEgbG9uZyB0aW1lIGF0IGxlYXN0KSBUaGlzIGlzIHRoZSBvbGQgbG9naWMgZm9yIHJlc2l6aW5nIGltYWdlcyByZXNwb25zaXZlbHksXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgaXQgd29ya3MgZmluZSBidXQgbXkgbmV3IGxvZ2ljIGlzIGJldHRlciwgd2l0aCBsaW1pdGluZyBtYXggd2lkdGggYmFzZWQgb24gc2NyZWVuIHNpemUuIEJ1dFxyXG4gICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCA+IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDgwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBtZXRhNjQuZGV2aWNlV2lkdGggLSA4MDtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBoZWlnaHQgPSB3aWR0aCAqIG5vZGUuaGVpZ2h0IC8gbm9kZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcImhlaWdodFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJzdHlsZVwiLCBcIm1heC13aWR0aDogXCIgKyBtYXhXaWR0aCArIFwicHg7XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsbS5hdHRyKFwid2lkdGhcIiwgbm9kZS53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHNlZSBhbHNvOiBhZGp1c3RJbWFnZVNpemUoKSAqL1xyXG4gICAgbWFrZUltYWdlVGFnKG5vZGUpIHtcclxuICAgICAgICB2YXIgc3JjID0gdGhpcy5nZXRVcmxGb3JOb2RlQXR0YWNobWVudChub2RlKTtcclxuICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUud2lkdGggJiYgbm9kZS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFllcywgaXQgd291bGQgaGF2ZSBiZWVuIHNpbXBsZXIgdG8ganVzdCB1c2Ugc29tZXRoaW5nIGxpa2Ugd2lkdGg9MTAwJSBmb3IgdGhlIGltYWdlIHdpZHRoIGJ1dCB0aGVuXHJcbiAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgKiB0aGUgZWZmZWN0aXZlIHNjcm9sbCBwb3NpdGlvbiBvZiBlYWNoIHJvdyB3aWxsIGJlIGluY3JlYXNpbmcgZWFjaCB0aW1lIHRoZSBVUkwgcmVxdWVzdCBmb3IgYSBuZXdcclxuICAgICAgICAgICAgICogaW1hZ2UgY29tcGxldGVzLiBXaGF0IHdlIHdhbnQgaXMgdG8gaGF2ZSBpdCBzbyB0aGF0IG9uY2Ugd2Ugc2V0IHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gc2Nyb2xsIGFcclxuICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAqIGluIGFzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG5vZGUud2lkdGggPiBtZXRhNjQuZGV2aWNlV2lkdGggLSA1MCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IG1ldGE2NC5kZXZpY2VXaWR0aCAtIDUwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgKiBhbmQgc2V0IHRoZSBoZWlnaHQgdG8gdGhlIHZhbHVlIGl0IG5lZWRzIHRvIGJlIGF0IGZvciBzYW1lIHcvaCByYXRpbyAobm8gaW1hZ2Ugc3RyZXRjaGluZylcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRhZyhcImltZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIndpZHRoXCI6IHdpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIEltYWdlIGRvZXMgZml0IG9uIHNjcmVlbiBzbyByZW5kZXIgaXQgYXQgaXQncyBleGFjdCBzaXplICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBub2RlLmltZ0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGhcIjogbm9kZS53aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZFxyXG4gICAgICAgICAgICB9LCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAqIGNvbnRlbnQgaXMgbm9uLW51bGxcclxuICAgICAqL1xyXG4gICAgdGFnKHRhZz86IGFueSwgYXR0cmlidXRlcz86IGFueSwgY29udGVudD86IGFueSwgY2xvc2VUYWc/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgLyogZGVmYXVsdCBwYXJhbWV0ZXIgdmFsdWVzICovXHJcbiAgICAgICAgaWYgKHR5cGVvZiAoY2xvc2VUYWcpID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAvKiBIVE1MIHRhZyBpdHNlbGYgKi9cclxuICAgICAgICB2YXIgcmV0ID0gXCI8XCIgKyB0YWc7XHJcblxyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgKiB3ZSBpbnRlbGxpZ2VudGx5IHdyYXAgc3RyaW5ncyB0aGF0IGNvbnRhaW4gc2luZ2xlIHF1b3RlcyBpbiBkb3VibGUgcXVvdGVzIGFuZCB2aWNlIHZlcnNhXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYuY29udGFpbnMoXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbG9zZVRhZykge1xyXG4gICAgICAgICAgICByZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0ICs9IFwiLz5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZVRleHRBcmVhKGZpZWxkTmFtZSwgZmllbGRJZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlRWRpdEZpZWxkKGZpZWxkTmFtZSwgZmllbGRJZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICBcImlkXCI6IGZpZWxkSWRcclxuICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBtYWtlUGFzc3dvcmRGaWVsZChmaWVsZE5hbWUsIGZpZWxkSWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJwYXBlci1pbnB1dFwiLCB7XHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkXHJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUJ1dHRvbih0ZXh0LCBpZCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgYXR0cmlicyA9IHtcclxuICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgXCJpZFwiOiBpZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBjYWxsYmFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogZG9tSWQgaXMgaWQgb2YgZGlhbG9nIGJlaW5nIGNsb3NlZC5cclxuICAgICAqL1xyXG4gICAgbWFrZUJhY2tCdXR0b24odGV4dCwgaWQsIGRvbUlkLCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuY2FuY2VsRGlhbG9nKCdcIiArIGRvbUlkICsgXCInKTtcIiArIGNhbGxiYWNrXHJcbiAgICAgICAgfSwgdGV4dCwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wTmFtZSkge1xyXG4gICAgICAgIGlmICghbWV0YTY0LmluU2ltcGxlTW9kZSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdFtwcm9wTmFtZV0gPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpc1JlYWRPbmx5UHJvcGVydHkocHJvcE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gbWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBpc0JpbmFyeVByb3BlcnR5KHByb3BOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhbml0aXplUHJvcGVydHlOYW1lKHByb3BOYW1lOiBhbnkpIHtcclxuICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBcInNpbXBsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wTmFtZSA9PT0gamNyQ25zdC5DT05URU5UID8gXCJDb250ZW50XCIgOiBwcm9wTmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInJlbmRlclwiXSkge1xyXG4gICAgdmFyIHJlbmRlcjogUmVuZGVyID0gbmV3IFJlbmRlcigpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBzZWFyY2guanNcIik7XHJcblxyXG4vKlxyXG4gKiB0b2RvLTM6IHRyeSB0byByZW5hbWUgdG8gJ3NlYXJjaCcsIGJ1dCByZW1lbWJlciB5b3UgaGFkIGluZXhwbGlhYmxlIHByb2JsZW1zIHRoZSBmaXJzdCB0aW1lIHlvdSB0cmllZCB0byB1c2UgJ3NlYXJjaCdcclxuICogYXMgdGhlIHZhciBuYW1lLlxyXG4gKi9cclxuY2xhc3MgU3JjaCB7XHJcblxyXG4gICAgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3NyY2hfcm93XCI7XHJcblxyXG4gICAgc2VhcmNoTm9kZXM6IGFueSA9IG51bGw7XHJcbiAgICBzZWFyY2hQYWdlVGl0bGU6IHN0cmluZyA9IFwiU2VhcmNoIFJlc3VsdHNcIjtcclxuICAgIHRpbWVsaW5lUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlRpbWVsaW5lXCI7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHNlYXJjaCBoYXMgYmVlbiBkb25lLlxyXG4gICAgICovXHJcbiAgICBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIb2xkcyB0aGUgTm9kZVNlYXJjaFJlc3BvbnNlLmphdmEgSlNPTiwgb3IgbnVsbCBpZiBubyB0aW1lbGluZSBoYXMgYmVlbiBkb25lLlxyXG4gICAgICovXHJcbiAgICB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIFdpbGwgYmUgdGhlIGxhc3Qgcm93IGNsaWNrZWQgb24gKE5vZGVJbmZvLmphdmEgb2JqZWN0KSBhbmQgaGF2aW5nIHRoZSByZWQgaGlnaGxpZ2h0IGJhclxyXG4gICAgICovXHJcbiAgICBoaWdobGlnaHRSb3dOb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgKi9cclxuICAgIGlkZW50VG9VaWRNYXA6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBtYXBzIG5vZGUudWlkIHZhbHVlcyB0byB0aGUgTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgKlxyXG4gICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICogJ2luc3RhbmNlJyBvZiBhIG1vZGVsIG9iamVjdC4gVmVyeSBzaW1pbGFyIHRvIGEgJ2hhc2hDb2RlJyBvbiBKYXZhIG9iamVjdHMuXHJcbiAgICAgKi9cclxuICAgIHVpZFRvTm9kZU1hcDogYW55ID17fTtcclxuXHJcbiAgICBudW1TZWFyY2hSZXN1bHRzKCkge1xyXG4gICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFJlc3VsdHMuc2VhcmNoUmVzdWx0cyAhPSBudWxsICYmIC8vXHJcbiAgICAgICAgICAgIHNyY2guc2VhcmNoUmVzdWx0cy5zZWFyY2hSZXN1bHRzLmxlbmd0aCAhPSBudWxsID8gLy9cclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hUYWJBY3RpdmF0ZWQoKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBhIGxvZ2dlZCBpbiB1c2VyIGNsaWNrcyB0aGUgc2VhcmNoIHRhYiwgYW5kIG5vIHNlYXJjaCByZXN1bHRzIGFyZSBjdXJyZW50bHkgZGlzcGxheWluZywgdGhlbiBnbyBhaGVhZFxyXG4gICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLm51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAobmV3IFNlYXJjaERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlYXJjaE5vZGVzUmVzcG9uc2UocmVzKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gc2VhcmNoUmVzdWx0c1BhbmVsLmJ1aWxkKCk7XHJcbiAgICAgICAgdXRpbC5zZXRIdG1sRW5oYW5jZWQoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgc2VhcmNoUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICBtZXRhNjQuY2hhbmdlUGFnZShzZWFyY2hSZXN1bHRzUGFuZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHRpbWVsaW5lUmVzcG9uc2UocmVzKSB7XHJcbiAgICAgICAgdGhpcy50aW1lbGluZVJlc3VsdHMgPSByZXM7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aW1lbGluZVJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgdGltZWxpbmVSZXN1bHRzUGFuZWwuaW5pdCgpO1xyXG4gICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHRpbWVsaW5lUmVzdWx0c1BhbmVsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aW1lbGluZSgpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byAndGltZWxpbmUnIHVuZGVyLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1dGlsLmpzb24oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcclxuICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IFwiXCIsXHJcbiAgICAgICAgICAgIFwibW9kU29ydERlc2NcIjogdHJ1ZSxcclxuICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IFwiamNyOmNvbnRlbnRcIiAvLyBzaG91bGQgaGF2ZSBubyBlZmZlY3QsIGZvclxyXG4gICAgICAgICAgICAvLyB0aW1lbGluZT9cclxuICAgICAgICB9LCB0aGlzLnRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRTZWFyY2hOb2RlKG5vZGUpIHtcclxuICAgICAgICBub2RlLnVpZCA9IHV0aWwuZ2V0VWlkRm9ySWQodGhpcy5pZGVudFRvVWlkTWFwLCBub2RlLmlkKTtcclxuICAgICAgICB0aGlzLnVpZFRvTm9kZU1hcFtub2RlLnVpZF0gPSBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2UoZGF0YSwgdmlld05hbWUpIHtcclxuICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XHJcbiAgICAgICAgdmFyIGNoaWxkQ291bnQgPSBkYXRhLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIE51bWJlciBvZiByb3dzIHRoYXQgaGF2ZSBhY3R1YWxseSBtYWRlIGl0IG9udG8gdGhlIHBhZ2UgdG8gZmFyLiBOb3RlOiBzb21lIG5vZGVzIGdldCBmaWx0ZXJlZCBvdXQgb24gdGhlXHJcbiAgICAgICAgICogY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgJC5lYWNoKGRhdGEuc2VhcmNoUmVzdWx0cywgZnVuY3Rpb24oaSwgbm9kZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpei5pbml0U2VhcmNoTm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgIHJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgIG91dHB1dCArPSB0aGl6LnJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZCh2aWV3TmFtZSwgb3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmVuZGVycyBhIHNpbmdsZSBsaW5lIG9mIHNlYXJjaCByZXN1bHRzIG9uIHRoZSBzZWFyY2ggcmVzdWx0cyBwYWdlLlxyXG4gICAgICpcclxuICAgICAqIG5vZGUgaXMgYSBOb2RlSW5mby5qYXZhIEpTT05cclxuICAgICAqL1xyXG4gICAgcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbShub2RlLCBpbmRleCwgY291bnQsIHJvd0NvdW50KSB7XHJcblxyXG4gICAgICAgIHZhciB1aWQgPSBub2RlLnVpZDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlclNlYXJjaFJlc3VsdDogXCIgKyB1aWQpO1xyXG5cclxuICAgICAgICB2YXIgY3NzSWQgPSB1aWQgKyB0aGlzLl9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gd2l0aCBpZDogXCIgK2Nzc0lkKVxyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFySHRtbCA9IHRoaXMubWFrZUJ1dHRvbkJhckh0bWwoXCJcIiArIHVpZCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnV0dG9uQmFySHRtbD1cIiArIGJ1dHRvbkJhckh0bWwpO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gcmVuZGVyLnJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJub2RlLXRhYmxlLXJvdyBpbmFjdGl2ZS1yb3dcIixcclxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwic3JjaC5jbGlja09uU2VhcmNoUmVzdWx0Um93KHRoaXMsICdcIiArIHVpZCArIFwiJyk7XCIsIC8vXHJcbiAgICAgICAgICAgIFwiaWRcIjogY3NzSWRcclxuICAgICAgICB9LC8vXHJcbiAgICAgICAgICAgIGJ1dHRvbkJhckh0bWwvL1xyXG4gICAgICAgICAgICArIHJlbmRlci50YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB1aWQgKyBcIl9zcmNoX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFrZUJ1dHRvbkJhckh0bWwodWlkKSB7XHJcbiAgICAgICAgdmFyIGdvdG9CdXR0b24gPSByZW5kZXIubWFrZUJ1dHRvbihcIkdvIHRvIE5vZGVcIiwgdWlkLCBcInNyY2guY2xpY2tTZWFyY2hOb2RlKCdcIiArIHVpZCArIFwiJyk7XCIpO1xyXG4gICAgICAgIHJldHVybiByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChnb3RvQnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja09uU2VhcmNoUmVzdWx0Um93KHJvd0VsbSwgdWlkKSB7XHJcbiAgICAgICAgdGhpcy51bmhpZ2hsaWdodFJvdygpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0Um93Tm9kZSA9IHRoaXMudWlkVG9Ob2RlTWFwW3VpZF07XHJcblxyXG4gICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja1NlYXJjaE5vZGUodWlkKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB1cGRhdGUgaGlnaGxpZ2h0IG5vZGUgdG8gcG9pbnQgdG8gdGhlIG5vZGUgY2xpY2tlZCBvbiwganVzdCB0byBwZXJzaXN0IGl0IGZvciBsYXRlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNyY2guaGlnaGxpZ2h0Um93Tm9kZSA9IHNyY2gudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgdmlldy5yZWZyZXNoVHJlZShzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQsIHRydWUpO1xyXG4gICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogdHVybiBvZiByb3cgc2VsZWN0aW9uIHN0eWxpbmcgb2Ygd2hhdGV2ZXIgcm93IGlzIGN1cnJlbnRseSBzZWxlY3RlZFxyXG4gICAgICovXHJcbiAgICB1bmhpZ2hsaWdodFJvdygpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgIHZhciBub2RlSWQgPSB0aGlzLmhpZ2hsaWdodFJvd05vZGUudWlkICsgdGhpcy5fVUlEX1JPV0lEX1NVRkZJWDtcclxuXHJcbiAgICAgICAgdmFyIGVsbSA9IHV0aWwuZG9tRWxtKG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKGVsbSkge1xyXG4gICAgICAgICAgICAvKiBjaGFuZ2UgY2xhc3Mgb24gZWxlbWVudCAqL1xyXG4gICAgICAgICAgICB1dGlsLmNoYW5nZU9yQWRkQ2xhc3MoZWxtLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInNyY2hcIl0pIHtcclxuICAgIHZhciBzcmNoOiBTcmNoID0gbmV3IFNyY2goKTtcclxufVxyXG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXNlci5qc1wiKTtcclxuXHJcbmNsYXNzIFNoYXJlIHtcclxuXHJcbiAgICBfZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UocmVzKSB7XHJcbiAgICAgICAgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlKHJlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hhcmluZ05vZGU6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLypcclxuICAgICAqIEhhbmRsZXMgJ1NoYXJpbmcnIGJ1dHRvbiBvbiBhIHNwZWNpZmljIG5vZGUsIGZyb20gYnV0dG9uIGJhciBhYm92ZSBub2RlIGRpc3BsYXkgaW4gZWRpdCBtb2RlXHJcbiAgICAgKi9cclxuICAgIGVkaXROb2RlU2hhcmluZygpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaGFyaW5nTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU2hhcmVkTm9kZXMoKSB7XHJcbiAgICAgICAgdmFyIGZvY3VzTm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICBpZiAoZm9jdXNOb2RlID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3JjaC5zZWFyY2hQYWdlVGl0bGUgPSBcIlNoYXJlZCBOb2Rlc1wiO1xyXG5cclxuICAgICAgICB1dGlsLmpzb24oXCJnZXRTaGFyZWROb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IGZvY3VzTm9kZS5pZFxyXG4gICAgICAgIH0sIHRoaXMuX2ZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlLCB0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKCF3aW5kb3dbXCJzaGFyZVwiXSkge1xyXG4gICAgdmFyIHNoYXJlOiBTaGFyZSA9IG5ldyBTaGFyZSgpO1xyXG59XHRcclxuIiwiY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdXNlci5qc1wiKTtcclxuXHJcbmNsYXNzIFVzZXIge1xyXG5cclxuICAgIC8vIHJlcyBpcyBKU09OIHJlc3BvbnNlIG9iamVjdCBmcm9tIHNlcnZlci5cclxuICAgIF9yZWZyZXNoTG9naW5SZXNwb25zZShyZXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpblJlc3BvbnNlXCIpO1xyXG5cclxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgdXNlci5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgdXNlci5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIF9sb2dvdXRSZXNwb25zZShyZXMpIHtcclxuICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICB9XHJcblxyXG4gICAgX3R3aXR0ZXJMb2dpblJlc3BvbnNlKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidHdpdHRlciBMb2dpbiByZXNwb25zZSByZWNpZXZlZC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCBJIHdhbnQgdG8gYWxsb3cgY2VydGFpbiB1c2VycyBhZGRpdGlvbmFsIHByaXZpbGVnZXMuIEEgYml0IG9mIGEgaGFjayBiZWNhdXNlIGl0IHdpbGwgZ29cclxuICAgICAqIGludG8gcHJvZHVjdGlvbiwgYnV0IG9uIG15IG93biBwcm9kdWN0aW9uIHRoZXNlIGFyZSBteSBcInRlc3RVc2VyQWNjb3VudHNcIiwgc28gbm8gcmVhbCB1c2VyIHdpbGwgYmUgYWJsZSB0b1xyXG4gICAgICogdXNlIHRoZXNlIG5hbWVzXHJcbiAgICAgKi9cclxuICAgIGlzVGVzdFVzZXJBY2NvdW50KCkge1xyXG4gICAgICAgIHJldHVybiBtZXRhNjQudXNlck5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJhZGFtXCIgfHwgLy9cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYm9iXCIgfHwgLy9cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiY29yeVwiIHx8IC8vXHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRhblwiO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlKHJlcykge1xyXG4gICAgICAgIHZhciB0aXRsZSA9IEJSQU5ESU5HX1RJVExFO1xyXG4gICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgdGl0bGUgKz0gXCIgLSBcIiArIHJlcy51c2VyTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjaGVhZGVyQXBwTmFtZVwiKS5odG1sKHRpdGxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBUT0RPLTM6IG1vdmUgdGhpcyBpbnRvIG1ldGE2NCBtb2R1bGUgKi9cclxuICAgIHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZShyZXMpIHtcclxuICAgICAgICBpZiAocmVzLnJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZUlkID0gcmVzLnJvb3ROb2RlLmlkO1xyXG4gICAgICAgICAgICBtZXRhNjQuaG9tZU5vZGVQYXRoID0gcmVzLnJvb3ROb2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1ldGE2NC51c2VyTmFtZSA9IHJlcy51c2VyTmFtZTtcclxuICAgICAgICBtZXRhNjQuaXNBZG1pblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYWRtaW5cIjtcclxuXHJcbiAgICAgICAgbWV0YTY0LmlzQW5vblVzZXIgPSByZXMudXNlck5hbWUgPT09IFwiYW5vbnltb3VzXCI7XHJcbiAgICAgICAgbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlID0gcmVzLmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG5cclxuICAgICAgICBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPSByZXMudXNlclByZWZlcmVuY2VzLmFkdmFuY2VkTW9kZSA/IG1ldGE2NC5NT0RFX0FEVkFOQ0VEIDogbWV0YTY0Lk1PREVfU0lNUExFO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImZyb20gc2VydmVyOiBtZXRhNjQuZWRpdE1vZGVPcHRpb249XCIgKyBtZXRhNjQuZWRpdE1vZGVPcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHR3aXR0ZXJMb2dpbigpIHtcclxuICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJub3QgeWV0IGltcGxlbWVudGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBwb2x5bWVyIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcbiAgICAgICAgICogd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvdHdpdHRlckxvZ2luXCI7XHJcbiAgICAgICAgICovXHJcbiAgICB9XHJcblxyXG4gICAgb3BlblNpZ251cFBnKCkge1xyXG4gICAgICAgIChuZXcgU2lnbnVwRGxnKCkpLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBXcml0ZSBhIGNvb2tpZSB0aGF0IGV4cGlyZXMgaW4gYSB5ZWFyIGZvciBhbGwgcGF0aHMgKi9cclxuICAgIHdyaXRlQ29va2llKG5hbWUsIHZhbCkge1xyXG4gICAgICAgICQuY29va2llKG5hbWUsIHZhbCwge1xyXG4gICAgICAgICAgICBleHBpcmVzOiAzNjUsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1Z2x5LiBJdCBpcyB0aGUgYnV0dG9uIHRoYXQgY2FuIGJlIGxvZ2luICpvciogbG9nb3V0LlxyXG4gICAgICovXHJcbiAgICBvcGVuTG9naW5QZygpIHtcclxuICAgICAgICB2YXIgbG9naW5EbGcgPSBuZXcgTG9naW5EbGcoKTtcclxuICAgICAgICBsb2dpbkRsZy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XHJcbiAgICAgICAgbG9naW5EbGcub3BlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hMb2dpbigpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW4uXCIpO1xyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGNhbGxVc3IsIGNhbGxQd2QsIHVzaW5nQ29va2llcyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBsb2dpblNlc3Npb25SZWFkeSA9ICQoXCIjbG9naW5TZXNzaW9uUmVhZHlcIikudGV4dCgpO1xyXG4gICAgICAgIGlmIChsb2dpblNlc3Npb25SZWFkeSA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSB0cnVlXCIpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB1c2luZyBibGFuayBjcmVkZW50aWFscyB3aWxsIGNhdXNlIHNlcnZlciB0byBsb29rIGZvciBhIHZhbGlkIHNlc3Npb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gXCJcIjtcclxuICAgICAgICAgICAgdXNpbmdDb29raWVzID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBsb2dpblNlc3Npb25SZWFkeSA9IGZhbHNlXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxvZ2luU3RhdGUgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSk7XHJcblxyXG4gICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIGtub3duIHN0YXRlIGFzIGxvZ2dlZCBvdXQsIHRoZW4gZG8gbm90aGluZyBoZXJlICovXHJcbiAgICAgICAgICAgIGlmIChsb2dpblN0YXRlID09PSBcIjBcIikge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdXNyID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgdmFyIHB3ZCA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1BXRCk7XHJcblxyXG4gICAgICAgICAgICB1c2luZ0Nvb2tpZXMgPSAhdXRpbC5lbXB0eVN0cmluZyh1c3IpICYmICF1dGlsLmVtcHR5U3RyaW5nKHB3ZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29va2llVXNlcj1cIiArIHVzciArIFwiIHVzaW5nQ29va2llcyA9IFwiICsgdXNpbmdDb29raWVzKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIGVtcHl0IGNyZWRlbnRpYWxzIGNhdXNlcyBzZXJ2ZXIgdG8gdHJ5IHRvIGxvZyBpbiB3aXRoIGFueSBhY3RpdmUgc2Vzc2lvbiBjcmVkZW50aWFscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxVc3IgPSB1c3IgPyB1c3IgOiBcIlwiO1xyXG4gICAgICAgICAgICBjYWxsUHdkID0gcHdkID8gcHdkIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaExvZ2luIHdpdGggbmFtZTogXCIgKyBjYWxsVXNyKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYWxsVXNyKSB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IGNhbGxVc3IsXHJcbiAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCI6IGNhbGxQd2QsXHJcbiAgICAgICAgICAgICAgICBcInR6T2Zmc2V0XCI6IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlyb25SZXMuY29tcGxldGVzLnRoZW4oZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHVzaW5nQ29va2llcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXoubG9naW5SZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlLCBjYWxsVXNyLCBjYWxsUHdkLCB1c2luZ0Nvb2tpZXMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGl6Ll9yZWZyZXNoTG9naW5SZXNwb25zZShpcm9uUmVzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCh1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKHVwZGF0ZUxvZ2luU3RhdGVDb29raWUpIHtcclxuICAgICAgICAgICAgdGhpcy53cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXRpbC5qc29uKFwibG9nb3V0XCIsIHt9LCB0aGlzLl9sb2dvdXRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4obG9naW5EbGcsIHVzciwgcHdkKSB7XHJcbiAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xyXG4gICAgICAgIHZhciBpcm9uUmVzID0gdXRpbC5qc29uKFwibG9naW5cIiwge1xyXG4gICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzcixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwd2QsXHJcbiAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpei5sb2dpblJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIHVzciwgcHdkLCBudWxsLCBsb2dpbkRsZyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQWxsVXNlckNvb2tpZXMoKSB7XHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpblJlc3BvbnNlKHJlcz86IGFueSwgdXNyPzogYW55LCBwd2Q/OiBhbnksIHVzaW5nQ29va2llcz86IGFueSwgbG9naW5EbGc/OiBhbnkpIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJMb2dpblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW5SZXNwb25zZTogdXNyPVwiICsgdXNyICsgXCIgaG9tZU5vZGVPdmVycmlkZTogXCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNyICE9IFwiYW5vbnltb3VzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSLCB1c3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QsIHB3ZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFLCBcIjFcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsb2dpbkRsZykge1xyXG4gICAgICAgICAgICAgICAgbG9naW5EbGcuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGVWYXJzVXNpbmdMb2dpblJlc3BvbnNlKHJlcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0Tm9kZTogXCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGUgaXMgbnVsbC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIHNldCBJRCB0byBiZSB0aGUgcGFnZSB3ZSB3YW50IHRvIHNob3cgdXNlciByaWdodCBhZnRlciBsb2dpbiAqL1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1dGlsLmVtcHR5U3RyaW5nKHJlcy5ob21lTm9kZU92ZXJyaWRlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGhvbWVOb2RlT3ZlcnJpZGU9XCIgKyByZXMuaG9tZU5vZGVPdmVycmlkZSk7XHJcbiAgICAgICAgICAgICAgICBpZCA9IHJlcy5ob21lTm9kZU92ZXJyaWRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgbGFzdE5vZGU9XCIgKyByZXMudXNlclByZWZlcmVuY2VzLmxhc3ROb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZCA9IHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZUlkPVwiICsgbWV0YTY0LmhvbWVOb2RlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gbWV0YTY0LmhvbWVOb2RlSWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoaWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaXRsZVVzaW5nTG9naW5SZXNwb25zZShyZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkNvb2tpZSBsb2dpbiBmYWlsZWQuXCIpKS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGJsb3cgYXdheSBmYWlsZWQgY29va2llIGNyZWRlbnRpYWxzIGFuZCByZWxvYWQgcGFnZSwgc2hvdWxkIHJlc3VsdCBpbiBicmFuZCBuZXcgcGFnZSBsb2FkIGFzIGFub25cclxuICAgICAgICAgICAgICAgICAqIHVzZXIuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmlmICghd2luZG93W1widXNlclwiXSkge1xyXG4gICAgdmFyIHVzZXI6IFVzZXIgPSBuZXcgVXNlcigpO1xyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB2aWV3LmpzXCIpO1xyXG5cclxuY2xhc3MgVmlldyB7XHJcblxyXG4gICAgc2Nyb2xsVG9TZWxOb2RlUGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXR1c0JhcigpIHtcclxuICAgICAgICBpZiAoIW1ldGE2NC5jdXJyZW50Tm9kZURhdGEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgc3RhdHVzTGluZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VEKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0xpbmUgKz0gXCJjb3VudDogXCIgKyBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXRhNjQuZWRpdE1vZGUpIHtcclxuICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcIiBTZWxlY3Rpb25zOiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBwYXJhbWV0ZXIgd2hpY2gsIGlmIHN1cHBsaWVkLCBzaG91bGQgYmUgdGhlIGlkIHdlIHNjcm9sbCB0byB3aGVuIGZpbmFsbHkgZG9uZSB3aXRoIHRoZVxyXG4gICAgICogcmVuZGVyLlxyXG4gICAgICovXHJcbiAgICByZWZyZXNoVHJlZVJlc3BvbnNlKHJlcz86IGFueSwgdGFyZ2V0SWQ/OiBhbnksIHJlbmRlclBhcmVudElmTGVhZj86IGFueSwgbmV3SWQ/OiBhbnkpIHtcclxuXHJcbiAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMpO1xyXG5cclxuICAgICAgICBpZiAobmV3SWQpIHtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodFJvd0J5SWQobmV3SWQsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFRPRE8tMzogV2h5IHdhc24ndCB0aGlzIGp1c3QgYmFzZWQgb24gdGFyZ2V0SWQgPyBUaGlzIGlmIGNvbmRpdGlvbiBpcyB0b28gY29uZnVzaW5nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRhcmdldElkICYmIHJlbmRlclBhcmVudElmTGVhZiAmJiByZXMuZGlzcGxheWVkUGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaGlnaGxpZ2h0Um93QnlJZCh0YXJnZXRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIG5ld0lkIGlzIG9wdGlvbmFsIGFuZCBpZiBzcGVjaWZpZWQgbWFrZXMgdGhlIHBhZ2Ugc2Nyb2xsIHRvIGFuZCBoaWdobGlnaHQgdGhhdCBub2RlIHVwb24gcmUtcmVuZGVyaW5nLlxyXG4gICAgICovXHJcbiAgICByZWZyZXNoVHJlZShub2RlSWQ/OiBhbnksIHJlbmRlclBhcmVudElmTGVhZj86IGFueSwgbmV3SWQ/OiBhbnkpIHtcclxuICAgICAgICBpZiAoIW5vZGVJZCkge1xyXG4gICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVmcmVzaGluZyB0cmVlOiBub2RlSWQ9XCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlSWQsXHJcbiAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IHJlbmRlclBhcmVudElmTGVhZiA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgaXJvblJlcy5jb21wbGV0ZXMudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpei5yZWZyZXNoVHJlZVJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG5vZGVJZCwgcmVuZGVyUGFyZW50SWZMZWFmLCBuZXdJZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIHRvZG8tMzogdGhpcyBzY3JvbGxpbmcgaXMgc2xpZ2h0bHkgaW1wZXJmZWN0LiBzb21ldGltZXMgdGhlIGNvZGUgc3dpdGNoZXMgdG8gYSB0YWIsIHdoaWNoIHRyaWdnZXJzXHJcbiAgICAgKiBzY3JvbGxUb1RvcCwgYW5kIHRoZW4gc29tZSBvdGhlciBjb2RlIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyBsb2NhdGlvbiBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyLiB0aGVcclxuICAgICAqICdwZW5kaW5nJyBib29sZWFuIGhlcmUgaXMgYSBjcnV0Y2ggZm9yIG5vdyB0byBoZWxwIHZpc3VhbCBhcHBlYWwgKGkuZS4gc3RvcCBpZiBmcm9tIHNjcm9sbGluZyB0byBvbmUgcGxhY2VcclxuICAgICAqIGFuZCB0aGVuIHNjcm9sbGluZyB0byBhIGRpZmZlcmVudCBwbGFjZSBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyKVxyXG4gICAgICovXHJcbiAgICBzY3JvbGxUb1NlbGVjdGVkTm9kZSgpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGl6LnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBuYXYuZ2V0U2VsZWN0ZWRQb2x5RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGZpbmQgYSBzZWxlY3RlZCBub2RlIG9uIHRoaXMgcGFnZSwgc2Nyb2xsIHRvXHJcbiAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IHV0aWwucG9seUVsbShcIm1haW5QYXBlclRhYnNcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxtLm5vZGUuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiB0b2RvLTM6IFRoZSBmb2xsb3dpbmcgd2FzIGluIGEgcG9seW1lciBleGFtcGxlIChjYW4gSSB1c2UgdGhpcz8pOiBhcHAuJC5oZWFkZXJQYW5lbE1haW4uc2Nyb2xsVG9Ub3AodHJ1ZSk7XHJcbiAgICAgKi9cclxuICAgIHNjcm9sbFRvVG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXouc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB1dGlsLnBvbHlFbG0oXCJtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQoZG9tSWQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGVkaXQuZWRpdE5vZGU7XHJcbiAgICAgICAgdmFyIGUgPSAkKFwiI1wiICsgZG9tSWQpO1xyXG4gICAgICAgIGlmICghZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcclxuICAgICAgICAgICAgZS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICBlLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcGF0aERpc3BsYXkgPSBcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0b2RvLTI6IERvIHdlIHJlYWxseSBuZWVkIElEIGluIGFkZGl0aW9uIHRvIFBhdGggaGVyZT9cclxuICAgICAgICAgICAgLy8gcGF0aERpc3BsYXkgKz0gXCI8YnI+SUQ6IFwiICsgbm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgcGF0aERpc3BsYXkgKz0gXCI8YnI+TW9kOiBcIiArIG5vZGUubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUuaHRtbChwYXRoRGlzcGxheSk7XHJcbiAgICAgICAgICAgIGUuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93U2VydmVySW5mbygpIHtcclxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbihcImdldFNlcnZlckluZm9cIiwge30pO1xyXG5cclxuICAgICAgICBpcm9uUmVzLmNvbXBsZXRlcy50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoaXJvblJlcy5yZXNwb25zZS5zZXJ2ZXJJbmZvKSkub3BlbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcInZpZXdcIl0pIHtcclxuICAgIHZhciB2aWV3OiBWaWV3ID0gbmV3IFZpZXcoKTtcclxufVxyXG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWVudVBhbmVsLmpzXCIpO1xyXG5cclxuY2xhc3MgTWVudVBhbmVsIHtcclxuXHJcbiAgICBfbWFrZVRvcExldmVsTWVudSh0aXRsZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItc3VibWVudVwiLCB7XHJcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJtZXRhNjQtbWVudS1oZWFkaW5nXCJcclxuICAgICAgICB9LCBcIjxwYXBlci1pdGVtIGNsYXNzPSdtZW51LXRyaWdnZXInPlwiICsgdGl0bGUgKyBcIjwvcGFwZXItaXRlbT5cIiArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9tYWtlU2Vjb25kTGV2ZWxMaXN0KGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1tZW51XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBteS1tZW51LXNlY3Rpb25cIixcclxuICAgICAgICAgICAgXCJtdWx0aVwiOiBcIm11bHRpXCJcclxuICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBfbWVudUl0ZW0obmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBvbkNsaWNrOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItaXRlbVwiLCB7XHJcbiAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgIFwib25jbGlja1wiOiBvbkNsaWNrXHJcbiAgICAgICAgfSwgbmFtZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX21lbnVUb2dnbGVJdGVtKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwge1xyXG4gICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGlja1xyXG4gICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRvbUlkOiBzdHJpbmcgPSBcIm1haW5OYXZCYXJcIjtcclxuXHJcbiAgICBidWlsZCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIk1vdmVcIiwgXCJtb3ZlU2VsTm9kZXNCdXR0b25cIiwgXCJlZGl0Lm1vdmVTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiRmluaXNoIE1vdmluZ1wiLCBcImZpbmlzaE1vdmluZ1NlbE5vZGVzQnV0dG9uXCIsIFwiZWRpdC5maW5pc2hNb3ZpbmdTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsIFwiKG5ldyBSZW5hbWVOb2RlRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkRlbGV0ZVwiLCBcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsIFwiZWRpdC5kZWxldGVTZWxOb2RlcygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiQ2xlYXIgU2VsZWN0aW9uc1wiLCBcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCBcImVkaXQuY2xlYXJTZWxlY3Rpb25zKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJJbXBvcnRcIiwgXCJvcGVuSW1wb3J0RGxnXCIsIFwiKG5ldyBJbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiRXhwb3J0XCIsIFwib3BlbkV4cG9ydERsZ1wiLCBcIihuZXcgRXhwb3J0RGxnKCkpLm9wZW4oKTtcIik7IC8vXHJcbiAgICAgICAgdmFyIGVkaXRNZW51ID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIkVkaXRcIiwgZWRpdE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBhdHRhY2htZW50TWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJVcGxvYWQgZnJvbSBGaWxlXCIsIFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgXCJhdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tRmlsZURsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiVXBsb2FkIGZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybEJ1dHRvblwiLCBcImF0dGFjaG1lbnQub3BlblVwbG9hZEZyb21VcmxEbGcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkRlbGV0ZSBBdHRhY2htZW50XCIsIFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgXCJhdHRhY2htZW50LmRlbGV0ZUF0dGFjaG1lbnQoKTtcIik7XHJcbiAgICAgICAgdmFyIGF0dGFjaG1lbnRNZW51ID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIkF0dGFjaFwiLCBhdHRhY2htZW50TWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHNoYXJpbmdNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIkVkaXQgTm9kZSBTaGFyaW5nXCIsIFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsIFwic2hhcmUuZWRpdE5vZGVTaGFyaW5nKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJGaW5kIFNoYXJlZCBTdWJub2Rlc1wiLCBcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCBcInNoYXJlLmZpbmRTaGFyZWROb2RlcygpO1wiKTtcclxuICAgICAgICB2YXIgc2hhcmluZ01lbnUgPSB0aGlzLl9tYWtlVG9wTGV2ZWxNZW51KFwiU2hhcmVcIiwgc2hhcmluZ01lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgIHZhciBzZWFyY2hNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIlRleHQgU2VhcmNoXCIsIFwic2VhcmNoRGxnQnV0dG9uXCIsIFwiKG5ldyBTZWFyY2hEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZUJ1dHRvblwiLCBcInNyY2gudGltZWxpbmUoKTtcIik7Ly9cclxuICAgICAgICB2YXIgc2VhcmNoTWVudSA9IHRoaXMuX21ha2VUb3BMZXZlbE1lbnUoXCJTZWFyY2hcIiwgc2VhcmNoTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJUb2dnbGUgUHJvcGVydGllc1wiLCBcInByb3BzVG9nZ2xlQnV0dG9uXCIsIFwicHJvcHMucHJvcHNUb2dnbGUoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm1ldGE2NC5yZWZyZXNoKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJTaG93IFVSTFwiLCBcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBcInJlbmRlci5zaG93Tm9kZVVybCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBidWc6IHNlcnZlciBpbmZvIG1lbnUgaXRlbSBpcyBzaG93aW5nIHVwIChhbHRob3VnaCBjb3JyZWN0bHkgZGlzYWJsZWQpIGZvciBub24tYWRtaW4gdXNlcnMuXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiU2VydmVyIEluZm9cIiwgXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBcInZpZXcuc2hvd1NlcnZlckluZm8oKTtcIik7IC8vXHJcbiAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudSA9IHRoaXMuX21ha2VUb3BMZXZlbE1lbnUoXCJWaWV3XCIsIHZpZXdPcHRpb25zTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiB3aGF0ZXZlciBpcyBjb21tZW50ZWQgaXMgb25seSBjb21tZW50ZWQgZm9yIHBvbHltZXIgY29udmVyc2lvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBteUFjY291bnRJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCBcIihuZXcgQ2hhbmdlUGFzc3dvcmREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiUHJlZmVyZW5jZXNcIiwgXCJhY2NvdW50UHJlZmVyZW5jZXNCdXR0b25cIiwgXCIobmV3IFByZWZzRGxnKCkpLm9wZW4oKTtcIikgKyAvL1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51SXRlbShcIk1hbmFnZSBBY2NvdW50XCIsIFwibWFuYWdlQWNjb3VudEJ1dHRvblwiLCBcIihuZXcgTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5fbWVudUl0ZW0oXCJJbnNlcnQgQm9vazogV2FyIGFuZCBQZWFjZVwiLCBcImluc2VydEJvb2tXYXJBbmRQZWFjZUJ1dHRvblwiLCBcIiBlZGl0Lmluc2VydEJvb2tXYXJBbmRQZWFjZSgpO1wiKTsgLy9cclxuICAgICAgICAvLyBfbWVudUl0ZW0oXCJGdWxsIFJlcG9zaXRvcnkgRXhwb3J0XCIsIFwiZnVsbFJlcG9zaXRvcnlFeHBvcnRcIiwgXCJcclxuICAgICAgICAvLyBlZGl0LmZ1bGxSZXBvc2l0b3J5RXhwb3J0KCk7XCIpICsgLy9cclxuICAgICAgICB2YXIgbXlBY2NvdW50TWVudSA9IHRoaXMuX21ha2VUb3BMZXZlbE1lbnUoXCJBY2NvdW50XCIsIG15QWNjb3VudEl0ZW1zKTtcclxuXHJcbiAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIHRoaXMuX21lbnVJdGVtKFwiTWFpbiBNZW51IEhlbHBcIiwgXCJtYWluTWVudUhlbHBcIiwgXCJuYXYub3Blbk1haW5NZW51SGVscCgpO1wiKTtcclxuICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gdGhpcy5fbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICB2YXIgY29udGVudCA9IGVkaXRNZW51ICsgYXR0YWNobWVudE1lbnUgKyBzaGFyaW5nTWVudSArIHZpZXdPcHRpb25zTWVudSArIHNlYXJjaE1lbnUgKyBteUFjY291bnRNZW51XHJcbiAgICAgICAgICAgICsgbWFpbk1lbnVIZWxwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZCh0aGlzLmRvbUlkLCBjb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCk6IHZvaWQge1xyXG4gICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pZiAoIXdpbmRvd1tcIm1lbnVQYW5lbFwiXSkge1xyXG4gICAgdmFyIG1lbnVQYW5lbDogTWVudVBhbmVsID0gbmV3IE1lbnVQYW5lbCgpO1xyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IERpYWxvZ0Jhc2UuanNcIik7XG5cbi8qXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgZGlhbG9nIGJveGVzLlxuICpcbiAqIHRvZG86IHdoZW4gcmVmYWN0b3JpbmcgYWxsIGRpYWxvZ3MgdG8gdGhpcyBuZXcgYmFzZS1jbGFzcyBkZXNpZ24gSSdtIGFsd2F5c1xuICogY3JlYXRpbmcgYSBuZXcgZGlhbG9nIGVhY2ggdGltZSwgc28gdGhlIG5leHQgb3B0aW1pemF0aW9uIHdpbGwgYmUgdG8gbWFrZVxuICogY2VydGFpbiBkaWFsb2dzIChpbmRlZWQgbW9zdCBvZiB0aGVtKSBiZSBhYmxlIHRvIGJlaGF2ZSBhcyBzaW5nbGV0b25zIG9uY2VcbiAqIHRoZXkgaGF2ZSBiZWVuIGNvbnN0cnVjdGVkIHdoZXJlIHRoZXkgbWVyZWx5IGhhdmUgdG8gYmUgcmVzaG93biBhbmRcbiAqIHJlcG9wdWxhdGVkIHRvIHJlb3BlbiBvbmUgb2YgdGhlbSwgYW5kIGNsb3NpbmcgYW55IG9mIHRoZW0gaXMgbWVyZWx5IGRvbmUgYnlcbiAqIG1ha2luZyB0aGVtIGludmlzaWJsZS5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgRGlhbG9nQmFzZSB7XG5cbiAgICBkYXRhOiBhbnk7XG4gICAgYnVpbHQ6IGJvb2xlYW47XG4gICAgZ3VpZDpzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9tSWQ6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFdlIHJlZ2lzdGVyICd0aGlzJyBzbyB3ZSBjYW4gZG8gbWV0YTY0LmdldE9iamVjdEJ5R3VpZCBpbiBvbkNsaWNrIG1ldGhvZHNcbiAgICAgICAgICogb24gdGhlIGRpYWxvZyBhbmQgYmUgYWJsZSB0byBoYXZlICd0aGlzJ2F2YWlsYWJsZSB0byB0aGUgZnVuY3Rpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzKTtcbiAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgYnVpbGQoKTogc3RyaW5nO1xuXG4gICAgb3BlbigpOiB2b2lkIHtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBnZXQgY29udGFpbmVyIHdoZXJlIGFsbCBkaWFsb2dzIGFyZSBjcmVhdGVkICh0cnVlIHBvbHltZXIgZGlhbG9ncylcbiAgICAgICAgICovXG4gICAgICAgIHZhciBtb2RhbHNDb250YWluZXIgPSB1dGlsLnBvbHlFbG0oXCJtb2RhbHNDb250YWluZXJcIik7XG5cbiAgICAgICAgLyogc3VmZml4IGRvbUlkIGZvciB0aGlzIGluc3RhbmNlL2d1aWQgKi9cbiAgICAgICAgdmFyIGlkID0gdGhpcy5pZCh0aGlzLmRvbUlkKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBUT0RPLiBJTVBPUlRBTlQ6IG5lZWQgdG8gcHV0IGNvZGUgaW4gdG8gcmVtb3ZlIHRoaXMgZGlhbG9nIGZyb20gdGhlIGRvbVxuICAgICAgICAgKiBvbmNlIGl0J3MgY2xvc2VkLCBBTkQgdGhhdCBzYW1lIGNvZGUgc2hvdWxkIGRlbGV0ZSB0aGUgZ3VpZCdzIG9iamVjdCBpblxuICAgICAgICAgKiBtYXAgaW4gdGhpcyBtb2R1bGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBhcGVyLWRpYWxvZ1wiKTtcblxuICAgICAgICAvL05PVEU6IFRoaXMgd29ya3MsIGJ1dCBpcyBhbiBleGFtcGxlIG9mIHdoYXQgTk9UIHRvIGRvIGFjdHVhbGx5LiBJbnN0ZWFkIGFsd2F5c1xuICAgICAgICAvL3NldCB0aGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSAncG9seUVsbS5ub2RlJyBiZWxvdy5cbiAgICAgICAgLy9ub2RlLnNldEF0dHJpYnV0ZShcIndpdGgtYmFja2Ryb3BcIiwgXCJ3aXRoLWJhY2tkcm9wXCIpO1xuXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICBtb2RhbHNDb250YWluZXIubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgICAgICAvLyB0b2RvLTM6IHB1dCBpbiBDU1Mgbm93XG4gICAgICAgIG5vZGUuc3R5bGUuYm9yZGVyID0gXCIzcHggc29saWQgZ3JheVwiO1xuXG4gICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXG4gICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKGlkLCBjb250ZW50KTtcbiAgICAgICAgdGhpcy5idWlsdCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdCkge1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJTaG93aW5nIGRpYWxvZzogXCIgKyBpZCk7XG5cbiAgICAgICAgLyogbm93IG9wZW4gYW5kIGRpc3BsYXkgcG9seW1lciBkaWFsb2cgd2UganVzdCBjcmVhdGVkICovXG4gICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKGlkKTtcblxuICAgICAgICAvL0FmdGVyIHRoZSBUeXBlU2NyaXB0IGNvbnZlcnNpb24gSSBub3RpY2VkIGhhdmluZyBhIG1vZGFsIGZsYWcgd2lsbCBjYXVzZVxuICAgICAgICAvL2FuIGluZmluaXRlIGxvb3AgKGNvbXBsZXRlbHkgaGFuZykgQ2hyb21lIGJyb3dzZXIsIGJ1dCB0aGlzIGlzc3VlIGlzIG1vc3QgbGlrZWx5XG4gICAgICAgIC8vbm90IHJlbGF0ZWQgdG8gVHlwZVNjcmlwdCBhdCBhbGwsIGJ1dCBpJ20ganVzdCBtZW50aW9uIFRTIGp1c3QgaW4gY2FzZSwgYmVjYXVzZVxuICAgICAgICAvL3RoYXQncyB3aGVuIEkgbm90aWNlZCBpdC4gRGlhbG9ncyBhcmUgZmluZSBidXQgbm90IGEgZGlhbG9nIG9uIHRvcCBvZiBhbm90aGVyIGRpYWxvZywgd2hpY2ggaXNcbiAgICAgICAgLy90aGUgY2FzZSB3aGVyZSBpdCBoYW5ncyBpZiBtb2RlbD10cnVlXG4gICAgICAgIC8vcG9seUVsbS5ub2RlLm1vZGFsID0gdHJ1ZTtcblxuICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgcG9seUVsbS5ub2RlLmNvbnN0cmFpbigpO1xuICAgICAgICBwb2x5RWxtLm5vZGUuY2VudGVyKCk7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5vcGVuKCk7XG4gICAgfVxuXG4gICAgLyogdG9kbzogbmVlZCB0byBjbGVhbnVwIHRoZSByZWdpc3RlcmVkIElEcyB0aGF0IGFyZSBpbiBtYXBzIGZvciB0aGlzIGRpYWxvZyAqL1xuICAgIGNhbmNlbCgpOiB2b2lkIHtcbiAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgIHBvbHlFbG0ubm9kZS5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSB0cnVlIGlkIHRoYXQgaXMgc3BlY2lmaWMgdG8gdGhpcyBkaWFsb2cgKGkuZS4gZ3VpZFxuICAgICAqIHN1ZmZpeCBhcHBlbmRlZClcbiAgICAgKi9cbiAgICBpZChpZCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpZCA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLyogaWYgZGlhbG9nIGFscmVhZHkgc3VmZml4ZWQgKi9cbiAgICAgICAgaWYgKGlkLmNvbnRhaW5zKFwiX2RsZ0lkXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkICsgXCJfZGxnSWRcIiArIHRoaXMuZGF0YS5ndWlkO1xuICAgIH1cblxuICAgIG1ha2VQYXNzd29yZEZpZWxkKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiByZW5kZXIubWFrZVBhc3N3b3JkRmllbGQodGV4dCwgdGhpcy5pZChpZCkpO1xuICAgIH1cblxuICAgIG1ha2VFZGl0RmllbGQoZmllbGROYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XG4gICAgICAgICAgICBcIm5hbWVcIjogaWQsXG4gICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgbWFrZU1lc3NhZ2VBcmVhKG1lc3NhZ2U6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLW1lc3NhZ2VcIlxuICAgICAgICB9O1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBcIiwgYXR0cnMsIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8vIHRvZG86IHRoZXJlJ3MgYSBtYWtlQnV0dG9uIChhbmQgb3RoZXIgc2ltaWxhciBtZXRob2RzKSB0aGF0IGRvbid0IGhhdmUgdGhlXG4gICAgLy8gZW5jb2RlQ2FsbGJhY2sgY2FwYWJpbGl0eSB5ZXRcbiAgICBtYWtlQnV0dG9uKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSwgY3R4PzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGF0dHJpYnMgPSB7XG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCBhdHRyaWJzLCB0ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBtYWtlQ2xvc2VCdXR0b24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjaz86IGFueSwgY3R4PzogYW55KTogc3RyaW5nIHtcblxuICAgICAgICB2YXIgYXR0cmlicyA9IHtcbiAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAvLyB3YXJuaW5nOiB0aGlzIGRpYWxvZy1jb25maXJtIGlzIHJlcXVpcmVkIChsb2dpYyBmYWlscyB3aXRob3V0KVxuICAgICAgICAgICAgXCJkaWFsb2ctY29uZmlybVwiOiBcImRpYWxvZy1jb25maXJtXCIsXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoaWQpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYXR0cmlic1tcIm9uQ2xpY2tcIl0gPSBtZXRhNjQuZW5jb2RlT25DbGljayhjYWxsYmFjaywgY3R4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgIH1cblxuICAgIGJpbmRFbnRlcktleShpZDogc3RyaW5nLCBjYWxsYmFjazogYW55KTogdm9pZCB7XG4gICAgICAgIHV0aWwuYmluZEVudGVyS2V5KHRoaXMuaWQoaWQpLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc2V0SW5wdXRWYWwoaWQ6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgICAgIHZhbCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSwgdmFsKTtcbiAgICB9XG5cbiAgICBnZXRJbnB1dFZhbChpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChpZCkpLnRyaW0oKTtcbiAgICB9XG5cbiAgICBzZXRIdG1sKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChpZCksIHRleHQpO1xuICAgIH1cblxuICAgIG1ha2VSYWRpb0J1dHRvbihsYWJlbDogc3RyaW5nLCBpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xuICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBpZFxuICAgICAgICB9LCBsYWJlbCk7XG4gICAgfVxuXG4gICAgbWFrZUhlYWRlcih0ZXh0OiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjZW50ZXJlZD86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICB2YXIgYXR0cnMgPSB7XG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLWhlYWRlciBcIiArIChjZW50ZXJlZCA/IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiIDogXCJcIilcbiAgICAgICAgfTtcblxuICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgYXR0cnNbXCJpZFwiXSA9IHRoaXMuaWQoaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJoMlwiLCBhdHRycywgdGV4dCk7XG4gICAgfVxuXG4gICAgZm9jdXMoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoXCIjXCIpKSB7XG4gICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWQgPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENvbmZpcm1EbGcuanNcIik7XG5cbmNsYXNzIENvbmZpcm1EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgc3VwZXIoXCJDb25maXJtRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBjb250ZW50OiBzdHJpbmcgPSB0aGlzLm1ha2VIZWFkZXIoXCJcIiwgXCJDb25maXJtRGxnVGl0bGVcIikgKyB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIlwiLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spXG4gICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiTm9cIiwgXCJDb25maXJtRGxnTm9CdXR0b25cIik7XG4gICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLnRpdGxlLCBcIkNvbmZpcm1EbGdUaXRsZVwiKTtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMuYnV0dG9uVGV4dCwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIpO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByb2dyZXNzRGxnLmpzXCIpO1xuXG5jbGFzcyBQcm9ncmVzc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiUHJvZ3Jlc3NEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlByb2Nlc3NpbmcgUmVxdWVzdFwiLCBcIlwiLCB0cnVlKTtcblxuICAgICAgICB2YXIgcHJvZ3Jlc3NCYXIgPSByZW5kZXIudGFnKFwicGFwZXItcHJvZ3Jlc3NcIiwge1xuICAgICAgICAgICAgXCJpbmRldGVybWluYXRlXCI6IFwiaW5kZXRlcm1pbmF0ZVwiLFxuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIjgwMFwiLFxuICAgICAgICAgICAgXCJtaW5cIjogXCIxMDBcIixcbiAgICAgICAgICAgIFwibWF4XCI6IFwiMTAwMFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiYXJDb250YWluZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoyODBweDsgbWFyZ2luOjI0cHg7XCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBjZW50ZXItanVzdGlmaWVkIGxheW91dFwiXG4gICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgYmFyQ29udGFpbmVyO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IE1lc3NhZ2VEbGcuanNcIik7XHJcblxyXG4vKlxyXG4gKiBDYWxsYmFjayBjYW4gYmUgbnVsbCBpZiB5b3UgZG9uJ3QgbmVlZCB0byBydW4gYW55IGZ1bmN0aW9uIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWRcclxuICovXHJcbmNsYXNzIE1lc3NhZ2VEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICBzdXBlcihcIk1lc3NhZ2VEbGdcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpdGxlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IFwiTWVzc2FnZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAqL1xyXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnRpdGxlKSArIFwiPHA+XCIgKyB0aGlzLm1lc3NhZ2UgKyBcIjwvcD5cIjtcclxuICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk9rXCIsIFwibWVzc2FnZURsZ09rQnV0dG9uXCIsIHRoaXMuY2FsbGJhY2spKTtcclxuICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH1cclxufVxyXG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IExvZ2luRGxnLmpzXCIpO1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkvanF1ZXJ5LmQudHNcIiAvPlxuXG4vKlxuTm90ZTogVGhlIGpxdWVyeSBjb29raWUgbG9va3MgZm9yIGpxdWVyeSBkLnRzIGluIHRoZSByZWxhdGl2ZSBsb2NhdGlvbiBcIlwiLi4vanF1ZXJ5XCIgc28gYmV3YXJlIGlmIHlvdXJcbnRyeSB0byByZW9yZ2FuaXplIHRoZSBmb2xkZXIgc3RydWN0dXJlIEkgaGF2ZSBpbiB0eXBlZGVmcywgdGhpbmdzIHdpbGwgY2VydGFpbmx5IGJyZWFrXG4qL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vdHllcGRlZnMvanF1ZXJ5LmNvb2tpZS9qcXVlcnkuY29va2llLmQudHNcIiAvPlxuXG5jbGFzcyBMb2dpbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIkxvZ2luRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJMb2dpblwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlclwiLCBcInVzZXJOYW1lXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgIHZhciBsb2dpbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkxvZ2luXCIsIFwibG9naW5CdXR0b25cIiwgdGhpcy5sb2dpbiwgdGhpcyk7XG4gICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRm9yZ290IFBhc3N3b3JkXCIsIFwicmVzZXRQYXNzd29yZEJ1dHRvblwiLCB0aGlzLnJlc2V0UGFzc3dvcmQsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxMb2dpbkJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihsb2dpbkJ1dHRvbiArIHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBTb2NpYWwgTG9naW4gQnV0dG9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBTZWUgc2VydmVyIGNvbnRyb2xsZXIuIEltcGxlbWVudGF0aW9uIGlzIGFib3V0IDk1JSBjb21wbGV0ZSwgYnV0IG5vdCB5ZXQgZnVsbHkgY29tcGxldGUhXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgdHdpdHRlckJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlR3aXR0ZXJcIiwgXCJ0d2l0dGVyTG9naW5CdXR0b25cIiwgXCJ1c2VyLnR3aXR0ZXJMb2dpbigpO1wiKTtcbiAgICAgICAgdmFyIHNvY2lhbEJ1dHRvbkJhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cCh0d2l0dGVyQnV0dG9uKTtcblxuICAgICAgICB2YXIgZGl2aWRlciA9IFwiPGRpdj48aDM+T3IgTG9naW4gV2l0aC4uLjwvaDM+PC9kaXY+XCI7XG5cbiAgICAgICAgdmFyIGZvcm0gPSBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG5cbiAgICAgICAgdmFyIG1haW5Db250ZW50ID0gZm9ybTtcbiAgICAgICAgLypcbiAgICAgICAgICogY29tbWVudGluZyB0d2l0dGVyIGxvZ2luIGR1cmluZyBwb2x5bWVyIGNvbnZlcnNpb24gKyBkaXZpZGVyICsgc29jaWFsQnV0dG9uQmFyXG4gICAgICAgICAqL1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XG5cbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJ1c2VyTmFtZVwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJwYXNzd29yZFwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVGcm9tQ29va2llcygpOiB2b2lkIHtcbiAgICAgICAgdmFyIHVzciA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XG4gICAgICAgIHZhciBwd2QgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xuXG4gICAgICAgIGlmICh1c3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiLCB1c3IpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwd2QpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiLCBwd2QpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9naW4oKTogdm9pZCB7XG5cbiAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcbiAgICAgICAgdmFyIHB3ZCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJwYXNzd29yZFwiKTtcblxuICAgICAgICB1c2VyLmxvZ2luKHRoaXMsIHVzciwgcHdkKTtcbiAgICB9XG5cbiAgICByZXNldFBhc3N3b3JkKCk6IGFueSB7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcblxuICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFJlc2V0IFBhc3N3b3JkXCIsXG4gICAgICAgICAgICBcIlJlc2V0IHlvdXIgcGFzc3dvcmQgPzxwPllvdSdsbCBzdGlsbCBiZSBhYmxlIHRvIGxvZ2luIHdpdGggeW91ciBvbGQgcGFzc3dvcmQgdW50aWwgdGhlIG5ldyBvbmUgaXMgc2V0LlwiLFxuICAgICAgICAgICAgXCJZZXMsIHJlc2V0LlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgIChuZXcgUmVzZXRQYXNzd29yZERsZyh1c3IpKS5vcGVuKCk7XG4gICAgICAgICAgICB9KSkub3BlbigpO1xuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2lnbnVwRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRTtcblxuY2xhc3MgU2lnbnVwRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTaWdudXBEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihCUkFORElOR19USVRMRSArIFwiIFNpZ251cFwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gLy9cbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJzaWdudXBVc2VyTmFtZVwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VQYXNzd29yZEZpZWxkKFwiUGFzc3dvcmRcIiwgXCJzaWdudXBQYXNzd29yZFwiKSArIC8vXG4gICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbFwiLCBcInNpZ251cEVtYWlsXCIpICsgLy9cbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkNhcHRjaGFcIiwgXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgIHZhciBjYXB0Y2hhSW1hZ2UgPSByZW5kZXIudGFnKFwiZGl2XCIsIC8vXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGEtaW1hZ2VcIiAvL1xuICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgIHJlbmRlci50YWcoXCJpbWdcIiwgLy9cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogXCJcIi8vXG4gICAgICAgICAgICAgICAgfSwgLy9cbiAgICAgICAgICAgICAgICBcIlwiLCBmYWxzZSkpO1xuXG4gICAgICAgIHZhciBzaWdudXBCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaWdudXBcIiwgXCJzaWdudXBCdXR0b25cIiwgdGhpcy5zaWdudXAsIHRoaXMpO1xuICAgICAgICB2YXIgbmV3Q2FwdGNoYUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlRyeSBEaWZmZXJlbnQgSW1hZ2VcIiwgXCJ0cnlBbm90aGVyQ2FwdGNoYUJ1dHRvblwiLFxuICAgICAgICAgICAgdGhpcy50cnlBbm90aGVyQ2FwdGNoYSwgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNpZ251cEJ1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNpZ251cEJ1dHRvbiArIG5ld0NhcHRjaGFCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgY2FwdGNoYUltYWdlICsgYnV0dG9uQmFyO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqICQoXCIjXCIgKyBfLmRvbUlkICsgXCItbWFpblwiKS5jc3MoeyBcImJhY2tncm91bmRJbWFnZVwiIDogXCJ1cmwoL2libS03MDItYnJpZ2h0LmpwZyk7XCIgXCJiYWNrZ3JvdW5kLXJlcGVhdFwiIDpcbiAgICAgICAgICogXCJuby1yZXBlYXQ7XCIsIFwiYmFja2dyb3VuZC1zaXplXCIgOiBcIjEwMCUgYXV0b1wiIH0pO1xuICAgICAgICAgKi9cbiAgICB9XG5cbiAgICBzaWdudXAoKTogdm9pZCB7XG4gICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBVc2VyTmFtZVwiKTtcbiAgICAgICAgdmFyIHBhc3N3b3JkID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cFBhc3N3b3JkXCIpO1xuICAgICAgICB2YXIgZW1haWwgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwRW1haWxcIik7XG4gICAgICAgIHZhciBjYXB0Y2hhID0gdGhpcy5nZXRJbnB1dFZhbChcInNpZ251cENhcHRjaGFcIik7XG5cbiAgICAgICAgLyogbm8gcmVhbCB2YWxpZGF0aW9uIHlldCwgb3RoZXIgdGhhbiBub24tZW1wdHkgKi9cbiAgICAgICAgaWYgKHV0aWwuYW55RW1wdHkodXNlck5hbWUsIHBhc3N3b3JkLCBlbWFpbCwgY2FwdGNoYSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNvcnJ5LCB5b3UgY2Fubm90IGxlYXZlIGFueSBmaWVsZHMgYmxhbmsuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1dGlsLmpzb24oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgXCJ1c2VOYW1lXCI6IHVzZXJOYW1lLFxuICAgICAgICAgICAgXCJwYXN3b3JkXCI6IHBhc3N3b3JkLFxuICAgICAgICAgICAgXCJtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgXCJjYXRjaGFcIjogY2FwdGNoYVxuICAgICAgICB9LCB0aGlzLnNpZ251cFJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBzaWdudXBSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTaWdudXAgbmV3IHVzZXJcIiwgcmVzKSkge1xuXG4gICAgICAgICAgICAvKiBjbG9zZSB0aGUgc2lnbnVwIGRpYWxvZyAqL1xuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFxuICAgICAgICAgICAgICAgIFwiVXNlciBJbmZvcm1hdGlvbiBBY2NlcHRlZC48cC8+Q2hlY2sgeW91ciBlbWFpbCBmb3Igc2lnbnVwIGNvbmZpcm1hdGlvbi5cIixcbiAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICApKS5vcGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnlBbm90aGVyQ2FwdGNoYSgpOiB2b2lkIHtcblxuICAgICAgICB2YXIgbiA9IHV0aWwuY3VycmVudFRpbWVNaWxsaXMoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBlbWJlZCBhIHRpbWUgcGFyYW1ldGVyIGp1c3QgdG8gdGh3YXJ0IGJyb3dzZXIgY2FjaGluZywgYW5kIGVuc3VyZSBzZXJ2ZXIgYW5kIGJyb3dzZXIgd2lsbCBuZXZlciByZXR1cm4gdGhlIHNhbWVcbiAgICAgICAgICogaW1hZ2UgdHdpY2UuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc3JjID0gcG9zdFRhcmdldFVybCArIFwiY2FwdGNoYT90PVwiICsgbjtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjYXB0Y2hhSW1hZ2VcIikpLmF0dHIoXCJzcmNcIiwgc3JjKTtcbiAgICB9XG5cbiAgICBwYWdlSW5pdFNpZ251cFBnKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyeUFub3RoZXJDYXB0Y2hhKCk7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYWdlSW5pdFNpZ251cFBnKCk7XG4gICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICB9XG59XG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUHJlZnNEbGcuanNcIik7XHJcblxyXG5jbGFzcyBQcmVmc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICovXHJcbiAgICBidWlsZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJBY2NvdW50IFBlZmVyZW5jZXNcIik7XHJcblxyXG4gICAgICAgIHZhciByYWRpb0J1dHRvbnMgPSB0aGlzLm1ha2VSYWRpb0J1dHRvbihcIlNpbXBsZVwiLCBcImVkaXRNb2RlU2ltcGxlXCIpICsgLy9cclxuICAgICAgICAgICAgdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJBZHZhbmNlZFwiLCBcImVkaXRNb2RlQWR2YW5jZWRcIik7XHJcblxyXG4gICAgICAgIHZhciByYWRpb0J1dHRvbkdyb3VwID0gcmVuZGVyLnRhZyhcInBhcGVyLXJhZGlvLWdyb3VwXCIsIHtcclxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIiksXHJcbiAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpXHJcbiAgICAgICAgfSwgcmFkaW9CdXR0b25zKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgIHZhciBsZWdlbmQgPSBcIjxsZWdlbmQ+RWRpdCBNb2RlOjwvbGVnZW5kPlwiO1xyXG4gICAgICAgIHZhciByYWRpb0JhciA9IHJlbmRlci5tYWtlSG9yekNvbnRyb2xHcm91cChsZWdlbmQgKyBmb3JtQ29udHJvbHMpO1xyXG5cclxuICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNhbmNlbFwiLCBcImNhbmNlbFByZWZlcmVuY2VzRGxnQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHJhZGlvQmFyICsgYnV0dG9uQmFyO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVQcmVmZXJlbmNlcygpOiB2b2lkIHtcclxuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHBvbHlFbG0ubm9kZS5zZWxlY3RlZCA9PSB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgPyBtZXRhNjQuTU9ERV9TSU1QTEVcclxuICAgICAgICAgICAgOiBtZXRhNjQuTU9ERV9BRFZBTkNFRDtcclxuICAgICAgICB1dGlsLmpzb24oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgXCJ1c2VyUHJlZmVyZW5jZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJhZHZhbmNlZE1vZGVcIjogbWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcy5zYXZlUHJlZmVyZW5jZXNSZXNwb25zZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVByZWZlcmVuY2VzUmVzcG9uc2UocmVzOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZpbmcgUHJlZmVyZW5jZXNcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMjogdHJ5IGFuZCBtYWludGFpbiBzY3JvbGwgcG9zaXRpb24gPyB0aGlzIGlzIGdvaW5nIHRvIGJlIGFzeW5jLCBzbyB3YXRjaCBvdXQuXHJcbiAgICAgICAgICAgIC8vIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgIHBvbHlFbG0ubm9kZS5zZWxlY3QobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09IG1ldGE2NC5NT0RFX1NJTVBMRSA/IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA6IHRoaXNcclxuICAgICAgICAgICAgLmlkKFwiZWRpdE1vZGVBZHZhbmNlZFwiKSk7XHJcbiAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgIH1cclxufVxyXG4iLCJcclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWFuYWdlQWNjb3VudERsZy5qc1wiKTtcclxuXHJcbi8vaW1wb3J0IF9wcmVmcyBmcm9tIFwiLi4vcHJlZnNcIjtcclxuLy9sZXQgcHJlZnMgPSBfcHJlZnM7XHJcblxyXG5jbGFzcyBNYW5hZ2VBY2NvdW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCJNYW5hZ2VBY2NvdW50RGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk1hbmFnZSBBY2NvdW50XCIpO1xyXG5cclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsUHJlZmVyZW5jZXNEbGdCdXR0b25cIik7XHJcbiAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjbG9zZUFjY291bnRCdXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgYm90dG9tQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJhY2tCdXR0b24pO1xyXG4gICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNsb3NlLWFjY291bnQtYmFyXCJcclxuICAgICAgICB9LCBib3R0b21CdXR0b25CYXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgfVxyXG59XHJcbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEV4cG9ydERsZy5qc1wiKTtcblxuXG5jbGFzcyBFeHBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJFeHBvcnREbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkV4cG9ydCB0byBYTUxcIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkV4cG9ydCB0byBGaWxlIE5hbWVcIiwgXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICB2YXIgZXhwb3J0QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiRXhwb3J0XCIsIFwiZXhwb3J0Tm9kZXNCdXR0b25cIiwgdGhpcy5leHBvcnROb2RlcywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEV4cG9ydEJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihleHBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIGV4cG9ydE5vZGVzKCk6IHZvaWQge1xuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgdmFyIHRhcmdldEZpbGVOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcImV4cG9ydFRhcmdldE5vZGVOYW1lXCIpO1xuXG4gICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHRhcmdldEZpbGVOYW1lKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGxlYXNlIGVudGVyIGEgbmFtZSBmb3IgdGhlIGV4cG9ydCBmaWxlLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgIHV0aWwuanNvbihcImV4cG9ydFRvWG1sXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgIH0sIHRoaXMuZXhwb3J0UmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0UmVzcG9uc2UocmVzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkV4cG9ydCBTdWNjZXNzZnVsLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEltcG9ydERsZy5qc1wiKTtcblxuY2xhc3MgSW1wb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiSW1wb3J0RGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJJbXBvcnQgZnJvbSBYTUxcIik7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkltcG9ydCBUYXJnZXQgTm9kZSBOYW1lXCIsIFwiaW1wb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgdmFyIGltcG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkltcG9ydFwiLCBcImltcG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuaW1wb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxJbXBvcnRCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoaW1wb3J0QnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBpbXBvcnROb2RlcygpOiB2b2lkIHtcbiAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIHZhciBzb3VyY2VGaWxlTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJpbXBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzb3VyY2VGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBpbXBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICB1dGlsLmpzb24oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJzb3VyY2VGaWxlTmFtZVwiOiBzb3VyY2VGaWxlTmFtZVxuICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbXBvcnRSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJJbXBvcnRcIiwgcmVzKSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoRGxnLmpzXCIpO1xuXG5jbGFzcyBTZWFyY2hEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlNlYXJjaERsZ1wiKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgKi9cbiAgICBidWlsZCgpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiU2VhcmNoXCIpO1xuXG4gICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLiBBbGwgc3ViLW5vZGVzIHVuZGVyIHRoZSBzZWxlY3RlZCBub2RlIGFyZSBpbmNsdWRlZCBpbiB0aGUgc2VhcmNoLlwiKTtcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgIHZhciBzZWFyY2hUYWdzQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2ggVGFnc1wiLCBcInNlYXJjaFRhZ3NCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2VhcmNoQnV0dG9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIHNlYXJjaFRhZ3NCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIHNlYXJjaE5vZGVzKCk6IHZvaWQge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShcImpjcjpjb250ZW50XCIpO1xuICAgIH1cblxuICAgIHNlYXJjaFRhZ3MoKTogdm9pZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuVEFHUyk7XG4gICAgfVxuXG4gICAgc2VhcmNoUHJvcGVydHkoc2VhcmNoUHJvcDogYW55KSB7XG4gICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1dGlsLmpzb24oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXG4gICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgIFwibW9kU29ydERlc2NcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlYXJjaFByb3BcIjogc2VhcmNoUHJvcFxuICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgIH1cblxuICAgIGluaXQoKTogYW55IHtcbiAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgIH1cbn1cbiIsImNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IENoYW5nZVBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxuY2xhc3MgQ2hhbmdlUGFzc3dvcmREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICBwd2Q6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcIkNoYW5nZVBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAqIHdoZXJlIGl0IHdpbGwgdmFsaWRhdGUgdGhlIHBhc3NDb2RlLCBhbmQgaWYgaXQncyB2YWxpZCB1c2UgaXQgdG8gcGVyZm9ybSB0aGUgY29ycmVjdCBwYXNzd29yZCBjaGFuZ2Ugb24gdGhlIGNvcnJlY3RcclxuICAgICAqIHVzZXIuXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIodGhpcy5wYXNzQ29kZSA/IFwiUGFzc3dvcmQgUmVzZXRcIiA6IFwiQ2hhbmdlIFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgfSwgXCJFbnRlciB5b3VyIG5ldyBwYXNzd29yZCBiZWxvdy4uLlwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJOZXcgUGFzc3dvcmRcIiwgXCJjaGFuZ2VQYXNzd29yZDFcIik7XHJcblxyXG4gICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsQ2hhbmdlUGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGFzc3dvcmQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wd2QgPSB0aGlzLmdldElucHV0VmFsKFwiY2hhbmdlUGFzc3dvcmQxXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHdkICYmIHRoaXMucHdkLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbihcImNoYW5nZVBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibmV3UGFzc3dvcmRcIjogdGhpcy5wd2QsXHJcbiAgICAgICAgICAgICAgICBcInBhc3NDb2RlXCI6IHRoaXMucGFzc0NvZGVcclxuICAgICAgICAgICAgfSwgdGhpcy5jaGFuZ2VQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJJbnZhbGlkIHBhc3N3b3JkKHMpLlwiKSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXNzd29yZFJlc3BvbnNlKHJlczogYW55KSB7XHJcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIHBhc3N3b3JkXCIsIHJlcykpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtc2cgPSBcIlBhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5LlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIG1zZyArPSBcIjxwPllvdSBtYXkgbm93IGxvZ2luIGFzIDxiPlwiICsgcmVzLnVzZXJcclxuICAgICAgICAgICAgICAgICAgICArIFwiPC9iPiB3aXRoIHlvdXIgbmV3IHBhc3N3b3JkLlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2csIFwiUGFzc3dvcmQgQ2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXoucGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbG9naW4gY2FsbCBET0VTIHdvcmssIGJ1dCB0aGUgcmVhc29uIHdlIGRvbid0IGRvIHRoaXMgaXMgYmVjYXVzZSB0aGUgVVJMIHN0aWxsIGhhcyB0aGUgcGFzc0NvZGUgb24gaXQgYW5kIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy93YW50IHRvIGRpcmVjdCB0aGUgdXNlciB0byBhIHVybCB3aXRob3V0IHRoYXQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy91c2VyLmxvZ2luKG51bGwsIHJlcy51c2VyLCB0aGl6LnB3ZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmZvY3VzKFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZXNldFBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxuY2xhc3MgUmVzZXRQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdXNlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJSZXNldFBhc3N3b3JkRGxnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlc2V0IFBhc3N3b3JkXCIpO1xyXG5cclxuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgeW91ciB1c2VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgYW5kIGEgY2hhbmdlLXBhc3N3b3JkIGxpbmsgd2lsbCBiZSBzZW50IHRvIHlvdVwiKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXJcIiwgXCJ1c2VyTmFtZVwiKSArIC8vXHJcbiAgICAgICAgICAgIHRoaXMubWFrZUVkaXRGaWVsZChcIkVtYWlsIEFkZHJlc3NcIiwgXCJlbWFpbEFkZHJlc3NcIik7XHJcblxyXG4gICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZXNldCBteSBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIixcclxuICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkLCB0aGlzKTtcclxuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxSZXNldFBhc3N3b3JkQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhlYWRlciArIG1lc3NhZ2UgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRQYXNzd29yZCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcInVzZXJOYW1lXCIpLnRyaW0oKTtcclxuICAgICAgICB2YXIgZW1haWxBZGRyZXNzID0gdGhpcy5nZXRJbnB1dFZhbChcImVtYWlsQWRkcmVzc1wiKS50cmltKCk7XHJcblxyXG4gICAgICAgIGlmICh1c2VyTmFtZSAmJiBlbWFpbEFkZHJlc3MpIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uKFwicmVzZXRQYXNzd29yZFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgICAgICB9LCB0aGlzLnJlc2V0UGFzc3dvcmRSZXNwb25zZSwgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiT29wcy4gVHJ5IHRoYXQgYWdhaW4uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0UGFzc3dvcmRSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlc2V0IHBhc3N3b3JkXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiUGFzc3dvcmQgcmVzZXQgZW1haWwgd2FzIHNlbnQuIENoZWNrIHlvdXIgaW5ib3guXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsKFwidXNlck5hbWVcIiwgdGhpcy51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBVcGxvYWRGcm9tRmlsZURsZy5qc1wiKTtcblxuY2xhc3MgVXBsb2FkRnJvbUZpbGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21GaWxlRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJVcGxvYWQgRmlsZSBBdHRhY2htZW50XCIpO1xuXG4gICAgICAgIHZhciB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgIHVwbG9hZFBhdGhEaXNwbGF5ICs9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuXG4gICAgICAgIHZhciBmb3JtRmllbGRzID0gXCJcIjtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBGb3Igbm93IEkganVzdCBoYXJkLWNvZGUgaW4gNyBlZGl0IGZpZWxkcywgYnV0IHdlIGNvdWxkIHRoZW9yZXRpY2FsbHkgbWFrZSB0aGlzIGR5bmFtaWMgc28gdXNlciBjYW4gY2xpY2sgJ2FkZCdcbiAgICAgICAgICogYnV0dG9uIGFuZCBhZGQgbmV3IG9uZXMgb25lIGF0IGEgdGltZS4gSnVzdCBub3QgdGFraW5nIHRoZSB0aW1lIHRvIGRvIHRoYXQgeWV0LlxuICAgICAgICAgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmlsZVwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZpbGVzXCJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvKiB3cmFwIGluIERJViB0byBmb3JjZSB2ZXJ0aWNhbCBhbGlnbiAqL1xuICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLWJvdHRvbTogMTBweDtcIlxuICAgICAgICAgICAgfSwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybU5vZGVJZFwiKSxcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZUlkXCJcbiAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQWNjb3JkaW5nIHRvIHNvbWUgb25saW5lIHBvc3RzIEkgc2hvdWxkIGhhdmUgbmVlZGVkIGRhdGEtYWpheD1cImZhbHNlXCIgb24gdGhpcyBmb3JtIGJ1dCBpdCBpcyB3b3JraW5nIGFzIGlzXG4gICAgICAgICAqIHdpdGhvdXQgdGhhdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSxcbiAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiUE9TVFwiLFxuICAgICAgICAgICAgXCJlbmN0eXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuICAgICAgICAgICAgXCJkYXRhLWFqYXhcIjogXCJmYWxzZVwiIC8vIE5FVyBmb3IgbXVsdGlwbGUgZmlsZSB1cGxvYWQgc3VwcG9ydD8/P1xuICAgICAgICB9LCBmb3JtRmllbGRzKTtcblxuICAgICAgICB1cGxvYWRGaWVsZENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGaWVsZENvbnRhaW5lclwiKVxuICAgICAgICB9LCBcIjxwPlVwbG9hZCBmcm9tIHlvdXIgY29tcHV0ZXI8L3A+XCIgKyBmb3JtKTtcblxuICAgICAgICB2YXIgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG5cbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgdXBsb2FkUGF0aERpc3BsYXkgKyB1cGxvYWRGaWVsZENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICB1cGxvYWRGaWxlTm93KCk6IHZvaWQge1xuXG4gICAgICAgIC8qIFVwbG9hZCBmb3JtIGhhcyBoaWRkZW4gaW5wdXQgZWxlbWVudCBmb3Igbm9kZUlkIHBhcmFtZXRlciAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1Ob2RlSWRcIikpLmF0dHIoXCJ2YWx1ZVwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgZG8gc29tZXRoaW5nIGRpZmZlcmVudGx5IGZyb20gdGhlIG5vcm1hbCAndXRpbC5qc29uKCknIGNhbGxzIHRvIHRoZSBzZXJ2ZXIsIGJlY2F1c2VcbiAgICAgICAgICogdGhpcyBpcyBoaWdobHkgc3BlY2lhbGl6ZWQgaGVyZSBmb3IgZm9ybSB1cGxvYWRpbmcsIGFuZCBpcyBkaWZmZXJlbnQgZnJvbSBub3JtYWwgYWpheCBjYWxscy5cbiAgICAgICAgICovXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICB2YXIgZGF0YSA9IG5ldyBGb3JtRGF0YSg8SFRNTEZvcm1FbGVtZW50PigkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZEZvcm1cIikpWzBdKSk7XG5cbiAgICAgICAgdmFyIHBybXMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJtcy5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJtcy5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVXBsb2FkIGZhaWxlZC5cIikpLm9wZW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICB9XG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21VcmxEbGcuanNcIik7XG5cbmNsYXNzIFVwbG9hZEZyb21VcmxEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21VcmxEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgdmFyIHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB1cGxvYWRGaWVsZENvbnRhaW5lciA9IFwiXCI7XG4gICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRGl2ID0gXCJcIjtcblxuICAgICAgICB2YXIgdXBsb2FkRnJvbVVybEZpZWxkID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXBsb2FkIEZyb20gVVJMXCIsIFwidXBsb2FkRnJvbVVybFwiKTtcbiAgICAgICAgdXBsb2FkRnJvbVVybERpdiA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgIH0sIHVwbG9hZEZyb21VcmxGaWVsZCk7XG5cbiAgICAgICAgdmFyIHVwbG9hZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiVXBsb2FkXCIsIFwidXBsb2FkQnV0dG9uXCIsIHRoaXMudXBsb2FkRmlsZU5vdywgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyB1cGxvYWRGcm9tVXJsRGl2ICsgYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIHVwbG9hZEZpbGVOb3coKTogdm9pZCB7XG4gICAgICAgIHZhciBzb3VyY2VVcmwgPSB0aGlzLmdldElucHV0VmFsKFwidXBsb2FkRnJvbVVybFwiKTtcblxuICAgICAgICAvKiBpZiB1cGxvYWRpbmcgZnJvbSBVUkwgKi9cbiAgICAgICAgaWYgKHNvdXJjZVVybCkge1xuICAgICAgICAgICAgdXRpbC5qc29uKFwidXBsb2FkRnJvbVVybFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic291cmNlVXJsXCI6IHNvdXJjZVVybFxuICAgICAgICAgICAgfSwgdGhpcy51cGxvYWRGcm9tVXJsUmVzcG9uc2UsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBsb2FkRnJvbVVybFJlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XG4gICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlVwbG9hZCBmcm9tIFVSTFwiLCByZXMpKSB7XG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKFwidXBsb2FkRnJvbVVybFwiKSwgXCJcIik7XG5cbiAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICB9XG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXROb2RlRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBhY2U7XG5cbi8qXG4gKiBFZGl0b3IgRGlhbG9nIChFZGl0cyBOb2RlcylcbiAqXG4gKi9cbmNsYXNzIEVkaXROb2RlRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBmaWVsZElkVG9Qcm9wTWFwOiBhbnkgPSB7fTtcbiAgICBwcm9wRW50cmllczogQXJyYXk8UHJvcEVudHJ5PiA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgZWRpdFByb3BlcnR5RGxnSW5zdDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG4gICAgICAgIGRlYnVnZ2VyO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb3BlcnR5IGZpZWxkcyBhcmUgZ2VuZXJhdGVkIGR5bmFtaWNhbGx5IGFuZCB0aGlzIG1hcHMgdGhlIERPTSBJRHMgb2YgZWFjaCBmaWVsZCB0byB0aGUgcHJvcGVydHkgb2JqZWN0IGl0XG4gICAgICAgICAqIGVkaXRzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maWVsZElkVG9Qcm9wTWFwID0ge307XG4gICAgICAgIHRoaXMucHJvcEVudHJpZXMgPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFZGl0IE5vZGVcIik7XG5cbiAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgIHZhciBhZGRQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkFkZCBQcm9wZXJ0eVwiLCBcImFkZFByb3BlcnR5QnV0dG9uXCIsIHRoaXMuYWRkUHJvcGVydHksIHRoaXMpO1xuICAgICAgICB2YXIgYWRkVGFnc1Byb3BlcnR5QnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiQWRkIFRhZ3MgUHJvcGVydHlcIiwgXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIixcbiAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgLy8gdGhpcyBzcGxpdCB3b3JrcyBhZmFpaywgYnV0IEkgZG9uJ3Qgd2FudCBpdCBlbmFibGVkIHlldC5cbiAgICAgICAgLy8gdmFyIHNwbGl0Q29udGVudEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNwbGl0IENvbnRlbnRcIixcbiAgICAgICAgLy8gXCJzcGxpdENvbnRlbnRCdXR0b25cIiwgXCJlZGl0LnNwbGl0Q29udGVudCgpO1wiKTtcbiAgICAgICAgdmFyIGNhbmNlbEVkaXRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRWRpdEJ1dHRvblwiLCBcImVkaXQuY2FuY2VsRWRpdCgpO1wiLCB0aGlzKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNhdmVOb2RlQnV0dG9uICsgYWRkUHJvcGVydHlCdXR0b24gKyBhZGRUYWdzUHJvcGVydHlCdXR0b25cblx0LyogKyBzcGxpdENvbnRlbnRCdXR0b24gKi8gKyBjYW5jZWxFZGl0QnV0dG9uLCBcImJ1dHRvbnNcIik7XG5cbiAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAwLjY7XG4gICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwiZWRpdE5vZGVQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicGF0aC1kaXNwbGF5LWluLWVkaXRvclwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgIH0pICsgcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICBpZDogdGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLFxuICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgc3R5bGU6IFwicGFkZGluZy1sZWZ0OiAwcHg7IHdpZHRoOlwiICsgd2lkdGggKyBcInB4O2hlaWdodDpcIiArIGhlaWdodCArIFwicHg7b3ZlcmZsb3c6c2Nyb2xsO1wiIC8vIGJvcmRlcjo0cHggc29saWRcbiAgICAgICAgICAgIC8vIGxpZ2h0R3JheTtcIlxuICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgcmV0dXJuIGhlYWRlciArIGludGVybmFsTWFpbkNvbnRlbnQgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHZW5lcmF0ZXMgYWxsIHRoZSBIVE1MIGVkaXQgZmllbGRzIGFuZCBwdXRzIHRoZW0gaW50byB0aGUgRE9NIG1vZGVsIG9mIHRoZSBwcm9wZXJ0eSBlZGl0b3IgZGlhbG9nIGJveC5cbiAgICAgKlxuICAgICAqL1xuICAgIHBvcHVsYXRlRWRpdE5vZGVQZygpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIikpO1xuXG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgLyogY2xlYXIgdGhpcyBtYXAgdG8gZ2V0IHJpZCBvZiBvbGQgcHJvcGVydGllcyAqL1xuICAgICAgICB0aGlzLmZpZWxkSWRUb1Byb3BNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgLyogZWRpdE5vZGUgd2lsbCBiZSBudWxsIGlmIHRoaXMgaXMgYSBuZXcgbm9kZSBiZWluZyBjcmVhdGVkICovXG4gICAgICAgIGlmIChlZGl0LmVkaXROb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgIC8qIGl0ZXJhdG9yIGZ1bmN0aW9uIHdpbGwgaGF2ZSB0aGUgd3JvbmcgJ3RoaXMnIHNvIHdlIHNhdmUgdGhlIHJpZ2h0IG9uZSAqL1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHZhciBlZGl0T3JkZXJlZFByb3BzID0gcHJvcHMuZ2V0UHJvcGVydGllc0luRWRpdGluZ09yZGVyKGVkaXQuZWRpdE5vZGUucHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgIHZhciBhY2VGaWVsZHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBQcm9wZXJ0eUluZm8uamF2YSBvYmplY3RzXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogV2FybmluZyBlYWNoIGl0ZXJhdG9yIGxvb3AgaGFzIGl0cyBvd24gJ3RoaXMnXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgKiBpZiBwcm9wZXJ0eSBub3QgYWxsb3dlZCB0byBkaXNwbGF5IHJldHVybiB0byBieXBhc3MgdGhpcyBwcm9wZXJ0eS9pdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3AubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmaWVsZElkID0gX3RoaXMuaWQoXCJlZGl0Tm9kZVRleHRDb250ZW50XCIgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBlZGl0IGZpZWxkIFwiICsgZmllbGRJZCArIFwiIGZvciBwcm9wZXJ0eSBcIiArIHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgdmFyIGlzUmVhZE9ubHlQcm9wID0gcmVuZGVyLmlzUmVhZE9ubHlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgIF90aGlzLmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgX3RoaXMucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IF90aGlzLm1ha2VQcm9wZXJ0eUVkaXRCdXR0b25CYXIocHJvcCwgZmllbGRJZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzTXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgKz0gX3RoaXMubWFrZU11bHRpUHJvcEVkaXRvcihwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IF90aGlzLm1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeSwgYWNlRmllbGRzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKCghaXNSZWFkT25seVByb3AgJiYgIWlzQmluYXJ5UHJvcCkgfHwgZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJwcm9wZXJ0eUVkaXRMaXN0SXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1IaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJzdHlsZVwiIDogXCJkaXNwbGF5OiBcIisgKCFyZE9ubHkgfHwgbWV0YTY0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcImlubGluZVwiIDogXCJub25lXCIpXG4gICAgICAgICAgICAgICAgfSwgZmllbGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogRWRpdGluZyBhIG5ldyBub2RlICovXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdG9kby0wOiB0aGlzIGVudGlyZSBibG9jayBuZWVkcyByZXZpZXcgbm93IChyZWRlc2lnbilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBuZXcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjZUZpZWxkSWQgPSB0aGlzLmlkKFwibmV3Tm9kZU5hbWVJZFwiKTtcblxuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogYWNlRmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBcIlwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOZXcgTm9kZSBOYW1lXCJcbiAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyB0b2RvLTA6IEkgY2FuIHJlbW92ZSB0aGlzIGRpdiBub3cgP1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHt9LCBmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgLy8gdmFyIHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgIC8vICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAvLyB9LCAvL1xuICAgICAgICAvLyAgICAgKGVkaXQuc2hvd1JlYWRPbmx5UHJvcGVydGllcyA/IFwiSGlkZSBSZWFkLU9ubHkgUHJvcGVydGllc1wiIDogXCJTaG93IFJlYWQtT25seSBQcm9wZXJ0aWVzXCIpKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gZmllbGRzICs9IHRvZ2dsZVJlYWRvbmx5VmlzQnV0dG9uO1xuXG4gICAgICAgIHV0aWwuc2V0SHRtbEVuaGFuY2VkKHRoaXMuaWQoXCJwcm9wZXJ0eUVkaXRGaWVsZENvbnRhaW5lclwiKSwgZmllbGRzKTtcblxuICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoYWNlRmllbGRzW2ldLmlkKTtcbiAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoYWNlRmllbGRzW2ldLnZhbC51bmVuY29kZUh0bWwoKSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LmFjZUVkaXRvcnNCeUlkW2FjZUZpZWxkc1tpXS5pZF0gPSBlZGl0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5zdHIgPSBlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSA/IC8vXG4gICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgIDogLy9cbiAgICAgICAgICAgIFwiXCI7XG5cbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJlZGl0Tm9kZUluc3RydWN0aW9uc1wiKSkuaHRtbChpbnN0cik7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogQWxsb3cgYWRkaW5nIG9mIG5ldyBwcm9wZXJ0aWVzIGFzIGxvbmcgYXMgdGhpcyBpcyBhIHNhdmVkIG5vZGUgd2UgYXJlIGVkaXRpbmcsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBzdGFydFxuICAgICAgICAgKiBtYW5hZ2luZyBuZXcgcHJvcGVydGllcyBvbiB0aGUgY2xpZW50IHNpZGUuIFdlIG5lZWQgYSBnZW51aW5lIG5vZGUgYWxyZWFkeSBzYXZlZCBvbiB0aGUgc2VydmVyIGJlZm9yZSB3ZSBhbGxvd1xuICAgICAgICAgKiBhbnkgcHJvcGVydHkgZWRpdGluZyB0byBoYXBwZW4uXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCIjXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlCdXR0b25cIiksICFlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSk7XG5cbiAgICAgICAgdmFyIHRhZ3NQcm9wRXhpc3RzID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKFwidGFnc1wiLCBlZGl0LmVkaXROb2RlKSAhPSBudWxsO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhhc1RhZ3NQcm9wOiBcIiArIHRhZ3NQcm9wKTtcbiAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiKSwgIXRhZ3NQcm9wRXhpc3RzKTtcbiAgICB9XG5cbiAgICB0b2dnbGVTaG93UmVhZE9ubHkoKTogdm9pZCB7XG4gICAgICAgIC8vIGFsZXJ0KFwibm90IHlldCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgIC8vIHNlZSBzYXZlRXhpc3RpbmdOb2RlIGZvciBob3cgdG8gaXRlcmF0ZSBhbGwgcHJvcGVydGllcywgYWx0aG91Z2ggSSB3b25kZXIgd2h5IEkgZGlkbid0IGp1c3QgdXNlIGEgbWFwL3NldCBvZlxuICAgICAgICAvLyBwcm9wZXJ0aWVzIGVsZW1lbnRzXG4gICAgICAgIC8vIGluc3RlYWQgc28gSSBkb24ndCBuZWVkIHRvIHBhcnNlIGFueSBET00gb3IgZG9tSWRzIGlub3JkZXIgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IG9mIHRoZW0/Pz8/XG4gICAgfVxuXG4gICAgYWRkUHJvcGVydHkoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdCA9IG5ldyBFZGl0UHJvcGVydHlEbGcodGhpcyk7XG4gICAgICAgIHRoaXMuZWRpdFByb3BlcnR5RGxnSW5zdC5vcGVuKCk7XG4gICAgfVxuXG4gICAgYWRkVGFnc1Byb3BlcnR5KCk6IHZvaWQge1xuICAgICAgICBpZiAocHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGVkaXQuZWRpdE5vZGUsIFwidGFnc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcInRhZ3NcIixcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IFwiXCJcbiAgICAgICAgfTtcbiAgICAgICAgdXRpbC5qc29uKFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLmFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICBhZGRUYWdzUHJvcGVydHlSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJBZGQgVGFncyBQcm9wZXJ0eVwiLCByZXMpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlKHJlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlUHJvcGVydHlSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xuICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogTm90ZTogZmllbGRJZCBwYXJhbWV0ZXIgaXMgYWxyZWFkeSBkaWFsb2ctc3BlY2lmaWMgYW5kIGRvZXNuJ3QgbmVlZCBpZCgpIHdyYXBwZXIgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBtYWtlUHJvcGVydHlFZGl0QnV0dG9uQmFyKHByb3A6IGFueSwgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IFwiXCI7XG5cbiAgICAgICAgdmFyIGNsZWFyQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuICAgICAgICAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5jbGVhclByb3BlcnR5KCdcIiArIGZpZWxkSWQgKyBcIicpO1wiIC8vXG4gICAgICAgIH0sIC8vXG4gICAgICAgICAgICBcIkNsZWFyXCIpO1xuXG4gICAgICAgIHZhciBhZGRNdWx0aUJ1dHRvbiA9IFwiXCI7XG4gICAgICAgIHZhciBkZWxldGVCdXR0b24gPSBcIlwiO1xuXG4gICAgICAgIGlmIChwcm9wLm5hbWUgIT09IGpjckNuc3QuQ09OVEVOVCkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEZvciBub3cgd2UganVzdCBnbyB3aXRoIHRoZSBkZXNpZ24gd2hlcmUgdGhlIGFjdHVhbCBjb250ZW50IHByb3BlcnR5IGNhbm5vdCBiZSBkZWxldGVkLiBVc2VyIGNhbiBsZWF2ZVxuICAgICAgICAgICAgICogY29udGVudCBibGFuayBidXQgbm90IGRlbGV0ZSBpdC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVsZXRlQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmRlbGV0ZVByb3BlcnR5KCdcIiArIHByb3AubmFtZSArIFwiJyk7XCIgLy9cbiAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgXCJEZWxcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJIGRvbid0IHRoaW5rIGl0IHJlYWxseSBtYWtlcyBzZW5zZSB0byBhbGxvdyBhIGpjcjpjb250ZW50IHByb3BlcnR5IHRvIGJlIG11bHRpdmFsdWVkLiBJIG1heSBiZSB3cm9uZyBidXRcbiAgICAgICAgICAgICAqIHRoaXMgaXMgbXkgY3VycmVudCBhc3N1bXB0aW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIC8vdG9kby0wOiBUaGVyZSdzIGEgYnVnIGluIGVkaXRpbmcgbXVsdGlwbGUtdmFsdWVkIHByb3BlcnRpZXMsIGFuZCBzbyBpJ20ganVzdCB0dXJuaW5nIGl0IG9mZiBmb3Igbm93XG4gICAgICAgICAgICAvL3doaWxlIGkgY29tcGxldGUgdGVzdGluZyBvZiB0aGUgcmVzdCBvZiB0aGUgYXBwLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGFkZE11bHRpQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcbiAgICAgICAgICAgIC8vICAgICBcIm9uQ2xpY2tcIjogXCJtZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLmFkZFN1YlByb3BlcnR5KCdcIiArIGZpZWxkSWQgKyBcIicpO1wiIC8vXG4gICAgICAgICAgICAvLyB9LCAvL1xuICAgICAgICAgICAgLy8gICAgIFwiQWRkIE11bHRpXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFsbEJ1dHRvbnMgPSBhZGRNdWx0aUJ1dHRvbiArIGNsZWFyQnV0dG9uICsgZGVsZXRlQnV0dG9uO1xuICAgICAgICBpZiAoYWxsQnV0dG9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBidXR0b25CYXIgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zLCBcInByb3BlcnR5LWVkaXQtYnV0dG9uLWJhclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1dHRvbkJhciA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnV0dG9uQmFyO1xuICAgIH1cblxuICAgIGFkZFN1YlByb3BlcnR5KGZpZWxkSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICB2YXIgaXNNdWx0aSA9IHV0aWwuaXNPYmplY3QocHJvcC52YWx1ZXMpO1xuXG4gICAgICAgIC8qIGNvbnZlcnQgdG8gbXVsdGktdHlwZSBpZiB3ZSBuZWVkIHRvICovXG4gICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgcHJvcC52YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHByb3AudmFsdWVzLnB1c2gocHJvcC52YWx1ZSk7XG4gICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETy0zOiBmb3IgcGVyZm9ybWFuY2Ugd2UgY291bGQgZG8gc29tZXRoaW5nIHNpbXBsZXIgdGhhbiAncG9wdWxhdGVFZGl0Tm9kZVBnJyBoZXJlLCBidXQgZm9yIG5vdyB3ZSBqdXN0XG4gICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvcC52YWx1ZXMucHVzaChcIlwiKTtcblxuICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAqL1xuICAgIGRlbGV0ZVByb3BlcnR5KHByb3BOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgfSkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZShwcm9wTmFtZTogc3RyaW5nKSB7XG5cbiAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb24oXCJkZWxldGVQcm9wZXJ0eVwiLCB7XG4gICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgXCJwcm9wTmFtZVwiOiBwcm9wTmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlyb25SZXMuY29tcGxldGVzLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBub3Qgc3VyZSBpZiAndGhpcycgd2lsbCBiZSBjb3JyZWN0IGhlcmUgKHVzaW5nIF90aGlzIHVudGlsIEkgY2hlY2spXG4gICAgICAgICAgICBfdGhpcy5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIHByb3BOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVsZXRlUHJvcGVydHlSZXNwb25zZShyZXM6IGFueSwgcHJvcGVydHlUb0RlbGV0ZTogYW55KSB7XG5cbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIHJlbW92ZSBkZWxldGVkIHByb3BlcnR5IGZyb20gY2xpZW50IHNpZGUgc3RvcmFnZSwgc28gd2UgY2FuIHJlLXJlbmRlciBzY3JlZW4gd2l0aG91dCBtYWtpbmcgYW5vdGhlciBjYWxsIHRvXG4gICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJvcHMuZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhKHByb3BlcnR5VG9EZWxldGUpO1xuXG4gICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyUHJvcGVydHkoZmllbGRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgdXRpbC5zZXRJbnB1dFZhbCh0aGlzLmlkKGZpZWxkSWQpLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogc2NhbiBmb3IgYWxsIG11bHRpLXZhbHVlIHByb3BlcnR5IGZpZWxkcyBhbmQgY2xlYXIgdGhlbSAqL1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHdoaWxlIChjb3VudGVyIDwgMTAwMCkge1xuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkICsgXCJfc3ViUHJvcFwiICsgY291bnRlcildO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICogaXRzZWxmIGZyb20gYW55IGtpbmQgb2YgZGFtYWdlLlxuICAgICAqL1xuICAgIHNhdmVOb2RlKCk6IHZvaWQge1xuICAgICAgICAvKlxuICAgICAgICAgKiBJZiBlZGl0aW5nIGFuIHVuc2F2ZWQgbm9kZSBpdCdzIHRpbWUgdG8gcnVuIHRoZSBpbnNlcnROb2RlLCBvciBjcmVhdGVTdWJOb2RlLCB3aGljaCBhY3R1YWxseSBzYXZlcyBvbnRvIHRoZVxuICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAvLyB0b2RvLTA6IG5lZWQgdG8gbWFrZSB0aGlzIGNvbXBhdGlibGUgd2l0aCBBY2UgRWRpdG9yLlxuICAgICAgICAgICAgdGhpcy5zYXZlTmV3Tm9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgICAqIEVsc2Ugd2UgYXJlIGVkaXRpbmcgYSBzYXZlZCBub2RlLCB3aGljaCBpcyBhbHJlYWR5IHNhdmVkIG9uIHNlcnZlci5cbiAgICAgICAgICovXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlRXhpc3RpbmdOb2RlLlwiKTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZU5ld05vZGUobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFuZXdOb2RlTmFtZSkge1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWUgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHdlIGRpZG4ndCBjcmVhdGUgdGhlIG5vZGUgd2UgYXJlIGluc2VydGluZyB1bmRlciwgYW5kIG5laXRoZXIgZGlkIFwiYWRtaW5cIiwgdGhlbiB3ZSBuZWVkIHRvIHNlbmQgbm90aWZpY2F0aW9uXG4gICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWV0YTY0LnVzZXJOYW1lICE9IGVkaXQucGFyZW50T2ZOZXdOb2RlLmNyZWF0ZWRCeSAmJiAvL1xuICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgIGlmIChlZGl0Lm5vZGVJbnNlcnRUYXJnZXQpIHtcbiAgICAgICAgICAgIHV0aWwuanNvbihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwicGFyZW50SWRcIjogZWRpdC5wYXJlbnRPZk5ld05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJ0YXJnZXROYW1lXCI6IGVkaXQubm9kZUluc2VydFRhcmdldC5uYW1lLFxuICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWVcbiAgICAgICAgICAgIH0sIGVkaXQuaW5zZXJ0Tm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHV0aWwuanNvbihcImNyZWF0ZVN1Yk5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWVcbiAgICAgICAgICAgIH0sIGVkaXQuY3JlYXRlU3ViTm9kZVJlc3BvbnNlLCBlZGl0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVFeGlzdGluZ05vZGUoKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZVwiKTtcblxuICAgICAgICAvKiBob2xkcyBsaXN0IG9mIHByb3BlcnRpZXMgdG8gc2VuZCB0byBzZXJ2ZXIuIEVhY2ggb25lIGhhdmluZyBuYW1lK3ZhbHVlIHByb3BlcnRpZXMgKi9cbiAgICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMucHJvcEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4OiBudW1iZXIsIHByb3A6IGFueSkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLSBHZXR0aW5nIHByb3AgaWR4OiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgLyogSWdub3JlIHRoaXMgcHJvcGVydHkgaWYgaXQncyBvbmUgdGhhdCBjYW5ub3QgYmUgZWRpdGVkIGFzIHRleHQgKi9cbiAgICAgICAgICAgIGlmIChwcm9wLnJlYWRPbmx5IHx8IHByb3AuYmluYXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKCFwcm9wLm11bHRpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbm9uLW11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtwcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIEFjZSBFZGl0b3IgZm9yIElEOiBcIiArIHByb3AuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQocHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWwgIT09IHByb3AudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGNoYW5nZWQ6IHByb3BOYW1lPVwiICsgcHJvcC5wcm9wZXJ0eS5uYW1lICsgXCIgcHJvcFZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLnByb3BlcnR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9wIGRpZG4ndCBjaGFuZ2U6IFwiICsgcHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogRWxzZSB0aGlzIGlzIGEgTVVMVEkgcHJvcGVydHkgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIG11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFscyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKHByb3Auc3ViUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBzdWJQcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJQcm9wW1wiICsgaW5kZXggKyBcIl06IFwiICsgSlNPTi5zdHJpbmdpZnkoc3ViUHJvcCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtzdWJQcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgQWNlIEVkaXRvciBmb3Igc3ViUHJvcCBJRDogXCIgKyBzdWJQcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJTZXR0aW5nW1wiICsgcHJvcFZhbCArIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChzdWJQcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIHN1YlByb3BbXCIgKyBpbmRleCArIFwiXSBvZiBcIiArIHByb3AubmFtZSArIFwiIHZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFscy5wdXNoKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVzXCI6IHByb3BWYWxzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7Ly8gZW5kIGl0ZXJhdG9yXG5cbiAgICAgICAgLyogaWYgYW55dGhpbmcgY2hhbmdlZCwgc2F2ZSB0byBzZXJ2ZXIgKi9cbiAgICAgICAgaWYgKHByb3BlcnRpZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllc0xpc3QsXG4gICAgICAgICAgICAgICAgc2VuZE5vdGlmaWNhdGlvbjogZWRpdC5zZW5kTm90aWZpY2F0aW9uUGVuZGluZ1NhdmVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgc2F2ZU5vZGUoKS4gUG9zdERhdGE9XCIgKyB1dGlsLnRvSnNvbihwb3N0RGF0YSkpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb24oXCJzYXZlTm9kZVwiLCBwb3N0RGF0YSwgZWRpdC5zYXZlTm9kZVJlc3BvbnNlLCBlZGl0LCB7XG4gICAgICAgICAgICAgICAgc2F2ZWRJZDogZWRpdC5lZGl0Tm9kZS5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3RoaW5nIGNoYW5nZWQuIE5vdGhpbmcgdG8gc2F2ZS5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlTXVsdGlQcm9wRWRpdG9yKHByb3BFbnRyeTogUHJvcEVudHJ5KTogc3RyaW5nIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgTXVsdGkgRWRpdG9yOiBQcm9wZXJ0eSBtdWx0aS10eXBlOiBuYW1lPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIiBjb3VudD1cIlxuICAgICAgICAgICAgKyBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcyA9IFtdO1xuXG4gICAgICAgIHZhciBwcm9wTGlzdCA9IHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZXM7XG4gICAgICAgIGlmICghcHJvcExpc3QgfHwgcHJvcExpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHByb3BMaXN0ID0gW107XG4gICAgICAgICAgICBwcm9wTGlzdC5wdXNoKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9wIG11bHRpLXZhbFtcIiArIGkgKyBcIl09XCIgKyBwcm9wTGlzdFtpXSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmlkKHByb3BFbnRyeS5pZCArIFwiX3N1YlByb3BcIiArIGkpO1xuXG4gICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCB8fCAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gKGkgPT0gMCA/IHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lIDogXCIqXCIpICsgXCIuXCIgKyBpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIHRleHRhcmVhIHdpdGggaWQ9XCIgKyBpZCk7XG5cbiAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgcHJvcEVudHJ5LnN1YlByb3BzLnB1c2goc3ViUHJvcCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wRW50cnkuYmluYXJ5IHx8IHByb3BFbnRyeS5yZWFkT25seSkge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlYWRvbmx5XCI6IFwicmVhZG9ubHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yKHByb3BFbnRyeTogYW55LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUHJvcGVydHkgc2luZ2xlLXR5cGU6IFwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuXG4gICAgICAgIHZhciBmaWVsZCA9IFwiXCI7XG5cbiAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICB2YXIgbGFiZWwgPSByZW5kZXIuc2FuaXRpemVQcm9wZXJ0eU5hbWUocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgPyBwcm9wVmFsIDogJyc7XG4gICAgICAgIHByb3BWYWxTdHIgPSBwcm9wVmFsU3RyLmVzY2FwZUZvckF0dHJpYigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1ha2luZyBzaW5nbGUgcHJvcCBlZGl0b3I6IHByb3BbXCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSArIFwiXSB2YWxbXCIgKyBwcm9wRW50cnkucHJvcGVydHkudmFsXG4gICAgICAgICAgICArIFwiXSBmaWVsZElkPVwiICsgcHJvcEVudHJ5LmlkKTtcblxuICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgIGZpZWxkICs9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBsYWJlbCxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFN0clxuICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiYWNlLWVkaXQtcGFuZWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodG1sXCI6IFwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgYWNlRmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBpZDogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdE5vZGVEbGcuaW5pdFwiKTtcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICB9XG59XG4iLCJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xuY2xhc3MgRWRpdFByb3BlcnR5RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBwcml2YXRlIGVkaXROb2RlRGxnOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihlZGl0Tm9kZURsZzogYW55KSB7XG4gICAgICAgIHN1cGVyKFwiRWRpdFByb3BlcnR5RGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJFZGl0IE5vZGUgUHJvcGVydHlcIik7XG5cbiAgICAgICAgdmFyIHNhdmVQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLnNhdmVQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJlZGl0UHJvcGVydHlQZ0Nsb3NlQnV0dG9uXCIpO1xuXG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZVByb3BlcnR5QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbik7XG5cbiAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiZWRpdFByb3BlcnR5UGF0aERpc3BsYXlcIilcbiAgICAgICAgICAgICAgICArIFwiJyBjbGFzcz0ncGF0aC1kaXNwbGF5LWluLWVkaXRvcic+PC9kaXY+XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBwb3B1bGF0ZVByb3BlcnR5RWRpdCgpOiB2b2lkIHtcbiAgICAgICAgdmFyIGZpZWxkID0gJyc7XG5cbiAgICAgICAgLyogUHJvcGVydHkgTmFtZSBGaWVsZCAqL1xuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZmllbGRQcm9wTmFtZUlkID0gXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBmaWVsZFByb3BOYW1lSWQsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcE5hbWVJZCksXG4gICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IG5hbWVcIixcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiTmFtZVwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFByb3BlcnR5IFZhbHVlIEZpZWxkICovXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmaWVsZFByb3BWYWx1ZUlkID0gXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIjtcblxuICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wVmFsdWVJZCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoZmllbGRQcm9wVmFsdWVJZCksXG4gICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBcIkVudGVyIHByb3BlcnR5IHRleHRcIixcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiVmFsdWVcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgIHZpZXcuaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQodGhpcy5pZChcImVkaXRQcm9wZXJ0eVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZCh0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSwgZmllbGQpO1xuICAgIH1cblxuICAgIHNhdmVQcm9wZXJ0eSgpOiB2b2lkIHtcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiKSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlRGF0YSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcImFkZFByb3BlcnR5VmFsdWVUZXh0Q29udGVudFwiKSk7XG5cbiAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBwcm9wZXJ0eU5hbWVEYXRhLFxuICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogcHJvcGVydHlWYWx1ZURhdGFcbiAgICAgICAgfTtcbiAgICAgICAgdXRpbC5qc29uKFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKiBXYXJuaW5nOiBkb24ndCBjb25mdXNlIHdpdGggRWRpdE5vZGVEbGcgKi9cbiAgICBzYXZlUHJvcGVydHlSZXNwb25zZShyZXM6IGFueSk6IHZvaWQge1xuICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgIGVkaXQuZWRpdE5vZGUucHJvcGVydGllcy5wdXNoKHJlcy5wcm9wZXJ0eVNhdmVkKTtcbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuZWRpdE5vZGVEbGcuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBpbmNvcnJlY3Qgb2JqZWN0IGZvciBFZGl0Tm9kZURsZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXROb2RlRGxnLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgIH1cblxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVQcm9wZXJ0eUVkaXQoKTtcbiAgICB9XG59XG4iLCJjb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5jbGFzcyBTaGFyZVRvUGVyc29uRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiVXNlciB0byBTaGFyZSBXaXRoXCIsIFwic2hhcmVUb1VzZXJOYW1lXCIpO1xuICAgICAgICB2YXIgc2hhcmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNoYXJlXCIsIFwic2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIiwgdGhpcy5zaGFyZU5vZGVUb1BlcnNvbixcbiAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzaGFyZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QZXJzb24oKTogdm9pZCB7XG4gICAgICAgIHZhciB0YXJnZXRVc2VyID0gdGhpcy5nZXRJbnB1dFZhbChcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgaWYgKCF0YXJnZXRVc2VyKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgdXRpbC5qc29uKFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgIFwicHJpdmlsZWdlc1wiOiBbXCJyZWFkXCIsIFwid3JpdGVcIiwgXCJhZGRDaGlsZHJlblwiLCBcIm5vZGVUeXBlTWFuYWdlbWVudFwiXVxuICAgICAgICB9LCB0aGl6LnJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24sIHRoaXopO1xuICAgIH1cblxuICAgIHJlbG9hZEZyb21TaGFyZVdpdGhQZXJzb24ocmVzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2hhcmUgTm9kZSB3aXRoIFBlcnNvblwiLCByZXMpKSB7XG4gICAgICAgICAgICAobmV3IFNoYXJpbmdEbGcoKSkub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyaW5nRGxnLmpzXCIpO1xuXG5jbGFzcyBTaGFyaW5nRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJTaGFyaW5nRGxnXCIpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAqL1xuICAgIGJ1aWxkKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJOb2RlIFNoYXJpbmdcIik7XG5cbiAgICAgICAgdmFyIHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHdpdGggUGVyc29uXCIsIFwic2hhcmVOb2RlVG9QZXJzb25QZ0J1dHRvblwiLFxuICAgICAgICAgICAgdGhpcy5zaGFyZU5vZGVUb1BlcnNvblBnLCB0aGlzKTtcbiAgICAgICAgdmFyIG1ha2VQdWJsaWNCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTaGFyZSB0byBQdWJsaWNcIiwgXCJzaGFyZU5vZGVUb1B1YmxpY0J1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUHVibGljLFxuICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlU2hhcmluZ0J1dHRvblwiKTtcblxuICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiArIG1ha2VQdWJsaWNCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNDtcblxuICAgICAgICB2YXIgaW50ZXJuYWxNYWluQ29udGVudCA9IFwiPGRpdiBpZD0nXCIgKyB0aGlzLmlkKFwic2hhcmVOb2RlTmFtZURpc3BsYXlcIikgKyBcIic+PC9kaXY+XCIgKyAvL1xuICAgICAgICAgICAgXCI8ZGl2IHN0eWxlPVxcXCJ3aWR0aDpcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBoZWlnaHQgKyBcInB4O292ZXJmbG93OnNjcm9sbDtib3JkZXI6NHB4IHNvbGlkIGxpZ2h0R3JheTtcXFwiIGlkPSdcIlxuICAgICAgICAgICAgKyB0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSArIFwiJz48L2Rpdj5cIjtcblxuICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICB9XG5cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICovXG4gICAgcmVsb2FkKCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgIHV0aWwuanNvbihcImdldE5vZGVQcml2aWxlZ2VzXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICBcImluY2x1ZGVPd25lcnNcIjogdHJ1ZVxuICAgICAgICB9LCB0aGlzLmdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogSGFuZGxlcyBnZXROb2RlUHJpdmlsZWdlcyByZXNwb25zZS5cbiAgICAgKlxuICAgICAqIHJlcz1qc29uIG9mIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UuamF2YVxuICAgICAqXG4gICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgKi9cbiAgICBnZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAqL1xuICAgIHBvcHVsYXRlU2hhcmluZ1BnKHJlczogYW55KTogdm9pZCB7XG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgdmFyIFRoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuZWFjaChyZXMuYWNsRW50cmllcywgZnVuY3Rpb24oaW5kZXgsIGFjbEVudHJ5KSB7XG4gICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1saXN0XCJcbiAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgIHZhciBwdWJsaWNBcHBlbmRBdHRycyA9IHtcbiAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTtcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImFsbG93UHVibGljQ29tbWVudGluZ1wiLFxuICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHJlcy5wdWJsaWNBcHBlbmQpIHtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZEF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kbzogdXNlIGFjdHVhbCBwb2x5bWVyIHBhcGVyLWNoZWNrYm94IGhlcmUgKi9cbiAgICAgICAgaHRtbCArPSByZW5kZXIudGFnKFwicGFwZXItY2hlY2tib3hcIiwgcHVibGljQXBwZW5kQXR0cnMsIFwiXCIsIGZhbHNlKTtcblxuICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJsYWJlbFwiLCB7XG4gICAgICAgICAgICBcImZvclwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgIH0sIFwiQWxsb3cgcHVibGljIGNvbW1lbnRpbmcgdW5kZXIgdGhpcyBub2RlLlwiLCB0cnVlKTtcblxuICAgICAgICB1dGlsLnNldEh0bWxFbmhhbmNlZCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgfVxuXG4gICAgcHVibGljQ29tbWVudGluZ0NoYW5nZWQoKTogdm9pZCB7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogVXNpbmcgb25DbGljayBvbiB0aGUgZWxlbWVudCBBTkQgdGhpcyB0aW1lb3V0IGlzIHRoZSBvbmx5IGhhY2sgSSBjb3VsZCBmaW5kIHRvIGdldCBnZXQgd2hhdCBhbW91bnRzIHRvIGEgc3RhdGVcbiAgICAgICAgICogY2hhbmdlIGxpc3RlbmVyIG9uIGEgcGFwZXItY2hlY2tib3guIFRoZSBkb2N1bWVudGVkIG9uLWNoYW5nZSBsaXN0ZW5lciBzaW1wbHkgZG9lc24ndCB3b3JrIGFuZCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwb2x5RWxtID0gdXRpbC5wb2x5RWxtKHRoaXouaWQoXCJhbGxvd1B1YmxpY0NvbW1lbnRpbmdcIikpO1xuXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdXRpbC5qc29uKFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBwb2x5RWxtLm5vZGUuY2hlY2tlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCAyNTApO1xuICAgIH1cblxuICAgIHJlbW92ZVByaXZpbGVnZShwcmluY2lwYWw6IGFueSwgcHJpdmlsZWdlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgLypcbiAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgKi9cbiAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdXRpbC5qc29uKFwicmVtb3ZlUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VcIjogcHJpdmlsZWdlXG4gICAgICAgIH0sIHRoaXMucmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHJlbW92ZVByaXZpbGVnZVJlc3BvbnNlKHJlczogYW55KTogdm9pZCB7XG5cbiAgICAgICAgdXRpbC5qc29uKFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUucGF0aCxcbiAgICAgICAgICAgIFwiaW5jbHVkZUFjbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgfSwgdGhpcy5nZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZW5kZXJBY2xQcml2aWxlZ2VzKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXoubWFrZUJ1dHRvbihcIlJlbW92ZVwiLCBcInJlbW92ZVByaXZCdXR0b25cIiwgLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICArIFwiJyk7XCIpO1xuXG4gICAgICAgICAgICB2YXIgcm93ID0gcmVuZGVyLm1ha2VIb3Jpem9udGFsRmllbGRTZXQocmVtb3ZlQnV0dG9uKTtcblxuICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcml2aWxlZ2UtZW50cnlcIlxuICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgc2hhcmVOb2RlVG9QZXJzb25QZygpOiB2b2lkIHtcbiAgICAgICAgKG5ldyBTaGFyZVRvUGVyc29uRGxnKCkpLm9wZW4oKTtcbiAgICB9XG5cbiAgICBzaGFyZU5vZGVUb1B1YmxpYygpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTaGFyaW5nIG5vZGUgdG8gcHVibGljLlwiKTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAqL1xuICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAvKlxuICAgICAgICAgKiBBZGQgcHJpdmlsZWdlIGFuZCB0aGVuIHJlbG9hZCBzaGFyZSBub2RlcyBkaWFsb2cgZnJvbSBzY3JhdGNoIGRvaW5nIGFub3RoZXIgY2FsbGJhY2sgdG8gc2VydmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE86IHRoaXMgYWRkaXRpb25hbCBjYWxsIGNhbiBiZSBhdm9pZGVkIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbC5qc29uKFwiYWRkUHJpdmlsZWdlXCIsIHtcbiAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogXCJldmVyeW9uZVwiLFxuICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IFtcInJlYWRcIl1cbiAgICAgICAgfSwgdGhpcy5yZWxvYWQsIHRoaXMpO1xuICAgIH1cbn1cbiIsIlxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVuYW1lTm9kZURsZy5qc1wiKTtcblxuY2xhc3MgUmVuYW1lTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICovXG4gICAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgIHZhciBjdXJOb2RlTmFtZURpc3BsYXkgPSBcIjxoMyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZU5hbWVEaXNwbGF5XCIpICsgXCInPjwvaDM+XCI7XG4gICAgICAgIHZhciBjdXJOb2RlUGF0aERpc3BsYXkgPSBcIjxoNCBjbGFzcz0ncGF0aC1kaXNwbGF5JyBpZD0nXCIgKyB0aGlzLmlkKFwiY3VyTm9kZVBhdGhEaXNwbGF5XCIpICsgXCInPjwvaDQ+XCI7XG5cbiAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgIHZhciByZW5hbWVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZW5hbWVcIiwgXCJyZW5hbWVOb2RlQnV0dG9uXCIsIHRoaXMucmVuYW1lTm9kZSwgdGhpcyk7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlbmFtZU5vZGVCdXR0b25cIik7XG4gICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgIHJldHVybiBoZWFkZXIgKyBjdXJOb2RlTmFtZURpc3BsYXkgKyBjdXJOb2RlUGF0aERpc3BsYXkgKyBmb3JtQ29udHJvbHMgKyBidXR0b25CYXI7XG4gICAgfVxuXG4gICAgcmVuYW1lTm9kZSgpOiB2b2lkIHtcbiAgICAgICAgdmFyIG5ld05hbWUgPSB0aGlzLmdldElucHV0VmFsKFwibmV3Tm9kZU5hbWVFZGl0RmllbGRcIik7XG5cbiAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcobmV3TmFtZSkpIHtcbiAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTZWxlY3QgYSBub2RlIHRvIHJlbmFtZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGlmIG5vIG5vZGUgYmVsb3cgdGhpcyBub2RlLCByZXR1cm5zIG51bGwgKi9cbiAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgIHZhciByZW5hbWluZ1Jvb3ROb2RlID0gKGhpZ2hsaWdodE5vZGUuaWQgPT09IG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcblxuICAgICAgICB2YXIgaXJvblJlcyA9IHV0aWwuanNvbihcInJlbmFtZU5vZGVcIiwge1xuICAgICAgICAgICAgXCJub2RlSWRcIjogaGlnaGxpZ2h0Tm9kZS5pZCxcbiAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0aGl6ID0gdGhpcztcblxuICAgICAgICBpcm9uUmVzLmNvbXBsZXRlcy50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpei5yZW5hbWVOb2RlUmVzcG9uc2UoaXJvblJlcy5yZXNwb25zZSwgcmVuYW1pbmdSb290Tm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmFtZU5vZGVSZXNwb25zZShyZXM6IGFueSwgcmVuYW1pbmdQYWdlUm9vdDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZW5hbWUgbm9kZVwiLCByZXMpKSB7XG4gICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUocmVzLm5ld0lkLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICBpZiAoIWhpZ2hsaWdodE5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSkuaHRtbChcIk5hbWU6IFwiICsgaGlnaGxpZ2h0Tm9kZS5uYW1lKTtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIGhpZ2hsaWdodE5vZGUucGF0aCk7XG4gICAgfVxufVxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNlYXJjaFJlc3VsdHNQYW5lbC5qc1wiKTtcclxuXHJcblxyXG52YXIgc2VhcmNoUmVzdWx0c1BhbmVsID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIF8gPSB7XHJcbiAgICAgICAgZG9tSWQ6IFwic2VhcmNoUmVzdWx0c1BhbmVsXCIsXHJcbiAgICAgICAgdGFiSWQ6IFwic2VhcmNoVGFiTmFtZVwiLFxyXG4gICAgICAgIHZpc2libGU6IGZhbHNlLFxyXG5cclxuICAgICAgICBidWlsZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJz48L2gyPlwiO1xyXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBcIjxkaXYgaWQ9J3NlYXJjaFJlc3VsdHNWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiTW9kdWxlIHJlYWR5OiBzZWFyY2hSZXN1bHRzUGFuZWwuanNcIik7XHJcbiAgICByZXR1cm4gXztcclxufSAoKTtcclxuIiwiXHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHRpbWVsaW5lUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxudmFyIHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuICAgIHZhciBfID0ge1xyXG4gICAgICAgIGRvbUlkOiBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCIsXHJcbiAgICAgICAgdGFiSWQ6IFwidGltZWxpbmVUYWJOYW1lXCIsXHJcbiAgICAgICAgdmlzaWJsZTogZmFsc2UsXHJcblxyXG4gICAgICAgIGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSd0aW1lbGluZVZpZXcnPjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgbWFpbkNvbnRlbnQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoXCIjdGltZWxpbmVQYWdlVGl0bGVcIikuaHRtbChzcmNoLnRpbWVsaW5lUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2gudGltZWxpbmVSZXN1bHRzLCBcInRpbWVsaW5lVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiTW9kdWxlIHJlYWR5OiB0aW1lbGluZVJlc3VsdHNQYW5lbC5qc1wiKTtcclxuICAgIHJldHVybiBfO1xyXG59ICgpO1xyXG4iXX0=