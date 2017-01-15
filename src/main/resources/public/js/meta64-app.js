var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
(function (m64) {
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
                (new m64.MessageDlg("Variable not found: " + varName)).open();
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
                var isRep = m64.util.startsWith(node.name, "rep:") ||
                    m64.util.contains(node.path, "/rep:");
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
                if (meta64.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && m64.util.startsWith(node.name, prop)) {
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
                var elmId = "#ownerDisplay" + node.uid;
                var elm = $(elmId);
                elm.html(" (Manager: " + ownerBuf + ")");
                if (mine) {
                    m64.util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
                }
                else {
                    m64.util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
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
                    m64.util.changeOrAddClass("#" + rowElmId, "active-row", "inactive-row");
                }
            }
            if (!doneHighlighting) {
                meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;
                var rowElmId = node.uid + "_row";
                var rowElm = $("#" + rowElmId);
                if (!rowElm || rowElm.length == 0) {
                    console.log("Unable to find rowElement to highlight: " + rowElmId);
                }
                m64.util.changeOrAddClass("#" + rowElmId, "inactive-row", "active-row");
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
                m64.jcrCnst.PUBLIC_APPEND
            ]);
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
                m64.jcrCnst.PUBLIC_APPEND
            ]);
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
(function (m64) {
    var props;
    (function (props_1) {
        props_1.orderProps = function (propOrder, props) {
            var propsNew = m64.util.arrayClone(props);
            var targetIdx = 0;
            for (var _i = 0, propOrder_1 = propOrder; _i < propOrder_1.length; _i++) {
                var prop = propOrder_1[_i];
                targetIdx = moveNodePosition(propsNew, targetIdx, prop);
            }
            return propsNew;
        };
        var moveNodePosition = function (props, idx, typeName) {
            var tagIdx = m64.util.arrayIndexOfItemByProp(props, "name", typeName);
            if (tagIdx != -1) {
                m64.util.arrayMoveItem(props, tagIdx, idx++);
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
            var propsNew = m64.util.arrayClone(props);
            movePropsToTop([m64.jcrCnst.CONTENT, m64.jcrCnst.TAGS], propsNew);
            movePropsToEnd([m64.jcrCnst.CREATED, m64.jcrCnst.CREATED_BY, m64.jcrCnst.LAST_MODIFIED, m64.jcrCnst.LAST_MODIFIED_BY], propsNew);
            return propsNew;
        };
        var movePropsToTop = function (propsList, props) {
            for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
                var prop = propsList_1[_i];
                var tagIdx = m64.util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    m64.util.arrayMoveItem(props, tagIdx, 0);
                }
            }
        };
        var movePropsToEnd = function (propsList, props) {
            for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
                var prop = propsList_2[_i];
                var tagIdx = m64.util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    m64.util.arrayMoveItem(props, tagIdx, props.length);
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
            if (m64.util.contains(content, "<code")) {
                m64.meta64.codeFormatDirty = true;
                content = render.encodeLanguages(content);
                content = m64.util.replaceAll(content, "</code>", "</pre>");
            }
            return content;
        };
        render.injectSubstitutions = function (content) {
            return m64.util.replaceAll(content, "{{locationOrigin}}", window.location.origin);
        };
        render.encodeLanguages = function (content) {
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = m64.util.replaceAll(content, "<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = m64.util.replaceAll(content, "<code>", "<pre class='prettyprint'>");
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
                if (m64.util.contains(ret, m64.cnst.INSERT_ATTACHMENT)) {
                    ret = m64.util.replaceAll(ret, m64.cnst.INSERT_ATTACHMENT, binary);
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
            var isRep = m64.util.startsWith(node.name, "rep:") ||
                m64.util.contains(node.path, "/rep:");
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
            var path = m64.util.stripIfStartsWith(node.path, "/root");
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
            path = m64.util.replaceAll(path, "/", " / ");
            var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
            var noRootPath = shortPath;
            if (m64.util.startsWith(noRootPath, "/root")) {
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
                        if (m64.util.contains(v, "'")) {
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
            if (link && link.value && m64.util.contains(link.value.toLowerCase(), ".mp3")) {
                return link.value;
            }
            var uri = m64.props.getNodeProperty("meta64:rssItemUri", node);
            if (uri && uri.value && m64.util.contains(uri.value.toLowerCase(), ".mp3")) {
                return uri.value;
            }
            var encUrl = m64.props.getNodeProperty("meta64:rssItemEncUrl", node);
            if (encUrl && encUrl.value) {
                var encType = m64.props.getNodeProperty("meta64:rssItemEncType", node);
                if (encType && encType.value && m64.util.startsWith(encType.value, "audio/")) {
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
                "meta64:rssFeedImageUrl"
            ];
            return m64.props.orderProps(propOrder, properties);
        };
        podcast.propOrderingItemNode = function (node, properties) {
            var propOrder = [
                "meta64:rssItemTitle",
                "meta64:rssItemDesc",
                "meta64:rssItemLink",
                "meta64:rssItemUri",
                "meta64:rssItemAuthor"
            ];
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
                "meta64:json"
            ];
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
                "meta64:path"
            ];
            return m64.props.orderProps(propOrder, properties);
        };
    })(systemfolder = m64.systemfolder || (m64.systemfolder = {}));
})(m64 || (m64 = {}));
m64.meta64.renderFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.renderNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = m64.systemfolder.propOrdering;
m64.meta64.renderFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.renderFileListNode;
m64.meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = m64.systemfolder.fileListPropOrdering;
console.log("running module: DialogBase.js");
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
                if (m64.util.contains(id, "_dlgId")) {
                    return id;
                }
                return id + "_dlgId" + _this.data.guid;
            };
            this.el = function (id) {
                if (!m64.util.startsWith(id, "#")) {
                    return $("#" + _this.id(id));
                }
                else {
                    return $(_this.id(id));
                }
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
                if (!m64.util.startsWith(id, "#")) {
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
console.log("running module: ProgressDlg.js");
(function (m64) {
    var ProgressDlg = (function (_super) {
        __extends(ProgressDlg, _super);
        function ProgressDlg() {
            var _this = _super.call(this, "ProgressDlg") || this;
            _this.build = function () {
                var header = _this.makeHeader("Processing Request", "", true);
                var progressBar = m64.render.tag("paper-progress", {
                    "indeterminate": "indeterminate",
                    "value": "800",
                    "min": "100",
                    "max": "1000"
                });
                var barContainer = m64.render.tag("div", {
                    "style": "width:280px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
                    "class": "horizontal center-justified layout"
                }, progressBar);
                return header + barContainer;
            };
            return _this;
        }
        return ProgressDlg;
    }(m64.DialogBase));
    m64.ProgressDlg = ProgressDlg;
})(m64 || (m64 = {}));
console.log("running module: ConfirmDlg.js");
(function (m64) {
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
                content = m64.render.centerContent(content, 300);
                var buttons = _this.makeCloseButton("Yes", "ConfirmDlgYesButton", _this.yesCallback)
                    + _this.makeCloseButton("No", "ConfirmDlgNoButton", _this.noCallback);
                content += m64.render.centeredButtonBar(buttons);
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
    }(m64.DialogBase));
    m64.ConfirmDlg = ConfirmDlg;
})(m64 || (m64 = {}));
console.log("running module: EditSystemFile.js");
(function (m64) {
    var EditSystemFileDlg = (function (_super) {
        __extends(EditSystemFileDlg, _super);
        function EditSystemFileDlg(fileName) {
            var _this = _super.call(this, "EditSystemFileDlg") || this;
            _this.fileName = fileName;
            _this.build = function () {
                var content = "<h2>File Editor: " + _this.fileName + "</h2>";
                var buttons = _this.makeCloseButton("Save", "SaveFileButton", _this.saveEdit)
                    + _this.makeCloseButton("Cancel", "CancelFileEditButton", _this.cancelEdit);
                content += m64.render.centeredButtonBar(buttons);
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
    }(m64.DialogBase));
    m64.EditSystemFileDlg = EditSystemFileDlg;
})(m64 || (m64 = {}));
console.log("running module: MessageDlg.js");
(function (m64) {
    var MessageDlg = (function (_super) {
        __extends(MessageDlg, _super);
        function MessageDlg(message, title, callback) {
            var _this = _super.call(this, "MessageDlg") || this;
            _this.message = message;
            _this.title = title;
            _this.callback = callback;
            _this.build = function () {
                var content = _this.makeHeader(_this.title) + "<p>" + _this.message + "</p>";
                content += m64.render.centeredButtonBar(_this.makeCloseButton("Ok", "messageDlgOkButton", _this.callback));
                return content;
            };
            if (!title) {
                title = "Message";
            }
            _this.title = title;
            return _this;
        }
        return MessageDlg;
    }(m64.DialogBase));
    m64.MessageDlg = MessageDlg;
})(m64 || (m64 = {}));
console.log("running module: LoginDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
                var divider = "<div><h3>Or Login With...</h3></div>";
                var form = formControls + buttonBar;
                var mainContent = form;
                var content = header + mainContent;
                _this.bindEnterKey("userName", m64.user.login);
                _this.bindEnterKey("password", m64.user.login);
                return content;
            };
            _this.init = function () {
                _this.populateFromCookies();
            };
            _this.populateFromCookies = function () {
                var usr = $.cookie(m64.cnst.COOKIE_LOGIN_USR);
                var pwd = $.cookie(m64.cnst.COOKIE_LOGIN_PWD);
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
                m64.user.login(_this, usr, pwd);
            };
            _this.resetPassword = function () {
                var thiz = _this;
                var usr = _this.getInputVal("userName");
                (new m64.ConfirmDlg("Confirm Reset Password", "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.", "Yes, reset.", function () {
                    thiz.cancel();
                    (new m64.ResetPasswordDlg(usr)).open();
                })).open();
            };
            return _this;
        }
        return LoginDlg;
    }(m64.DialogBase));
    m64.LoginDlg = LoginDlg;
})(m64 || (m64 = {}));
console.log("running module: SignupDlg.js");
(function (m64) {
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
            _this.signup = function () {
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
            _this.signupResponse = function (res) {
                if (m64.util.checkSuccess("Signup new user", res)) {
                    _this.cancel();
                    (new m64.MessageDlg("User Information Accepted.<p/>Check your email for signup confirmation.", "Signup")).open();
                }
            };
            _this.tryAnotherCaptcha = function () {
                var n = m64.util.currentTimeMillis();
                var src = postTargetUrl + "captcha?t=" + n;
                $("#" + _this.id("captchaImage")).attr("src", src);
            };
            _this.pageInitSignupPg = function () {
                _this.tryAnotherCaptcha();
            };
            _this.init = function () {
                _this.pageInitSignupPg();
                m64.util.delayedFocus("#" + _this.id("signupUserName"));
            };
            return _this;
        }
        return SignupDlg;
    }(m64.DialogBase));
    m64.SignupDlg = SignupDlg;
})(m64 || (m64 = {}));
console.log("running module: PrefsDlg.js");
(function (m64) {
    var PrefsDlg = (function (_super) {
        __extends(PrefsDlg, _super);
        function PrefsDlg() {
            var _this = _super.call(this, "PrefsDlg") || this;
            _this.build = function () {
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
            _this.savePreferences = function () {
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
            _this.savePreferencesResponse = function (res) {
                if (m64.util.checkSuccess("Saving Preferences", res)) {
                    m64.meta64.selectTab("mainTabName");
                    m64.meta64.refresh();
                }
            };
            _this.init = function () {
                var polyElm = m64.util.polyElm(_this.id("simpleModeRadioGroup"));
                polyElm.node.select(m64.meta64.editModeOption == m64.meta64.MODE_SIMPLE ? _this.id("editModeSimple") : _this
                    .id("editModeAdvanced"));
                polyElm = m64.util.polyElm(_this.id("showMetaData"));
                polyElm.node.checked = m64.meta64.showMetaData;
                Polymer.dom.flush();
            };
            return _this;
        }
        return PrefsDlg;
    }(m64.DialogBase));
    m64.PrefsDlg = PrefsDlg;
})(m64 || (m64 = {}));
console.log("running module: ManageAccountDlg.js");
(function (m64) {
    var ManageAccountDlg = (function (_super) {
        __extends(ManageAccountDlg, _super);
        function ManageAccountDlg() {
            var _this = _super.call(this, "ManageAccountDlg") || this;
            _this.build = function () {
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
            return _this;
        }
        return ManageAccountDlg;
    }(m64.DialogBase));
    m64.ManageAccountDlg = ManageAccountDlg;
})(m64 || (m64 = {}));
console.log("running module: ExportDlg.js");
(function (m64) {
    var ExportDlg = (function (_super) {
        __extends(ExportDlg, _super);
        function ExportDlg() {
            var _this = _super.call(this, "ExportDlg") || this;
            _this.build = function () {
                var header = _this.makeHeader("Export to XML");
                var formControls = _this.makeEditField("Export to File Name", "exportTargetNodeName");
                var exportButton = _this.makeButton("Export", "exportNodesButton", _this.exportNodes, _this);
                var backButton = _this.makeCloseButton("Close", "cancelExportButton");
                var buttonBar = m64.render.centeredButtonBar(exportButton + backButton);
                return header + formControls + buttonBar;
            };
            _this.exportNodes = function () {
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
            _this.exportResponse = function (res) {
                if (m64.util.checkSuccess("Export", res)) {
                    (new m64.MessageDlg("Export Successful.")).open();
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            return _this;
        }
        return ExportDlg;
    }(m64.DialogBase));
    m64.ExportDlg = ExportDlg;
})(m64 || (m64 = {}));
console.log("running module: ImportDlg.js");
(function (m64) {
    var ImportDlg = (function (_super) {
        __extends(ImportDlg, _super);
        function ImportDlg() {
            var _this = _super.call(this, "ImportDlg") || this;
            _this.build = function () {
                var header = _this.makeHeader("Import from XML");
                var formControls = _this.makeEditField("File name to import", "sourceFileName");
                var importButton = _this.makeButton("Import", "importNodesButton", _this.importNodes, _this);
                var backButton = _this.makeCloseButton("Close", "cancelImportButton");
                var buttonBar = m64.render.centeredButtonBar(importButton + backButton);
                return header + formControls + buttonBar;
            };
            _this.importNodes = function () {
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
            _this.importResponse = function (res) {
                if (m64.util.checkSuccess("Import", res)) {
                    (new m64.MessageDlg("Import Successful.")).open();
                    m64.view.refreshTree(null, false);
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            return _this;
        }
        return ImportDlg;
    }(m64.DialogBase));
    m64.ImportDlg = ImportDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchContentDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            _this.searchNodes = function () {
                return _this.searchProperty(m64.jcrCnst.CONTENT);
            };
            _this.searchProperty = function (searchProp) {
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
            _this.init = function () {
                _this.focus("searchText");
            };
            return _this;
        }
        return SearchContentDlg;
    }(m64.DialogBase));
    m64.SearchContentDlg = SearchContentDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchTagsDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            _this.searchTags = function () {
                return _this.searchProperty(m64.jcrCnst.TAGS);
            };
            _this.searchProperty = function (searchProp) {
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
            _this.init = function () {
                m64.util.delayedFocus(_this.id("searchText"));
            };
            return _this;
        }
        return SearchTagsDlg;
    }(m64.DialogBase));
    m64.SearchTagsDlg = SearchTagsDlg;
})(m64 || (m64 = {}));
console.log("running module: SearchFilesDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(searchButton + backButton);
                var content = header + instructions + formControls + buttonBar;
                _this.bindEnterKey("searchText", m64.srch.searchNodes);
                return content;
            };
            _this.searchTags = function () {
                return _this.searchProperty(m64.jcrCnst.TAGS);
            };
            _this.searchProperty = function (searchProp) {
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
            _this.init = function () {
                m64.util.delayedFocus(_this.id("searchText"));
            };
            return _this;
        }
        return SearchFilesDlg;
    }(m64.DialogBase));
    m64.SearchFilesDlg = SearchFilesDlg;
})(m64 || (m64 = {}));
console.log("running module: ChangePasswordDlg.js");
(function (m64) {
    var ChangePasswordDlg = (function (_super) {
        __extends(ChangePasswordDlg, _super);
        function ChangePasswordDlg(passCode) {
            var _this = _super.call(this, "ChangePasswordDlg") || this;
            _this.passCode = passCode;
            _this.build = function () {
                var header = _this.makeHeader(_this.passCode ? "Password Reset" : "Change Password");
                var message = m64.render.tag("p", {}, "Enter your new password below...");
                var formControls = _this.makePasswordField("New Password", "changePassword1");
                var changePasswordButton = _this.makeCloseButton("Change Password", "changePasswordActionButton", _this.changePassword, _this);
                var backButton = _this.makeCloseButton("Close", "cancelChangePasswordButton");
                var buttonBar = m64.render.centeredButtonBar(changePasswordButton + backButton);
                return header + message + formControls + buttonBar;
            };
            _this.changePassword = function () {
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
            _this.changePasswordResponse = function (res) {
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
            _this.init = function () {
                _this.focus("changePassword1");
            };
            return _this;
        }
        return ChangePasswordDlg;
    }(m64.DialogBase));
    m64.ChangePasswordDlg = ChangePasswordDlg;
})(m64 || (m64 = {}));
console.log("running module: ResetPasswordDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(resetPasswordButton + backButton);
                return header + message + formControls + buttonBar;
            };
            _this.resetPassword = function () {
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
            _this.resetPasswordResponse = function (res) {
                if (m64.util.checkSuccess("Reset password", res)) {
                    (new m64.MessageDlg("Password reset email was sent. Check your inbox.")).open();
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
    }(m64.DialogBase));
    m64.ResetPasswordDlg = ResetPasswordDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromFileDlg.js");
(function (m64) {
    var UploadFromFileDlg = (function (_super) {
        __extends(UploadFromFileDlg, _super);
        function UploadFromFileDlg() {
            var _this = _super.call(this, "UploadFromFileDlg") || this;
            _this.build = function () {
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
            _this.init = function () {
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
            };
            return _this;
        }
        return UploadFromFileDlg;
    }(m64.DialogBase));
    m64.UploadFromFileDlg = UploadFromFileDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromFileDropzoneDlg.js");
(function (m64) {
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
            _this.updateFileList = function (dropzoneEvt) {
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
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
                _this.configureDropZone();
            };
            return _this;
        }
        return UploadFromFileDropzoneDlg;
    }(m64.DialogBase));
    m64.UploadFromFileDropzoneDlg = UploadFromFileDropzoneDlg;
})(m64 || (m64 = {}));
console.log("running module: UploadFromUrlDlg.js");
(function (m64) {
    var UploadFromUrlDlg = (function (_super) {
        __extends(UploadFromUrlDlg, _super);
        function UploadFromUrlDlg() {
            var _this = _super.call(this, "UploadFromUrlDlg") || this;
            _this.build = function () {
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
            _this.uploadFileNow = function () {
                var sourceUrl = _this.getInputVal("uploadFromUrl");
                if (sourceUrl) {
                    m64.util.json("uploadFromUrl", {
                        "nodeId": m64.attachment.uploadNode.id,
                        "sourceUrl": sourceUrl
                    }, _this.uploadFromUrlResponse, _this);
                }
            };
            _this.uploadFromUrlResponse = function (res) {
                if (m64.util.checkSuccess("Upload from URL", res)) {
                    m64.meta64.refresh();
                }
            };
            _this.init = function () {
                m64.util.setInputVal(_this.id("uploadFromUrl"), "");
                $("#" + _this.id("uploadPathDisplay")).html("Path: " + m64.render.formatPath(m64.attachment.uploadNode));
            };
            return _this;
        }
        return UploadFromUrlDlg;
    }(m64.DialogBase));
    m64.UploadFromUrlDlg = UploadFromUrlDlg;
})(m64 || (m64 = {}));
console.log("running module: EditNodeDlg.js");
(function (m64) {
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
            _this.populateEditNodePg = function () {
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
                        editor.setValue(m64.util.unencodeHtml(aceFields[i].val));
                        m64.meta64.aceEditorsById[aceFields[i].id] = editor;
                    }
                }
                var instr = m64.edit.editingUnsavedNode ?
                    "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                    :
                        "";
                _this.el("editNodeInstructions").html(instr);
                m64.util.setVisibility("#" + _this.id("addPropertyButton"), !m64.edit.editingUnsavedNode);
                var tagsPropExists = m64.props.getNodePropertyVal("tags", m64.edit.editNode) != null;
                m64.util.setVisibility("#" + _this.id("addTagsPropertyButton"), !tagsPropExists);
            };
            _this.toggleShowReadOnly = function () {
            };
            _this.addProperty = function () {
                _this.editPropertyDlgInst = new m64.EditPropertyDlg(_this);
                _this.editPropertyDlgInst.open();
            };
            _this.addTagsProperty = function () {
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
            _this.addTagsPropertyResponse = function (res) {
                if (m64.util.checkSuccess("Add Tags Property", res)) {
                    _this.savePropertyResponse(res);
                }
            };
            _this.savePropertyResponse = function (res) {
                m64.util.checkSuccess("Save properties", res);
                m64.edit.editNode.properties.push(res.propertySaved);
                m64.meta64.treeDirty = true;
                _this.populateEditNodePg();
            };
            _this.addSubProperty = function (fieldId) {
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
            _this.deleteProperty = function (propName) {
                var thiz = _this;
                (new m64.ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function () {
                    thiz.deletePropertyImmediate(propName);
                })).open();
            };
            _this.deletePropertyImmediate = function (propName) {
                var thiz = _this;
                m64.util.json("deleteProperty", {
                    "nodeId": m64.edit.editNode.id,
                    "propName": propName
                }, function (res) {
                    thiz.deletePropertyResponse(res, propName);
                });
            };
            _this.deletePropertyResponse = function (res, propertyToDelete) {
                if (m64.util.checkSuccess("Delete property", res)) {
                    m64.props.deletePropertyFromLocalData(propertyToDelete);
                    m64.meta64.treeDirty = true;
                    _this.populateEditNodePg();
                }
            };
            _this.clearProperty = function (fieldId) {
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
            _this.saveNode = function () {
                if (m64.edit.editingUnsavedNode) {
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
                    propValStr = m64.util.escapeForAttrib(propVal);
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
            _this.makeSinglePropEditor = function (propEntry, aceFields) {
                console.log("Property single-type: " + propEntry.property.name);
                var field = "";
                var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
                var label = m64.render.sanitizePropertyName(propEntry.property.name);
                var propValStr = propVal ? propVal : '';
                propValStr = m64.util.escapeForAttrib(propValStr);
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
            _this.deletePropertyButtonClick = function () {
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
            _this.splitContent = function () {
                var nodeBelow = m64.edit.getNodeBelow(m64.edit.editNode);
                m64.util.json("splitNode", {
                    "nodeId": m64.edit.editNode.id,
                    "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
                    "delimiter": null
                }, _this.splitContentResponse);
            };
            _this.splitContentResponse = function (res) {
                if (m64.util.checkSuccess("Split content", res)) {
                    _this.cancel();
                    m64.view.refreshTree(null, false);
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            _this.cancelEdit = function () {
                _this.cancel();
                if (m64.meta64.treeDirty) {
                    m64.meta64.goToMainPage(true);
                }
                else {
                    m64.meta64.selectTab("mainTabName");
                    m64.view.scrollToSelectedNode();
                }
            };
            _this.init = function () {
                console.log("EditNodeDlg.init");
                _this.populateEditNodePg();
                if (_this.contentFieldDomId) {
                    m64.util.delayedFocus("#" + _this.contentFieldDomId);
                }
            };
            _this.fieldIdToPropMap = {};
            _this.propEntries = new Array();
            return _this;
        }
        return EditNodeDlg;
    }(m64.DialogBase));
    m64.EditNodeDlg = EditNodeDlg;
})(m64 || (m64 = {}));
console.log("running module: EditPropertyDlg.js");
(function (m64) {
    var EditPropertyDlg = (function (_super) {
        __extends(EditPropertyDlg, _super);
        function EditPropertyDlg(editNodeDlg) {
            var _this = _super.call(this, "EditPropertyDlg") || this;
            _this.editNodeDlg = editNodeDlg;
            _this.build = function () {
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
            _this.populatePropertyEdit = function () {
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
            _this.saveProperty = function () {
                var propertyNameData = m64.util.getInputVal(_this.id("addPropertyNameTextContent"));
                var propertyValueData = m64.util.getInputVal(_this.id("addPropertyValueTextContent"));
                var postData = {
                    nodeId: m64.edit.editNode.id,
                    propertyName: propertyNameData,
                    propertyValue: propertyValueData
                };
                m64.util.json("saveProperty", postData, _this.savePropertyResponse, _this);
            };
            _this.savePropertyResponse = function (res) {
                m64.util.checkSuccess("Save properties", res);
                m64.edit.editNode.properties.push(res.propertySaved);
                m64.meta64.treeDirty = true;
                _this.editNodeDlg.populateEditNodePg();
            };
            _this.init = function () {
                _this.populatePropertyEdit();
            };
            return _this;
        }
        return EditPropertyDlg;
    }(m64.DialogBase));
    m64.EditPropertyDlg = EditPropertyDlg;
})(m64 || (m64 = {}));
console.log("running module: ShareToPersonDlg.js");
(function (m64) {
    var ShareToPersonDlg = (function (_super) {
        __extends(ShareToPersonDlg, _super);
        function ShareToPersonDlg() {
            var _this = _super.call(this, "ShareToPersonDlg") || this;
            _this.build = function () {
                var header = _this.makeHeader("Share Node to Person");
                var formControls = _this.makeEditField("User to Share With", "shareToUserName");
                var shareButton = _this.makeCloseButton("Share", "shareNodeToPersonButton", _this.shareNodeToPerson, _this);
                var backButton = _this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
                var buttonBar = m64.render.centeredButtonBar(shareButton + backButton);
                return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                    + buttonBar;
            };
            _this.shareNodeToPerson = function () {
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
            _this.reloadFromShareWithPerson = function (res) {
                if (m64.util.checkSuccess("Share Node with Person", res)) {
                    (new m64.SharingDlg()).open();
                }
            };
            return _this;
        }
        return ShareToPersonDlg;
    }(m64.DialogBase));
    m64.ShareToPersonDlg = ShareToPersonDlg;
})(m64 || (m64 = {}));
console.log("running module: SharingDlg.js");
(function (m64) {
    var SharingDlg = (function (_super) {
        __extends(SharingDlg, _super);
        function SharingDlg() {
            var _this = _super.call(this, "SharingDlg") || this;
            _this.build = function () {
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
            _this.init = function () {
                _this.reload();
            };
            _this.reload = function () {
                console.log("Loading node sharing info.");
                m64.util.json("getNodePrivileges", {
                    "nodeId": m64.share.sharingNode.id,
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
            _this.publicCommentingChanged = function () {
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
            _this.removePrivilege = function (principal, privilege) {
                m64.meta64.treeDirty = true;
                m64.util.json("removePrivilege", {
                    "nodeId": m64.share.sharingNode.id,
                    "principal": principal,
                    "privilege": privilege
                }, _this.removePrivilegeResponse, _this);
            };
            _this.removePrivilegeResponse = function (res) {
                m64.util.json("getNodePrivileges", {
                    "nodeId": m64.share.sharingNode.path,
                    "includeAcl": true,
                    "includeOwners": true
                }, _this.getNodePrivilegesResponse, _this);
            };
            _this.renderAclPrivileges = function (principal, aclEntry) {
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
            _this.shareNodeToPersonPg = function () {
                (new m64.ShareToPersonDlg()).open();
            };
            _this.shareNodeToPublic = function () {
                console.log("Sharing node to public.");
                m64.meta64.treeDirty = true;
                m64.util.json("addPrivilege", {
                    "nodeId": m64.share.sharingNode.id,
                    "principal": "everyone",
                    "privileges": ["read"],
                    "publicAppend": false
                }, _this.reload, _this);
            };
            return _this;
        }
        return SharingDlg;
    }(m64.DialogBase));
    m64.SharingDlg = SharingDlg;
})(m64 || (m64 = {}));
console.log("running module: RenameNodeDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(renameNodeButton + backButton);
                return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
            };
            _this.renameNode = function () {
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
            _this.renameNodeResponse = function (res, renamingPageRoot) {
                if (m64.util.checkSuccess("Rename node", res)) {
                    if (renamingPageRoot) {
                        m64.view.refreshTree(res.newId, true);
                    }
                    else {
                        m64.view.refreshTree(null, false, res.newId);
                    }
                }
            };
            _this.init = function () {
                var highlightNode = m64.meta64.getHighlightedNode();
                if (!highlightNode) {
                    return;
                }
                $("#" + _this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
                $("#" + _this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
            };
            return _this;
        }
        return RenameNodeDlg;
    }(m64.DialogBase));
    m64.RenameNodeDlg = RenameNodeDlg;
})(m64 || (m64 = {}));
console.log("running module: AudioPlayerDlg.js");
(function (m64) {
    var AudioPlayerDlg = (function (_super) {
        __extends(AudioPlayerDlg, _super);
        function AudioPlayerDlg(sourceUrl, nodeUid, startTimePending) {
            var _this = _super.call(this, "AudioPlayerDlg") || this;
            _this.sourceUrl = sourceUrl;
            _this.nodeUid = nodeUid;
            _this.startTimePending = startTimePending;
            _this.build = function () {
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
            _this.closeEvent = function () {
                m64.podcast.destroyPlayer(null);
            };
            _this.closeBtn = function () {
                m64.podcast.destroyPlayer(_this);
            };
            _this.init = function () {
            };
            console.log("startTimePending in constructor: " + startTimePending);
            m64.podcast.startTimePending = startTimePending;
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
    }(m64.DialogBase));
    m64.AudioPlayerDlg = AudioPlayerDlg;
})(m64 || (m64 = {}));
console.log("running module: CreateNodeDlg.js");
(function (m64) {
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
                var buttonBar = m64.render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);
                var content = "";
                var typeIdx = 0;
                content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
                content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
                content += _this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);
                var listBox = m64.render.tag("div", {
                    "class": "listBox"
                }, content);
                var mainContent = listBox;
                var centeredHeader = m64.render.tag("div", {
                    "class": "centeredTitle"
                }, header);
                return centeredHeader + mainContent + buttonBar;
            };
            _this.createFirstChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.createSubNode(null, _this.lastSelTypeName, true);
            };
            _this.createLastChild = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.createSubNode(null, _this.lastSelTypeName, false);
            };
            _this.createInline = function () {
                if (!_this.lastSelTypeName) {
                    alert("choose a type.");
                    return;
                }
                m64.edit.insertNode(null, _this.lastSelTypeName);
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
                var node = m64.meta64.getHighlightedNode();
                if (node) {
                    var canInsertInline = m64.meta64.homeNodeId != node.id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YTY0LWFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21lZ2EtbWV0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQW1hQSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFLOUIsSUFBSSxRQUFRLEdBQUcsVUFBUyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7SUFDMUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDO1FBQ2pELE1BQU0sQ0FBQztJQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDbkMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU1GO0FBRUEsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBWXpDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsVUFBUyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUMsQ0FBQztBQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQU12QyxJQUFVLEdBQUcsQ0E0Qlo7QUE1QkQsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsSUFBSSxDQTBCcEI7SUExQkQsV0FBaUIsSUFBSTtRQUVOLFNBQUksR0FBVyxXQUFXLENBQUM7UUFDM0IscUJBQWdCLEdBQVcsWUFBWSxHQUFHLFVBQVUsQ0FBQztRQUNyRCxxQkFBZ0IsR0FBVyxZQUFZLEdBQUcsVUFBVSxDQUFDO1FBSXJELHVCQUFrQixHQUFXLFlBQVksR0FBRyxZQUFZLENBQUM7UUFFekQsc0JBQWlCLEdBQVcsdUJBQXVCLENBQUM7UUFDcEQsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFDaEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFDaEMsMkJBQXNCLEdBQVksSUFBSSxDQUFDO1FBTXZDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBR2hDLHNCQUFpQixHQUFZLElBQUksQ0FBQztRQUNsQyxzQkFBaUIsR0FBWSxJQUFJLENBQUM7UUFFbEMsZ0NBQTJCLEdBQVksS0FBSyxDQUFDO0lBQzVELENBQUMsRUExQmdCLElBQUksR0FBSixRQUFJLEtBQUosUUFBSSxRQTBCcEI7QUFDTCxDQUFDLEVBNUJTLEdBQUcsS0FBSCxHQUFHLFFBNEJaO0FBRUQsV0FBVSxHQUFHO0lBSVQ7UUFDSSxtQkFBbUIsU0FBaUIsRUFDekIsT0FBZTtZQURQLGNBQVMsR0FBVCxTQUFTLENBQVE7WUFDekIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUMxQixDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQUpZLGFBQVMsWUFJckIsQ0FBQTtJQUVEO1FBQ0ksbUJBQW1CLEVBQVUsRUFDbEIsUUFBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQWlCLEVBQ2pCLE1BQWUsRUFDZixRQUFtQjtZQUxYLE9BQUUsR0FBRixFQUFFLENBQVE7WUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBbUI7WUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBUztZQUNkLGFBQVEsR0FBUixRQUFRLENBQVM7WUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUztZQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDOUIsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0FBQyxBQVJELElBUUM7SUFSWSxhQUFTLFlBUXJCLENBQUE7SUFFRDtRQUNJLGlCQUFtQixFQUFVLEVBQ2xCLEdBQVc7WUFESCxPQUFFLEdBQUYsRUFBRSxDQUFRO1lBQ2xCLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDdEIsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQUpZLFdBQU8sVUFJbkIsQ0FBQTtBQUNMLENBQUMsRUF6QlMsR0FBRyxLQUFILEdBQUcsUUF5Qlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFNdkMsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsSUFBSSxDQTZyQnBCO0lBN3JCRCxXQUFpQixJQUFJO1FBRU4sWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6Qix3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFDckMsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixZQUFPLEdBQVEsSUFBSSxDQUFDO1FBRTFCLGlCQUFZLEdBQUcsVUFBUyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQTtRQUVVLG9CQUFlLEdBQUcsVUFBUyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFBO1FBRVcsaUJBQVksR0FBRyxVQUFTLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUVuQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDTixHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFekMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztZQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQTtRQUVVLGFBQVEsR0FBRyxVQUFTLENBQUMsRUFBRSxHQUFHO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVhLGVBQVUsR0FBRyxVQUFTLENBQUMsRUFBQyxHQUFHO1lBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFUSxzQkFBaUIsR0FBRyxVQUFTLENBQUMsRUFBQyxHQUFHO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFYSxlQUFVLEdBQUcsVUFBUyxDQUFRO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUVTLDJCQUFzQixHQUFHLFVBQVMsQ0FBUSxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ3BFLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUM7UUFLUyxrQkFBYSxHQUFHLFVBQVMsQ0FBUSxFQUFFLFNBQVMsRUFBRSxPQUFPO1lBQzVELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQUVTLHNCQUFpQixHQUFHLFVBQVMsQ0FBTTtZQUMxQyxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUE7UUFFVSxRQUFHLEdBQUcsVUFBUyxDQUFNO1lBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxLQUFBLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUcsVUFBUyxDQUFRLEVBQUUsR0FBRztZQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQU9VLGtCQUFhLEdBQUcsVUFBUyxPQUFPO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQzdELENBQUM7UUFDTCxDQUFDLENBQUE7UUFNRCxJQUFJLFlBQVksR0FBVyxDQUFDLENBQUM7UUFFbEIsd0JBQW1CLEdBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFFckUsV0FBTSxHQUFHLFVBQVMsR0FBRztZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQU1VLHVCQUFrQixHQUFHLFVBQVMsSUFBVSxFQUFFLEdBQVM7WUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ0wsR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFBO1FBT1UsWUFBTyxHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUs7WUFDdkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRVUsd0JBQW1CLEdBQUc7WUFDN0IsV0FBVyxDQUFDLEtBQUEsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUc7WUFDMUIsSUFBSSxTQUFTLEdBQUcsS0FBQSxhQUFhLEVBQUUsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEtBQUEsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsS0FBQSxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFBLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsS0FBQSxPQUFPLEdBQUcsSUFBSSxJQUFBLFdBQVcsRUFBRSxDQUFDO3dCQUM1QixLQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbkIsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEtBQUEsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsS0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLEtBQUEsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqQixLQUFBLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsU0FBSSxHQUFHLFVBQXFDLFFBQWEsRUFBRSxRQUFxQixFQUN2RixRQUF5RCxFQUFFLFlBQWtCLEVBQUUsZUFBcUI7WUFFcEcsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsUUFBUSxHQUFHLDZFQUE2RSxDQUFDLENBQUM7WUFDM0ksQ0FBQztZQUVELElBQUksUUFBUSxDQUFDO1lBQ2IsSUFBSSxXQUFXLENBQUM7WUFFaEIsSUFBSSxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyxDQUFDO29CQUN0RCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxLQUFBLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDakYsQ0FBQztnQkFNRCxRQUFRLEdBQUcsS0FBQSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRW5DLFFBQVEsQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztnQkFDeEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUM7Z0JBSzFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQU0zQixRQUFRLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUdsQyxZQUFZLEVBQUUsQ0FBQztnQkFDZixXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdDLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsMkJBQTJCLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFtQkQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBR3RCO2dCQUNJLElBQUksQ0FBQztvQkFDRCxZQUFZLEVBQUUsQ0FBQztvQkFDZixLQUFBLGdCQUFnQixFQUFFLENBQUM7b0JBRW5CLEVBQUUsQ0FBQyxDQUFDLEtBQUEsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLFFBQVEsR0FBRywwQkFBMEI7OEJBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELENBQUM7b0JBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFNaEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzs0QkFDbEIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQ0FDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBZ0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzs0QkFDckYsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixRQUFRLENBQWUsV0FBVyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQzs0QkFDbEUsQ0FBQzt3QkFDTCxDQUFDO3dCQUtELElBQUksQ0FBQyxDQUFDOzRCQUNGLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0NBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQWdCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDcEUsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixRQUFRLENBQWUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUNqRCxDQUFDO3dCQUNMLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ1YsS0FBQSxhQUFhLENBQUMsNkJBQTZCLEdBQUcsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDO1lBRUwsQ0FBQyxFQUVEO2dCQUNJLElBQUksQ0FBQztvQkFDRCxZQUFZLEVBQUUsQ0FBQztvQkFDZixLQUFBLGdCQUFnQixFQUFFLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztvQkFFbEMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7d0JBQy9DLEtBQUEsT0FBTyxHQUFHLElBQUksQ0FBQzt3QkFFZixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUEsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixLQUFBLG1CQUFtQixHQUFHLElBQUksQ0FBQzs0QkFDM0IsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDckUsQ0FBQzt3QkFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDOUMsTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBRUQsSUFBSSxHQUFHLEdBQVcsNEJBQTRCLENBQUM7b0JBRy9DLElBQUksQ0FBQzt3QkFDRCxHQUFHLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3dCQUNsRCxHQUFHLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNoRCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsQ0FBQztvQkFhRCxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDakMsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNWLEtBQUEsYUFBYSxDQUFDLHlDQUF5QyxHQUFHLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRVAsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSxnQkFBVyxHQUFHLFVBQVMsT0FBZTtZQUM3QyxJQUFJLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztZQUNyQyxJQUFJLENBQUM7Z0JBQ0QsS0FBSyxHQUFTLElBQUksS0FBSyxFQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLE9BQU8sQ0FBQztRQUNsQixDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHLFVBQVMsT0FBZSxFQUFFLFNBQWM7WUFDL0QsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLENBQUM7WUFDckMsSUFBSSxDQUFDO2dCQUNELEtBQUssR0FBUyxJQUFJLEtBQUssRUFBRyxDQUFDLEtBQUssQ0FBQztZQUNyQyxDQUFDO1lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxTQUFTLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUsY0FBUyxHQUFHLFVBQVMsV0FBVztZQUN2QyxFQUFFLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxXQUFXLEdBQUcsK0JBQStCLENBQUMsQ0FBQztnQkFDbkYsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQTtRQUdVLGlCQUFZLEdBQUcsVUFBUyxFQUFFO1lBRWpDLFVBQVUsQ0FBQztnQkFDUCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBR1IsVUFBVSxDQUFDO2dCQUVQLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFTVSxpQkFBWSxHQUFHLFVBQVMsY0FBYyxFQUFFLEdBQUc7WUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN4RSxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQyxDQUFBO1FBR1UsV0FBTSxHQUFHLFVBQVMsR0FBRyxFQUFFLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQUc7WUFDakMsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsQ0FBQztRQUM3QyxDQUFDLENBQUE7UUFNVSxnQkFBVyxHQUFHLFVBQVMsR0FBOEIsRUFBRSxFQUFFO1lBRWhFLElBQUksR0FBRyxHQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUcxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxHQUFHLEVBQUUsR0FBRyxJQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNsQixDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUcsVUFBUyxFQUFFO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFFRCxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQUdVLHVCQUFrQixHQUFHLFVBQVMsRUFBRTtZQUN2QyxJQUFJLEVBQUUsR0FBZ0IsS0FBQSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFvQixFQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQUtVLFdBQU0sR0FBRyxVQUFTLEVBQUU7WUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEUsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFVSxTQUFJLEdBQUcsVUFBUyxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxLQUFBLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDNUIsQ0FBQyxDQUFBO1FBS1UsWUFBTyxHQUFHLFVBQVMsRUFBVTtZQUVwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBQ0QsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN0RSxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEVBQVU7WUFDeEMsSUFBSSxDQUFDLEdBQUcsS0FBQSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQyxDQUFBO1FBS1UsdUJBQWtCLEdBQUcsVUFBUyxFQUFVO1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMscURBQXFELEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUUsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDLENBQUE7UUFFVSxhQUFRLEdBQUcsVUFBUyxHQUFRO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRVUsc0JBQWlCLEdBQUc7WUFDM0IsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQVc7WUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtRQUVVLGdCQUFXLEdBQUcsVUFBUyxFQUFVO1lBQ3hDLE1BQU0sQ0FBQyxLQUFBLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUdVLGdCQUFXLEdBQUcsVUFBUyxFQUFVLEVBQUUsR0FBVztZQUNyRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDZCxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsQ0FBQztZQUNELElBQUksR0FBRyxHQUFHLEtBQUEsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSxpQkFBWSxHQUFHLFVBQVMsRUFBVSxFQUFFLElBQVM7WUFDcEQsS0FBQSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUE7UUFFVSxZQUFPLEdBQUcsVUFBUyxFQUFVLEVBQUUsSUFBUyxFQUFFLE9BQVk7WUFDN0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFTLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxFQUFFLENBQUM7b0JBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFPVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQVcsRUFBRSxRQUFnQixFQUFFLFFBQWdCO1lBQ2xGLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUE7UUFLVSxlQUFVLEdBQUcsVUFBUyxHQUFRLEVBQUUsSUFBUyxFQUFFLEdBQVc7WUFDN0QsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRVUsWUFBTyxHQUFHLFVBQVMsRUFBVSxFQUFFLE9BQWU7WUFDckQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDakIsQ0FBQztZQUVELElBQUksR0FBRyxHQUFHLEtBQUEsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFLL0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFFNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUcsVUFBUyxHQUFXO1lBQzlDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksSUFBSSxDQUFDO1lBRVQsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEtBQUssRUFBRSxDQUFDO2dCQUNaLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUE7UUFLVSxnQkFBVyxHQUFHLFVBQVMsR0FBVztZQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFBO1lBQ3BCLElBQUksQ0FBQztnQkFDRCxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ3ZDLEtBQUssRUFBRSxDQUFDO29CQUNaLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFTLENBQUMsRUFBRSxDQUFDO29CQUNyQixHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFHVSxjQUFTLEdBQUcsVUFBUyxHQUFXO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFFbEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUNmLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixHQUFHLElBQUksR0FBRyxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQU9VLGtCQUFhLEdBQUcsVUFBUyxLQUFhLEVBQUUsTUFBZTtZQUU5RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixHQUFHLEdBQUcsS0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDaEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBRVYsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVKLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFPVSxrQkFBYSxHQUFHLFVBQVMsS0FBYSxFQUFFLEdBQVk7WUFFM0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ2YsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsR0FBRyxHQUFHLEtBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFHTixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUdKLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTVUsZ0JBQVcsR0FBRyxVQUFhLE9BQWUsRUFBRSxJQUFZO1lBQUUsY0FBYztpQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkLDZCQUFjOztZQUMvRSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RCxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFJLFFBQVEsQ0FBQztRQUN2QixDQUFDLENBQUE7SUFDTCxDQUFDLEVBN3JCZ0IsSUFBSSxHQUFKLFFBQUksS0FBSixRQUFJLFFBNnJCcEI7QUFDTCxDQUFDLEVBL3JCUyxHQUFHLEtBQUgsR0FBRyxRQStyQlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFFMUMsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsT0FBTyxDQW1DdkI7SUFuQ0QsV0FBaUIsT0FBTztRQUVULGtCQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ2pDLHFCQUFhLEdBQVcsY0FBYyxDQUFDO1FBQ3ZDLG9CQUFZLEdBQVcsaUJBQWlCLENBQUM7UUFDekMsY0FBTSxHQUFXLFlBQVksQ0FBQztRQUU5QixtQkFBVyxHQUFXLGdCQUFnQixDQUFDO1FBRXZDLHFCQUFhLEdBQVcsYUFBYSxDQUFDO1FBQ3RDLG1CQUFXLEdBQVcsT0FBTyxDQUFDO1FBQzlCLHFCQUFhLEdBQVcsU0FBUyxDQUFDO1FBRWxDLGVBQU8sR0FBVyxhQUFhLENBQUM7UUFDaEMsa0JBQVUsR0FBVyxlQUFlLENBQUM7UUFDckMsZUFBTyxHQUFXLGFBQWEsQ0FBQztRQUNoQyxZQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFlBQUksR0FBVyxVQUFVLENBQUM7UUFDMUIscUJBQWEsR0FBVyxrQkFBa0IsQ0FBQztRQUMzQyx3QkFBZ0IsR0FBVyxvQkFBb0IsQ0FBQztRQUNoRCwrQkFBdUIsR0FBVyxhQUFhLENBQUM7UUFFaEQsc0JBQWMsR0FBVyxlQUFlLENBQUM7UUFFekMsWUFBSSxHQUFXLE1BQU0sQ0FBQztRQUN0QixXQUFHLEdBQVcsS0FBSyxDQUFDO1FBQ3BCLGFBQUssR0FBVyxPQUFPLENBQUM7UUFDeEIsWUFBSSxHQUFXLE1BQU0sQ0FBQztRQUV0QixlQUFPLEdBQVcsUUFBUSxDQUFDO1FBQzNCLGdCQUFRLEdBQVcsU0FBUyxDQUFDO1FBQzdCLGdCQUFRLEdBQVcsY0FBYyxDQUFDO1FBRWxDLGlCQUFTLEdBQVcsVUFBVSxDQUFDO1FBQy9CLGtCQUFVLEdBQVcsV0FBVyxDQUFDO0lBQ2hELENBQUMsRUFuQ2dCLE9BQU8sR0FBUCxXQUFPLEtBQVAsV0FBTyxRQW1DdkI7QUFDTCxDQUFDLEVBckNTLEdBQUcsS0FBSCxHQUFHLFFBcUNaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRTdDLFdBQVUsR0FBRztJQUNULElBQWlCLFVBQVUsQ0F3RDFCO0lBeERELFdBQWlCLFVBQVU7UUFFWixxQkFBVSxHQUFRLElBQUksQ0FBQztRQUV2QixnQ0FBcUIsR0FBRztZQUMvQixJQUFJLElBQUksR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFdBQUEsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELFdBQUEsVUFBVSxHQUFHLElBQUksQ0FBQztZQUNsQixDQUFDLElBQUksSUFBQSx5QkFBeUIsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFPN0MsQ0FBQyxDQUFBO1FBRVUsK0JBQW9CLEdBQUc7WUFDOUIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFdBQUEsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEQsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELFdBQUEsVUFBVSxHQUFHLElBQUksQ0FBQztZQUNsQixDQUFDLElBQUksSUFBQSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBRVUsMkJBQWdCLEdBQUc7WUFDMUIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsMkJBQTJCLEVBQUUsb0NBQW9DLEVBQUUsY0FBYyxFQUM3RjtvQkFDSSxJQUFBLElBQUksQ0FBQyxJQUFJLENBQThELGtCQUFrQixFQUFFO3dCQUN2RixRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7cUJBQ3BCLEVBQUUsV0FBQSx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxtQ0FBd0IsR0FBRyxVQUFTLEdBQWtDLEVBQUUsR0FBUTtZQUN2RixFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFOUIsSUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDLEVBeERnQixVQUFVLEdBQVYsY0FBVSxLQUFWLGNBQVUsUUF3RDFCO0FBQ0wsQ0FBQyxFQTFEUyxHQUFHLEtBQUgsR0FBRyxRQTBEWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUV2QyxXQUFVLEdBQUc7SUFDVCxJQUFpQixJQUFJLENBMGZwQjtJQTFmRCxXQUFpQixJQUFJO1FBRU4sZUFBVSxHQUFHO1lBQ3BCLENBQUMsSUFBSSxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUE7UUFFRCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsR0FBNEI7WUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRTNDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QixJQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEMsSUFBQSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUE7UUFFRCxJQUFJLG1CQUFtQixHQUFHLFVBQVMsR0FBNkIsRUFBRSxPQUFlO1lBQzdFLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUM1QixJQUFJLFdBQVcsR0FBVyxJQUFJLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzNDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YsV0FBVyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQzdCLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsSUFBSSxvQkFBb0IsR0FBRyxVQUFTLEdBQThCO1lBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLElBQUksR0FBa0IsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsSUFBSSxLQUFLLEdBQVksSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO29CQUN2RCxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFHbEMsSUFBSSxjQUFjLEdBQVksSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsY0FBYyxHQUFHLENBQUMsSUFBQSxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFBLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7MkJBQzlFLENBQUMsSUFBQSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBS2pCLEtBQUEsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7b0JBQ3hCLEtBQUEsZUFBZSxHQUFHLElBQUksSUFBQSxXQUFXLEVBQUUsQ0FBQztvQkFDcEMsS0FBQSxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekUsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxJQUFJLGlCQUFpQixHQUFHLFVBQVMsR0FBMkI7WUFDeEQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLEtBQUEsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDbkIsS0FBQSxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUNwQixJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFRCxJQUFJLHVCQUF1QixHQUFHLFVBQVMsR0FBaUM7WUFDcEUsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBQSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLDJCQUFzQixHQUFZLElBQUksQ0FBQztRQUl2QyxnQkFBVyxHQUFRLElBQUksQ0FBQztRQUt4QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUU1QixvQkFBZSxHQUFrQixJQUFJLENBQUM7UUFLdEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBS3BDLGdDQUEyQixHQUFZLEtBQUssQ0FBQztRQVE3QyxhQUFRLEdBQWtCLElBQUksQ0FBQztRQUcvQixvQkFBZSxHQUFnQixJQUFJLENBQUM7UUFVcEMscUJBQWdCLEdBQVEsSUFBSSxDQUFDO1FBRzdCLGtCQUFhLEdBQUcsVUFBUyxJQUFTO1lBQ3pDLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRztnQkFJdEQsQ0FBQyxDQUFDLElBQUEsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO21CQUNuRSxDQUFDLElBQUEsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUE7UUFHVSxvQkFBZSxHQUFHLFVBQVMsSUFBUztZQUMzQyxNQUFNLENBQUMsSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBQSxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUMxRSxDQUFDLENBQUE7UUFFVSx3QkFBbUIsR0FBRyxVQUFTLFFBQWlCLEVBQUUsV0FBcUI7WUFDOUUsS0FBQSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDM0IsS0FBQSxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLEtBQUEsZUFBZSxHQUFHLElBQUksSUFBQSxXQUFXLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELEtBQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFjVSxnQ0FBMkIsR0FBRztZQUNyQyxLQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMxQixLQUFBLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsS0FBQSxlQUFlLEdBQUcsSUFBSSxJQUFBLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLEtBQUEsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVVLHVCQUFrQixHQUFHLFVBQVMsR0FBNEI7WUFDakUsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsS0FBQSxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsMEJBQXFCLEdBQUcsVUFBUyxHQUErQjtZQUN2RSxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkMsS0FBQSxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUcsVUFBUyxHQUEwQixFQUFFLE9BQVk7WUFDM0UsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBTXRDLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0MsSUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxhQUFRLEdBQUcsVUFBUyxPQUFpQjtZQUM1QyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM5QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDckYsQ0FBQztZQUdELElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFNNUIsSUFBQSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUU1QixJQUFBLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2pDLENBQUMsQ0FBQTtRQUVVLGVBQVUsR0FBRyxVQUFTLEdBQVk7WUFFekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksT0FBTyxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN6RCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN0QixDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7b0JBQ3BGLGNBQWMsRUFBRSxJQUFBLE1BQU0sQ0FBQyxhQUFhO29CQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ25CLFdBQVcsRUFBRSxhQUFhO2lCQUM3QixFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGlCQUFZLEdBQUcsVUFBUyxHQUFZO1lBRTNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDekQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFrQixJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQTRELGlCQUFpQixFQUFFO29CQUNwRixjQUFjLEVBQUUsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM5QyxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUN6QixFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUcsVUFBUyxHQUFZO1lBRTVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLE9BQU8sR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDekQsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEIsQ0FBQztZQUVELElBQUksSUFBSSxHQUFrQixJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQTRELGlCQUFpQixFQUFFO29CQUNwRixjQUFjLEVBQUUsSUFBQSxNQUFNLENBQUMsYUFBYTtvQkFDcEMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixXQUFXLEVBQUUsV0FBVztpQkFDM0IsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxxQkFBZ0IsR0FBRyxVQUFTLEdBQVk7WUFFL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksT0FBTyxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN6RCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN0QixDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBNEQsaUJBQWlCLEVBQUU7b0JBQ3BGLGNBQWMsRUFBRSxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDbkIsV0FBVyxFQUFFLElBQUk7aUJBQ3BCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN2RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBS1UsaUJBQVksR0FBRyxVQUFTLElBQUk7WUFDbkMsSUFBSSxPQUFPLEdBQVcsSUFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUE7UUFLVSxpQkFBWSxHQUFHLFVBQVMsSUFBUztZQUN4QyxJQUFJLE9BQU8sR0FBVyxJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksT0FBTyxJQUFJLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUVoQixNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFBO1FBRVUsc0JBQWlCLEdBQUc7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0UsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFBO1FBRVUsZ0JBQVcsR0FBRyxVQUFTLEdBQVE7WUFDdEMsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsS0FBQSxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELEtBQUEsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBRTNCLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO2dCQUMzRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7YUFDcEIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUVVLGVBQVUsR0FBRyxVQUFTLEdBQVMsRUFBRSxRQUFpQjtZQUV6RCxLQUFBLGVBQWUsR0FBRyxJQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFBLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQU1ELElBQUksSUFBSSxHQUFrQixJQUFJLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksR0FBRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLEdBQUcsSUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEtBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixLQUFBLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHLFVBQVMsR0FBUyxFQUFFLFFBQWlCLEVBQUUsV0FBcUI7WUFNbkYsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksYUFBYSxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMvRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixLQUFBLGVBQWUsR0FBRyxhQUFhLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsS0FBQSxlQUFlLEdBQUcsSUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEtBQUEsZUFBZSxHQUFHLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFBLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELE1BQU0sQ0FBQztnQkFDWCxDQUFDO1lBQ0wsQ0FBQztZQUtELEtBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLEtBQUEsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQTtRQUVVLG1CQUFjLEdBQUcsVUFBUyxHQUFRO1lBQ3pDLEtBQUEsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQTtRQUVVLG9CQUFlLEdBQUc7WUFDekIsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQU81QixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzVCLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFNVSxtQkFBYyxHQUFHO1lBQ3hCLElBQUksYUFBYSxHQUFHLElBQUEsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsZ0VBQWdFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMxRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLFlBQVksRUFBRSxjQUFjLEVBQzdGO2dCQUNJLElBQUksaUJBQWlCLEdBQWtCLEtBQUEsd0JBQXdCLEVBQUUsQ0FBQztnQkFFbEUsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFvRCxhQUFhLEVBQUU7b0JBQ3hFLFNBQVMsRUFBRSxhQUFhO2lCQUMzQixFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQTtRQUdVLDZCQUF3QixHQUFHO1lBRWxDLElBQUksUUFBUSxHQUFXLElBQUEsTUFBTSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDMUQsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztZQUNuQyxJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7WUFJbEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5RCxJQUFJLElBQUksR0FBa0IsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0QsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUdELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQixZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxnQkFBVyxHQUFHO1lBRXJCLElBQUksYUFBYSxHQUFHLElBQUEsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsc0RBQXNELENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUNYLGFBQWEsRUFDYixNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRywyQ0FBMkMsRUFDM0UsS0FBSyxFQUNMO2dCQUNJLEtBQUEsV0FBVyxHQUFHLGFBQWEsQ0FBQztnQkFDNUIsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRWxDLElBQUEsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBRzFCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzVCLElBQUEsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxJQUFJLGtCQUFrQixHQUFHLFVBQVMsT0FBaUI7WUFDL0MsS0FBQSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLEdBQUcsQ0FBQyxDQUFXLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztnQkFBakIsSUFBSSxFQUFFLGdCQUFBO2dCQUNQLEtBQUEsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM3QjtRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFhLEdBQUc7WUFDdkIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLGVBQWUsRUFBRSxRQUFRLEdBQUcsS0FBQSxXQUFXLENBQUMsTUFBTSxHQUFHLHVDQUF1QyxFQUNwRyxhQUFhLEVBQUU7Z0JBRVgsSUFBSSxhQUFhLEdBQUcsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFPaEQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFnRCxXQUFXLEVBQUU7b0JBQ2xFLGNBQWMsRUFBRSxhQUFhLENBQUMsRUFBRTtvQkFDaEMsZUFBZSxFQUFFLGFBQWEsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLEVBQUUsR0FBRyxJQUFJO29CQUNoRSxTQUFTLEVBQUUsS0FBQSxXQUFXO2lCQUN6QixFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFVSwwQkFBcUIsR0FBRztZQUMvQixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsU0FBUyxFQUFFLDJIQUEySCxFQUFFLG1CQUFtQixFQUFFO2dCQUd6SyxJQUFJLElBQUksR0FBRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTt3QkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO3dCQUNqQixVQUFVLEVBQUUsZUFBZTt3QkFDM0IsV0FBVyxFQUFFLElBQUEsSUFBSSxDQUFDLGlCQUFpQixFQUFFO3FCQUN4QyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzNCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTFmZ0IsSUFBSSxHQUFKLFFBQUksS0FBSixRQUFJLFFBMGZwQjtBQUNMLENBQUMsRUE1ZlMsR0FBRyxLQUFILEdBQUcsUUE0Zlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFNekMsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsTUFBTSxDQTYxQnRCO0lBNzFCRCxXQUFpQixNQUFNO1FBRVIscUJBQWMsR0FBWSxLQUFLLENBQUM7UUFFaEMsaUJBQVUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUl2RSxzQkFBZSxHQUFZLEtBQUssQ0FBQztRQUdqQyxlQUFRLEdBQVcsQ0FBQyxDQUFDO1FBR3JCLGVBQVEsR0FBVyxXQUFXLENBQUM7UUFHL0Isa0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsbUJBQVksR0FBVyxDQUFDLENBQUM7UUFLekIsaUJBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsbUJBQVksR0FBVyxFQUFFLENBQUM7UUFLMUIsa0JBQVcsR0FBWSxLQUFLLENBQUM7UUFHN0IsaUJBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsOEJBQXVCLEdBQVEsSUFBSSxDQUFDO1FBQ3BDLDRCQUFxQixHQUFZLEtBQUssQ0FBQztRQU12QyxnQkFBUyxHQUFZLEtBQUssQ0FBQztRQVMzQixtQkFBWSxHQUFxQyxFQUFFLENBQUM7UUFLcEQsa0JBQVcsR0FBcUMsRUFBRSxDQUFDO1FBR25ELHFCQUFjLEdBQVEsRUFBRSxDQUFDO1FBR3pCLGNBQU8sR0FBVyxDQUFDLENBQUM7UUFNcEIsb0JBQWEsR0FBOEIsRUFBRSxDQUFDO1FBUzlDLDhCQUF1QixHQUFxQyxFQUFFLENBQUM7UUFHL0Qsb0JBQWEsR0FBVyxVQUFVLENBQUM7UUFDbkMsa0JBQVcsR0FBVyxRQUFRLENBQUM7UUFHL0IscUJBQWMsR0FBVyxRQUFRLENBQUM7UUFLbEMscUJBQWMsR0FBWSxLQUFLLENBQUM7UUFHaEMsbUJBQVksR0FBWSxLQUFLLENBQUM7UUFLOUIsb0NBQTZCLEdBQVE7WUFDNUMsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDO1FBRVMsa0NBQTJCLEdBQVEsRUFBRSxDQUFDO1FBRXRDLDJCQUFvQixHQUFRLEVBQUUsQ0FBQztRQUUvQix5QkFBa0IsR0FBUSxFQUFFLENBQUM7UUFLN0Isb0JBQWEsR0FBUSxFQUFFLENBQUM7UUFHeEIsNEJBQXFCLEdBQVEsRUFBRSxDQUFDO1FBR2hDLHNCQUFlLEdBQVEsSUFBSSxDQUFDO1FBSzVCLGtCQUFXLEdBQWtCLElBQUksQ0FBQztRQUNsQyxxQkFBYyxHQUFRLElBQUksQ0FBQztRQUMzQixvQkFBYSxHQUFRLElBQUksQ0FBQztRQUMxQixzQkFBZSxHQUFRLElBQUksQ0FBQztRQUc1QixpQkFBVSxHQUFRLEVBQUUsQ0FBQztRQUVyQiwrQkFBd0IsR0FBZ0MsRUFBRSxDQUFDO1FBQzNELHFDQUE4QixHQUFnQyxFQUFFLENBQUM7UUFFakUsc0JBQWUsR0FBeUI7WUFDL0MsVUFBVSxFQUFFLEtBQUs7WUFDakIsY0FBYyxFQUFFLEtBQUs7WUFDckIsVUFBVSxFQUFFLEVBQUU7WUFDZCxlQUFlLEVBQUUsS0FBSztZQUN0QixlQUFlLEVBQUUsS0FBSztZQUN0QixjQUFjLEVBQUUsS0FBSztTQUN4QixDQUFDO1FBRVMsMEJBQW1CLEdBQUc7WUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3hDLElBQUEsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLElBQUEsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQU1VLHlCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxPQUFBLFFBQVEsQ0FBQztnQkFDdkIsT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsc0JBQWUsR0FBRyxVQUFTLElBQUk7WUFDdEMsSUFBSSxHQUFHLEdBQUcsT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFrQlUsb0JBQWEsR0FBRyxVQUFTLFFBQWEsRUFBRSxHQUFTLEVBQUUsT0FBYSxFQUFFLGFBQXNCO1lBQy9GLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxPQUFBLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU3QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLE9BQUEsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRXhCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1YsT0FBQSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDaEMsQ0FBQztvQkFDRCxJQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7b0JBR2pELE1BQU0sQ0FBQyw0QkFBMEIsUUFBUSxDQUFDLElBQUksU0FBSSxHQUFHLENBQUMsSUFBSSxTQUFJLFVBQVUsU0FBSSxhQUFhLE9BQUksQ0FBQztnQkFDbEcsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsNEJBQTBCLFFBQVEsQ0FBQyxJQUFJLG1CQUFjLGFBQWEsT0FBSSxDQUFDO2dCQUNsRixDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sMkNBQTJDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGtCQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxhQUFzQjtZQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixVQUFVLENBQUM7b0JBQ1AsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFBLG9CQUFvQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLDJCQUFvQixHQUFHLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPO1lBQ3pELElBQUksT0FBTyxHQUFHLE9BQUEsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBSXBDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUdELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLElBQUksSUFBSSxHQUFHLE9BQUEsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsT0FBQSxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUMzRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sOENBQThDLEdBQUcsSUFBSSxDQUFDO1lBQ2hFLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxtQkFBWSxHQUFHO1lBQ3RCLE1BQU0sQ0FBQyxPQUFBLGNBQWMsS0FBSyxPQUFBLFdBQVcsQ0FBQztRQUMxQyxDQUFDLENBQUE7UUFFVSxjQUFPLEdBQUc7WUFDakIsT0FBQSxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUVVLG1CQUFZLEdBQUcsVUFBUyxRQUFrQixFQUFFLGtCQUE0QjtZQUUvRSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLE9BQUEsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNyQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE9BQUEsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsT0FBQSxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDNUIsT0FBQSx1QkFBdUIsRUFBRSxDQUFDO2dCQUM5QixDQUFDO1lBQ0wsQ0FBQztZQUtELElBQUksQ0FBQyxDQUFDO2dCQUNGLElBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGdCQUFTLEdBQUcsVUFBUyxRQUFRO1lBQ3BDLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM1QyxTQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBZ0I3QyxDQUFDLENBQUE7UUFVVSxpQkFBVSxHQUFHLFVBQVMsRUFBUSxFQUFFLElBQVU7WUFDakQsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQztnQkFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBR0QsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLFNBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQTtRQUVVLHdCQUFpQixHQUFHLFVBQVMsSUFBSTtZQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQUEsWUFBWSxFQUFFLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFFakIsSUFBSSxJQUFJLENBQUM7WUFDVCxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBQSw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLE9BQUEsNkJBQTZCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekYsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLCtCQUF3QixHQUFHO1lBQ2xDLElBQUksUUFBUSxHQUFhLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFFakMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsT0FBQSxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUtVLDhCQUF1QixHQUFHO1lBQ2pDLElBQUksUUFBUSxHQUFhLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFFakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQztZQUVELEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLE9BQUEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLElBQUksSUFBSSxHQUFrQixPQUFBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQzlELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUdVLGdDQUF5QixHQUFHO1lBQ25DLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBb0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDN0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBR1UsNEJBQXFCLEdBQUc7WUFDL0IsSUFBSSxRQUFRLEdBQW9CLEVBQUUsQ0FBQztZQUNuQyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLE9BQUEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQUEsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUseUJBQWtCLEdBQUc7WUFDNUIsT0FBQSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQTtRQUVVLDZCQUFzQixHQUFHLFVBQVMsR0FBRyxFQUFFLElBQUk7WUFDbEQsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO1lBQzFCLElBQUksSUFBSSxHQUFZLEtBQUssQ0FBQztZQUUxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBUyxLQUFLLEVBQUUsS0FBSztvQkFDcEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixRQUFRLElBQUksR0FBRyxDQUFDO29CQUNwQixDQUFDO29CQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDaEIsQ0FBQztvQkFFRCxRQUFRLElBQUksS0FBSyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO2dCQUN0QixJQUFJLEtBQUssR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDdkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxxQkFBYyxHQUFHLFVBQVMsSUFBbUI7WUFDcEQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtnQkFDMUYsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsZUFBZSxFQUFFLElBQUk7YUFDeEIsRUFBRSxVQUFTLEdBQW1DO2dCQUMzQyxPQUFBLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUdVLG9CQUFhLEdBQUcsVUFBUyxFQUFVO1lBQzFDLE1BQU0sQ0FBQyxPQUFBLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUE7UUFFVSxtQkFBWSxHQUFHLFVBQVMsR0FBVztZQUMxQyxJQUFJLElBQUksR0FBa0IsT0FBQSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sQ0FBQyw0QkFBNEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ3BELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUseUJBQWtCLEdBQUc7WUFDNUIsSUFBSSxHQUFHLEdBQWtCLE9BQUEsdUJBQXVCLENBQUMsT0FBQSxjQUFjLENBQUMsQ0FBQztZQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsdUJBQWdCLEdBQUcsVUFBUyxFQUFFLEVBQUUsTUFBTTtZQUM3QyxJQUFJLElBQUksR0FBa0IsT0FBQSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxPQUFBLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDN0QsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLG9CQUFhLEdBQUcsVUFBUyxJQUFtQixFQUFFLE1BQWU7WUFDcEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ04sTUFBTSxDQUFDO1lBRVgsSUFBSSxnQkFBZ0IsR0FBWSxLQUFLLENBQUM7WUFHdEMsSUFBSSxrQkFBa0IsR0FBa0IsT0FBQSx1QkFBdUIsQ0FBQyxPQUFBLGNBQWMsQ0FBQyxDQUFDO1lBQ2hGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV0QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztvQkFDL0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztvQkFDL0IsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3hFLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE9BQUEsdUJBQXVCLENBQUMsT0FBQSxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBRS9DLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO2dCQUN6QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZFLENBQUM7Z0JBQ0QsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEUsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBQSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTVUsOEJBQXVCLEdBQUc7WUFFakMsSUFBSSxjQUFjLEdBQVksSUFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNqRCxJQUFJLGNBQWMsR0FBWSxDQUFDLElBQUEsR0FBRyxDQUFDLFVBQVUsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBVyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFBLGFBQWEsQ0FBQyxDQUFDO1lBQ2hFLElBQUksYUFBYSxHQUFrQixPQUFBLGtCQUFrQixFQUFFLENBQUM7WUFDeEQsSUFBSSxhQUFhLEdBQVksYUFBYSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEtBQUssT0FBQSxRQUFRLElBQUksT0FBTyxLQUFLLE9BQUEsUUFBUSxDQUFDLENBQUM7WUFFckgsSUFBSSxnQkFBZ0IsR0FBWSxhQUFhLElBQUksSUFBSSxJQUFJLE9BQUEsVUFBVSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUM7WUFDeEYsSUFBSSxvQkFBb0IsR0FBRyxPQUFBLFdBQVcsSUFBSSxPQUFBLGVBQWUsQ0FBQyxhQUFhLENBQUM7WUFDeEUsSUFBSSxvQkFBb0IsR0FBRyxPQUFBLFdBQVcsSUFBSSxPQUFBLGVBQWUsQ0FBQyxhQUFhLENBQUM7WUFDeEUsSUFBSSxnQkFBZ0IsR0FBVyxPQUFBLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9ELElBQUksYUFBYSxHQUFXLE9BQUEsZ0JBQWdCLEVBQUUsQ0FBQztZQUMvQyxJQUFJLFNBQVMsR0FBWSxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDO1lBQ3ZGLElBQUksV0FBVyxHQUFZLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxHQUFHLENBQUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDO1lBR3pHLElBQUksYUFBYSxHQUFHLE9BQUEsZUFBZSxDQUFDLFFBQVEsSUFBSSxDQUFDLE9BQUEsV0FBVyxJQUFJLENBQUMsQ0FBQyxPQUFBLFVBQVUsQ0FBd0IsQ0FBQyxDQUFDO1lBRXRHLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsT0FBQSxVQUFVLEdBQUcsZ0JBQWdCLEdBQUcsWUFBWSxHQUFHLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxDQUFDO1lBRTFILElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxDQUFDLENBQUM7WUFDbkQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLE9BQUEsVUFBVSxDQUFDLENBQUM7WUFFckQsSUFBSSxXQUFXLEdBQVksT0FBQSxXQUFXLElBQUksQ0FBQyxPQUFBLFVBQVUsQ0FBQztZQUN0RCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFckQsSUFBSSxhQUFhLEdBQVksT0FBQSxXQUFXLElBQUksQ0FBQyxPQUFBLFVBQVUsQ0FBQztZQUV4RCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDcEQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxPQUFBLFdBQVcsSUFBSSxJQUFBLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7WUFDOUUsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksWUFBWSxHQUFHLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQztZQUMxRixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQzdGLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxJQUFBLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUUxSCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3RELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNyRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFMUQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUMxRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxDQUFDLENBQUM7WUFDdkQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLDZCQUE2QixFQUFFLE9BQUEsV0FBVyxJQUFJLENBQUMsSUFBQSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQzlHLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxPQUFBLFdBQVcsQ0FBQyxDQUFDO1lBQ3JELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLENBQUM7WUFDbEcsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksSUFBSSxhQUFhLENBQUMsQ0FBQztZQUNqRyxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSTttQkFDM0UsYUFBYSxDQUFDLFNBQVMsSUFBSSxhQUFhLENBQUMsQ0FBQztZQUNqRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQ25HLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLENBQUM7WUFDaEcsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ25GLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUMvRSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxPQUFBLHFCQUFxQixDQUFDLENBQUM7WUFDaEYsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ2hGLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNsRixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbEYsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixFQUFFLENBQUMsT0FBQSxVQUFVLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ25GLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxPQUFBLFdBQVcsQ0FBQyxDQUFDO1lBQ3hELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbkUsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbEYsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLDhCQUE4QixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdEQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksT0FBQSxVQUFVLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxSSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksSUFBSSxPQUFBLFVBQVUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFJLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsT0FBQSxXQUFXLENBQUMsQ0FBQztZQUk3QyxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDMUQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzFELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNwRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLE9BQUEsV0FBVyxJQUFJLElBQUEsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztZQUM5RSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsT0FBQSxXQUFXLElBQUksQ0FBQyxJQUFBLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDOUcsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLE9BQUEsV0FBVyxDQUFDLENBQUM7WUFDckQsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxPQUFBLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE9BQUEsVUFBVSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNoRixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7WUFDbEYsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLDhCQUE4QixFQUFFLENBQUMsT0FBQSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxPQUFBLFVBQVUsSUFBSSxPQUFBLHFCQUFxQixDQUFDLENBQUM7WUFHaEYsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxPQUFBLFdBQVcsQ0FBQyxDQUFDO1lBRTdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVVLDRCQUFxQixHQUFHO1lBQy9CLElBQUksR0FBVyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFBLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLE9BQUEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXBDLE1BQU0sQ0FBQyxPQUFBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVVLHVCQUFnQixHQUFHLFVBQVMsSUFBbUI7WUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFBLGVBQWUsSUFBSSxDQUFDLE9BQUEsZUFBZSxDQUFDLFFBQVEsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFBLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRztZQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQUEsZUFBZSxJQUFJLENBQUMsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDO2dCQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRWIsTUFBTSxDQUFDLE9BQUEsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDM0MsQ0FBQyxDQUFBO1FBRVUseUJBQWtCLEdBQUcsVUFBUyxJQUFJO1lBQ3pDLE9BQUEsZUFBZSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFBLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE9BQUEsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQy9CLE9BQUEsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzdCLE9BQUEsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JDLENBQUMsQ0FBQTtRQUVVLDJCQUFvQixHQUFHLFVBQVMsR0FBOEI7WUFFckUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztnQkFFekIsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUU1QyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFFbEQsT0FBQSx1QkFBdUIsRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRTdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsd0JBQWlCLEdBQUcsVUFBUyxHQUFHO1lBQ3ZDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLElBQUksR0FBa0IsT0FBQSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUN2QixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNVSxlQUFRLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW9CO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFLRCxJQUFJLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBQSxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQUEsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUEsS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFPM0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVwRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE9BQUEsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLE9BQUEsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLG9CQUFhLEdBQUc7WUFDdkIsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQUEsMkJBQTJCLEVBQUU7Z0JBQ3JDLElBQUEsT0FBTyxDQUFDLFdBQVc7Z0JBQ25CLElBQUEsT0FBTyxDQUFDLFlBQVk7Z0JBQ3BCLElBQUEsT0FBTyxDQUFDLE1BQU07Z0JBQ2QsSUFBQSxPQUFPLENBQUMsU0FBUztnQkFDakIsSUFBQSxPQUFPLENBQUMsVUFBVTtnQkFDbEIsSUFBQSxPQUFPLENBQUMsT0FBTztnQkFDZixJQUFBLE9BQU8sQ0FBQyxRQUFRO2dCQUNoQixJQUFBLE9BQU8sQ0FBQyxRQUFRO2dCQUNoQixJQUFBLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQixJQUFBLE9BQU8sQ0FBQyxhQUFhO2FBQUMsQ0FBQyxDQUFDO1lBRTVCLElBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFBLG9CQUFvQixFQUFFO2dCQUM5QixJQUFBLE9BQU8sQ0FBQyxZQUFZO2dCQUNwQixJQUFBLE9BQU8sQ0FBQyxJQUFJO2dCQUNaLElBQUEsT0FBTyxDQUFDLFdBQVc7Z0JBQ25CLElBQUEsT0FBTyxDQUFDLE9BQU87Z0JBQ2YsSUFBQSxPQUFPLENBQUMsVUFBVTtnQkFDbEIsSUFBQSxPQUFPLENBQUMsYUFBYTtnQkFDckIsSUFBQSxPQUFPLENBQUMsZ0JBQWdCO2dCQUN4QixJQUFBLE9BQU8sQ0FBQyxTQUFTO2dCQUNqQixJQUFBLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQixJQUFBLE9BQU8sQ0FBQyxPQUFPO2dCQUNmLElBQUEsT0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLElBQUEsT0FBTyxDQUFDLFFBQVE7Z0JBQ2hCLElBQUEsT0FBTyxDQUFDLFVBQVU7Z0JBQ2xCLElBQUEsT0FBTyxDQUFDLGFBQWE7YUFBQyxDQUFDLENBQUM7WUFFNUIsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQUEsa0JBQWtCLEVBQUUsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQTtRQUdVLGNBQU8sR0FBRztZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFaEMsRUFBRSxDQUFDLENBQUMsT0FBQSxjQUFjLENBQUM7Z0JBQ2YsTUFBTSxDQUFDO1lBRVgsT0FBQSxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRXRCLElBQUksSUFBSSxHQUFHLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFO2dCQUNqQyxPQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFBLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLE9BQUEsb0JBQW9CLEVBQUUsQ0FBQztZQU92QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBVUgsT0FBQSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hDLE9BQUEsWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQU1sQyxJQUFBLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQXFCcEIsT0FBQSxtQkFBbUIsRUFBRSxDQUFDO1lBQ3RCLE9BQUEsdUJBQXVCLEVBQUUsQ0FBQztZQUUxQixJQUFBLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRTNCLE9BQUEsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRztZQUMxQixJQUFJLFFBQVEsR0FBRyxJQUFBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLFVBQVUsQ0FBQztvQkFDUCxDQUFDLElBQUksSUFBQSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM3QyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDO1lBRUQsT0FBQSxNQUFNLEdBQUcsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFBO1FBRVUscUJBQWMsR0FBRyxVQUFTLE9BQU87WUFDeEMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUEsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLDJCQUFvQixHQUFHO1lBQzlCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25FLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSx1QkFBZ0IsR0FBRztZQUMxQixFQUFFLENBQUMsQ0FBQyxPQUFBLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBRWxCLEVBQUUsQ0FBQyxDQUFDLE9BQUEsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFBLFdBQVcsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO2dCQUVELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBQSxlQUFlLENBQUMsUUFBUSxFQUFFLFVBQVMsQ0FBQyxFQUFFLElBQUk7b0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNiLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUE7UUFHVSx5QkFBa0IsR0FBRyxVQUFTLEtBQUs7UUFNOUMsQ0FBQyxDQUFBO1FBRVUsdUJBQWdCLEdBQUcsVUFBUyxTQUFTO1lBQzVDLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO2dCQUMzRSxXQUFXLEVBQUUsU0FBUzthQUN6QixFQUFFLE9BQUEsb0JBQW9CLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFVSwwQkFBbUIsR0FBRztZQUM3QixJQUFBLElBQUksQ0FBQyxJQUFJLENBQW9FLHFCQUFxQixFQUFFO2dCQUVoRyxpQkFBaUIsRUFBRSxPQUFBLGVBQWU7YUFDckMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRVUscUJBQWMsR0FBRyxVQUFTLFFBQWdCO1lBQ2pELElBQUEsSUFBSSxDQUFDLElBQUksQ0FBMEQsZ0JBQWdCLEVBQUU7Z0JBQ2pGLFVBQVUsRUFBRSxRQUFRO2FBQ3ZCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUVVLHFCQUFjLEdBQUcsVUFBUyxRQUFnQjtZQUNqRCxJQUFJLElBQUEsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTcxQmdCLE1BQU0sR0FBTixVQUFNLEtBQU4sVUFBTSxRQTYxQnRCO0FBQ0wsQ0FBQyxFQS8xQlMsR0FBRyxLQUFILEdBQUcsUUErMUJaO0FBSUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDNUIsQ0FBQztBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUV0QyxXQUFVLEdBQUc7SUFDVCxJQUFpQixHQUFHLENBdU9uQjtJQXZPRCxXQUFpQixHQUFHO1FBQ0wscUJBQWlCLEdBQVcsTUFBTSxDQUFDO1FBR25DLGNBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsY0FBVSxHQUFZLElBQUksQ0FBQztRQUczQixpQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUUzQixvQkFBZ0IsR0FBRztZQUMxQixHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNuQixJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsUUFBUSxFQUFFLElBQUEsVUFBVTtnQkFDcEIsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxJQUFBLG1CQUFtQixDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFBO1FBRVUsb0JBQWdCLEdBQUc7WUFDMUIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixTQUFTLEVBQUUsSUFBSTtnQkFDZixvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQixRQUFRLEVBQUUsSUFBQSxVQUFVO2dCQUNwQixjQUFjLEVBQUUsS0FBSzthQUN4QixFQUFFLElBQUEsbUJBQW1CLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUE7UUFFVSxjQUFVLEdBQUcsVUFBUyxNQUFjO1lBSTNDLElBQUEsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUU1QyxJQUFBLElBQUksQ0FBQyxJQUFJLENBQXdFLHVCQUF1QixFQUFFO2dCQUN0RyxRQUFRLEVBQUUsTUFBTTthQUNuQixFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFBO1FBRUQsSUFBSSw2QkFBNkIsR0FBRyxVQUFTLEdBQXVDO1lBQ2hGLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxELElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsa0JBQWMsR0FBRztZQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsYUFBYSxLQUFLLElBQUEsTUFBTSxDQUFDLHVCQUF1QixDQUFDO1lBQ25FLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsYUFBYSxLQUFLLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsdUJBQW1CLEdBQUc7WUFDN0IsTUFBTSxDQUFDLENBQUMsSUFBQSxjQUFjLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUE7UUFFVSxtQkFBZSxHQUFHLFVBQVMsR0FBNEIsRUFBRSxFQUFFO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLElBQUEsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDckMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGNBQVUsR0FBRztZQUVwQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRXpCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFLRCxJQUFBLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDbkYsUUFBUSxFQUFFLElBQUEsTUFBTSxDQUFDLGFBQWE7Z0JBQzlCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLG9CQUFvQixFQUFFLEtBQUs7Z0JBQzNCLFFBQVEsRUFBRSxJQUFBLFVBQVU7Z0JBQ3BCLGNBQWMsRUFBRSxLQUFLO2FBQ3hCLEVBQUUsVUFBUyxHQUE0QjtnQkFDcEMsSUFBQSxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUtVLHlCQUFxQixHQUFHO1lBRS9CLElBQUksY0FBYyxHQUFHLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDakQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFHakIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWxFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBR3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxpQkFBaUIsQ0FBQztvQkFHbEQsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUtVLDBCQUFzQixHQUFHO1lBQ2hDLElBQUksQ0FBQztnQkFDRCxJQUFJLGNBQWMsR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDaEUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFHakIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRWxFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBR3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxpQkFBaUIsQ0FBQzt3QkFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxNQUFNLENBQUMsQ0FBQzt3QkFFdEQsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDaEMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVVLGtCQUFjLEdBQUcsVUFBUyxNQUFNLEVBQUUsR0FBRztZQUU1QyxJQUFJLElBQUksR0FBa0IsSUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGdFQUFnRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRixNQUFNLENBQUM7WUFDWCxDQUFDO1lBS0QsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFLbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBQ3RDLElBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUM7WUFDRCxJQUFBLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQTtRQUVVLFlBQVEsR0FBRyxVQUFTLEdBQUc7WUFFOUIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuRCxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsOEJBQThCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU9VLGlCQUFhLEdBQUcsVUFBUyxHQUFHO1lBQ25DLElBQUksWUFBWSxHQUFRLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDbkQsVUFBVSxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLElBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFRCxJQUFBLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsSUFBQSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUNyQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUE7UUFFVSx1QkFBbUIsR0FBRyxVQUFTLEdBQTRCO1lBQ2xFLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDNUIsSUFBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBQSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBQSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUE7UUFFVSxXQUFPLEdBQUc7WUFDakIsRUFBRSxDQUFDLENBQUMsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUEsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtvQkFDckUsUUFBUSxFQUFFLElBQUEsTUFBTSxDQUFDLFVBQVU7b0JBQzNCLFNBQVMsRUFBRSxJQUFJO29CQUNmLG9CQUFvQixFQUFFLElBQUk7b0JBQzFCLFFBQVEsRUFBRSxJQUFBLFVBQVU7b0JBQ3BCLGNBQWMsRUFBRSxLQUFLO2lCQUN4QixFQUFFLElBQUEsbUJBQW1CLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsaUJBQWEsR0FBRztZQUN2QixJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUE7SUFDTCxDQUFDLEVBdk9nQixHQUFHLEdBQUgsT0FBRyxLQUFILE9BQUcsUUF1T25CO0FBQ0wsQ0FBQyxFQXpPUyxHQUFHLEtBQUgsR0FBRyxRQXlPWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUV4QyxXQUFVLEdBQUc7SUFDVCxJQUFpQixLQUFLLENBa0JyQjtJQWxCRCxXQUFpQixLQUFLO1FBRVAsMEJBQW9CLEdBQUcsVUFBUyxHQUE4QjtZQUVyRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQUVVLGtCQUFZLEdBQUc7WUFDdEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLFFBQVEsRUFBRSxzQ0FBc0MsRUFBRSxxQkFBcUIsRUFBRTtnQkFDckYsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLGdCQUFnQixFQUFFLHdFQUF3RSxFQUFFLHFCQUFxQixFQUFFO29CQUMvSCxJQUFBLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO29CQUM1QixJQUFBLElBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRSxFQUFFLEVBQUUsTUFBQSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUM3RyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFsQmdCLEtBQUssR0FBTCxTQUFLLEtBQUwsU0FBSyxRQWtCckI7QUFDTCxDQUFDLEVBcEJTLEdBQUcsS0FBSCxHQUFHLFFBb0JaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXhDLFdBQVUsR0FBRztJQUNULElBQWlCLEtBQUssQ0ErTnJCO0lBL05ELFdBQWlCLE9BQUs7UUFFUCxrQkFBVSxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUEwQjtZQUM1RSxJQUFJLFFBQVEsR0FBd0IsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNELElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztZQUUxQixHQUFHLENBQUMsQ0FBYSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7Z0JBQXJCLElBQUksSUFBSSxrQkFBQTtnQkFDVCxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMzRDtZQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxnQkFBZ0IsR0FBRyxVQUFTLEtBQTBCLEVBQUUsR0FBVyxFQUFFLFFBQWdCO1lBQ3JGLElBQUksTUFBTSxHQUFXLElBQUEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUUsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBS1UsbUJBQVcsR0FBRztZQUNyQixJQUFBLE1BQU0sQ0FBQyxjQUFjLEdBQUcsSUFBQSxNQUFNLENBQUMsY0FBYyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7WUFTN0QsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixJQUFBLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFFVSxtQ0FBMkIsR0FBRyxVQUFTLFlBQVk7WUFDMUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUVwRCxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLEtBQUssQ0FBQztnQkFDVixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLG1DQUEyQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxLQUEwQjtZQUM3RixJQUFJLElBQUksR0FBYSxJQUFBLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBRUQsSUFBSSxRQUFRLEdBQXdCLElBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRCxjQUFjLENBQUMsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUQsY0FBYyxDQUFDLENBQUMsSUFBQSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBQSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVqSCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUdELElBQUksY0FBYyxHQUFHLFVBQVMsU0FBbUIsRUFBRSxLQUEwQjtZQUN6RSxHQUFHLENBQUMsQ0FBYSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7Z0JBQXJCLElBQUksSUFBSSxrQkFBQTtnQkFDVCxJQUFJLE1BQU0sR0FBRyxJQUFBLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2FBQ0o7UUFDTCxDQUFDLENBQUE7UUFHRCxJQUFJLGNBQWMsR0FBRyxVQUFTLFNBQW1CLEVBQUUsS0FBMEI7WUFDekUsR0FBRyxDQUFDLENBQWEsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO2dCQUFyQixJQUFJLElBQUksa0JBQUE7Z0JBQ1QsSUFBSSxNQUFNLEdBQUcsSUFBQSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELENBQUM7YUFDSjtRQUNMLENBQUMsQ0FBQTtRQUtVLHdCQUFnQixHQUFHLFVBQVMsVUFBVTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksT0FBSyxHQUFXLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxXQUFTLEdBQVcsQ0FBQyxDQUFDO2dCQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLENBQUMsRUFBRSxRQUFRO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLFlBQVksR0FBRyxJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRTFELFdBQVMsRUFBRSxDQUFDO3dCQUNaLElBQUksRUFBRSxHQUFXLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQzlCLE9BQU8sRUFBRSxxQkFBcUI7eUJBQ2pDLEVBQUUsSUFBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBRS9DLElBQUksR0FBRyxTQUFRLENBQUM7d0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQ2YsR0FBRyxHQUFHLFVBQVUsQ0FBQzt3QkFDckIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDMUIsR0FBRyxHQUFHLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzFDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osR0FBRyxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3RELENBQUM7d0JBRUQsRUFBRSxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQ25CLE9BQU8sRUFBRSxvQkFBb0I7eUJBQ2hDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRVIsT0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7NEJBQ3RCLE9BQU8sRUFBRSxnQkFBZ0I7eUJBQzVCLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRVgsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckQsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsQ0FBQyxXQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakIsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUN2QixRQUFRLEVBQUUsR0FBRztvQkFDYixPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUFFLE9BQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQU1VLHVCQUFlLEdBQUcsVUFBUyxZQUFZLEVBQUUsSUFBSTtZQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFFaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLElBQUksR0FBc0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRVUsMEJBQWtCLEdBQUcsVUFBUyxZQUFZLEVBQUUsSUFBSTtZQUN2RCxJQUFJLElBQUksR0FBc0IsUUFBQSxlQUFlLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDcEMsQ0FBQyxDQUFBO1FBTVUsc0JBQWMsR0FBRyxVQUFTLElBQUk7WUFDckMsSUFBSSxTQUFTLEdBQVcsUUFBQSxrQkFBa0IsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFHckUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNiLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDeEIsQ0FBQztZQUdELE1BQU0sQ0FBQyxTQUFTLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQU1VLDZCQUFxQixHQUFHLFVBQVMsSUFBSTtZQUM1QyxJQUFJLFNBQVMsR0FBVyxRQUFBLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdELENBQUMsQ0FBQTtRQUVVLDBCQUFrQixHQUFHLFVBQVMsSUFBSTtZQUN6QyxJQUFJLFNBQVMsR0FBVyxRQUFBLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdELENBQUMsQ0FBQTtRQUtVLHNCQUFjLEdBQUcsVUFBUyxRQUFRO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBR25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDMUIsQ0FBQztZQUVELElBQUksQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxRQUFBLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsNEJBQW9CLEdBQUcsVUFBUyxNQUFNO1lBQzdDLElBQUksR0FBRyxHQUFXLE9BQU8sQ0FBQztZQUMxQixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBUyxDQUFDLEVBQUUsS0FBSztnQkFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osR0FBRyxJQUFJLElBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixLQUFLLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxJQUFJLFFBQVEsQ0FBQztZQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQS9OZ0IsS0FBSyxHQUFMLFNBQUssS0FBTCxTQUFLLFFBK05yQjtBQUNMLENBQUMsRUFqT1MsR0FBRyxLQUFILEdBQUcsUUFpT1o7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFLekMsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsTUFBTSxDQTJqQ3RCO0lBM2pDRCxXQUFpQixNQUFNO1FBQ25CLElBQUksS0FBSyxHQUFZLEtBQUssQ0FBQztRQU0zQixJQUFJLGtCQUFrQixHQUFHO1lBQ3JCLE1BQU0sQ0FBQywwSEFBMEgsQ0FBQztRQUN0SSxDQUFDLENBQUE7UUFFRCxJQUFJLFlBQVksR0FBRyxVQUFTLElBQW1CO1lBSTNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixNQUFNLENBQUMsT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUlELElBQUksQ0FBQyxDQUFDO2dCQUNGLElBQUksTUFBTSxHQUFXLE9BQUEsR0FBRyxDQUFDLEdBQUcsRUFBRTtvQkFDMUIsTUFBTSxFQUFFLE9BQUEsdUJBQXVCLENBQUMsSUFBSSxDQUFDO2lCQUN4QyxFQUFFLHVCQUF1QixDQUFDLENBQUM7Z0JBRTVCLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDZixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBU1UsZUFBUSxHQUFHLFVBQVMsRUFBRSxFQUFFLElBQUk7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLHFCQUFjLEdBQUcsVUFBUyxJQUFtQixFQUFFLFFBQWlCLEVBQUUsUUFBaUI7WUFDMUYsSUFBSSxTQUFTLEdBQVcsSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBQSxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTNFLElBQUksVUFBVSxHQUFXLEVBQUUsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFVBQVUsSUFBSSxrQ0FBa0MsR0FBRyxPQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbkYsQ0FBQztZQUVELFVBQVUsSUFBSSxPQUFPLENBQUM7WUFFdEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLEtBQUssR0FBVyxDQUFDLFNBQVMsS0FBSyxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7Z0JBQzNGLFVBQVUsSUFBSSxlQUFlLEdBQUcsS0FBSyxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDckYsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLEdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztnQkFDaEcsVUFBVSxJQUFJLGVBQWUsR0FBRyxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDMUYsQ0FBQztZQUVELFVBQVUsSUFBSSwyQkFBeUIsSUFBSSxDQUFDLEdBQUcsY0FBVyxDQUFDO1lBQzNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixVQUFVLElBQUksWUFBVSxJQUFJLENBQUMsWUFBYyxDQUFDO1lBQ2hELENBQUM7WUFDRCxVQUFVLElBQUksUUFBUSxDQUFDO1lBWXZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckMsVUFBVSxJQUFJLFdBQVMsSUFBSSxDQUFDLElBQUksY0FBUyxJQUFJLENBQUMsR0FBRyxNQUFHLENBQUM7WUFDekQsQ0FBQztZQUVELFVBQVUsR0FBRyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLE9BQU8sRUFBRSxhQUFhO2FBQ3pCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFZixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUMsQ0FBQTtRQU9VLDJCQUFvQixHQUFHLFVBQVMsT0FBZTtZQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBTzdCLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO2dCQUM5QixPQUFPLEdBQUcsT0FBQSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RCxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFVSwwQkFBbUIsR0FBRyxVQUFTLE9BQWU7WUFDckQsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUE7UUFFVSxzQkFBZSxHQUFHLFVBQVMsT0FBZTtZQUtqRCxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxPQUFPLEdBQUcsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUNsRSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsNkJBQTZCLENBQUMsQ0FBQztZQUN2RSxDQUFDO1lBQ0QsT0FBTyxHQUFHLElBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFFMUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFJVSx3QkFBaUIsR0FBRyxVQUFTLElBQW1CO1lBSXZELElBQUksR0FBRyxHQUFXLElBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSwyQkFBeUIsSUFBSSxDQUFDLEVBQUUsZ0JBQWEsQ0FBQztZQUM5RCxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sdUNBQXVDLENBQUM7WUFDbkUsSUFBSSxVQUFVLEdBQVcsT0FBQSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9FLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUE7UUFVVSx3QkFBaUIsR0FBRyxVQUFTLElBQW1CLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVU7WUFDOUcsSUFBSSxHQUFHLEdBQVcsT0FBQSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUc1QyxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLElBQUksVUFBVSxHQUFHLE9BQUEsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLFVBQVUsR0FBRyxJQUFBLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsR0FBRyxJQUFrQixVQUFVLENBQUM7Z0JBQ3BDLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDO2dCQUtwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksSUFBSSxHQUFhLElBQUEsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDM0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUCxjQUFjLEdBQUcsSUFBSSxDQUFDO3dCQUN0QixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTtvQkFDakMsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxXQUFXLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBR2xGLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ2QsY0FBYyxHQUFHLElBQUksQ0FBQzt3QkFFdEIsSUFBSSxVQUFVLEdBQUcsSUFBQSxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUduRCxJQUFJLGFBQWEsR0FBRyxrQ0FBa0M7NEJBQ2xELG1DQUFtQzs0QkFDbkMsaUNBQWlDOzRCQUNqQyxVQUFVOzRCQUNWLFdBQVc7NEJBQ1gsbUJBQW1CLENBQUM7d0JBT3hCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7NEJBQ2IsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQ0FDZCxPQUFPLEVBQUUsYUFBYTs2QkFDekIsRUFBRSxhQUFhLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO2dDQUNkLE9BQU8sRUFBRSxrQkFBa0I7NkJBQzlCLEVBQUUsYUFBYSxDQUFDLENBQUM7d0JBQ3RCLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixHQUFHLElBQUksV0FBVyxDQUFDO29CQUN2QixDQUFDO29CQUVELElBQUksWUFBVSxHQUFXLElBQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakUsRUFBRSxDQUFDLENBQUMsWUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDYixHQUFHLElBQWtCLFlBQVUsQ0FBQztvQkFDcEMsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxNQUFNLEdBQVcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQU94QyxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxHQUFHLEdBQUcsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFBLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLElBQUksTUFBTSxDQUFDO2dCQUNsQixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksSUFBSSxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLGNBQWM7aUJBQzFCLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUseUNBQWtDLEdBQUcsVUFBUyxXQUFtQjtZQUN4RSxJQUFJLE9BQU8sR0FBVyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLElBQUksR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUUxQyxHQUFHLENBQUMsQ0FBYyxVQUFJLEVBQUosYUFBSSxFQUFKLGtCQUFJLEVBQUosSUFBSTtvQkFBakIsSUFBSSxLQUFLLGFBQUE7b0JBQ1YsT0FBTyxJQUFJLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDbEIsT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLFNBQVMsRUFBRSxnQ0FBOEIsS0FBSyxDQUFDLFFBQVEsT0FBSTtxQkFDOUQsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBb0J0QjtZQUNMLENBQUM7WUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQTtZQUMvQixDQUFDO1lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQixDQUFDLENBQUE7UUFRVSwyQkFBb0IsR0FBRyxVQUFTLElBQW1CLEVBQUUsS0FBYSxFQUFFLEtBQWEsRUFBRSxRQUFnQjtZQUUxRyxJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQzNCLElBQUksY0FBYyxHQUFZLElBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDakQsSUFBSSxjQUFjLEdBQVksQ0FBQyxJQUFBLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDOUMsSUFBSSxTQUFTLEdBQVksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUM7WUFDdkUsSUFBSSxXQUFXLEdBQVksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQztZQUVqRSxJQUFJLEtBQUssR0FBWSxJQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7Z0JBRWxELElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXZDLElBQUksY0FBYyxHQUFZLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsY0FBYyxHQUFHLENBQUMsSUFBQSxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFBLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7dUJBQzlFLENBQUMsSUFBQSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFVRCxJQUFJLFNBQVMsR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMzRCxJQUFJLFFBQVEsR0FBWSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRTdELElBQUksZ0JBQWdCLEdBQVcsT0FBQSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNsRyxJQUFJLFFBQVEsR0FBVyxPQUFBLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxELElBQUksS0FBSyxHQUFXLEdBQUcsR0FBRyxNQUFNLENBQUM7WUFDakMsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsYUFBYSxHQUFHLGVBQWUsQ0FBQztnQkFDeEUsU0FBUyxFQUFFLG1DQUFpQyxHQUFHLFFBQUs7Z0JBQ3BELElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxRQUFRO2FBQ3BCLEVBQ0csZ0JBQWdCLEdBQUcsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUMxQixJQUFJLEVBQUUsR0FBRyxHQUFHLFVBQVU7YUFDekIsRUFBRSxPQUFBLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQTtRQUVVLGtCQUFXLEdBQUc7WUFDckIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLElBQUksR0FBVyxJQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlELElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDekQsSUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWhDLElBQUksT0FBTyxHQUFXLHNCQUFzQixHQUFHLEdBQUcsQ0FBQztZQUNuRCxJQUFJLElBQUksR0FBVyxJQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxPQUFPLElBQUksdUJBQXVCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNoRixDQUFDO1lBRUQsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BELENBQUMsQ0FBQTtRQUVVLDBCQUFtQixHQUFHLFVBQVMsSUFBbUI7WUFDekQsSUFBSSxXQUFXLEdBQVcsSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksY0FBYyxHQUFXLEVBQUUsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNkLGNBQWMsR0FBRyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3hCLEtBQUssRUFBRSxXQUFXO29CQUNsQixPQUFPLEVBQUUsaUJBQWlCO2lCQUM3QixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBQ0QsTUFBTSxDQUFDLGNBQWMsQ0FBQztRQUMxQixDQUFDLENBQUE7UUFFVSwyQkFBb0IsR0FBRyxVQUFTLElBQW1CO1lBQzFELElBQUksTUFBTSxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxJQUFJLFdBQVcsR0FBVyxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFFVCxXQUFXLEdBQUcsMkJBQXlCLE1BQU0sT0FBSSxDQUFDO1lBQ3RELENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQTtRQUVVLHdCQUFpQixHQUFHLFVBQVMsT0FBZ0IsRUFBRSxPQUFnQjtZQUN0RSxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUV4QixNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNkLE9BQU8sRUFBRSx5REFBeUQsR0FBRyxPQUFPO2FBQy9FLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRVUsb0JBQWEsR0FBRyxVQUFTLE9BQWUsRUFBRSxLQUFhO1lBQzlELElBQUksR0FBRyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVMsS0FBSyxRQUFLLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUUvRSxJQUFJLEtBQUssR0FBRztnQkFDUixPQUFPLEVBQUUsd0RBQXdEO2FBQ3BFLENBQUM7WUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUE7UUFFVSxnQkFBUyxHQUFHLFVBQVMsT0FBZSxFQUFFLE9BQWU7WUFDNUQsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7WUFFeEIsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsdURBQXVELEdBQUcsT0FBTzthQUM3RSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVVLDJCQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxTQUFrQixFQUFFLFdBQW9CLEVBQUUsY0FBdUI7WUFFN0gsSUFBSSxTQUFTLEdBQVcsSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBQSxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLElBQUksU0FBUyxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxJQUFJLFlBQVksR0FBVyxJQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakYsSUFBSSxVQUFVLEdBQVcsRUFBRSxDQUFDO1lBQzVCLElBQUksU0FBUyxHQUFXLEVBQUUsQ0FBQztZQUMzQixJQUFJLG1CQUFtQixHQUFXLEVBQUUsQ0FBQztZQUNyQyxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFDaEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxrQkFBa0IsR0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxnQkFBZ0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxXQUFXLEdBQVcsRUFBRSxDQUFDO1lBTTdCLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxJQUFJLFNBQVMsSUFBSSxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxXQUFXLEdBQUcsT0FBQSxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUM5QixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLDhCQUE0QixJQUFJLENBQUMsR0FBRyxRQUFLO2lCQUN2RCxFQUNHLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFFRCxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7WUFHNUIsRUFBRSxDQUFDLENBQUMsT0FBQSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsV0FBVyxFQUFFLENBQUM7Z0JBRWQsVUFBVSxHQUFHLE9BQUEsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFPN0IsT0FBTyxFQUFFLHdDQUF3QztvQkFDakQsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSx1QkFBcUIsSUFBSSxDQUFDLEdBQUcsUUFBSztpQkFDaEQsRUFDRyxNQUFNLENBQUMsQ0FBQztZQUNoQixDQUFDO1lBT0QsRUFBRSxDQUFDLENBQUMsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBR2xDLElBQUksUUFBUSxHQUFZLElBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFHdEUsV0FBVyxFQUFFLENBQUM7Z0JBRWQsSUFBSSxHQUFHLEdBQVcsUUFBUSxHQUFHO29CQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNO29CQUN2QixTQUFTLEVBQUUsNEJBQTBCLElBQUksQ0FBQyxHQUFHLFFBQUs7b0JBQ2xELFNBQVMsRUFBRSxTQUFTO29CQUdwQixPQUFPLEVBQUUsbUJBQW1CO2lCQUMvQjtvQkFDRzt3QkFDSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNO3dCQUN2QixTQUFTLEVBQUUsNEJBQTBCLElBQUksQ0FBQyxHQUFHLFFBQUs7d0JBQ2xELE9BQU8sRUFBRSxtQkFBbUI7cUJBQy9CLENBQUM7Z0JBRU4sU0FBUyxHQUFHLE9BQUEsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFM0MsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFFcEMsV0FBVyxFQUFFLENBQUM7b0JBQ2QsbUJBQW1CLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7d0JBQzNDLE1BQU0sRUFBRSw4QkFBOEI7d0JBQ3RDLElBQUksRUFBRSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRzt3QkFDbEMsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFNBQVMsRUFBRSw2QkFBMkIsSUFBSSxDQUFDLEdBQUcsUUFBSztxQkFDdEQsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BDLFdBQVcsRUFBRSxDQUFDO29CQUVkLGdCQUFnQixHQUFHLE9BQUEsR0FBRyxDQUFDLG1CQUFtQixFQUFFO3dCQUN4QyxNQUFNLEVBQUUsMEJBQTBCO3dCQUNsQyxJQUFJLEVBQUUsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUc7d0JBQ3JDLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsMEJBQXdCLElBQUksQ0FBQyxHQUFHLFFBQUs7cUJBQ25ELEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUM7WUFJRCxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELFdBQVcsRUFBRSxDQUFDO2dCQUVkLGNBQWMsR0FBRyxPQUFBLEdBQUcsQ0FBQyxtQkFBbUIsRUFDcEM7b0JBQ0ksS0FBSyxFQUFFLFlBQVk7b0JBQ25CLE1BQU0sRUFBRSxrQkFBa0I7b0JBQzFCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsMkJBQXlCLElBQUksQ0FBQyxHQUFHLFFBQUs7aUJBQ3BELEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRWYsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsc0JBQXNCLElBQUksSUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBRWxGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osV0FBVyxFQUFFLENBQUM7d0JBRWQsZ0JBQWdCLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7NEJBQ3hDLE1BQU0sRUFBRSxvQkFBb0I7NEJBQzVCLFFBQVEsRUFBRSxRQUFROzRCQUNsQixTQUFTLEVBQUUsMEJBQXdCLElBQUksQ0FBQyxHQUFHLFFBQUs7eUJBQ25ELEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUNkLFdBQVcsRUFBRSxDQUFDO3dCQUVkLGtCQUFrQixHQUFHLE9BQUEsR0FBRyxDQUFDLG1CQUFtQixFQUFFOzRCQUMxQyxNQUFNLEVBQUUsc0JBQXNCOzRCQUM5QixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsU0FBUyxFQUFFLDRCQUEwQixJQUFJLENBQUMsR0FBRyxRQUFLO3lCQUNyRCxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNiLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFPRCxJQUFJLGlCQUFpQixHQUFXLEVBQUUsQ0FBQztZQUtuQyxJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7WUFLaEMsSUFBSSxVQUFVLEdBQVcsU0FBUyxHQUFHLFVBQVUsR0FBRyxnQkFBZ0IsR0FBRyxtQkFBbUIsR0FBRyxpQkFBaUI7a0JBQ3RHLGNBQWMsR0FBRyxjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO1lBRTVGLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFBLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUYsQ0FBQyxDQUFBO1FBRVUsNkJBQXNCLEdBQUcsVUFBUyxPQUFnQixFQUFFLFlBQXFCO1lBR2hGLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQ1o7Z0JBQ0ksT0FBTyxFQUFFLG1CQUFtQixHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUM1RSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUE7UUFFVSwyQkFBb0IsR0FBRyxVQUFTLE9BQWU7WUFDdEQsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsbUJBQW1CO2FBQy9CLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQTtRQUVVLHNCQUFlLEdBQUcsVUFBUyxLQUFhLEVBQUUsRUFBVTtZQUMzRCxNQUFNLENBQUMsT0FBQSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxFQUFFO2FBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQUtVLHNCQUFlLEdBQUcsVUFBUyxHQUFXO1lBQzdDLElBQUksSUFBSSxHQUFrQixJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxpQkFBVSxHQUFHLFVBQVMsSUFBbUI7WUFDaEQsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUc3QixJQUFJLEdBQUcsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUVoRixJQUFJLFVBQVUsR0FBVyxTQUFTLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBRUQsSUFBSSxHQUFHLEdBQVcsSUFBQSxNQUFNLENBQUMsV0FBVyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7WUFDOUQsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztZQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsZUFBUSxHQUFHLFVBQVMsSUFBWTtZQUN2QyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckMsQ0FBQyxDQUFBO1FBS1UseUJBQWtCLEdBQUcsVUFBUyxJQUE4QixFQUFFLFdBQXFCO1lBQzFGLElBQUEsTUFBTSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBRS9DLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxHQUFHLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxHQUFHLElBQUksQ0FBQztZQUNuQixDQUFDO1lBRUQsSUFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRXpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsSUFBQSxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUV6QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUEsTUFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLElBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLElBQUEsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBTTFCLElBQUEsTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLElBQUEsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztnQkFFcEMsSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLElBQUEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxJQUFJLFNBQVMsR0FBVyxJQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUVqRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUM1RSxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksUUFBUSxHQUFXLE9BQUEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBTXZELElBQUksZUFBZSxHQUFXLE9BQUEsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFJMUYsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDaEMsSUFBSSxLQUFLLEdBQVcsR0FBRyxHQUFHLE1BQU0sQ0FBQztnQkFDakMsSUFBSSxXQUFTLEdBQVcsRUFBRSxDQUFDO2dCQUMzQixJQUFJLGNBQWMsR0FBVyxFQUFFLENBQUM7Z0JBQ2hDLElBQUksbUJBQW1CLEdBQVcsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLFdBQVcsR0FBVyxFQUFFLENBQUM7Z0JBTTdCLElBQUksU0FBUyxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hGLElBQUksU0FBUyxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hGLElBQUksWUFBWSxHQUFXLElBQUEsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUEsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBT3RGLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLElBQUksSUFBQSxNQUFNLENBQUMsUUFBUSxJQUFJLFNBQVMsSUFBSSxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxXQUFXLEdBQUcsT0FBQSxHQUFHLENBQUMsY0FBYyxFQUFFO3dCQUM5QixRQUFRLEVBQUUsUUFBUTt3QkFDbEIsU0FBUyxFQUFFLDhCQUE0QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBSztxQkFDNUQsRUFDRyxPQUFPLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxJQUFJLElBQUEsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUYsbUJBQW1CLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7d0JBQzNDLE1BQU0sRUFBRSw4QkFBOEI7d0JBQ3RDLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsNkJBQTJCLEdBQUcsUUFBSztxQkFDakQsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUdELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUdoQyxjQUFjLEdBQUcsT0FBQSxHQUFHLENBQUMsbUJBQW1CLEVBQUU7d0JBQ3RDLE1BQU0sRUFBRSxrQkFBa0I7d0JBQzFCLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixTQUFTLEVBQUUsMkJBQXlCLEdBQUcsUUFBSztxQkFDL0MsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDZixDQUFDO2dCQUdELElBQUksU0FBUyxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMzRCxJQUFJLFFBQVEsR0FBWSxTQUFTLElBQUksU0FBUyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUM7Z0JBRzNELEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixJQUFJLGNBQWMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxXQUFTLEdBQUcsT0FBQSxzQkFBc0IsQ0FBQyxtQkFBbUIsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQzNGLENBQUM7Z0JBRUQsSUFBSSxPQUFPLEdBQVcsT0FBQSxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUM3QixPQUFPLEVBQUUsQ0FBQyxRQUFRLEdBQUcsaUNBQWlDLEdBQUcsbUNBQW1DLENBQUM7b0JBQzdGLFNBQVMsRUFBRSxtQ0FBaUMsR0FBRyxRQUFLO29CQUNwRCxJQUFJLEVBQUUsS0FBSztpQkFDZCxFQUNHLFdBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQztnQkFFakMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQU94QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakMsQ0FBQztZQUdELElBQUEsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLEVBQUUsQ0FBQyxDQUFDLElBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLFdBQVcsR0FBVyxPQUFBLFVBQVUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsT0FBQSxTQUFTLENBQUMsQ0FBQztnQkFDakYsSUFBSSxVQUFVLEdBQVcsT0FBQSxVQUFVLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQUEsUUFBUSxDQUFDLENBQUM7Z0JBQzdFLE1BQU0sSUFBSSxPQUFBLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUMvRSxDQUFDO1lBRUQsSUFBSSxRQUFRLEdBQVcsQ0FBQyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFNOUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM1QyxJQUFJLElBQUksR0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsSUFBSSxHQUFHLEdBQVcsT0FBQSxXQUFXLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUN0RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xCLE1BQU0sSUFBSSxHQUFHLENBQUM7NEJBQ2QsUUFBUSxFQUFFLENBQUM7d0JBQ2YsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztnQkFDbEMsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLFVBQVUsR0FBRyxPQUFBLFVBQVUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsT0FBQSxRQUFRLENBQUMsQ0FBQztnQkFDckUsSUFBSSxVQUFVLEdBQUcsT0FBQSxVQUFVLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQUEsUUFBUSxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sSUFBSSxPQUFBLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUM5RSxDQUFDO1lBRUQsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixXQUFXLEVBQUUsQ0FBQztZQUNsQixDQUFDO1lBRUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFPaEMsSUFBQSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUUxQixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBQSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLGdCQUFTLEdBQUc7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3hDLElBQUEsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtRQUVVLGVBQVEsR0FBRztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdkMsSUFBQSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUsZUFBUSxHQUFHO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN2QyxJQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFFVSxlQUFRLEdBQUc7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLElBQUEsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVVLGtCQUFXLEdBQUcsVUFBUyxDQUFTLEVBQUUsSUFBbUIsRUFBRSxPQUFnQixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7WUFFcEgsRUFBRSxDQUFDLENBQUMsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFFZCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTVCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzlELENBQUM7WUFDTCxDQUFDO1lBRUQsUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLEdBQUcsR0FBRyxPQUFBLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTlELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFVSw4QkFBdUIsR0FBRyxVQUFTLElBQW1CO1lBQzdELE1BQU0sQ0FBQyxhQUFhLEdBQUcsdUJBQXVCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNHLENBQUMsQ0FBQTtRQUdVLHNCQUFlLEdBQUcsVUFBUyxJQUFtQjtZQUVyRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUtOLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBaUI1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQVF2QyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBRS9CLENBQUM7b0JBSUQsSUFBSSxDQUFDLENBQUM7d0JBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUE7UUFHVSxtQkFBWSxHQUFHLFVBQVMsSUFBbUI7WUFDbEQsSUFBSSxHQUFHLEdBQVcsT0FBQSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBRWxDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBYTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBQSxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBR3ZDLElBQUksS0FBSyxHQUFXLElBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7b0JBSzVDLElBQUksTUFBTSxHQUFXLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBRXRELE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ2QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNoQixPQUFPLEVBQUUsS0FBSyxHQUFHLElBQUk7d0JBQ3JCLFFBQVEsRUFBRSxNQUFNLEdBQUcsSUFBSTtxQkFDMUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRUQsSUFBSSxDQUFDLENBQUM7b0JBQ0YsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDZCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7d0JBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUk7d0JBQzFCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUk7cUJBQy9CLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUNuQixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTVUsVUFBRyxHQUFHLFVBQVMsR0FBVyxFQUFFLFVBQW1CLEVBQUUsT0FBZ0IsRUFBRSxRQUFrQjtZQUc1RixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssV0FBVyxDQUFDO2dCQUNsQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBR3BCLElBQUksR0FBRyxHQUFXLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksR0FBRyxDQUFDO2dCQUNYLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUM7b0JBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ0osRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDeEIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsQ0FBQzt3QkFLRCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFeEIsR0FBRyxJQUFPLENBQUMsV0FBSyxDQUFDLFFBQUksQ0FBQzt3QkFDMUIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFFSixHQUFHLElBQU8sQ0FBQyxVQUFLLENBQUMsT0FBSSxDQUFDO3dCQUMxQixDQUFDO29CQUNMLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ25CLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFFRCxHQUFHLElBQUksTUFBSSxPQUFPLFVBQUssR0FBRyxNQUFHLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsSUFBSSxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFVSxtQkFBWSxHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1lBQ2pFLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2FBQ2hCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLG9CQUFhLEdBQUcsVUFBUyxTQUFpQixFQUFFLE9BQWU7WUFDbEUsTUFBTSxDQUFDLE9BQUEsR0FBRyxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2FBQ2hCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQTtRQUVVLHdCQUFpQixHQUFHLFVBQVMsU0FBaUIsRUFBRSxPQUFlO1lBQ3RFLE1BQU0sQ0FBQyxPQUFBLEdBQUcsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixNQUFNLEVBQUUsT0FBTztnQkFDZixPQUFPLEVBQUUsU0FBUztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLGNBQWM7YUFDMUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFBO1FBRVUsaUJBQVUsR0FBRyxVQUFTLElBQVksRUFBRSxFQUFVLEVBQUUsUUFBYSxFQUFFLEdBQVM7WUFDL0UsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxnQkFBZ0I7YUFDNUIsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFBO1FBRVUsNkJBQXNCLEdBQUcsVUFBUyxRQUFnQjtZQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDaEUsQ0FBQyxDQUFBO1FBRVUseUJBQWtCLEdBQUcsVUFBUyxRQUFnQjtZQUNyRCxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFBO1FBRVUsdUJBQWdCLEdBQUcsVUFBUyxRQUFnQjtZQUNuRCxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFBO1FBRVUsMkJBQW9CLEdBQUcsVUFBUyxRQUFnQjtZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFBLE9BQU8sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMvRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNwQixDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTNqQ2dCLE1BQU0sR0FBTixVQUFNLEtBQU4sVUFBTSxRQTJqQ3RCO0FBQ0wsQ0FBQyxFQTdqQ1MsR0FBRyxLQUFILEdBQUcsUUE2akNaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBTXpDLFdBQVUsR0FBRztJQUNULElBQWlCLElBQUksQ0EwTnBCO0lBMU5ELFdBQWlCLElBQUk7UUFDTixzQkFBaUIsR0FBVyxXQUFXLENBQUM7UUFFeEMsZ0JBQVcsR0FBUSxJQUFJLENBQUM7UUFDeEIsb0JBQWUsR0FBVyxnQkFBZ0IsQ0FBQztRQUMzQyxzQkFBaUIsR0FBVyxVQUFVLENBQUM7UUFFdkMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFLbkIsa0JBQWEsR0FBUSxJQUFJLENBQUM7UUFLMUIsb0JBQWUsR0FBUSxJQUFJLENBQUM7UUFLNUIscUJBQWdCLEdBQWtCLElBQUksQ0FBQztRQU12QyxrQkFBYSxHQUFRLEVBQUUsQ0FBQztRQVN4QixpQkFBWSxHQUFxQyxFQUFFLENBQUM7UUFFcEQscUJBQWdCLEdBQUc7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSTtnQkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSTtnQkFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUk7Z0JBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBRVUsdUJBQWtCLEdBQUc7WUFLNUIsRUFBRSxDQUFDLENBQUMsS0FBQSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUMsSUFBSSxJQUFBLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsd0JBQW1CLEdBQUcsVUFBUyxHQUE0QjtZQUNsRSxLQUFBLGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLElBQUEsa0JBQWtCLEVBQUUsQ0FBQztZQUNsRCxJQUFJLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUIsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRVUscUJBQWdCLEdBQUcsVUFBUyxHQUE0QjtZQUMvRCxLQUFBLGVBQWUsR0FBRyxHQUFHLENBQUM7WUFDdEIsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLElBQUEsb0JBQW9CLEVBQUUsQ0FBQztZQUN0RCxJQUFJLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUIsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFBO1FBRVUsd0JBQW1CLEdBQUcsVUFBUyxHQUE0QjtZQUNsRSxJQUFBLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO2dCQUNyRSxRQUFRLEVBQUUsR0FBRyxDQUFDLGtCQUFrQjtnQkFDaEMsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsY0FBYyxFQUFFLEtBQUs7YUFDeEIsRUFBRSxJQUFBLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtRQUVVLHNCQUFpQixHQUFHO1lBQzNCLElBQUksSUFBSSxHQUFHLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRSxJQUFBLE9BQU8sQ0FBQyxhQUFhO2dCQUNsQyxZQUFZLEVBQUUsSUFBSTthQUNyQixFQUFFLEtBQUEsZ0JBQWdCLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUE7UUFFVSx5QkFBb0IsR0FBRztZQUM5QixJQUFJLElBQUksR0FBRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRSxNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7Z0JBQ3JFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDakIsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixXQUFXLEVBQUUsSUFBQSxPQUFPLENBQUMsT0FBTztnQkFDNUIsWUFBWSxFQUFFLElBQUk7YUFDckIsRUFBRSxLQUFBLGdCQUFnQixDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFBO1FBRVUsbUJBQWMsR0FBRyxVQUFTLElBQW1CO1lBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUEsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRCxLQUFBLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUVVLDhCQUF5QixHQUFHLFVBQVMsSUFBSSxFQUFFLFFBQVE7WUFDMUQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBTTNDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUVqQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBUyxDQUFDLEVBQUUsSUFBSTtnQkFDdkMsRUFBRSxDQUFDLENBQUMsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQy9CLE1BQU0sQ0FBQztnQkFFWCxLQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFckIsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsTUFBTSxJQUFJLEtBQUEsNEJBQTRCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtRQU9VLGlDQUE0QixHQUFHLFVBQVMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUTtZQUUzRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFMUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUEsaUJBQWlCLENBQUM7WUFHcEMsSUFBSSxhQUFhLEdBQUcsS0FBQSxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTNFLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsNkJBQTZCO2dCQUN0QyxTQUFTLEVBQUUsNENBQTBDLEdBQUcsUUFBSztnQkFDN0QsSUFBSSxFQUFFLEtBQUs7YUFDZCxFQUNHLGFBQWE7a0JBQ1gsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDaEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxlQUFlO2lCQUM5QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFBO1FBRVUsc0JBQWlCLEdBQUcsVUFBUyxHQUFHO1lBQ3ZDLElBQUksVUFBVSxHQUFHLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLCtCQUE2QixHQUFHLFFBQUssQ0FBQyxDQUFDO1lBQzdGLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUE7UUFFVSwyQkFBc0IsR0FBRyxVQUFTLE1BQU0sRUFBRSxHQUFHO1lBQ3BELEtBQUEsY0FBYyxFQUFFLENBQUM7WUFDakIsS0FBQSxnQkFBZ0IsR0FBRyxLQUFBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVyQyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQTtRQUVVLG9CQUFlLEdBQUcsVUFBUyxHQUFXO1lBSTdDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSx3Q0FBd0MsR0FBRyxHQUFHLENBQUM7WUFDekQsQ0FBQztZQUVELElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0UsSUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQTtRQUtVLG1CQUFjLEdBQUc7WUFFeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFBLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELElBQUksTUFBTSxHQUFHLEtBQUEsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLEtBQUEsaUJBQWlCLENBQUM7WUFFdEQsSUFBSSxHQUFHLEdBQUcsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRU4sSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM3RCxDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxFQTFOZ0IsSUFBSSxHQUFKLFFBQUksS0FBSixRQUFJLFFBME5wQjtBQUNMLENBQUMsRUE1TlMsR0FBRyxLQUFILEdBQUcsUUE0Tlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFeEMsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsS0FBSyxDQWtDckI7SUFsQ0QsV0FBaUIsS0FBSztRQUVsQixJQUFJLHVCQUF1QixHQUFHLFVBQVMsR0FBZ0M7WUFDbkUsSUFBQSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFBO1FBRVUsaUJBQVcsR0FBa0IsSUFBSSxDQUFDO1FBS2xDLHFCQUFlLEdBQUc7WUFDekIsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxNQUFBLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQyxJQUFJLElBQUEsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFFVSxxQkFBZSxHQUFHO1lBQ3pCLElBQUksU0FBUyxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBQSxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztZQUV0QyxJQUFBLElBQUksQ0FBQyxJQUFJLENBQTBELGdCQUFnQixFQUFFO2dCQUNqRixRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7YUFDekIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFsQ2dCLEtBQUssR0FBTCxTQUFLLEtBQUwsU0FBSyxRQWtDckI7QUFDTCxDQUFDLEVBcENTLEdBQUcsS0FBSCxHQUFHLFFBb0NaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRXZDLFdBQVUsR0FBRztJQUNULElBQWlCLElBQUksQ0F1T3BCO0lBdk9ELFdBQWlCLElBQUk7UUFFakIsSUFBSSxjQUFjLEdBQUcsVUFBUyxHQUF3QjtZQUVsRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxDQUFDLENBQUE7UUFPVSxzQkFBaUIsR0FBRztZQUMzQixNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU07Z0JBQzNDLElBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLO2dCQUN2QyxJQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTTtnQkFDeEMsSUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztRQUNoRCxDQUFDLENBQUE7UUFFVSwrQkFBMEIsR0FBRyxVQUFTLEdBQUc7WUFDaEQsSUFBSSxLQUFLLEdBQUcsb0JBQW9CLENBQUM7WUFHakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixLQUFLLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDaEMsQ0FBQztZQUVELENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUE7UUFHVSxtQ0FBOEIsR0FBRyxVQUFTLEdBQXVCO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUEsTUFBTSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsSUFBQSxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzVDLENBQUM7WUFDRCxJQUFBLE1BQU0sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUMvQixJQUFBLE1BQU0sQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7WUFDOUMsSUFBQSxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO1lBQ2pELElBQUEsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUM3RCxJQUFBLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUM7WUFFekQsSUFBQSxNQUFNLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDN0MsSUFBQSxNQUFNLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxHQUFHLElBQUEsTUFBTSxDQUFDLGFBQWEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDckcsSUFBQSxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO1lBRXZELE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsSUFBQSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFBO1FBRVUsaUJBQVksR0FBRztZQUN0QixDQUFDLElBQUksSUFBQSxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLENBQUMsQ0FBQTtRQUdVLGdCQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUUsR0FBRztZQUN2QyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLElBQUksRUFBRSxHQUFHO2FBQ1osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBS1UsZ0JBQVcsR0FBRztZQUNyQixJQUFJLFFBQVEsR0FBYSxJQUFJLElBQUEsUUFBUSxFQUFFLENBQUM7WUFDeEMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDL0IsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVVLGlCQUFZLEdBQUc7WUFFdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUU3QixJQUFJLE9BQWUsQ0FBQztZQUNwQixJQUFJLE9BQWUsQ0FBQztZQUNwQixJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7WUFFbEMsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2RCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBSTVDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBRTdDLElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFHM0QsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2xELElBQUksR0FBRyxHQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFbEQsWUFBWSxHQUFHLENBQUMsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxDQUFDLENBQUM7Z0JBS3JFLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDekIsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQzdCLENBQUM7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBRWxELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBQSxJQUFJLENBQUMsSUFBSSxDQUF3QyxPQUFPLEVBQUU7b0JBQ3RELFVBQVUsRUFBRSxPQUFPO29CQUNuQixVQUFVLEVBQUUsT0FBTztvQkFDbkIsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7b0JBQzFDLEtBQUssRUFBRSxJQUFBLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2xDLEVBQUUsVUFBUyxHQUF1QjtvQkFDL0IsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDZixLQUFBLGFBQWEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDdkQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxXQUFNLEdBQUcsVUFBUyxzQkFBc0I7WUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUdELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFOUIsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFBLFdBQVcsQ0FBQyxJQUFBLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBRUQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUEwQyxRQUFRLEVBQUUsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQTtRQUVVLFVBQUssR0FBRyxVQUFTLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRztZQUMxQyxJQUFBLElBQUksQ0FBQyxJQUFJLENBQXdDLE9BQU8sRUFBRTtnQkFDdEQsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzFDLEtBQUssRUFBRSxJQUFBLElBQUksQ0FBQyxtQkFBbUI7YUFDbEMsRUFBRSxVQUFTLEdBQXVCO2dCQUMvQixLQUFBLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFVSx5QkFBb0IsR0FBRztZQUM5QixDQUFDLENBQUMsWUFBWSxDQUFDLElBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFVSxrQkFBYSxHQUFHLFVBQVMsR0FBd0IsRUFBRSxHQUFZLEVBQUUsR0FBWSxFQUFFLFlBQXNCLEVBQUUsUUFBbUI7WUFDakksRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsR0FBRyxHQUFHLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUV4RixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDckIsS0FBQSxXQUFXLENBQUMsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3hDLEtBQUEsV0FBVyxDQUFDLElBQUEsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxLQUFBLFdBQVcsQ0FBQyxJQUFBLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNYLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztnQkFFRCxLQUFBLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUdELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQztnQkFFdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNoRSxFQUFFLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDO29CQUMxQixJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBQ2pDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2hFLEVBQUUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixHQUFHLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN2RCxFQUFFLEdBQUcsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxLQUFBLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNmLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBTWhELENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDdEMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN0QyxLQUFBLFdBQVcsQ0FBQyxJQUFBLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUdELElBQUksb0JBQW9CLEdBQUcsVUFBUyxHQUF1QjtZQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUVELElBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQTtJQUNMLENBQUMsRUF2T2dCLElBQUksR0FBSixRQUFJLEtBQUosUUFBSSxRQXVPcEI7QUFDTCxDQUFDLEVBek9TLEdBQUcsS0FBSCxHQUFHLFFBeU9aO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRXZDLFdBQVUsR0FBRztJQUNULElBQWlCLElBQUksQ0FnTXBCO0lBaE1ELFdBQWlCLElBQUk7UUFFTiwyQkFBc0IsR0FBWSxLQUFLLENBQUM7UUFFeEMsb0JBQWUsR0FBRztZQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDO1lBQ1gsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBRXBCLEVBQUUsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLGNBQWMsS0FBSyxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxVQUFVLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3JFLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsVUFBVSxJQUFJLGVBQWUsR0FBRyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBTVUsd0JBQW1CLEdBQUcsVUFBUyxHQUE2QixFQUFFLFFBQWMsRUFBRSxXQUFxQjtZQUMxRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFNUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUVsQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osS0FBQSxvQkFBb0IsRUFBRSxDQUFDO2dCQUMzQixDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUEsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDakMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBS1UsZ0JBQVcsR0FBRyxVQUFTLE1BQVksRUFBRSxrQkFBd0IsRUFBRSxXQUFpQixFQUFFLGVBQXlCO1lBQ2xILEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLEdBQUcsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQ2xDLENBQUM7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLGNBQWMsR0FBa0IsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDaEUsV0FBVyxHQUFHLGNBQWMsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFDdEUsQ0FBQztZQU9ELElBQUEsSUFBSSxDQUFDLElBQUksQ0FBa0QsWUFBWSxFQUFFO2dCQUNyRSxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsU0FBUyxFQUFFLElBQUk7Z0JBQ2Ysb0JBQW9CLEVBQUUsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEtBQUs7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFBLEdBQUcsQ0FBQyxVQUFVO2dCQUN4QixjQUFjLEVBQUUsS0FBSzthQUN4QixFQUFFLFVBQVMsR0FBNEI7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLElBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7Z0JBQzNDLENBQUM7Z0JBQ0QsS0FBQSxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBRXRDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsSUFBSSxJQUFBLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxJQUFJLElBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDM0UsSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFVSxjQUFTLEdBQUc7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZDLElBQUEsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7WUFDbkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVVLGFBQVEsR0FBRztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEMsSUFBQSxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUEsR0FBRyxDQUFDLGFBQWEsQ0FBQztZQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFBLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUVVLGFBQVEsR0FBRztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEMsSUFBQSxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUEsR0FBRyxDQUFDLGFBQWEsQ0FBQztZQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBRVUsYUFBUSxHQUFHO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUV0QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxRQUFRLEdBQUcsVUFBUyxZQUFxQjtZQUN6QyxJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtnQkFDckUsUUFBUSxFQUFFLElBQUEsTUFBTSxDQUFDLGFBQWE7Z0JBQzlCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLFFBQVEsRUFBRSxJQUFBLEdBQUcsQ0FBQyxVQUFVO2dCQUN4QixjQUFjLEVBQUUsWUFBWTthQUMvQixFQUFFLFVBQVMsR0FBNEI7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsSUFBQSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDM0MsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUEsbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQVFVLHlCQUFvQixHQUFHO1lBQzlCLEtBQUEsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1lBRTlCLFVBQVUsQ0FBQztnQkFDUCxLQUFBLHNCQUFzQixHQUFHLEtBQUssQ0FBQztnQkFFL0IsSUFBSSxHQUFHLEdBQVEsSUFBQSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM5QixDQUFDO2dCQUdELElBQUksQ0FBQyxDQUFDO29CQUNGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFNckMsQ0FBQztZQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQTtRQUVVLGdCQUFXLEdBQUc7WUFDckIsRUFBRSxDQUFDLENBQUMsS0FBQSxzQkFBc0IsQ0FBQztnQkFDdkIsTUFBTSxDQUFDO1lBR1gsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBR2pDLFVBQVUsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxLQUFBLHNCQUFzQixDQUFDO29CQUN2QixNQUFNLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLENBQUMsQ0FBQTtRQUVVLDRCQUF1QixHQUFHLFVBQVMsS0FBYTtZQUN2RCxJQUFJLElBQUksR0FBa0IsSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxHQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDO1lBRVgsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLFdBQVcsR0FBRyxRQUFRLEdBQUcsSUFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUtyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsV0FBVyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNuRCxDQUFDO2dCQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxtQkFBYyxHQUFHO1lBQ3hCLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBd0QsZUFBZSxFQUFFLEVBQUUsRUFBRSxVQUFTLEdBQStCO2dCQUMxSCxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7SUFDTCxDQUFDLEVBaE1nQixJQUFJLEdBQUosUUFBSSxLQUFKLFFBQUksUUFnTXBCO0FBQ0wsQ0FBQyxFQWxNUyxHQUFHLEtBQUgsR0FBRyxRQWtNWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUU1QyxXQUFVLEdBQUc7SUFDVCxJQUFpQixTQUFTLENBa0p6QjtJQWxKRCxXQUFpQixTQUFTO1FBRXRCLElBQUksZ0JBQWdCLEdBQUcsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLEVBQVc7WUFDdkUsSUFBSSxjQUFjLEdBQUc7Z0JBQ2pCLEtBQUssRUFBRSxjQUFjO2FBQ3hCLENBQUM7WUFFRixJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVoRSxJQUFJLGlCQUFpQixHQUFHO2dCQUNwQixPQUFPLEVBQUUsS0FBSztnQkFDZCxZQUFZLEVBQUUsRUFBRTthQUNuQixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDQyxpQkFBa0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsRUFNOUMsU0FBUztnQkFDWCxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUE7UUFFRCxJQUFJLG1CQUFtQixHQUFHLFVBQVMsT0FBZTtZQUM5QyxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtnQkFDNUIsT0FBTyxFQUFFLHNDQUFzQztnQkFDL0MsWUFBWSxFQUFFLEVBQUU7YUFHbkIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxRQUFRLEdBQUcsVUFBUyxJQUFZLEVBQUUsRUFBVSxFQUFFLE9BQVk7WUFDMUQsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixZQUFZLEVBQUUsRUFBRTthQUNuQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUE7UUFFRCxJQUFJLEtBQUssR0FBVyxhQUFhLENBQUM7UUFFdkIsZUFBSyxHQUFHO1lBU2YsSUFBSSxRQUFRLEdBQ1IsUUFBUSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztZQUNwRSxJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFcEQsSUFBSSxhQUFhLEdBQ2IsUUFBUSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSx3QkFBd0IsQ0FBQztnQkFDaEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxtQ0FBbUMsQ0FBQztnQkFDN0UsUUFBUSxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSx5QkFBeUIsQ0FBQztnQkFDL0QsUUFBUSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSwyQkFBMkIsQ0FBQztnQkFDckUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLDZCQUE2QixDQUFDO2dCQUNwRixRQUFRLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSwrQkFBK0IsQ0FBQztnQkFDcEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsK0JBQStCLENBQUM7Z0JBQ3BFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztZQUM3RSxJQUFJLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFdkQsSUFBSSxhQUFhLEdBQ2IsUUFBUSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSx3QkFBd0IsQ0FBQztnQkFDNUQsUUFBUSxDQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSwwQkFBMEIsQ0FBQztnQkFDbEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSwyQkFBMkIsQ0FBQztnQkFDdEUsUUFBUSxDQUFDLFdBQVcsRUFBRSx3QkFBd0IsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1lBQ3BGLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUV2RCxJQUFJLG1CQUFtQixHQUNuQixRQUFRLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLEVBQUUseUNBQXlDLENBQUM7Z0JBQy9GLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSx3Q0FBd0MsQ0FBQztnQkFDNUYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLG9DQUFvQyxDQUFDLENBQUM7WUFDbkcsSUFBSSxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFckUsSUFBSSxnQkFBZ0IsR0FDaEIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHVCQUF1QixFQUFFLDhCQUE4QixDQUFDO2dCQUN0RixRQUFRLENBQUMsc0JBQXNCLEVBQUUsdUJBQXVCLEVBQUUsOEJBQThCLENBQUMsQ0FBQztZQUM5RixJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUU5RCxJQUFJLGVBQWUsR0FDZixRQUFRLENBQUMsU0FBUyxFQUFFLHdCQUF3QixFQUFFLHNDQUFzQyxDQUFDO2dCQUVyRixRQUFRLENBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLG1DQUFtQyxDQUFDO2dCQUMzRSxRQUFRLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLHdDQUF3QyxDQUFDLENBQUM7WUFFdkYsSUFBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRTdELElBQUksaUJBQWlCLEdBQ2pCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsa0NBQWtDLENBQUM7Z0JBQ2hGLFFBQVEsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLEVBQUUsK0JBQStCLENBQUMsQ0FBQztZQUNwRixJQUFJLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUVuRSxJQUFJLG9CQUFvQixHQUNwQixRQUFRLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsMEJBQTBCLENBQUM7Z0JBQzlFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsdUJBQXVCLENBQUM7Z0JBQ2pFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsMkJBQTJCLENBQUM7Z0JBQzFFLFFBQVEsQ0FBQyxhQUFhLEVBQUUsMEJBQTBCLEVBQUUsOEJBQThCLENBQUMsQ0FBQztZQUN4RixJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQVlyRSxJQUFJLGNBQWMsR0FDZCxRQUFRLENBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUUsdUNBQXVDLENBQUM7Z0JBQzlGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO1lBSTlGLElBQUksYUFBYSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUVoRSxJQUFJLFVBQVUsR0FDVixRQUFRLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLDRCQUE0QixDQUFDO2dCQUMzRSxRQUFRLENBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUFFLDRCQUE0QixDQUFDO2dCQUM3RSxRQUFRLENBQUMsNEJBQTRCLEVBQUUsNkJBQTZCLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztZQUMvRyxJQUFJLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRW5FLElBQUksU0FBUyxHQUNULFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztZQUM5RSxJQUFJLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFNUQsSUFBSSxPQUFPLEdBQW1CLFdBQVcsR0FBRyxRQUFRLEdBQUcsUUFBUSxHQUFHLGNBQWMsR0FBRyxXQUFXLEdBQUcsZUFBZSxHQUEwQixVQUFVLEdBQUcsWUFBWSxHQUFHLGFBQWE7a0JBQzdLLFNBQVMsR0FBRyxZQUFZLENBQUM7WUFFL0IsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUE7UUFFVSxjQUFJLEdBQUc7WUFDZCxJQUFBLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3JDLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFsSmdCLFNBQVMsR0FBVCxhQUFTLEtBQVQsYUFBUyxRQWtKekI7QUFDTCxDQUFDLEVBcEpTLEdBQUcsS0FBSCxHQUFHLFFBb0paO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBTzFDLFdBQVUsR0FBRztJQUNULElBQWlCLE9BQU8sQ0F3VnZCO0lBeFZELFdBQWlCLE9BQU87UUFDVCxjQUFNLEdBQVEsSUFBSSxDQUFDO1FBQ25CLHdCQUFnQixHQUFXLElBQUksQ0FBQztRQUUzQyxJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQWtCLElBQUksQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBZ0IsSUFBSSxDQUFDO1FBRW5DLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztRQUVmLG1CQUFXLEdBQUc7WUFDckIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFvRCxhQUFhLEVBQUUsRUFDM0UsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQTtRQUVELElBQUksbUJBQW1CLEdBQUc7WUFDdEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQTtRQUVVLHNCQUFjLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW1CO1lBQ3pFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLEtBQUssR0FBc0IsSUFBQSxLQUFLLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxHQUFzQixJQUFBLEtBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEYsSUFBSSxNQUFNLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV0RixJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUN4QixFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUN2QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzlCLEVBQ0csSUFBSSxDQUFDLENBQUM7WUFDZCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2lCQUN0QixFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLGlDQUF5QixHQUFHLFVBQVMsSUFBbUI7WUFDL0QsSUFBSSxJQUFJLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBc0IsSUFBQSxLQUFLLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDckIsQ0FBQztZQUVELElBQUksTUFBTSxHQUFzQixJQUFBLEtBQUssQ0FBQyxlQUFlLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEYsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBc0IsSUFBQSxLQUFLLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0RixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN4QixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRVUsc0JBQWMsR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBbUI7WUFDekUsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLElBQUksUUFBUSxHQUFzQixJQUFBLEtBQUssQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckYsSUFBSSxPQUFPLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRixJQUFJLFNBQVMsR0FBc0IsSUFBQSxLQUFLLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3ZGLElBQUksT0FBTyxHQUFzQixJQUFBLEtBQUssQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkYsSUFBSSxNQUFNLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRixJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7WUFFdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxLQUFLLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtvQkFDckIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLO2lCQUN4QixFQUFFLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFFRCxJQUFJLFNBQVMsR0FBRyxRQUFBLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQ2hDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLO29CQUM5RCxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUNHLE1BQU0sQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEtBQUssSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQ3hCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQzFCLEVBQUUsTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzlCLEVBQ0csS0FBSyxDQUFDLENBQUM7WUFDZixDQUFDO1lBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVVLDRCQUFvQixHQUFHLFVBQVMsSUFBbUIsRUFBRSxVQUErQjtZQUMzRixJQUFJLFNBQVMsR0FBYTtnQkFDdEIscUJBQXFCO2dCQUNyQixvQkFBb0I7Z0JBQ3BCLG9CQUFvQjtnQkFDcEIsbUJBQW1CO2dCQUNuQixtQkFBbUI7Z0JBQ25CLHdCQUF3QjthQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDLElBQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRVUsNEJBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1lBQzNGLElBQUksU0FBUyxHQUFhO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjtnQkFDcEIsb0JBQW9CO2dCQUNwQixtQkFBbUI7Z0JBQ25CLHNCQUFzQjthQUFDLENBQUM7WUFFNUIsTUFBTSxDQUFDLElBQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRVUsd0JBQWdCLEdBQUcsVUFBUyxJQUFZO1lBQy9DLEdBQUcsR0FBRyxJQUFJLENBQUM7WUFDWCxJQUFJLEdBQUcsSUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxRQUFNLEdBQUcsUUFBQSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRTt3QkFDOUUsS0FBSyxFQUFFLFFBQU07cUJBQ2hCLEVBQUUsVUFBUyxHQUErQjt3QkFDdkMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3ZCLElBQUksR0FBRyxHQUFHLElBQUksSUFBQSxjQUFjLENBQUMsUUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQzFELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVELElBQUksaUJBQWlCLEdBQUcsVUFBUyxJQUFZO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxNQUFNLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1Qsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUk7Z0JBQUMsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUM7UUFDakQsQ0FBQyxDQUFBO1FBRUQsSUFBSSxrQkFBa0IsR0FBRyxVQUFTLE1BQWM7WUFDNUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUVoQixJQUFJLE9BQU8sR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxDQUFZLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztnQkFBbEIsSUFBSSxHQUFHLGdCQUFBO2dCQUNSLElBQUksUUFBUSxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDMUMsUUFBUSxDQUFDO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxTQUFTLEdBQVcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELElBQUksT0FBTyxHQUFXLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVwRCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBQSxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDdEQ7UUFDTCxDQUFDLENBQUE7UUFPRCxJQUFJLGdCQUFnQixHQUFHLFVBQVMsT0FBZTtZQUUzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLFNBQVMsR0FBYSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pELElBQUksT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUNsQyxDQUFDLENBQUE7UUFFVSx3QkFBZ0IsR0FBRztZQUUxQixFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sSUFBSSxRQUFBLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDN0IsUUFBQSxNQUFNLENBQUMsV0FBVyxHQUFHLFFBQUEsZ0JBQWdCLENBQUM7Z0JBQ3RDLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxpQkFBUyxHQUFHLFVBQVMsR0FBVyxFQUFFLEdBQVE7WUFDakQsUUFBQSxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2IsUUFBQSxnQkFBZ0IsRUFBRSxDQUFDO1lBQ25CLFFBQUEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUVVLG9CQUFZLEdBQUcsVUFBUyxHQUFXLEVBQUUsR0FBUTtZQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRWIsU0FBUyxHQUFHLFdBQVcsQ0FBQyxRQUFBLGlCQUFpQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUVELFFBQUEsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQU1iLFFBQUEsZ0JBQWdCLEVBQUUsQ0FBQztZQUVuQixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDeEIsR0FBRyxDQUFDLENBQVksVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO2dCQUFyQixJQUFJLEdBQUcsbUJBQUE7Z0JBRVIsRUFBRSxDQUFDLENBQUMsUUFBQSxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxTQUFTO29CQUNuQyxDQUFDLFFBQUEsTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUl6RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxRQUFBLE1BQU0sQ0FBQyxXQUFXLEdBQUcsUUFBQSxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRzlELFFBQUEsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7d0JBQ3BCLFFBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFBLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUM3QyxDQUFDO29CQUVELElBQUksQ0FBQyxDQUFDO3dCQUNGLFFBQUEsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtvQkFDeEMsQ0FBQztvQkFDRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQzthQUNKO1FBQ0wsQ0FBQyxDQUFBO1FBR1UseUJBQWlCLEdBQUc7WUFRM0IsRUFBRSxDQUFDLENBQUMsUUFBQSxNQUFNLElBQUksQ0FBQyxRQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUczQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUZBQW1GLENBQUMsQ0FBQztvQkFDakcsUUFBQSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBRUQsUUFBQSxjQUFjLENBQUMsUUFBQSxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDTCxDQUFDLENBQUE7UUFHVSxhQUFLLEdBQUc7WUFDZixFQUFFLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsUUFBQSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsUUFBQSxjQUFjLENBQUMsUUFBQSxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxxQkFBYSxHQUFHLFVBQVMsR0FBbUI7WUFDbkQsRUFBRSxDQUFDLENBQUMsUUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULFFBQUEsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLFVBQVUsQ0FBQztvQkFDUCxRQUFBLGNBQWMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQy9DLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxRQUFBLE1BQU0sQ0FBQyxDQUFDO29CQUM1QixRQUFBLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2QsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUVyQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNOLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakIsQ0FBQztnQkFDTCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRVUsWUFBSSxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsUUFBQSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULFFBQUEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxhQUFLLEdBQUcsVUFBUyxJQUFZO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLFFBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxRQUFBLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUM7UUFDTCxDQUFDLENBQUE7UUFHVSxZQUFJLEdBQUcsVUFBUyxLQUFhO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLFFBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxRQUFBLE1BQU0sQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFFVSxzQkFBYyxHQUFHLFVBQVMsR0FBVyxFQUFFLFVBQWtCO1lBQ2hFLEVBQUUsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFFOUIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7Z0JBQzlFLEtBQUssRUFBRSxHQUFHO2dCQUNWLFlBQVksRUFBRSxVQUFVO2FBRTNCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFFRCxJQUFJLHFCQUFxQixHQUFHO1FBRTVCLENBQUMsQ0FBQTtJQUNMLENBQUMsRUF4VmdCLE9BQU8sR0FBUCxXQUFPLEtBQVAsV0FBTyxRQXdWdkI7QUFDTCxDQUFDLEVBMVZTLEdBQUcsS0FBSCxHQUFHLFFBMFZaO0FBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ25GLEdBQUcsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztBQUNuRixHQUFHLENBQUMsTUFBTSxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztBQUMvRixHQUFHLENBQUMsTUFBTSxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztBQUMvRixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFFL0MsV0FBVSxHQUFHO0lBQ1QsSUFBaUIsWUFBWSxDQThHNUI7SUE5R0QsV0FBaUIsWUFBWTtRQUVkLHVCQUFVLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQW1CO1lBQ3JFLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBc0IsSUFBQSxLQUFLLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3RSxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7WUFFdEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUN4QixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBUUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGFBQWE7aUJBQ3pCLEVBQUUsSUFBSSxDQUFxQixDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckIsT0FBTyxFQUFFLGtCQUFrQjtpQkFDOUIsRUFDRyxJQUFJLENBQXFCLENBQUM7WUFDbEMsQ0FBQztZQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDLENBQUE7UUFFVSwrQkFBa0IsR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBbUI7WUFDN0UsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBRXJCLElBQUksZ0JBQWdCLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFBLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksVUFBVSxHQUFHLElBQUEsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVuRixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNiLEdBQUcsSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQixPQUFPLEVBQUUsYUFBYTtxQkFDekIsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixHQUFHLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDckIsT0FBTyxFQUFFLGtCQUFrQjtxQkFDOUIsRUFDRyxVQUFVLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBRVUsaUNBQW9CLEdBQUcsVUFBUyxJQUFtQixFQUFFLFVBQStCO1lBQzNGLElBQUksU0FBUyxHQUFhO2dCQUN0QixhQUFhO2FBQUMsQ0FBQztZQUVuQixNQUFNLENBQUMsSUFBQSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUE7UUFFVSxvQkFBTyxHQUFHO1lBQ2pCLElBQUksT0FBTyxHQUFrQixJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRTtvQkFDcEIsU0FBUyxFQUFFLElBQUk7b0JBQ2YsWUFBWSxFQUFFLElBQUk7aUJBQ3JCLEVBQUUsYUFBQSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDdEMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQUVVLG1CQUFNLEdBQUc7UUFXcEIsQ0FBQyxDQUFBO1FBRVUsNEJBQWUsR0FBRyxVQUFTLEdBQThCO1FBU3BFLENBQUMsQ0FBQTtRQUVVLDRCQUFlLEdBQUcsVUFBUyxHQUE0QjtZQUM5RCxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUE7UUFFVSxtQkFBTSxHQUFHO1lBQ2hCLENBQUMsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFBO1FBRVUseUJBQVksR0FBRyxVQUFTLElBQW1CLEVBQUUsVUFBK0I7WUFDbkYsSUFBSSxTQUFTLEdBQWE7Z0JBQ3RCLGFBQWE7YUFBQyxDQUFDO1lBRW5CLE1BQU0sQ0FBQyxJQUFBLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtJQUNMLENBQUMsRUE5R2dCLFlBQVksR0FBWixnQkFBWSxLQUFaLGdCQUFZLFFBOEc1QjtBQUNMLENBQUMsRUFoSFMsR0FBRyxLQUFILEdBQUcsUUFnSFo7QUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDekYsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0FBRWpHLEdBQUcsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDO0FBQzdGLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0FBQ3JHLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUU3QyxXQUFVLEdBQUc7SUFXVDtRQVFJLG9CQUFzQixLQUFhO1lBQW5DLGlCQVVDO1lBVnFCLFVBQUssR0FBTCxLQUFLLENBQVE7WUFOM0IsMEJBQXFCLEdBQVksSUFBSSxDQUFDO1lBb0I5QyxTQUFJLEdBQUc7WUFDUCxDQUFDLENBQUE7WUFFRCxlQUFVLEdBQUc7WUFDYixDQUFDLENBQUE7WUFFRCxVQUFLLEdBQUc7Z0JBQ0osTUFBTSxDQUFDLEVBQUUsQ0FBQTtZQUNiLENBQUMsQ0FBQztZQUVGLFNBQUksR0FBRztnQkFDSCxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBSWhCLElBQUksZUFBZSxHQUFHLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUd0RCxJQUFJLEVBQUUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFPN0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFNbEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVCLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUd2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztnQkFFckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUd2QixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO29CQUU3QixJQUFJLE9BQU8sR0FDUCxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUlkLE9BQU8sRUFBRSxtQ0FBbUM7cUJBQy9DLEVBQ0csS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3RCLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBdUI5QixDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUdGLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFLM0IsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFHRCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFFbEIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBR3JDLElBQUksT0FBTyxHQUFHLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFnQi9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO2dCQU0zQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUdwQixJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsVUFBUyxXQUFXO29CQUc3RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO2dCQU9ILE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBR3JCLFVBQVUsQ0FBQztvQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN6QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBR1AsVUFBVSxDQUFDO29CQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQTtZQVlELE9BQUUsR0FBRyxVQUFDLEVBQUU7Z0JBQ0osRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztvQkFDWCxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUdoQixFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxFQUFFLEdBQUcsUUFBUSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQzFDLENBQUMsQ0FBQTtZQUVELE9BQUUsR0FBRyxVQUFDLEVBQUU7Z0JBQ0osRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsc0JBQWlCLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVTtnQkFDekMsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFBO1lBRUQsa0JBQWEsR0FBRyxVQUFDLFNBQWlCLEVBQUUsRUFBVTtnQkFDMUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFO29CQUM3QixNQUFNLEVBQUUsRUFBRTtvQkFDVixPQUFPLEVBQUUsU0FBUztvQkFDbEIsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsT0FBTyxFQUFFLGNBQWM7aUJBQzFCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQTtZQUVELG9CQUFlLEdBQUcsVUFBQyxPQUFlLEVBQUUsRUFBVztnQkFDM0MsSUFBSSxLQUFLLEdBQUc7b0JBQ1IsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQztnQkFDRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUE7WUFJRCxlQUFVLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVSxFQUFFLFFBQWEsRUFBRSxHQUFTO2dCQUM1RCxJQUFJLE9BQU8sR0FBRztvQkFDVixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUNqQixPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixDQUFDO2dCQUVGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFFRCxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQTtZQU1ELG9CQUFlLEdBQUcsVUFBQyxJQUFZLEVBQUUsRUFBVSxFQUFFLFFBQWMsRUFBRSxHQUFTLEVBQUUsZ0JBQWdDLEVBQUUsa0JBQThCO2dCQUFoRSxpQ0FBQSxFQUFBLHVCQUFnQztnQkFBRSxtQ0FBQSxFQUFBLHNCQUE4QjtnQkFFcEksSUFBSSxPQUFPLEdBQUc7b0JBQ1YsUUFBUSxFQUFFLFFBQVE7b0JBU2xCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQztnQkFFRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBRWpCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN4QixPQUFPLEdBQUcsSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztnQkFFRCxPQUFPLElBQUksSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxFQUFFLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUU3RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUM7Z0JBQ2pDLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUE7Z0JBQ3RDLENBQUM7Z0JBRUQsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUE7WUFFRCxpQkFBWSxHQUFHLFVBQUMsRUFBVSxFQUFFLFFBQWE7Z0JBQ3JDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELGdCQUFXLEdBQUcsVUFBQyxFQUFVLEVBQUUsR0FBVztnQkFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNQLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUE7WUFFRCxnQkFBVyxHQUFHLFVBQUMsRUFBVTtnQkFDckIsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEQsQ0FBQyxDQUFBO1lBRUQsWUFBTyxHQUFHLFVBQUMsSUFBWSxFQUFFLEVBQVU7Z0JBQy9CLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQTtZQUVELG9CQUFlLEdBQUcsVUFBQyxLQUFhLEVBQUUsRUFBVTtnQkFDeEMsRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUU7b0JBQ3BDLElBQUksRUFBRSxFQUFFO29CQUNSLE1BQU0sRUFBRSxFQUFFO2lCQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUE7WUFFRCxpQkFBWSxHQUFHLFVBQUMsS0FBYSxFQUFFLEVBQVUsRUFBRSxZQUFxQjtnQkFDNUQsRUFBRSxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRWpCLElBQUksS0FBSyxHQUFHO29CQUVSLE1BQU0sRUFBRSxFQUFFO29CQUNWLElBQUksRUFBRSxFQUFFO2lCQUNYLENBQUM7Z0JBWUYsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDZixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELElBQUksUUFBUSxHQUFXLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV0RSxRQUFRLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtvQkFDNUIsS0FBSyxFQUFFLEVBQUU7aUJBQ1osRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRWhCLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsQ0FBQyxDQUFBO1lBRUQsZUFBVSxHQUFHLFVBQUMsSUFBWSxFQUFFLEVBQVcsRUFBRSxRQUFrQjtnQkFDdkQsSUFBSSxLQUFLLEdBQUc7b0JBQ1IsT0FBTyxFQUF5QixDQUFDLFFBQVEsR0FBRyxvQ0FBb0MsR0FBRyxFQUFFLENBQUMsR0FBRyxnQkFBZ0I7aUJBQzVHLENBQUM7Z0JBR0YsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDTCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFHRCxNQUFNLENBQUMsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFBO1lBRUQsVUFBSyxHQUFHLFVBQUMsRUFBVTtnQkFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQztnQkFDRCxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakIsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBSTFCLENBQUMsQ0FBQTtZQTdWRyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQU9mLElBQUEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBc0pNLDJCQUFNLEdBQWI7WUFDSSxJQUFJLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLENBQUM7UUE0TEwsaUJBQUM7SUFBRCxDQUFDLEFBdldELElBdVdDO0lBdldZLGNBQVUsYUF1V3RCLENBQUE7QUFDTCxDQUFDLEVBblhTLEdBQUcsS0FBSCxHQUFHLFFBbVhaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTlDLFdBQVUsR0FBRztJQUNUO1FBQWlDLCtCQUFVO1FBRXZDO1lBQUEsWUFDSSxrQkFBTSxhQUFhLENBQUMsU0FDdkI7WUFLRCxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTdELElBQUksV0FBVyxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDM0MsZUFBZSxFQUFFLGVBQWU7b0JBQ2hDLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxLQUFLO29CQUNaLEtBQUssRUFBRSxNQUFNO2lCQUNoQixDQUFDLENBQUM7Z0JBRUgsSUFBSSxZQUFZLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDakMsT0FBTyxFQUFFLG1FQUFtRTtvQkFDNUUsT0FBTyxFQUFFLG9DQUFvQztpQkFDaEQsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFFaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7WUFDakMsQ0FBQyxDQUFBOztRQXJCRCxDQUFDO1FBc0JMLGtCQUFDO0lBQUQsQ0FBQyxBQTFCRCxDQUFpQyxJQUFBLFVBQVUsR0EwQjFDO0lBMUJZLGVBQVcsY0EwQnZCLENBQUE7QUFDTCxDQUFDLEVBNUJTLEdBQUcsS0FBSCxHQUFHLFFBNEJaO0FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRTdDLFdBQVUsR0FBRztJQUNUO1FBQWdDLDhCQUFVO1FBRXRDLG9CQUFvQixLQUFhLEVBQVUsT0FBZSxFQUFVLFVBQWtCLEVBQVUsV0FBcUIsRUFDekcsVUFBcUI7WUFEakMsWUFFSSxrQkFBTSxZQUFZLENBQUMsU0FDdEI7WUFIbUIsV0FBSyxHQUFMLEtBQUssQ0FBUTtZQUFVLGFBQU8sR0FBUCxPQUFPLENBQVE7WUFBVSxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtZQUFVLGlCQUFXLEdBQVgsV0FBVyxDQUFVO1lBQ3pHLGdCQUFVLEdBQVYsVUFBVSxDQUFXO1lBT2pDLFdBQUssR0FBRztnQkFDSixJQUFJLE9BQU8sR0FBVyxLQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQzdHLE9BQU8sR0FBRyxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDO3NCQUM1RSxLQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3hFLE9BQU8sSUFBSSxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNuQixDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7Z0JBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNoRCxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUE7O1FBcEJELENBQUM7UUFxQkwsaUJBQUM7SUFBRCxDQUFDLEFBMUJELENBQWdDLElBQUEsVUFBVSxHQTBCekM7SUExQlksY0FBVSxhQTBCdEIsQ0FBQTtBQUNMLENBQUMsRUE1QlMsR0FBRyxLQUFILEdBQUcsUUE0Qlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFHakQsV0FBVSxHQUFHO0lBQ1Q7UUFBdUMscUNBQVU7UUFFN0MsMkJBQW9CLFFBQWdCO1lBQXBDLFlBQ0ksa0JBQU0sbUJBQW1CLENBQUMsU0FDN0I7WUFGbUIsY0FBUSxHQUFSLFFBQVEsQ0FBUTtZQU9wQyxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxPQUFPLEdBQVcsbUJBQW1CLEdBQUcsS0FBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7Z0JBRXBFLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUM7c0JBQ3JFLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUUsT0FBTyxJQUFJLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUU3QyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQTtZQUVELGNBQVEsR0FBRztnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQTtZQUVELGdCQUFVLEdBQUc7Z0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7WUFDUCxDQUFDLENBQUE7O1FBeEJELENBQUM7UUF5Qkwsd0JBQUM7SUFBRCxDQUFDLEFBN0JELENBQXVDLElBQUEsVUFBVSxHQTZCaEQ7SUE3QlkscUJBQWlCLG9CQTZCN0IsQ0FBQTtBQUNMLENBQUMsRUEvQlMsR0FBRyxLQUFILEdBQUcsUUErQlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFLN0MsV0FBVSxHQUFHO0lBQ1Q7UUFBZ0MsOEJBQVU7UUFFdEMsb0JBQW9CLE9BQWEsRUFBVSxLQUFXLEVBQVUsUUFBYztZQUE5RSxZQUNJLGtCQUFNLFlBQVksQ0FBQyxTQU10QjtZQVBtQixhQUFPLEdBQVAsT0FBTyxDQUFNO1lBQVUsV0FBSyxHQUFMLEtBQUssQ0FBTTtZQUFVLGNBQVEsR0FBUixRQUFRLENBQU07WUFZOUUsV0FBSyxHQUFHO2dCQUNKLElBQUksT0FBTyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztnQkFDMUUsT0FBTyxJQUFJLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQTtZQWJHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxLQUFLLEdBQUcsU0FBUyxDQUFDO1lBQ3RCLENBQUM7WUFDRCxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7UUFDdkIsQ0FBQztRQVVMLGlCQUFDO0lBQUQsQ0FBQyxBQW5CRCxDQUFnQyxJQUFBLFVBQVUsR0FtQnpDO0lBbkJZLGNBQVUsYUFtQnRCLENBQUE7QUFDTCxDQUFDLEVBckJTLEdBQUcsS0FBSCxHQUFHLFFBcUJaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNDLFdBQVUsR0FBRztJQUNUO1FBQThCLDRCQUFVO1FBQ3BDO1lBQUEsWUFDSSxrQkFBTSxVQUFVLENBQUMsU0FDcEI7WUFLRCxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFdEMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO29CQUNyRCxLQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVuRCxJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxtQkFBbUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQzlHLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3BFLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDekYsSUFBSSxPQUFPLEdBQUcsc0NBQXNDLENBQUM7Z0JBRXJELElBQUksSUFBSSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBRXBDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDdkIsSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFdBQVcsQ0FBQztnQkFFbkMsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztnQkFDSCxLQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQUE7WUFFRCx5QkFBbUIsR0FBRztnQkFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRTFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ04sS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDTixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFdBQUssR0FBRztnQkFFSixJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUV2QyxJQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUE7WUFFRCxtQkFBYSxHQUFHO2dCQUNaLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsSUFBSSxHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFdkMsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHdCQUF3QixFQUNwQyx3R0FBd0csRUFDeEcsYUFBYSxFQUFFO29CQUNYLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxDQUFDLElBQUksSUFBQSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQTs7UUE3REQsQ0FBQztRQThETCxlQUFDO0lBQUQsQ0FBQyxBQWpFRCxDQUE4QixJQUFBLFVBQVUsR0FpRXZDO0lBakVZLFlBQVEsV0FpRXBCLENBQUE7QUFDTCxDQUFDLEVBbkVTLEdBQUcsS0FBSCxHQUFHLFFBbUVaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBSzVDLFdBQVUsR0FBRztJQUNUO1FBQStCLDZCQUFVO1FBRXJDO1lBQUEsWUFDSSxrQkFBTSxXQUFXLENBQUMsU0FDckI7WUFLRCxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBRXpELElBQUksWUFBWSxHQUNaLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDO29CQUM1QyxLQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDO29CQUNwRCxLQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7b0JBQzFDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUVuRCxJQUFJLFlBQVksR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUMvQjtvQkFDSSxPQUFPLEVBQUUsZUFBZTtpQkFDM0IsRUFDRCxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUNaO29CQUNJLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDN0IsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLEtBQUssRUFBRSxFQUFFO2lCQUNaLEVBQ0QsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBRXBCLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNoRixJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUseUJBQXlCLEVBQ25GLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFFckUsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUV2RixNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBTTVELENBQUMsQ0FBQTtZQUVELFlBQU0sR0FBRztnQkFDTCxJQUFJLFFBQVEsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2xELElBQUksUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFHaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO29CQUNqQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQ2pDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFDM0IsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyRSxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQTBDLFFBQVEsRUFBRTtvQkFDekQsVUFBVSxFQUFFLFFBQVE7b0JBQ3BCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixPQUFPLEVBQUUsS0FBSztvQkFDZCxTQUFTLEVBQUUsT0FBTztpQkFDckIsRUFBRSxLQUFJLENBQUMsY0FBYyxFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQTtZQUVELG9CQUFjLEdBQUcsVUFBQyxHQUF3QjtnQkFDdEMsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFHNUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUVkLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FDWCx5RUFBeUUsRUFDekUsUUFBUSxDQUNYLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsdUJBQWlCLEdBQUc7Z0JBRWhCLElBQUksQ0FBQyxHQUFHLElBQUEsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBTWpDLElBQUksR0FBRyxHQUFHLGFBQWEsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQTtZQUVELHNCQUFnQixHQUFHO2dCQUNmLEtBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzdCLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztnQkFDSCxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUE7O1FBaEdELENBQUM7UUFpR0wsZ0JBQUM7SUFBRCxDQUFDLEFBckdELENBQStCLElBQUEsVUFBVSxHQXFHeEM7SUFyR1ksYUFBUyxZQXFHckIsQ0FBQTtBQUNMLENBQUMsRUF2R1MsR0FBRyxLQUFILEdBQUcsUUF1R1o7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFM0MsV0FBVSxHQUFHO0lBQ1Q7UUFBOEIsNEJBQVU7UUFDcEM7WUFBQSxZQUNJLGtCQUFNLFVBQVUsQ0FBQyxTQUNwQjtZQUtELFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUUzQyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDL0QsS0FBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFFekQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUU7b0JBQ25ELElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUNyQyxVQUFVLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDeEMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFakIsSUFBSSxvQkFBb0IsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdkcsSUFBSSxXQUFXLEdBQUcsSUFBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFFcEUsSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7Z0JBRXBDLElBQUksTUFBTSxHQUFHLDZCQUE2QixDQUFDO2dCQUMzQyxJQUFJLFFBQVEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUM7Z0JBRWxFLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ25HLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDLENBQUM7Z0JBRTlFLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUN2RCxDQUFDLENBQUE7WUFFRCxxQkFBZSxHQUFHO2dCQUNkLElBQUksT0FBTyxHQUFHLElBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztnQkFDNUQsSUFBQSxNQUFNLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxXQUFXO3NCQUN6RixJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBRTNCLElBQUksb0JBQW9CLEdBQUcsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDakUsSUFBQSxNQUFNLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBRXhELElBQUEsSUFBSSxDQUFDLElBQUksQ0FBb0UscUJBQXFCLEVBQUU7b0JBRWhHLGlCQUFpQixFQUFFO3dCQUNmLGNBQWMsRUFBRSxJQUFBLE1BQU0sQ0FBQyxjQUFjLEtBQUssSUFBQSxNQUFNLENBQUMsYUFBYTt3QkFDOUQsVUFBVSxFQUFFLElBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRO3dCQUUzQyxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsZUFBZSxFQUFFLEtBQUs7d0JBQ3RCLGVBQWUsRUFBRSxLQUFLO3dCQUN0QixjQUFjLEVBQUUsSUFBQSxNQUFNLENBQUMsWUFBWTtxQkFDdEM7aUJBQ0osRUFBRSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFBO1lBRUQsNkJBQXVCLEdBQUcsVUFBQyxHQUFxQztnQkFDNUQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsSUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoQyxJQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFHckIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztnQkFDSCxJQUFJLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLGNBQWMsSUFBSSxJQUFBLE1BQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUk7cUJBQzdGLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBRzdCLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBRTNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFBOztRQXhFRCxDQUFDO1FBeUVMLGVBQUM7SUFBRCxDQUFDLEFBNUVELENBQThCLElBQUEsVUFBVSxHQTRFdkM7SUE1RVksWUFBUSxXQTRFcEIsQ0FBQTtBQUNMLENBQUMsRUE5RVMsR0FBRyxLQUFILEdBQUcsUUE4RVo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFFbkQsV0FBVSxHQUFHO0lBQ1Q7UUFBc0Msb0NBQVU7UUFFNUM7WUFBQSxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxrQkFBa0IsR0FBRyxJQUFBLE1BQU0sQ0FBQyxXQUFXLEdBQUcsMkJBQTJCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztnQkFFNUosSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFFN0QsSUFBSSxlQUFlLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNELElBQUksa0JBQWtCLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDdkMsT0FBTyxFQUFFLG1CQUFtQjtpQkFDL0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFcEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLEdBQUcsa0JBQWtCLENBQUM7WUFDbkQsQ0FBQyxDQUFBOztRQW5CRCxDQUFDO1FBb0JMLHVCQUFDO0lBQUQsQ0FBQyxBQXhCRCxDQUFzQyxJQUFBLFVBQVUsR0F3Qi9DO0lBeEJZLG9CQUFnQixtQkF3QjVCLENBQUE7QUFDTCxDQUFDLEVBMUJTLEdBQUcsS0FBSCxHQUFHLFFBMEJaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTVDLFdBQVUsR0FBRztJQUNUO1FBQStCLDZCQUFVO1FBQ3JDO1lBQUEsWUFDSSxrQkFBTSxXQUFXLENBQUMsU0FDckI7WUFLRCxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFOUMsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUVyRixJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUMxRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxpQkFBVyxHQUFHO2dCQUNWLElBQUksYUFBYSxHQUFHLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2hELElBQUksY0FBYyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFFOUQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEUsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUEwQyxhQUFhLEVBQUU7d0JBQzlELFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRTt3QkFDMUIsZ0JBQWdCLEVBQUUsY0FBYztxQkFDbkMsRUFBRSxLQUFJLENBQUMsY0FBYyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsb0JBQWMsR0FBRyxVQUFDLEdBQXdCO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsSUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoQyxJQUFBLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUNoQyxDQUFDO1lBQ0wsQ0FBQyxDQUFBOztRQXhDRCxDQUFDO1FBeUNMLGdCQUFDO0lBQUQsQ0FBQyxBQTVDRCxDQUErQixJQUFBLFVBQVUsR0E0Q3hDO0lBNUNZLGFBQVMsWUE0Q3JCLENBQUE7QUFDTCxDQUFDLEVBOUNTLEdBQUcsS0FBSCxHQUFHLFFBOENaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTVDLFdBQVUsR0FBRztJQUNUO1FBQStCLDZCQUFVO1FBQ3JDO1lBQUEsWUFDSSxrQkFBTSxXQUFXLENBQUMsU0FDckI7WUFLRCxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVoRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBRS9FLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQzFGLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3JFLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELGlCQUFXLEdBQUc7Z0JBQ1YsSUFBSSxhQUFhLEdBQUcsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxjQUFjLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUV4RCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwRSxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFBLElBQUksQ0FBQyxJQUFJLENBQTBDLFFBQVEsRUFBRTt3QkFDekQsUUFBUSxFQUFFLGFBQWEsQ0FBQyxFQUFFO3dCQUMxQixnQkFBZ0IsRUFBRSxjQUFjO3FCQUNuQyxFQUFFLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxvQkFBYyxHQUFHLFVBQUMsR0FBd0I7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM5QixJQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hDLElBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUE7O1FBekNELENBQUM7UUEwQ0wsZ0JBQUM7SUFBRCxDQUFDLEFBN0NELENBQStCLElBQUEsVUFBVSxHQTZDeEM7SUE3Q1ksYUFBUyxZQTZDckIsQ0FBQTtBQUNMLENBQUMsRUEvQ1MsR0FBRyxLQUFILEdBQUcsUUErQ1o7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFFbkQsV0FBVSxHQUFHO0lBQ1Q7UUFBc0Msb0NBQVU7UUFFNUM7WUFBQSxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxnSUFBZ0ksQ0FBQyxDQUFDO2dCQUMxSyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFOUQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDL0YsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVwRSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQTtZQUVELGlCQUFXLEdBQUc7Z0JBQ1YsTUFBTSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFBO1lBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWtCO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksSUFBSSxHQUFHLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNoRSxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFHRCxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTtvQkFDckUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNqQixZQUFZLEVBQUUsVUFBVTtvQkFDeEIsU0FBUyxFQUFFLEVBQUU7b0JBQ2IsV0FBVyxFQUFFLEVBQUU7b0JBQ2YsWUFBWSxFQUFFLFVBQVU7aUJBQzNCLEVBQUUsSUFBQSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBQSxJQUFJLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBRUgsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUE7O1FBdkRELENBQUM7UUF3REwsdUJBQUM7SUFBRCxDQUFDLEFBNURELENBQXNDLElBQUEsVUFBVSxHQTREL0M7SUE1RFksb0JBQWdCLG1CQTRENUIsQ0FBQTtBQUNMLENBQUMsRUE5RFMsR0FBRyxLQUFILEdBQUcsUUE4RFo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFFaEQsV0FBVSxHQUFHO0lBQ1Q7UUFBbUMsaUNBQVU7UUFFekM7WUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtZQUtELFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLDZIQUE2SCxDQUFDLENBQUM7Z0JBQ3ZLLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUM5RixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXBFLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxZQUFZLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztnQkFDL0QsS0FBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFBO1lBRUQsZ0JBQVUsR0FBRztnQkFDVCxNQUFNLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxvQkFBYyxHQUFHLFVBQUMsVUFBZTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFHRCxJQUFJLElBQUksR0FBRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1IsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEUsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDakIsWUFBWSxFQUFFLFVBQVU7b0JBQ3hCLFNBQVMsRUFBRSxFQUFFO29CQUNiLFdBQVcsRUFBRSxFQUFFO29CQUNmLFlBQVksRUFBRSxVQUFVO2lCQUMzQixFQUFFLElBQUEsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUEsSUFBSSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFBO1lBRUQsVUFBSSxHQUFHO2dCQUNILElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBOztRQXRERCxDQUFDO1FBdURMLG9CQUFDO0lBQUQsQ0FBQyxBQTNERCxDQUFtQyxJQUFBLFVBQVUsR0EyRDVDO0lBM0RZLGlCQUFhLGdCQTJEekIsQ0FBQTtBQUNMLENBQUMsRUE3RFMsR0FBRyxLQUFILEdBQUcsUUE2RFo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFakQsV0FBVSxHQUFHO0lBQ1Q7UUFBb0Msa0NBQVU7UUFFMUMsd0JBQW9CLE1BQWU7WUFBbkMsWUFDSSxrQkFBTSxnQkFBZ0IsQ0FBQyxTQUMxQjtZQUZtQixZQUFNLEdBQU4sTUFBTSxDQUFTO1lBT25DLFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQ3BFLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDekYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztnQkFDckUsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVwRSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBQy9ELEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLENBQUMsQ0FBQTtZQUVELGdCQUFVLEdBQUc7Z0JBQ1QsTUFBTSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsb0JBQWMsR0FBRyxVQUFDLFVBQWU7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBR0QsSUFBSSxJQUFJLEdBQUcsSUFBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNSLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2hFLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzlDLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztnQkFDMUIsSUFBSSxPQUFPLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3pELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1YsTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRUQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxNQUFNO29CQUNoQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsWUFBWSxFQUFFLFVBQVU7aUJBQzNCLEVBQUUsSUFBQSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBQSxJQUFJLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7O1FBMURELENBQUM7UUEyREwscUJBQUM7SUFBRCxDQUFDLEFBL0RELENBQW9DLElBQUEsVUFBVSxHQStEN0M7SUEvRFksa0JBQWMsaUJBK0QxQixDQUFBO0FBQ0wsQ0FBQyxFQWpFUyxHQUFHLEtBQUgsR0FBRyxRQWlFWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUVwRCxXQUFVLEdBQUc7SUFDVDtRQUF1QyxxQ0FBVTtRQUk3QywyQkFBb0IsUUFBZ0I7WUFBcEMsWUFDSSxrQkFBTSxtQkFBbUIsQ0FBQyxTQUM3QjtZQUZtQixjQUFRLEdBQVIsUUFBUSxDQUFRO1lBV3BDLFdBQUssR0FBRztnQkFFSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztnQkFFbkYsSUFBSSxPQUFPLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUU3QixFQUFFLGtDQUFrQyxDQUFDLENBQUM7Z0JBRXZDLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFFN0UsSUFBSSxvQkFBb0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLDRCQUE0QixFQUMzRixLQUFJLENBQUMsY0FBYyxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUMvQixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO2dCQUU3RSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFNUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUN2RCxDQUFDLENBQUE7WUFFRCxvQkFBYyxHQUFHO2dCQUNiLEtBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUV0RCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsR0FBRyxJQUFJLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBMEQsZ0JBQWdCLEVBQUU7d0JBQ2pGLGFBQWEsRUFBRSxLQUFJLENBQUMsR0FBRzt3QkFDdkIsVUFBVSxFQUFFLEtBQUksQ0FBQyxRQUFRO3FCQUM1QixFQUFFLEtBQUksQ0FBQyxzQkFBc0IsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNwRCxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsNEJBQXNCLEdBQUcsVUFBQyxHQUFnQztnQkFDdEQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFNUMsSUFBSSxHQUFHLEdBQUcsZ0NBQWdDLENBQUM7b0JBRTNDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixHQUFHLElBQUksNkJBQTZCLEdBQUcsR0FBRyxDQUFDLElBQUk7OEJBQ3pDLDhCQUE4QixDQUFDO29CQUN6QyxDQUFDO29CQUVELElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztvQkFDaEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTt3QkFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBS2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNsRCxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztnQkFDSCxLQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFBOztRQWxFRCxDQUFDO1FBbUVMLHdCQUFDO0lBQUQsQ0FBQyxBQXpFRCxDQUF1QyxJQUFBLFVBQVUsR0F5RWhEO0lBekVZLHFCQUFpQixvQkF5RTdCLENBQUE7QUFDTCxDQUFDLEVBM0VTLEdBQUcsS0FBSCxHQUFHLFFBMkVaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRW5ELFdBQVUsR0FBRztJQUNUO1FBQXNDLG9DQUFVO1FBRTVDLDBCQUFvQixJQUFZO1lBQWhDLFlBQ0ksa0JBQU0sa0JBQWtCLENBQUMsU0FDNUI7WUFGbUIsVUFBSSxHQUFKLElBQUksQ0FBUTtZQU9oQyxXQUFLLEdBQUc7Z0JBQ0osSUFBSSxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLE9BQU8sR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLHVGQUF1RixDQUFDLENBQUM7Z0JBRTVILElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQztvQkFDckQsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRXhELElBQUksbUJBQW1CLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsRUFDckYsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztnQkFFNUUsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRTNFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7WUFDdkQsQ0FBQyxDQUFBO1lBRUQsbUJBQWEsR0FBRztnQkFFWixJQUFJLFFBQVEsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuRCxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUUzRCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7d0JBQzlFLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixPQUFPLEVBQUUsWUFBWTtxQkFDeEIsRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckQsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELDJCQUFxQixHQUFHLFVBQUMsR0FBK0I7Z0JBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hGLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1osS0FBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBQ0wsQ0FBQyxDQUFBOztRQS9DRCxDQUFDO1FBZ0RMLHVCQUFDO0lBQUQsQ0FBQyxBQXBERCxDQUFzQyxJQUFBLFVBQVUsR0FvRC9DO0lBcERZLG9CQUFnQixtQkFvRDVCLENBQUE7QUFDTCxDQUFDLEVBdERTLEdBQUcsS0FBSCxHQUFHLFFBc0RaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXBELFdBQVUsR0FBRztJQUNUO1FBQXVDLHFDQUFVO1FBRTdDO1lBQUEsWUFDSSxrQkFBTSxtQkFBbUIsQ0FBQyxTQUM3QjtZQUtELFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBRXZELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO2dCQUUzQixFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFpQixJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ25DLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO3dCQUNsQyxPQUFPLEVBQUUsd0JBQXdCO3FCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLENBQUM7Z0JBRUQsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7Z0JBQzlCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFTcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDekIsSUFBSSxLQUFLLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDNUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUM7d0JBQzNDLE1BQU0sRUFBRSxNQUFNO3dCQUNkLE1BQU0sRUFBRSxPQUFPO3FCQUNsQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFHYixVQUFVLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDNUIsT0FBTyxFQUFFLHNCQUFzQjtxQkFDbEMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUVELFVBQVUsSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUM5QixJQUFJLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDakMsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2lCQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFHYixVQUFVLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtvQkFDOUIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUM1QixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsTUFBTSxFQUFFLGFBQWE7aUJBQ3hCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUViLElBQUksSUFBSSxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7b0JBQzFCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDM0IsUUFBUSxFQUFFLE1BQU07b0JBQ2hCLFNBQVMsRUFBRSxxQkFBcUI7b0JBQ2hDLFdBQVcsRUFBRSxPQUFPO2lCQUN2QixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVmLG9CQUFvQixHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3JDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUN4QyxFQUFFLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUU5QyxJQUFJLFlBQVksR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsS0FBSSxDQUFDLGFBQWEsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVwRSxNQUFNLENBQUMsTUFBTSxHQUFHLGlCQUFpQixHQUFHLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztZQUN6RSxDQUFDLENBQUE7WUFFRCxvQkFBYyxHQUFHO2dCQUNiLElBQUksR0FBRyxHQUFZLEtBQUssQ0FBQztnQkFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDekIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDcEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1lBRUQsbUJBQWEsR0FBRztnQkFFWixJQUFJLFVBQVUsR0FBRyxVQUFDLFdBQVc7b0JBRXpCLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFBLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzdFLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQztvQkFNOUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQWtCLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5RSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNkLEdBQUcsRUFBRSxhQUFhLEdBQUcsUUFBUTt3QkFDN0IsSUFBSSxFQUFFLElBQUk7d0JBQ1YsS0FBSyxFQUFFLEtBQUs7d0JBQ1osV0FBVyxFQUFFLEtBQUs7d0JBQ2xCLFdBQVcsRUFBRSxLQUFLO3dCQUNsQixJQUFJLEVBQUUsTUFBTTtxQkFDZixDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDTixJQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDckIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDTixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM5QyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLGVBQWUsRUFDM0IsNkRBQTZELEVBQzdELG1CQUFtQixFQUVuQjt3QkFDSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JCLENBQUMsRUFFRDt3QkFDSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN0QixDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsVUFBSSxHQUFHO2dCQUVILENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBQSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDLENBQUE7O1FBdElELENBQUM7UUF1SUwsd0JBQUM7SUFBRCxDQUFDLEFBM0lELENBQXVDLElBQUEsVUFBVSxHQTJJaEQ7SUEzSVkscUJBQWlCLG9CQTJJN0IsQ0FBQTtBQUNMLENBQUMsRUE3SVMsR0FBRyxLQUFILEdBQUcsUUE2SVo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7QUFFNUQsV0FBVSxHQUFHO0lBQ1Q7UUFBK0MsNkNBQVU7UUFFckQ7WUFBQSxZQUNJLGtCQUFNLDJCQUEyQixDQUFDLFNBQ3JDO1lBRUQsY0FBUSxHQUFhLElBQUksQ0FBQztZQUMxQix5QkFBbUIsR0FBWSxLQUFLLENBQUM7WUFDckMsaUJBQVcsR0FBWSxLQUFLLENBQUM7WUFFN0IsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Z0JBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsaUJBQWlCLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDbkMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUM7d0JBQ2xDLE9BQU8sRUFBRSx3QkFBd0I7cUJBQ3BDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBRXBCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLG9CQUFvQixHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3pDLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVQLElBQUksSUFBSSxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7b0JBQzFCLFFBQVEsRUFBRSxhQUFhLEdBQUcsUUFBUTtvQkFDbEMsa0JBQWtCLEVBQUUsS0FBSztvQkFFekIsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUNwQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVQLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNyRixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztZQUNoRixDQUFDLENBQUE7WUFFRCx1QkFBaUIsR0FBRztnQkFFaEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixJQUFJLE1BQU0sR0FBVztvQkFDakIsR0FBRyxFQUFFLGFBQWEsR0FBRyxRQUFRO29CQUU3QixnQkFBZ0IsRUFBRSxLQUFLO29CQUN2QixTQUFTLEVBQUUsT0FBTztvQkFDbEIsV0FBVyxFQUFFLENBQUM7b0JBQ2QsZUFBZSxFQUFFLEVBQUU7b0JBSW5CLGNBQWMsRUFBRSxLQUFLO29CQUNyQixjQUFjLEVBQUUsSUFBSTtvQkFDcEIsa0JBQWtCLEVBQUUsa0NBQWtDO29CQUN0RCxvQkFBb0IsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztvQkFXM0QsSUFBSSxFQUFFO3dCQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQzt3QkFDaEQsQ0FBQzt3QkFFRCxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBQzs0QkFFN0MsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUM1QixDQUFDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRTs0QkFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNuQyxDQUFDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRTs0QkFDbkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNuQyxDQUFDLENBQUMsQ0FBQzt3QkFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUTs0QkFDM0MsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBQSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNwRCxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQzs0QkFDcEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQzt3QkFDckMsQ0FBQyxDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBUyxJQUFJOzRCQUNsQyxJQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDckIsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQztpQkFDSixDQUFDO2dCQUVJLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQTtZQUVELG9CQUFjLEdBQUcsVUFBQyxXQUFnQjtnQkFDOUIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixLQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFLbkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsbUJBQW1CLElBQUksS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDckQsS0FBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztvQkFDaEMsQ0FBQyxJQUFJLElBQUEsVUFBVSxDQUFDLGVBQWUsRUFDM0IsNkRBQTZELEVBQzdELG1CQUFtQixFQUVuQjt3QkFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDNUIsQ0FBQyxFQUVEO3dCQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUM3QixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsb0JBQWMsR0FBRztnQkFDYixJQUFJLEdBQUcsR0FBWSxLQUFLLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxDQUFhLFVBQWEsRUFBYixLQUFBLEtBQUksQ0FBQyxRQUFRLEVBQWIsY0FBYSxFQUFiLElBQWE7b0JBQXpCLElBQUksSUFBSSxTQUFBO29CQUNULEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNoQixDQUFDO2lCQUNKO2dCQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDLENBQUE7WUFFRCx5QkFBbUIsR0FBRyxVQUFDLFdBQWdCO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7b0JBQ3RDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLENBQUM7b0JBQ0YsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFBLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUVoRyxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3QixDQUFDLENBQUE7O1FBM0pELENBQUM7UUE0SkwsZ0NBQUM7SUFBRCxDQUFDLEFBaEtELENBQStDLElBQUEsVUFBVSxHQWdLeEQ7SUFoS1ksNkJBQXlCLDRCQWdLckMsQ0FBQTtBQUNMLENBQUMsRUFsS1MsR0FBRyxLQUFILEdBQUcsUUFrS1o7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFFbkQsV0FBVSxHQUFHO0lBQ1Q7UUFBc0Msb0NBQVU7UUFFNUM7WUFBQSxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Z0JBRTNCLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsaUJBQWlCLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTt3QkFDbkMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUM7d0JBQ2xDLE9BQU8sRUFBRSx3QkFBd0I7cUJBQ3BDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBRTFCLElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDaEYsZ0JBQWdCLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUNwQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRXZCLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxLQUFJLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUM1RixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUVwRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEdBQUcsb0JBQW9CLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1lBQzVGLENBQUMsQ0FBQTtZQUVELG1CQUFhLEdBQUc7Z0JBQ1osSUFBSSxTQUFTLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFHbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFBLElBQUksQ0FBQyxJQUFJLENBQXdELGVBQWUsRUFBRTt3QkFDOUUsUUFBUSxFQUFFLElBQUEsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO3dCQUNsQyxXQUFXLEVBQUUsU0FBUztxQkFDekIsRUFBRSxLQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCwyQkFBcUIsR0FBRyxVQUFDLEdBQStCO2dCQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztnQkFDSCxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFHL0MsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFBLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3BHLENBQUMsQ0FBQTs7UUF2REQsQ0FBQztRQXdETCx1QkFBQztJQUFELENBQUMsQUE1REQsQ0FBc0MsSUFBQSxVQUFVLEdBNEQvQztJQTVEWSxvQkFBZ0IsbUJBNEQ1QixDQUFBO0FBQ0wsQ0FBQyxFQTlEUyxHQUFHLEtBQUgsR0FBRyxRQThEWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQU05QyxXQUFVLEdBQUc7SUFDVDtRQUFpQywrQkFBVTtRQU92QyxxQkFBb0IsUUFBaUIsRUFBVSxXQUFxQjtZQUFwRSxZQUNJLGtCQUFNLGFBQWEsQ0FBQyxTQVF2QjtZQVRtQixjQUFRLEdBQVIsUUFBUSxDQUFTO1lBQVUsaUJBQVcsR0FBWCxXQUFXLENBQVU7WUFKcEUsc0JBQWdCLEdBQVEsRUFBRSxDQUFDO1lBQzNCLGlCQUFXLEdBQXFCLElBQUksS0FBSyxFQUFhLENBQUM7WUFpQnZELFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUUxQyxJQUFJLGNBQWMsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUN6RixJQUFJLGlCQUFpQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3JHLElBQUkscUJBQXFCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLEVBQzNFLEtBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDakcsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMseUJBQXlCLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQzNHLElBQUksZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFFaEcsSUFBSSxTQUFTLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsY0FBYyxHQUFHLGlCQUFpQixHQUFHLHFCQUFxQixHQUFHLGdCQUFnQjtzQkFDaEgsa0JBQWtCLEdBQUcsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBR3hELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDaEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUVqQixJQUFJLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFFN0IsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUN6QixtQkFBbUIsSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQyxFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQzt3QkFDbEMsT0FBTyxFQUFFLHdCQUF3QjtxQkFDcEMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsbUJBQW1CLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDckMsRUFBRSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ3RDLENBQUMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUNuQixFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztvQkFFekMsS0FBSyxFQUFFLCtCQUErQixHQUFHLEtBQUssR0FBRyxZQUFZLEdBQUcsTUFBTSxHQUFHLDZEQUE2RDtvQkFDdEksS0FBSyxFQUFFLHFCQUFxQjtpQkFFL0IsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7WUFDcEQsQ0FBQyxDQUFBO1lBTUQsd0JBQWtCLEdBQUc7Z0JBRWpCLElBQUEsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO2dCQUU3RCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFHaEIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztnQkFDM0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEtBQUssRUFBYSxDQUFDO2dCQUcxQyxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7b0JBR3RDLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztvQkFDaEIsSUFBSSxnQkFBZ0IsR0FBRyxJQUFBLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNsRyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBTW5CLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxLQUFLLEVBQUUsSUFBSTt3QkFLekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDN0MsTUFBTSxDQUFDO3dCQUNYLENBQUM7d0JBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsQ0FBQzt3QkFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUU3RSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzt3QkFDcEQsSUFBSSxjQUFjLEdBQUcsSUFBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxRCxJQUFJLFlBQVksR0FBRyxJQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXRELElBQUksU0FBUyxHQUFjLElBQUksSUFBQSxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFckcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQzt3QkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2pDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQzt3QkFFZixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUNWLEtBQUssSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2pELENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osS0FBSyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQzdELENBQUM7d0JBRUQsTUFBTSxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7NEJBQ3hCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFBLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxzQkFBc0I7a0NBQzlGLDRCQUE0QixDQUFDO3lCQUV0QyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsSUFBSSxDQUFDLENBQUM7b0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUVqQyxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUUxQyxNQUFNLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTs0QkFDeEIsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLE9BQU8sRUFBRSxnQkFBZ0I7NEJBQ3pCLE1BQU0sRUFBRSxNQUFNO3lCQUNqQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFYixTQUFTLENBQUMsSUFBSSxDQUFDOzRCQUNYLEVBQUUsRUFBRSxVQUFVOzRCQUNkLEdBQUcsRUFBRSxFQUFFO3lCQUNWLENBQUMsQ0FBQztvQkFDUCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUksS0FBSyxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDckMsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDOzRCQUM5QixPQUFPLEVBQUUsZUFBZTt5QkFDM0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBRWIsTUFBTSxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ25FLENBQUM7Z0JBQ0wsQ0FBQztnQkFhRCxJQUFJLFNBQVMsR0FBVyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUNwQztvQkFDSSxTQUFTLEVBQUUsT0FBTztpQkFDckIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFHZixJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUUvRCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDeEMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxJQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDcEQsQ0FBQztnQkFDTCxDQUFDO2dCQUVELElBQUksS0FBSyxHQUFHLElBQUEsSUFBSSxDQUFDLGtCQUFrQjtvQkFDL0IsdUpBQXVKOzt3QkFFdkosRUFBRSxDQUFDO2dCQUVQLEtBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBTzVDLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFFakYsSUFBSSxjQUFjLEdBQUcsSUFBQSxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztnQkFFN0UsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNoRixDQUFDLENBQUE7WUFFRCx3QkFBa0IsR0FBRztZQUtyQixDQUFDLENBQUE7WUFFRCxpQkFBVyxHQUFHO2dCQUNWLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLElBQUEsZUFBZSxDQUFDLEtBQUksQ0FBQyxDQUFDO2dCQUNyRCxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQyxDQUFBO1lBRUQscUJBQWUsR0FBRztnQkFDZCxFQUFFLENBQUMsQ0FBQyxJQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFBLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLFFBQVEsR0FBRztvQkFDWCxNQUFNLEVBQUUsSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLFlBQVksRUFBRSxNQUFNO29CQUNwQixhQUFhLEVBQUUsRUFBRTtpQkFDcEIsQ0FBQztnQkFDRixJQUFBLElBQUksQ0FBQyxJQUFJLENBQXNELGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQ2pJLENBQUMsQ0FBQTtZQUVELDZCQUF1QixHQUFHLFVBQUMsR0FBOEI7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELDBCQUFvQixHQUFHLFVBQUMsR0FBUTtnQkFDNUIsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUUxQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2pELElBQUEsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBS3hCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQTtZQUVELG9CQUFjLEdBQUcsVUFBQyxPQUFlO2dCQUM3QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUVuRCxJQUFJLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUd6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLENBQUM7Z0JBUUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJCLEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQTtZQUtELG9CQUFjLEdBQUcsVUFBQyxRQUFnQjtnQkFDOUIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsdUJBQXVCLEdBQUcsUUFBUSxFQUFFLGNBQWMsRUFBRTtvQkFDbEYsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFBO1lBRUQsNkJBQXVCLEdBQUcsVUFBQyxRQUFnQjtnQkFFdkMsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO2dCQUNoQixJQUFBLElBQUksQ0FBQyxJQUFJLENBQTBELGdCQUFnQixFQUFFO29CQUNqRixRQUFRLEVBQUUsSUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzFCLFVBQVUsRUFBRSxRQUFRO2lCQUN2QixFQUFFLFVBQVMsR0FBZ0M7b0JBQ3hDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFBO1lBRUQsNEJBQXNCLEdBQUcsVUFBQyxHQUFRLEVBQUUsZ0JBQXFCO2dCQUVyRCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQU01QyxJQUFBLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUdwRCxJQUFBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUV4QixLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELG1CQUFhLEdBQUcsVUFBQyxPQUFlO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksTUFBTSxHQUFHLElBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztnQkFDTCxDQUFDO2dCQUdELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUM7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDakUsS0FBSyxDQUFDO3dCQUNWLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLE1BQU0sR0FBRyxJQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixLQUFLLENBQUM7d0JBQ1YsQ0FBQztvQkFDTCxDQUFDO29CQUNELE9BQU8sRUFBRSxDQUFDO2dCQUNkLENBQUM7WUFDTCxDQUFDLENBQUE7WUFNRCxjQUFRLEdBQUc7Z0JBS1AsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUc1QixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBSUQsSUFBSSxDQUFDLENBQUM7b0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUNqQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELGlCQUFXLEdBQUcsVUFBQyxXQUFvQjtnQkFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNmLFdBQVcsR0FBRyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDO2dCQU1ELEVBQUUsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUztvQkFDakQsSUFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFBLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUM7Z0JBQzVDLENBQUM7Z0JBRUQsSUFBQSxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFBLElBQUksQ0FBQyxJQUFJLENBQWtELFlBQVksRUFBRTt3QkFDckUsVUFBVSxFQUFFLElBQUEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO3dCQUNuQyxZQUFZLEVBQUUsSUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSTt3QkFDeEMsYUFBYSxFQUFFLFdBQVc7d0JBQzFCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQWlCO3FCQUNoRSxFQUFFLElBQUEsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUEsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBQSxJQUFJLENBQUMsSUFBSSxDQUF3RCxlQUFlLEVBQUU7d0JBQzlFLFFBQVEsRUFBRSxJQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTt3QkFDakMsYUFBYSxFQUFFLFdBQVc7d0JBQzFCLFVBQVUsRUFBRSxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLEdBQUcsaUJBQWlCO3dCQUM3RCxhQUFhLEVBQUUsS0FBSSxDQUFDLFdBQVc7cUJBQ2xDLEVBQUUsSUFBQSxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBQSxJQUFJLENBQUMsQ0FBQztnQkFDekMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELHNCQUFnQixHQUFHO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFHaEMsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBRWhCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxVQUFTLEtBQWEsRUFBRSxJQUFTO29CQUV0RCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUcxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7d0JBQzdCLE1BQU0sQ0FBQztvQkFFWCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUV4RSxJQUFJLE9BQU8sQ0FBQzt3QkFFWixFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixJQUFJLE1BQU0sR0FBRyxJQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQ0FDUixNQUFNLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7NEJBQ3pELE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ2hDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osT0FBTyxHQUFHLElBQUEsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDL0MsQ0FBQzt3QkFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDOzRCQUNwRixjQUFjLENBQUMsSUFBSSxDQUFDO2dDQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2dDQUMxQixPQUFPLEVBQUUsT0FBTzs2QkFDbkIsQ0FBQyxDQUFDO3dCQUNQLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2xELENBQUM7b0JBQ0wsQ0FBQztvQkFFRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFFcEUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO3dCQUVsQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTzs0QkFFekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBRWxFLElBQUksT0FBTyxDQUFDOzRCQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3RCLElBQUksTUFBTSxHQUFHLElBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO29DQUNSLE1BQU0sNENBQTRDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQ0FDcEUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFFaEMsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixPQUFPLEdBQUcsSUFBQSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRCxDQUFDOzRCQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUM7NEJBQzlFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzNCLENBQUMsQ0FBQyxDQUFDO3dCQUVILGNBQWMsQ0FBQyxJQUFJLENBQUM7NEJBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTs0QkFDakIsUUFBUSxFQUFFLFFBQVE7eUJBQ3JCLENBQUMsQ0FBQztvQkFDUCxDQUFDO2dCQUVMLENBQUMsQ0FBQyxDQUFDO2dCQUdILEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxRQUFRLEdBQUc7d0JBQ1gsTUFBTSxFQUFFLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUN4QixVQUFVLEVBQUUsY0FBYzt3QkFDMUIsZ0JBQWdCLEVBQUUsSUFBQSxJQUFJLENBQUMsMkJBQTJCO3FCQUNyRCxDQUFDO29CQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEdBQUcsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBOEMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFBLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7d0JBQ3RHLE9BQU8sRUFBRSxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtxQkFDNUIsQ0FBQyxDQUFDO29CQUNILElBQUEsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztnQkFDN0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCx5QkFBbUIsR0FBRyxVQUFDLFNBQW9CO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVM7c0JBQzdGLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRWhCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUV4QixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFaEQsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLFVBQVUsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO29CQUMvQixVQUFVLEdBQUcsSUFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMzQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFFL0MsSUFBSSxPQUFPLEdBQVksSUFBSSxJQUFBLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ2hELFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUVqQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxNQUFNLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFOzRCQUNuQyxJQUFJLEVBQUUsRUFBRTs0QkFDUixVQUFVLEVBQUUsVUFBVTs0QkFDdEIsVUFBVSxFQUFFLFVBQVU7NEJBQ3RCLE9BQU8sRUFBRSxLQUFLOzRCQUNkLE9BQU8sRUFBRSxVQUFVO3lCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDakIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFOzRCQUNuQyxJQUFJLEVBQUUsRUFBRTs0QkFDUixPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsVUFBVTt5QkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLEdBQUcsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUN4QixPQUFPLEVBQUUsc0JBQXNCO2lCQUNsQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUVYLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDLENBQUE7WUFFRCwwQkFBb0IsR0FBRyxVQUFDLFNBQW9CLEVBQUUsU0FBYztnQkFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVoRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBRWYsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZFLElBQUksS0FBSyxHQUFHLElBQUEsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUN4QyxVQUFVLEdBQUcsSUFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUs7c0JBQ3hHLFlBQVksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRW5DLElBQUksZUFBZSxHQUFXLEVBQUUsQ0FBQztnQkFFakMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDekMsS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFO3dCQUNsQixVQUFVLEVBQUUsVUFBVTt3QkFDdEIsVUFBVSxFQUFFLFVBQVU7d0JBQ3RCLE9BQU8sRUFBRSxLQUFLO3dCQUNkLE9BQU8sRUFBRSxVQUFVO3FCQUN0QixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixlQUFlLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQzdDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO29CQUMxQyxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTs0QkFDbEMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFOzRCQUNsQixPQUFPLEVBQUUsS0FBSzs0QkFDZCxPQUFPLEVBQUUsVUFBVTt5QkFDdEIsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7NEJBQ3ZCLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTs0QkFDbEIsT0FBTyxFQUFFLGdCQUFnQjs0QkFDekIsTUFBTSxFQUFFLE1BQU07eUJBQ2pCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUViLFNBQVMsQ0FBQyxJQUFJLENBQUM7NEJBQ1gsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFOzRCQUNoQixHQUFHLEVBQUUsVUFBVTt5QkFDbEIsQ0FBQyxDQUFDO29CQUNQLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxJQUFJLE1BQU0sR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUMzQixPQUFPLEVBQUUsa0RBQWtEO2lCQUM5RCxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUVwQixJQUFJLE9BQU8sR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUM1QixPQUFPLEVBQUUsa0RBQWtEO2lCQUM5RCxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVWLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQzVCLENBQUMsQ0FBQTtZQUVELCtCQUF5QixHQUFHO2dCQUd4QixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFHM0MsSUFBSSxTQUFTLEdBQWMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNyRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUVaLElBQUksWUFBWSxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDOzRCQU03QyxJQUFJLFdBQVcsR0FBRyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUN0RCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dDQUNkLElBQUksT0FBTyxHQUFZLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dDQUNoRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29DQUVWLEtBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FJN0MsTUFBTSxDQUFDO2dDQUNYLENBQUM7NEJBQ0wsQ0FBQzt3QkFDTCxDQUFDO3dCQUNELElBQUksQ0FBQyxDQUFDOzRCQUNGLE1BQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFDO3dCQUM5QyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDcEMsQ0FBQyxDQUFBO1lBRUQsa0JBQVksR0FBRztnQkFDWCxJQUFJLFNBQVMsR0FBa0IsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRSxJQUFBLElBQUksQ0FBQyxJQUFJLENBQWdELFdBQVcsRUFBRTtvQkFDbEUsUUFBUSxFQUFFLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUMxQixhQUFhLEVBQUUsQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO29CQUN4RCxXQUFXLEVBQUUsSUFBSTtpQkFDcEIsRUFBRSxLQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUE7WUFFRCwwQkFBb0IsR0FBRyxVQUFDLEdBQTJCO2dCQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzlCLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEMsSUFBQSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELGdCQUFVLEdBQUc7Z0JBQ1QsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hDLElBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoQyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQXBvQkcsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUMzQixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7O1FBQzlDLENBQUM7UUFtb0JMLGtCQUFDO0lBQUQsQ0FBQyxBQW5wQkQsQ0FBaUMsSUFBQSxVQUFVLEdBbXBCMUM7SUFucEJZLGVBQVcsY0FtcEJ2QixDQUFBO0FBQ0wsQ0FBQyxFQXJwQlMsR0FBRyxLQUFILEdBQUcsUUFxcEJaO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBS2xELFdBQVUsR0FBRztJQUNUO1FBQXFDLG1DQUFVO1FBRTNDLHlCQUFvQixXQUFnQjtZQUFwQyxZQUNJLGtCQUFNLGlCQUFpQixDQUFDLFNBQzNCO1lBRm1CLGlCQUFXLEdBQVgsV0FBVyxDQUFLO1lBT3BDLFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBRW5ELElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsQ0FBQztnQkFDckcsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2dCQUVuRixJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUVoRixJQUFJLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFFN0IsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO29CQUN6QixtQkFBbUIsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzswQkFDakUseUNBQXlDLENBQUM7Z0JBQ3BELENBQUM7Z0JBRUQsbUJBQW1CLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBRXZGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO1lBQ3BELENBQUMsQ0FBQTtZQUVELDBCQUFvQixHQUFHO2dCQUNuQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBR2YsQ0FBQztvQkFDRyxJQUFJLGVBQWUsR0FBRyw0QkFBNEIsQ0FBQztvQkFFbkQsS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsTUFBTSxFQUFFLGVBQWU7d0JBQ3ZCLElBQUksRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQzt3QkFDOUIsYUFBYSxFQUFFLHFCQUFxQjt3QkFDcEMsT0FBTyxFQUFFLE1BQU07cUJBQ2xCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqQixDQUFDO2dCQUdELENBQUM7b0JBQ0csSUFBSSxnQkFBZ0IsR0FBRyw2QkFBNkIsQ0FBQztvQkFFckQsS0FBSyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDbEMsTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7d0JBQy9CLGFBQWEsRUFBRSxxQkFBcUI7d0JBQ3BDLE9BQU8sRUFBRSxPQUFPO3FCQUNuQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFHRCxJQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztnQkFFakUsSUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUE7WUFFRCxrQkFBWSxHQUFHO2dCQUNYLElBQUksZ0JBQWdCLEdBQUcsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLGlCQUFpQixHQUFHLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztnQkFFakYsSUFBSSxRQUFRLEdBQUc7b0JBQ1gsTUFBTSxFQUFFLElBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN4QixZQUFZLEVBQUUsZ0JBQWdCO29CQUM5QixhQUFhLEVBQUUsaUJBQWlCO2lCQUNuQyxDQUFDO2dCQUNGLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFLFFBQVEsRUFBRSxLQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDOUgsQ0FBQyxDQUFBO1lBRUQsMEJBQW9CLEdBQUcsVUFBQyxHQUE4QjtnQkFDbEQsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUUxQyxJQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2pELElBQUEsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBS3hCLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQyxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFBOztRQXBGRCxDQUFDO1FBcUZMLHNCQUFDO0lBQUQsQ0FBQyxBQXpGRCxDQUFxQyxJQUFBLFVBQVUsR0F5RjlDO0lBekZZLG1CQUFlLGtCQXlGM0IsQ0FBQTtBQUNMLENBQUMsRUEzRlMsR0FBRyxLQUFILEdBQUcsUUEyRlo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFFbkQsV0FBVSxHQUFHO0lBQ1Q7UUFBc0Msb0NBQVU7UUFFNUM7WUFBQSxZQUNJLGtCQUFNLGtCQUFrQixDQUFDLFNBQzVCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFFckQsSUFBSSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMvRSxJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxLQUFJLENBQUMsaUJBQWlCLEVBQzdGLEtBQUksQ0FBQyxDQUFDO2dCQUNWLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLCtCQUErQixDQUFDLENBQUM7Z0JBQ2hGLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFbkUsTUFBTSxDQUFDLE1BQU0sR0FBRywyRUFBMkUsR0FBRyxZQUFZO3NCQUNwRyxTQUFTLENBQUM7WUFDcEIsQ0FBQyxDQUFBO1lBRUQsdUJBQWlCLEdBQUc7Z0JBQ2hCLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNkLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ25ELE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUtELElBQUEsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7b0JBQzNFLFFBQVEsRUFBRSxJQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDOUIsV0FBVyxFQUFFLFVBQVU7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixDQUFDO29CQUNwRSxjQUFjLEVBQUUsS0FBSztpQkFDeEIsRUFBRSxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsK0JBQXlCLEdBQUcsVUFBQyxHQUE4QjtnQkFDdkQsRUFBRSxDQUFDLENBQUMsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsQ0FBQyxJQUFJLElBQUEsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUMsQ0FBQTs7UUExQ0QsQ0FBQztRQTJDTCx1QkFBQztJQUFELENBQUMsQUEvQ0QsQ0FBc0MsSUFBQSxVQUFVLEdBK0MvQztJQS9DWSxvQkFBZ0IsbUJBK0M1QixDQUFBO0FBQ0wsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUU3QyxXQUFVLEdBQUc7SUFDVDtRQUFnQyw4QkFBVTtRQUV0QztZQUFBLFlBQ0ksa0JBQU0sWUFBWSxDQUFDLFNBQ3RCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRTdDLElBQUkscUJBQXFCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSwyQkFBMkIsRUFDeEYsS0FBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUseUJBQXlCLEVBQUUsS0FBSSxDQUFDLGlCQUFpQixFQUN2RyxLQUFJLENBQUMsQ0FBQztnQkFDVixJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUVyRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBcUIsR0FBRyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFaEcsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7Z0JBQ3BDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUV0QyxJQUFJLG1CQUFtQixHQUFHLFdBQVcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsVUFBVTtvQkFDaEYsaURBQWlELEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxNQUFNLEdBQUcsdURBQXVEO3NCQUN6SSxLQUFJLENBQUMsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUV4RCxNQUFNLENBQUMsTUFBTSxHQUFHLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztZQUNwRCxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQTtZQUtELFlBQU0sR0FBRztnQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBRTFDLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBZ0UsbUJBQW1CLEVBQUU7b0JBQzFGLFFBQVEsRUFBRSxJQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDOUIsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLGVBQWUsRUFBRSxJQUFJO2lCQUN4QixFQUFFLEtBQUksQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFTRCwrQkFBeUIsR0FBRyxVQUFDLEdBQW1DO2dCQUM1RCxLQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFBO1lBS0QsdUJBQWlCLEdBQUcsVUFBQyxHQUFtQztnQkFDcEQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFFaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLFFBQVE7b0JBQzNDLElBQUksSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7b0JBQ3hELElBQUksSUFBSSxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUN0QixPQUFPLEVBQUUsZ0JBQWdCO3FCQUM1QixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksaUJBQWlCLEdBQUc7b0JBQ3BCLFNBQVMsRUFBRSw2QkFBNkIsR0FBRyxLQUFJLENBQUMsSUFBSSxHQUFHLDhCQUE4QjtvQkFDckYsTUFBTSxFQUFFLHVCQUF1QjtvQkFDL0IsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUM7aUJBQ3pDLENBQUM7Z0JBRUYsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ25CLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDN0MsQ0FBQztnQkFHRCxJQUFJLElBQUksSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFbkUsSUFBSSxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7b0JBQ3hCLEtBQUssRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUMxQyxFQUFFLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVyRCxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQTtZQUVELDZCQUF1QixHQUFHO2dCQU90QixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLFVBQVUsQ0FBQztvQkFDUCxJQUFJLE9BQU8sR0FBRyxJQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7b0JBRTdELElBQUEsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBRXhCLElBQUEsSUFBSSxDQUFDLElBQUksQ0FBc0QsY0FBYyxFQUFFO3dCQUMzRSxRQUFRLEVBQUUsSUFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7d0JBQzlCLFlBQVksRUFBRSxJQUFJO3dCQUNsQixXQUFXLEVBQUUsSUFBSTt3QkFDakIsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztxQkFDeEQsQ0FBQyxDQUFDO2dCQUVQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQTtZQUVELHFCQUFlLEdBQUcsVUFBQyxTQUFpQixFQUFFLFNBQWlCO2dCQUluRCxJQUFBLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUV4QixJQUFBLElBQUksQ0FBQyxJQUFJLENBQTRELGlCQUFpQixFQUFFO29CQUNwRixRQUFRLEVBQUUsSUFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzlCLFdBQVcsRUFBRSxTQUFTO29CQUN0QixXQUFXLEVBQUUsU0FBUztpQkFDekIsRUFBRSxLQUFJLENBQUMsdUJBQXVCLEVBQUUsS0FBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFBO1lBRUQsNkJBQXVCLEdBQUcsVUFBQyxHQUFpQztnQkFFeEQsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFnRSxtQkFBbUIsRUFBRTtvQkFDMUYsUUFBUSxFQUFFLElBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO29CQUNoQyxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsZUFBZSxFQUFFLElBQUk7aUJBQ3hCLEVBQUUsS0FBSSxDQUFDLHlCQUF5QixFQUFFLEtBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUVELHlCQUFtQixHQUFHLFVBQUMsU0FBYyxFQUFFLFFBQWE7Z0JBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxTQUFTO29CQUVqRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFDM0QsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhOzBCQUM5RyxLQUFLLENBQUMsQ0FBQztvQkFFYixJQUFJLEdBQUcsR0FBRyxJQUFBLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFdEQsR0FBRyxJQUFJLEtBQUssR0FBRyxTQUFTLEdBQUcsd0JBQXdCLEdBQUcsU0FBUyxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztvQkFFckcsR0FBRyxJQUFJLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7d0JBQ3JCLE9BQU8sRUFBRSxpQkFBaUI7cUJBQzdCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ1osQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQTtZQUVELHlCQUFtQixHQUFHO2dCQUNsQixDQUFDLElBQUksSUFBQSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQyxDQUFBO1lBRUQsdUJBQWlCLEdBQUc7Z0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFLdkMsSUFBQSxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFPeEIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFzRCxjQUFjLEVBQUU7b0JBQzNFLFFBQVEsRUFBRSxJQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDOUIsV0FBVyxFQUFFLFVBQVU7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDdEIsY0FBYyxFQUFFLEtBQUs7aUJBQ3hCLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUE7O1FBaExELENBQUM7UUFpTEwsaUJBQUM7SUFBRCxDQUFDLEFBckxELENBQWdDLElBQUEsVUFBVSxHQXFMekM7SUFyTFksY0FBVSxhQXFMdEIsQ0FBQTtBQUNMLENBQUMsRUF2TFMsR0FBRyxLQUFILEdBQUcsUUF1TFo7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFFaEQsV0FBVSxHQUFHO0lBQ1Q7UUFBbUMsaUNBQVU7UUFDekM7WUFBQSxZQUNJLGtCQUFNLGVBQWUsQ0FBQyxTQUN6QjtZQUtELFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUNoRixJQUFJLGtCQUFrQixHQUFHLCtCQUErQixHQUFHLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBRXJHLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFFN0YsSUFBSSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUNqRyxJQUFJLFVBQVUsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFeEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxrQkFBa0IsR0FBRyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBQ3ZGLENBQUMsQ0FBQTtZQUVELGdCQUFVLEdBQUc7Z0JBQ1QsSUFBSSxPQUFPLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUV2RCxFQUFFLENBQUMsQ0FBQyxJQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixDQUFDLElBQUksSUFBQSxVQUFVLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN6RCxNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFFRCxJQUFJLGFBQWEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLENBQUMsSUFBSSxJQUFBLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BELE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUdELElBQUksU0FBUyxHQUFHLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFakQsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssSUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRW5FLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztnQkFDaEIsSUFBQSxJQUFJLENBQUMsSUFBSSxDQUFrRCxZQUFZLEVBQUU7b0JBQ3JFLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRTtvQkFDMUIsU0FBUyxFQUFFLE9BQU87aUJBQ3JCLEVBQUUsVUFBUyxHQUE0QjtvQkFDcEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQTtZQUVELHdCQUFrQixHQUFHLFVBQUMsR0FBNEIsRUFBRSxnQkFBeUI7Z0JBQ3pFLEVBQUUsQ0FBQyxDQUFDLElBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN0QyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLElBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsQ0FBQztnQkFFTCxDQUFDO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsVUFBSSxHQUFHO2dCQUNILElBQUksYUFBYSxHQUFHLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDakIsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUE7O1FBbEVELENBQUM7UUFtRUwsb0JBQUM7SUFBRCxDQUFDLEFBdEVELENBQW1DLElBQUEsVUFBVSxHQXNFNUM7SUF0RVksaUJBQWEsZ0JBc0V6QixDQUFBO0FBQ0wsQ0FBQyxFQXhFUyxHQUFHLEtBQUgsR0FBRyxRQXdFWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUdqRCxXQUFVLEdBQUc7SUFDVDtRQUFvQyxrQ0FBVTtRQUUxQyx3QkFBb0IsU0FBaUIsRUFBVSxPQUFlLEVBQVUsZ0JBQXdCO1lBQWhHLFlBQ0ksa0JBQU0sZ0JBQWdCLENBQUMsU0FHMUI7WUFKbUIsZUFBUyxHQUFULFNBQVMsQ0FBUTtZQUFVLGFBQU8sR0FBUCxPQUFPLENBQVE7WUFBVSxzQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7WUFvQmhHLFdBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLElBQUksR0FBa0IsSUFBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNSLE1BQU0sdUJBQXFCLEtBQUksQ0FBQyxPQUFTLENBQUM7Z0JBQzlDLENBQUM7Z0JBRUQsSUFBSSxRQUFRLEdBQXNCLElBQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFHckYsSUFBSSxXQUFXLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNqQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFLbkIsSUFBSSxhQUFhLEdBQVE7b0JBQ3JCLEtBQUssRUFBRSxLQUFJLENBQUMsU0FBUztvQkFDckIsSUFBSSxFQUFFLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUM1QixPQUFPLEVBQUUsaUZBQWlGO29CQUMxRixjQUFjLEVBQUUsK0JBQTZCLEtBQUksQ0FBQyxPQUFPLGNBQVc7b0JBQ3BFLFdBQVcsRUFBRSw0QkFBMEIsS0FBSSxDQUFDLE9BQU8sY0FBVztvQkFDOUQsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLFNBQVMsRUFBRSxNQUFNO2lCQUNwQixDQUFDO2dCQUVGLElBQUksTUFBTSxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBR2hELElBQUksZ0JBQWdCLEdBQUcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtvQkFDOUMsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFNBQVMsRUFBRSw0QkFBMEIsS0FBSSxDQUFDLE9BQU8sY0FBVztvQkFDNUQsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxPQUFPLENBQUMsQ0FBQztnQkFFYixJQUFJLG1CQUFtQixHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQ2pELFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsMkJBQXlCLEtBQUksQ0FBQyxPQUFPLGNBQVc7b0JBQzNELE9BQU8sRUFBRSxnQkFBZ0I7aUJBQzVCLEVBQ0csT0FBTyxDQUFDLENBQUM7Z0JBRWIsSUFBSSxhQUFhLEdBQUcsSUFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztnQkFHckYsSUFBSSxpQkFBaUIsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUMvQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHlCQUF5QjtvQkFDcEMsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxRQUFRLENBQUMsQ0FBQztnQkFFZCxJQUFJLGFBQWEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUMzQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHlCQUF5QjtvQkFDcEMsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxNQUFNLENBQUMsQ0FBQztnQkFFWixJQUFJLGFBQWEsR0FBRyxJQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFO29CQUMzQyxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsU0FBUyxFQUFFLHVCQUF1QjtvQkFDbEMsT0FBTyxFQUFFLGdCQUFnQjtpQkFDNUIsRUFDRyxJQUFJLENBQUMsQ0FBQztnQkFFVixJQUFJLGNBQWMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUM7Z0JBR2pHLElBQUksV0FBVyxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQ3pDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUsc0JBQXNCO29CQUNqQyxPQUFPLEVBQUUsZ0JBQWdCO2lCQUM1QixFQUNHLE9BQU8sQ0FBQyxDQUFDO2dCQUViLElBQUksVUFBVSxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUU7b0JBQ3hDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixTQUFTLEVBQUUscUJBQXFCO29CQUNoQyxPQUFPLEVBQUUsWUFBWTtpQkFDeEIsRUFDRyxNQUFNLENBQUMsQ0FBQztnQkFHWixJQUFJLFdBQVcsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXZGLElBQUksU0FBUyxHQUFHLElBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBRWpGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sR0FBRyxhQUFhLEdBQUcsY0FBYyxHQUFHLFNBQVMsQ0FBQztZQUN0RixDQUFDLENBQUE7WUFFRCxnQkFBVSxHQUFHO2dCQUNULElBQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUE7WUFFRCxjQUFRLEdBQUc7Z0JBQ1AsSUFBQSxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQTtZQUVELFVBQUksR0FBRztZQUNQLENBQUMsQ0FBQTtZQXhIRyxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFvQyxnQkFBa0IsQ0FBQyxDQUFDO1lBQ3BFLElBQUEsT0FBTyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDOztRQUNoRCxDQUFDO1FBR00sK0JBQU0sR0FBYjtZQUNJLGlCQUFNLE1BQU0sV0FBRSxDQUFDO1lBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFeEIsTUFBTSxDQUFDLENBQUMsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsQ0FBQztRQUNMLENBQUM7UUE0R0wscUJBQUM7SUFBRCxDQUFDLEFBN0hELENBQW9DLElBQUEsVUFBVSxHQTZIN0M7SUE3SFksa0JBQWMsaUJBNkgxQixDQUFBO0FBQ0wsQ0FBQyxFQS9IUyxHQUFHLEtBQUgsR0FBRyxRQStIWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUVoRCxXQUFVLEdBQUc7SUFDVDtRQUFtQyxpQ0FBVTtRQUt6QztZQUFBLFlBQ0ksa0JBQU0sZUFBZSxDQUFDLFNBQ3pCO1lBS0QsV0FBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFaEQsSUFBSSxzQkFBc0IsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUgsSUFBSSxxQkFBcUIsR0FBRyxLQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxDQUFDO2dCQUM5RyxJQUFJLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLG9CQUFvQixFQUFFLEtBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLENBQUM7Z0JBQ3ZHLElBQUksVUFBVSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLFNBQVMsR0FBRyxJQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsR0FBRyxxQkFBcUIsR0FBRyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFFM0gsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBRWhCLE9BQU8sSUFBSSxLQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEYsT0FBTyxJQUFJLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM3RSxPQUFPLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXZGLElBQUksT0FBTyxHQUFHLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQzVCLE9BQU8sRUFBRSxTQUFTO2lCQUNyQixFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUVaLElBQUksV0FBVyxHQUFXLE9BQU8sQ0FBQztnQkFFbEMsSUFBSSxjQUFjLEdBQVcsSUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFDM0MsT0FBTyxFQUFFLGVBQWU7aUJBQzNCLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRVgsTUFBTSxDQUFDLGNBQWMsR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQ3BELENBQUMsQ0FBQTtZQXNCRCxzQkFBZ0IsR0FBRztnQkFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQTtZQUVELHFCQUFlLEdBQUc7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUNELElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUE7WUFFRCxrQkFBWSxHQUFHO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN4QixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUE7WUFFRCxnQkFBVSxHQUFHLFVBQUMsT0FBWTtnQkFDdEIsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqRCxLQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7Z0JBRXhDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNwQixLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFDRCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDMUIsS0FBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUE7WUFFRCxVQUFJLEdBQUc7Z0JBQ0gsSUFBSSxJQUFJLEdBQWtCLElBQUEsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3RELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBSSxlQUFlLEdBQVksSUFBQSxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQzVELEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDekMsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixLQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3pDLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQTs7UUFwR0QsQ0FBQztRQWtDRCxvQ0FBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLFFBQWdCLEVBQUUsT0FBZSxFQUFFLGlCQUEwQjtZQUNuRixJQUFJLE9BQU8sR0FBVztnQkFDbEIsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFNBQVMsRUFBRSxPQUFPO2FBQ3JCLENBQUM7WUFFRixJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUVqRCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUM5QixDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxVQUFVLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7Z0JBQ3BFLElBQUksRUFBRSxLQUFLO2dCQUNYLFNBQVMsRUFBRSxJQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ2xFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixDQUFDO1FBaURMLG9CQUFDO0lBQUQsQ0FBQyxBQTVHRCxDQUFtQyxJQUFBLFVBQVUsR0E0RzVDO0lBNUdZLGlCQUFhLGdCQTRHekIsQ0FBQTtBQUNMLENBQUMsRUE5R1MsR0FBRyxLQUFILEdBQUcsUUE4R1o7QUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFFckQsV0FBVSxHQUFHO0lBQ1Q7UUFBQTtZQUVJLFVBQUssR0FBVyxvQkFBb0IsQ0FBQztZQUNyQyxVQUFLLEdBQVcsZUFBZSxDQUFDO1lBQ2hDLFlBQU8sR0FBWSxLQUFLLENBQUM7WUFFekIsVUFBSyxHQUFHO2dCQUNKLElBQUksTUFBTSxHQUFHLG1EQUFtRCxDQUFDO2dCQUNqRSxJQUFJLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDaEMsQ0FBQyxDQUFDO1lBRUYsU0FBSSxHQUFHO2dCQUNILENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDakQsSUFBQSxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBQSxJQUFJLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDNUUsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUFELHlCQUFDO0lBQUQsQ0FBQyxBQWhCRCxJQWdCQztJQWhCWSxzQkFBa0IscUJBZ0I5QixDQUFBO0FBQ0wsQ0FBQyxFQWxCUyxHQUFHLEtBQUgsR0FBRyxRQWtCWjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUV2RCxXQUFVLEdBQUc7SUFDVDtRQUFBO1lBRUksVUFBSyxHQUFXLHNCQUFzQixDQUFDO1lBQ3ZDLFVBQUssR0FBVyxpQkFBaUIsQ0FBQztZQUNsQyxZQUFPLEdBQVksS0FBSyxDQUFDO1lBRXpCLFVBQUssR0FBRztnQkFDSixJQUFJLE1BQU0sR0FBRyxxREFBcUQsQ0FBQztnQkFDbkUsSUFBSSxXQUFXLEdBQUcsK0JBQStCLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO1lBQ2hDLENBQUMsQ0FBQTtZQUVELFNBQUksR0FBRztnQkFDSCxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDckQsSUFBQSxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBQSxJQUFJLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQTtRQUNMLENBQUM7UUFBRCwyQkFBQztJQUFELENBQUMsQUFoQkQsSUFnQkM7SUFoQlksd0JBQW9CLHVCQWdCaEMsQ0FBQTtBQUNMLENBQUMsRUFsQlMsR0FBRyxLQUFILEdBQUcsUUFrQloiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBcInVzZSBzdHJpY3RcIjtcblxuLy90b2RvLTA6IG5lZWQgdG8gZmluZCB0aGUgRGVmaW5pdGVseVR5cGVkIGZpbGUgZm9yIFBvbHltZXIuXG5kZWNsYXJlIHZhciBQb2x5bWVyO1xuZGVjbGFyZSB2YXIgRHJvcHpvbmU7XG5kZWNsYXJlIHZhciBhY2U7XG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3R5ZXBkZWZzL2pxdWVyeS9qcXVlcnkuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90eWVwZGVmcy9qcXVlcnkuY29va2llL2pxdWVyeS5jb29raWUuZC50c1wiIC8+XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2UganNvbiB7XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBBY2Nlc3NDb250cm9sRW50cnlJbmZvIHtcbiAgICAgICAgICAgIHByaW5jaXBhbE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IFByaXZpbGVnZUluZm9bXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZUluZm8ge1xuICAgICAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhdGg6IHN0cmluZztcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByaW1hcnlUeXBlTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcGVydGllczogUHJvcGVydHlJbmZvW107XG4gICAgICAgICAgICBoYXNDaGlsZHJlbjogYm9vbGVhbjtcbiAgICAgICAgICAgIGhhc0JpbmFyeTogYm9vbGVhbjtcbiAgICAgICAgICAgIGJpbmFyeUlzSW1hZ2U6IGJvb2xlYW47XG4gICAgICAgICAgICBiaW5WZXI6IG51bWJlcjtcbiAgICAgICAgICAgIHdpZHRoOiBudW1iZXI7XG4gICAgICAgICAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICAgICAgICAgIGNoaWxkcmVuT3JkZXJlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIHVpZDogc3RyaW5nO1xuICAgICAgICAgICAgY3JlYXRlZEJ5OiBzdHJpbmc7XG4gICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IERhdGU7XG4gICAgICAgICAgICBpbWdJZDogc3RyaW5nO1xuICAgICAgICAgICAgb3duZXI6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJpdmlsZWdlSW5mbyB7XG4gICAgICAgICAgICBwcml2aWxlZ2VOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFByb3BlcnR5SW5mbyB7XG4gICAgICAgICAgICB0eXBlOiBudW1iZXI7XG4gICAgICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB2YWx1ZTogc3RyaW5nO1xuICAgICAgICAgICAgdmFsdWVzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIGFiYnJldmlhdGVkOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZWZJbmZvIHtcbiAgICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwYXRoOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgICAgICAgICBlZGl0TW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGFkdmFuY2VkTW9kZTogYm9vbGVhbjtcbiAgICAgICAgICAgIGxhc3ROb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBpbXBvcnRBbGxvd2VkOiBib29sZWFuO1xuICAgICAgICAgICAgZXhwb3J0QWxsb3dlZDogYm9vbGVhbjtcbiAgICAgICAgICAgIHNob3dNZXRhRGF0YTogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQWRkUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaXZpbGVnZXM6IHN0cmluZ1tdO1xuICAgICAgICAgICAgcHJpbmNpcGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWNBcHBlbmQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFub25QYWdlTG9hZFJlcXVlc3Qge1xuICAgICAgICAgICAgaWdub3JlVXJsOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VQYXNzd29yZFJlcXVlc3Qge1xuICAgICAgICAgICAgbmV3UGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3NDb2RlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENsb3NlQWNjb3VudFJlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZVJTU1JlcXVlc3Qge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgICAgIHRpbWVPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgICAgIC8vbm9kZVBhdGg6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0UGxheWVySW5mb1JlcXVlc3Qge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Yk5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3Tm9kZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHR5cGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBjcmVhdGVBdFRvcDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlQXR0YWNobWVudFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWRzOiBzdHJpbmdbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUHJvcGVydHlSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgcHJvcE5hbWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldEZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIGluY2x1ZGVBY2w6IGJvb2xlYW47XG4gICAgICAgICAgICBpbmNsdWRlT3duZXJzOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRTZXJ2ZXJJbmZvUmVxdWVzdCB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldFNoYXJlZE5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0UmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNvdXJjZUZpbGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluc2VydEJvb2tSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgYm9va05hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHRydW5jYXRlZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgcGFyZW50SWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIG5ld05vZGVOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0eXBlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dpblJlcXVlc3Qge1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgICAgICAgICB0ek9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgZHN0OiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXF1ZXN0IHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTW92ZU5vZGVzUmVxdWVzdCB7XG4gICAgICAgICAgICB0YXJnZXROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHRhcmdldENoaWxkSWQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZHM6IHN0cmluZ1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBOb2RlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBzb3J0RGlyOiBzdHJpbmc7XG4gICAgICAgICAgICBzb3J0RmllbGQ6IHN0cmluZztcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoVGV4dDogc3RyaW5nO1xuICAgICAgICAgICAgc2VhcmNoUHJvcDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBGaWxlU2VhcmNoUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHN0cmluZztcbiAgICAgICAgICAgIHJlaW5kZXg6IGJvb2xlYW5cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHByaW5jaXBhbDogc3RyaW5nO1xuICAgICAgICAgICAgcHJpdmlsZWdlOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmFtZU5vZGVSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbmV3TmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5kZXJOb2RlUmVxdWVzdCB7XG4gICAgICAgICAgICBub2RlSWQ6IHN0cmluZztcbiAgICAgICAgICAgIHVwTGV2ZWw6IG51bWJlcjtcbiAgICAgICAgICAgIG9mZnNldDogbnVtYmVyO1xuICAgICAgICAgICAgcmVuZGVyUGFyZW50SWZMZWFmOiBib29sZWFuO1xuICAgICAgICAgICAgZ29Ub0xhc3RQYWdlOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZXNldFBhc3N3b3JkUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyOiBzdHJpbmc7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTYXZlTm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBQcm9wZXJ0eUluZm9bXTtcbiAgICAgICAgICAgIHNlbmROb3RpZmljYXRpb246IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHByb3BlcnR5VmFsdWU6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1JlcXVlc3Qge1xuICAgICAgICAgICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZXM7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9wZW5TeXN0ZW1GaWxlUmVxdWVzdCB7XG4gICAgICAgICAgICBmaWxlTmFtZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXROb2RlUG9zaXRpb25SZXF1ZXN0IHtcbiAgICAgICAgICAgIHBhcmVudE5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBzaWJsaW5nSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVxdWVzdCB7XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZztcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICBjYXB0Y2hhOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNwbGl0Tm9kZVJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgICAgICBub2RlQmVsb3dJZDogc3RyaW5nO1xuICAgICAgICAgICAgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXF1ZXN0IHtcbiAgICAgICAgICAgIG5vZGVJZDogc3RyaW5nO1xuICAgICAgICAgICAgc291cmNlVXJsOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEJyb3dzZUZvbGRlclJlcXVlc3Qge1xuICAgICAgICAgICAgbm9kZUlkOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEFkZFByaXZpbGVnZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgQW5vblBhZ2VMb2FkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgICAgICAgICAgcmVuZGVyTm9kZVJlc3BvbnNlOiBSZW5kZXJOb2RlUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIENoYW5nZVBhc3N3b3JkUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdXNlcjogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDbG9zZUFjY291bnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlUlNTUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBHZXRQbGF5ZXJJbmZvUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgdGltZU9mZnNldDogbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBDcmVhdGVTdWJOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIERlbGV0ZU5vZGVzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBEZWxldGVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZUluZm86IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBFeHBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgYWNsRW50cmllczogQWNjZXNzQ29udHJvbEVudHJ5SW5mb1tdO1xuICAgICAgICAgICAgb3duZXJzOiBzdHJpbmdbXTtcbiAgICAgICAgICAgIHB1YmxpY0FwcGVuZDogYm9vbGVhbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2VydmVySW5mb1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlcnZlckluZm86IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgR2V0U2hhcmVkTm9kZXNSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzOiBOb2RlSW5mb1tdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbXBvcnRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEluaXROb2RlRWRpdFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGVJbmZvOiBOb2RlSW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgSW5zZXJ0Qm9va1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5ld05vZGU6IE5vZGVJbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBJbnNlcnROb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3Tm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgcm9vdE5vZGU6IFJlZkluZm87XG4gICAgICAgICAgICB1c2VyTmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU6IHN0cmluZztcbiAgICAgICAgICAgIGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VzO1xuICAgICAgICAgICAgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBMb2dvdXRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE1vdmVOb2Rlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgTm9kZVNlYXJjaFJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHM6IE5vZGVJbmZvW107XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEZpbGVTZWFyY2hSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzZWFyY2hSZXN1bHROb2RlSWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBSZW5hbWVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbmV3SWQ6IHN0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyTm9kZVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIG5vZGU6IE5vZGVJbmZvO1xuICAgICAgICAgICAgY2hpbGRyZW46IE5vZGVJbmZvW107XG4gICAgICAgICAgICBvZmZzZXRPZk5vZGVGb3VuZDogbnVtYmVyO1xuXG4gICAgICAgICAgICAvKiBob2xkcyB0cnVlIGlmIHdlIGhpdCB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkIG5vZGVzICovXG4gICAgICAgICAgICBlbmRSZWFjaGVkOiBib29sZWFuO1xuXG4gICAgICAgICAgICBkaXNwbGF5ZWRQYXJlbnQ6IGJvb2xlYW47XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFJlc2V0UGFzc3dvcmRSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVOb2RlUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICAgICAgbm9kZTogTm9kZUluZm87XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNhdmVQcm9wZXJ0eVJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5U2F2ZWQ6IFByb3BlcnR5SW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2F2ZVVzZXJQcmVmZXJlbmNlc1Jlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgT3BlblN5c3RlbUZpbGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFNldE5vZGVQb3NpdGlvblJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU2lnbnVwUmVzcG9uc2UgZXh0ZW5kcyBPYWtSZXNwb25zZUJhc2Uge1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTcGxpdE5vZGVSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFVwbG9hZEZyb21VcmxSZXNwb25zZSBleHRlbmRzIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIEJyb3dzZUZvbGRlclJlc3BvbnNlIGV4dGVuZHMgT2FrUmVzcG9uc2VCYXNlIHtcbiAgICAgICAgICAgIGxpc3RpbmdKc29uOiBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIE9ha1Jlc3BvbnNlQmFzZSB7XG4gICAgICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuY29uc29sZS5sb2coXCJydW5uaW5nIGFwcC5qc1wiKTtcblxuLy8gdmFyIG9ucmVzaXplID0gd2luZG93Lm9ucmVzaXplO1xuLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHsgaWYgKHR5cGVvZiBvbnJlc2l6ZSA9PT0gJ2Z1bmN0aW9uJykgb25yZXNpemUoKTsgLyoqIC4uLiAqLyB9XG5cbnZhciBhZGRFdmVudCA9IGZ1bmN0aW9uKG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwgfHwgdHlwZW9mIChvYmplY3QpID09ICd1bmRlZmluZWQnKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChvYmplY3QuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmplY3RbXCJvblwiICsgdHlwZV0gPSBjYWxsYmFjaztcbiAgICB9XG59O1xuXG4vKlxuICogV0FSTklORzogVGhpcyBpcyBjYWxsZWQgaW4gcmVhbHRpbWUgd2hpbGUgdXNlciBpcyByZXNpemluZyBzbyBhbHdheXMgdGhyb3R0bGUgYmFjayBhbnkgcHJvY2Vzc2luZyBzbyB0aGF0IHlvdSBkb24ndFxuICogZG8gYW55IGFjdHVhbCBwcm9jZXNzaW5nIGluIGhlcmUgdW5sZXNzIHlvdSB3YW50IGl0IFZFUlkgbGl2ZSwgYmVjYXVzZSBpdCBpcy5cbiAqL1xuZnVuY3Rpb24gd2luZG93UmVzaXplKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiV2luZG93UmVzaXplOiB3PVwiICsgd2luZG93LmlubmVyV2lkdGggKyBcIiBoPVwiICsgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemUpO1xuXG4vLyB0aGlzIGNvbW1lbnRlZCBzZWN0aW9uIGlzIG5vdCB3b3JraW5nIGluIG15IG5ldyB4LWFwcCBjb2RlLCBidXQgaXQncyBvayB0byBjb21tZW50IGl0IG91dCBmb3Igbm93LlxuLy9cbi8vIFRoaXMgaXMgb3VyIHRlbXBsYXRlIGVsZW1lbnQgaW4gaW5kZXguaHRtbFxuLy8gdmFyIGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4LWFwcCcpO1xuLy8gLy8gTGlzdGVuIGZvciB0ZW1wbGF0ZSBib3VuZCBldmVudCB0byBrbm93IHdoZW4gYmluZGluZ3Ncbi8vIC8vIGhhdmUgcmVzb2x2ZWQgYW5kIGNvbnRlbnQgaGFzIGJlZW4gc3RhbXBlZCB0byB0aGUgcGFnZVxuLy8gYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1jaGFuZ2UnLCBmdW5jdGlvbigpIHtcbi8vICAgICBjb25zb2xlLmxvZygnYXBwIHJlYWR5IGV2ZW50IScpO1xuLy8gfSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2x5bWVyLXJlYWR5JywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKCdwb2x5bWVyLXJlYWR5IGV2ZW50IScpO1xufSk7XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBjbnN0LmpzXCIpO1xyXG5cclxuZGVjbGFyZSB2YXIgY29va2llUHJlZml4O1xyXG5cclxuLy90b2RvLTE6IHR5cGVzY3JpcHQgd2lsbCBub3cgbGV0IHVzIGp1c3QgZG8gdGhpczogY29uc3QgdmFyPSd2YWx1ZSc7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgY25zdCB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQU5PTjogc3RyaW5nID0gXCJhbm9ueW1vdXNcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9VU1I6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Vc3JcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPT0tJRV9MT0dJTl9QV0Q6IHN0cmluZyA9IGNvb2tpZVByZWZpeCArIFwibG9naW5Qd2RcIjtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGxvZ2luU3RhdGU9XCIwXCIgaWYgdXNlciBsb2dnZWQgb3V0IGludGVudGlvbmFsbHkuIGxvZ2luU3RhdGU9XCIxXCIgaWYgbGFzdCBrbm93biBzdGF0ZSBvZiB1c2VyIHdhcyAnbG9nZ2VkIGluJ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ09PS0lFX0xPR0lOX1NUQVRFOiBzdHJpbmcgPSBjb29raWVQcmVmaXggKyBcImxvZ2luU3RhdGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEJSOiBcIjxkaXYgY2xhc3M9J3ZlcnQtc3BhY2UnPjwvZGl2PlwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TRVJUX0FUVEFDSE1FTlQ6IHN0cmluZyA9IFwie3tpbnNlcnQtYXR0YWNobWVudH19XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBORVdfT05fVE9PTEJBUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5TX09OX1RPT0xCQVI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBleHBvcnQgbGV0IE1PVkVfVVBET1dOX09OX1RPT0xCQVI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgd29ya3MsIGJ1dCBJJ20gbm90IHN1cmUgSSB3YW50IGl0IGZvciBBTEwgZWRpdGluZy4gU3RpbGwgdGhpbmtpbmcgYWJvdXQgZGVzaWduIGhlcmUsIGJlZm9yZSBJIHR1cm4gdGhpc1xyXG4gICAgICAgICAqIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgVVNFX0FDRV9FRElUT1I6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogc2hvd2luZyBwYXRoIG9uIHJvd3MganVzdCB3YXN0ZXMgc3BhY2UgZm9yIG9yZGluYXJ5IHVzZXJzLiBOb3QgcmVhbGx5IG5lZWRlZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX09OX1JPV1M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0hPV19QQVRIX0lOX0RMR1M6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFNIT1dfQ0xFQVJfQlVUVE9OX0lOX0VESVRPUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxubmFtZXNwYWNlIG02NCB7XG4gICAgLyogVGhlc2UgYXJlIENsaWVudC1zaWRlIG9ubHkgbW9kZWxzLCBhbmQgYXJlIG5vdCBzZWVuIG9uIHRoZSBzZXJ2ZXIgc2lkZSBldmVyICovXG5cbiAgICAvKiBNb2RlbHMgYSB0aW1lLXJhbmdlIGluIHNvbWUgbWVkaWEgd2hlcmUgYW4gQUQgc3RhcnRzIGFuZCBzdG9wcyAqL1xuICAgIGV4cG9ydCBjbGFzcyBBZFNlZ21lbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmVnaW5UaW1lOiBudW1iZXIsLy9cbiAgICAgICAgICAgIHB1YmxpYyBlbmRUaW1lOiBudW1iZXIpIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQcm9wRW50cnkge1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgLy9cbiAgICAgICAgICAgIHB1YmxpYyBwcm9wZXJ0eToganNvbi5Qcm9wZXJ0eUluZm8sIC8vXG4gICAgICAgICAgICBwdWJsaWMgbXVsdGk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4sIC8vXG4gICAgICAgICAgICBwdWJsaWMgYmluYXJ5OiBib29sZWFuLCAvL1xuICAgICAgICAgICAgcHVibGljIHN1YlByb3BzOiBTdWJQcm9wW10pIHtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTdWJQcm9wIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIC8vXG4gICAgICAgICAgICBwdWJsaWMgdmFsOiBzdHJpbmcpIHtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHV0aWwuanNcIik7XHJcblxyXG5pbnRlcmZhY2UgX0hhc1NlbGVjdCB7XHJcbiAgICBzZWxlY3Q/OiBhbnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSB1dGlsIHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dBamF4OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lb3V0TWVzc2FnZVNob3duOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZXhwb3J0IGxldCBvZmZsaW5lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgd2FpdENvdW50ZXI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCBwZ3JzRGxnOiBhbnkgPSBudWxsO1xyXG5cblx0XHRleHBvcnQgbGV0IGVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uKF8pIHtcbiAgICBcdFx0cmV0dXJuIF8ucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKTtcblx0XHR9XG5cblx0XHRleHBvcnQgbGV0IGVzY2FwZUZvckF0dHJpYiA9IGZ1bmN0aW9uKF8pIHtcbiAgICAgICAgXHRyZXR1cm4gdXRpbC5yZXBsYWNlQWxsKF8sIFwiXFxcIlwiLCBcIiZxdW90O1wiKTtcbiAgICBcdH1cblxuICAgXHQgXHRleHBvcnQgbGV0IHVuZW5jb2RlSHRtbCA9IGZ1bmN0aW9uKF8pIHtcblx0ICAgICAgICBpZiAoIXV0aWwuY29udGFpbnMoXywgXCImXCIpKVxuXHQgICAgICAgICAgICByZXR1cm4gXztcblxuXHRcdFx0dmFyIHJldCA9IF87XG5cdCAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgJyZhbXA7JywgJyYnKTtcblx0ICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJmd0OycsICc+Jyk7XG5cdCAgICAgICAgcmV0ID0gdXRpbC5yZXBsYWNlQWxsKHJldCwgJyZsdDsnLCAnPCcpO1xuXHQgICAgICAgIHJldCA9IHV0aWwucmVwbGFjZUFsbChyZXQsICcmcXVvdDsnLCAnXCInKTtcblx0ICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCAnJiMzOTsnLCBcIidcIik7XG5cblx0ICAgICAgICByZXR1cm4gcmV0O1xuICAgIFx0fVxuXG4gICAgXHRleHBvcnQgbGV0IHJlcGxhY2VBbGwgPSBmdW5jdGlvbihfLCBmaW5kLCByZXBsYWNlKSB7XG4gICAgICAgIFx0cmV0dXJuIF8ucmVwbGFjZShuZXcgUmVnRXhwKHV0aWwuZXNjYXBlUmVnRXhwKGZpbmQpLCAnZycpLCByZXBsYWNlKTtcbiAgICBcdH1cblxuICAgIFx0ZXhwb3J0IGxldCBjb250YWlucyA9IGZ1bmN0aW9uKF8sIHN0cikge1xuICAgICAgICBcdHJldHVybiBfLmluZGV4T2Yoc3RyKSAhPSAtMTtcbiAgICBcdH1cblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRzV2l0aCA9IGZ1bmN0aW9uKF8sc3RyKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uaW5kZXhPZihzdHIpID09PSAwO1xyXG4gICAgICAgIH1cclxuXG4gICBcdCBcdGV4cG9ydCBsZXQgc3RyaXBJZlN0YXJ0c1dpdGggPSBmdW5jdGlvbihfLHN0cikge1xuICAgICAgICBcdGlmIChfLnN0YXJ0c1dpdGgoc3RyKSkge1xuICAgICAgICAgICAgXHRyZXR1cm4gXy5zdWJzdHJpbmcoc3RyLmxlbmd0aCk7XG4gICAgICAgIFx0fVxuICAgICAgICBcdHJldHVybiBfO1xuICAgIFx0fVxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhcnJheUNsb25lID0gZnVuY3Rpb24oXzogYW55W10pIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uc2xpY2UoMCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhcnJheUluZGV4T2ZJdGVtQnlQcm9wID0gZnVuY3Rpb24oXzogYW55W10sIHByb3BOYW1lLCBwcm9wVmFsKSB7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSBfLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9baV1bcHJvcE5hbWVdID09PSBwcm9wVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIG5lZWQgdG8gdGVzdCBhbGwgY2FsbHMgdG8gdGhpcyBtZXRob2QgYmVjYXVzZSBpIG5vdGljZWQgZHVyaW5nIFR5cGVTY3JpcHQgY29udmVyc2lvbiBpIHdhc24ndCBldmVuIHJldHVybmluZ1xyXG4gICAgICAgIGEgdmFsdWUgZnJvbSB0aGlzIGZ1bmN0aW9uISB0b2RvLTBcclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYXJyYXlNb3ZlSXRlbSA9IGZ1bmN0aW9uKF86IGFueVtdLCBmcm9tSW5kZXgsIHRvSW5kZXgpIHtcclxuICAgICAgICAgICAgXy5zcGxpY2UodG9JbmRleCwgMCwgXy5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGRUaW1lem9uZU9mZnNldCA9IGZ1bmN0aW9uKF86RGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgamFuID0gbmV3IERhdGUoXy5nZXRGdWxsWWVhcigpLCAwLCAxKTtcclxuICAgICAgICAgICAgdmFyIGp1bCA9IG5ldyBEYXRlKF8uZ2V0RnVsbFllYXIoKSwgNiwgMSk7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChqYW4uZ2V0VGltZXpvbmVPZmZzZXQoKSwganVsLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkc3QgPSBmdW5jdGlvbihfOkRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZ2V0VGltZXpvbmVPZmZzZXQoKSA8IHN0ZFRpbWV6b25lT2Zmc2V0KF8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmRleE9mT2JqZWN0ID0gZnVuY3Rpb24oXzogYW55W10sIG9iaikge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF8ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChfW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RoaXMgYmxvd3MgdGhlIGhlbGwgdXAsIG5vdCBzdXJlIHdoeS5cclxuICAgICAgICAvL1x0T2JqZWN0LnByb3RvdHlwZS50b0pzb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL1x0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgNCk7XHJcbiAgICAgICAgLy9cdH07XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYXNzZXJ0Tm90TnVsbCA9IGZ1bmN0aW9uKHZhck5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmFsKHZhck5hbWUpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVmFyaWFibGUgbm90IGZvdW5kOiBcIiArIHZhck5hbWUpKS5vcGVuKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBXZSB1c2UgdGhpcyB2YXJpYWJsZSB0byBkZXRlcm1pbmUgaWYgd2UgYXJlIHdhaXRpbmcgZm9yIGFuIGFqYXggY2FsbCwgYnV0IHRoZSBzZXJ2ZXIgYWxzbyBlbmZvcmNlcyB0aGF0IGVhY2hcclxuICAgICAgICAgKiBzZXNzaW9uIGlzIG9ubHkgYWxsb3dlZCBvbmUgY29uY3VycmVudCBjYWxsIGFuZCBzaW11bHRhbmVvdXMgY2FsbHMgd291bGQganVzdCBcInF1ZXVlIHVwXCIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9hamF4Q291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXlsaWdodFNhdmluZ3NUaW1lOiBib29sZWFuID0gKHV0aWwuZHN0KG5ldyBEYXRlKCkpKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0b0pzb24gPSBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgNCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBUaGlzIGNhbWUgZnJvbSBoZXJlOlxyXG5cdFx0ICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0UGFyYW1ldGVyQnlOYW1lID0gZnVuY3Rpb24obmFtZT86IGFueSwgdXJsPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF1cmwpXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XHJcbiAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSwgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHRzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0c1syXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogU2V0cyB1cCBhbiBpbmhlcml0YW5jZSByZWxhdGlvbnNoaXAgc28gdGhhdCBjaGlsZCBpbmhlcml0cyBmcm9tIHBhcmVudCwgYW5kIHRoZW4gcmV0dXJucyB0aGUgcHJvdG90eXBlIG9mIHRoZVxyXG5cdFx0ICogY2hpbGQgc28gdGhhdCBtZXRob2RzIGNhbiBiZSBhZGRlZCB0byBpdCwgd2hpY2ggd2lsbCBiZWhhdmUgbGlrZSBtZW1iZXIgZnVuY3Rpb25zIGluIGNsYXNzaWMgT09QIHdpdGhcclxuXHRcdCAqIGluaGVyaXRhbmNlIGhpZXJhcmNoaWVzLlxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbmhlcml0ID0gZnVuY3Rpb24ocGFyZW50LCBjaGlsZCk6IGFueSB7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQucHJvdG90eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0UHJvZ3Jlc3NNb25pdG9yID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHNldEludGVydmFsKHByb2dyZXNzSW50ZXJ2YWwsIDEwMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcm9ncmVzc0ludGVydmFsID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciBpc1dhaXRpbmcgPSBpc0FqYXhXYWl0aW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChpc1dhaXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHdhaXRDb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICBpZiAod2FpdENvdW50ZXIgPj0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGdyc0RsZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnID0gbmV3IFByb2dyZXNzRGxnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBncnNEbGcub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdhaXRDb3VudGVyID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChwZ3JzRGxnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGdyc0RsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBwZ3JzRGxnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBqc29uID0gZnVuY3Rpb24gPFJlcXVlc3RUeXBlLCBSZXNwb25zZVR5cGU+KHBvc3ROYW1lOiBhbnksIHBvc3REYXRhOiBSZXF1ZXN0VHlwZSwgLy9cclxuICAgICAgICAgICAgY2FsbGJhY2s/OiAocmVzcG9uc2U6IFJlc3BvbnNlVHlwZSwgcGF5bG9hZD86IGFueSkgPT4gYW55LCBjYWxsYmFja1RoaXM/OiBhbnksIGNhbGxiYWNrUGF5bG9hZD86IGFueSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrVGhpcyA9PT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBST0JBQkxFIEJVRzoganNvbiBjYWxsIGZvciBcIiArIHBvc3ROYW1lICsgXCIgdXNlZCBnbG9iYWwgJ3dpbmRvdycgYXMgJ3RoaXMnLCB3aGljaCBpcyBhbG1vc3QgbmV2ZXIgZ29pbmcgdG8gYmUgY29ycmVjdC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpcm9uQWpheDtcclxuICAgICAgICAgICAgdmFyIGlyb25SZXF1ZXN0O1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChvZmZsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvZmZsaW5lOiBpZ25vcmluZyBjYWxsIGZvciBcIiArIHBvc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ0FqYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTT04tUE9TVFtnZW5dOiBbXCIgKyBwb3N0TmFtZSArIFwiXVwiICsgSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBEbyBub3QgZGVsZXRlLCByZXNlYXJjaCB0aGlzIHdheS4uLiAqL1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGlyb25BamF4ID0gdGhpcy4kJChcIiNteUlyb25BamF4XCIpO1xyXG4gICAgICAgICAgICAgICAgLy9pcm9uQWpheCA9IFBvbHltZXIuZG9tKCg8X0hhc1Jvb3Q+KXdpbmRvdy5kb2N1bWVudC5yb290KS5xdWVyeVNlbGVjdG9yKFwiI2lyb25BamF4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlyb25BamF4ID0gcG9seUVsbU5vZGUoXCJpcm9uQWpheFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC51cmwgPSBwb3N0VGFyZ2V0VXJsICsgcG9zdE5hbWU7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC52ZXJib3NlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmJvZHkgPSBKU09OLnN0cmluZ2lmeShwb3N0RGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5tZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICAgICAgICAgIGlyb25BamF4LmNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc3BlY2lmeSBhbnkgdXJsIHBhcmFtcyB0aGlzIHdheTpcclxuICAgICAgICAgICAgICAgIC8vIGlyb25BamF4LnBhcmFtcz0ne1wiYWx0XCI6XCJqc29uXCIsIFwicVwiOlwiY2hyb21lXCJ9JztcclxuXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5oYW5kbGVBcyA9IFwianNvblwiOyAvLyBoYW5kbGUtYXMgKGlzIHByb3ApXHJcblxyXG4gICAgICAgICAgICAgICAgLyogVGhpcyBub3QgYSByZXF1aXJlZCBwcm9wZXJ0eSAqL1xyXG4gICAgICAgICAgICAgICAgLy8gaXJvbkFqYXgub25SZXNwb25zZSA9IFwidXRpbC5pcm9uQWpheFJlc3BvbnNlXCI7IC8vIG9uLXJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAvLyAoaXNcclxuICAgICAgICAgICAgICAgIC8vIHByb3ApXHJcbiAgICAgICAgICAgICAgICBpcm9uQWpheC5kZWJvdW5jZUR1cmF0aW9uID0gXCIzMDBcIjsgLy8gZGVib3VuY2UtZHVyYXRpb24gKGlzXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9wKVxyXG5cclxuICAgICAgICAgICAgICAgIF9hamF4Q291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgaXJvblJlcXVlc3QgPSBpcm9uQWpheC5nZW5lcmF0ZVJlcXVlc3QoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kUmVUaHJvdyhcIkZhaWxlZCBzdGFydGluZyByZXF1ZXN0OiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBOb3Rlc1xyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogSWYgdXNpbmcgdGhlbiBmdW5jdGlvbjogcHJvbWlzZS50aGVuKHN1Y2Nlc3NGdW5jdGlvbiwgZmFpbEZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgICogPHA+XHJcbiAgICAgICAgICAgICAqIEkgdGhpbmsgdGhlIHdheSB0aGVzZSBwYXJhbWV0ZXJzIGdldCBwYXNzZWQgaW50byBkb25lL2ZhaWwgZnVuY3Rpb25zLCBpcyBiZWNhdXNlIHRoZXJlIGFyZSByZXNvbHZlL3JlamVjdFxyXG4gICAgICAgICAgICAgKiBtZXRob2RzIGdldHRpbmcgY2FsbGVkIHdpdGggdGhlIHBhcmFtZXRlcnMuIEJhc2ljYWxseSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgdG8gJ3Jlc29sdmUnIGdldCBkaXN0cmlidXRlZFxyXG4gICAgICAgICAgICAgKiB0byBhbGwgdGhlIHdhaXRpbmcgbWV0aG9kcyBqdXN0IGxpa2UgYXMgaWYgdGhleSB3ZXJlIHN1YnNjcmliaW5nIGluIGEgcHViL3N1YiBtb2RlbC4gU28gdGhlICdwcm9taXNlJ1xyXG4gICAgICAgICAgICAgKiBwYXR0ZXJuIGlzIHNvcnQgb2YgYSBwdWIvc3ViIG1vZGVsIGluIGEgd2F5XHJcbiAgICAgICAgICAgICAqIDxwPlxyXG4gICAgICAgICAgICAgKiBUaGUgcmVhc29uIHRvIHJldHVybiBhICdwcm9taXNlLnByb21pc2UoKScgbWV0aG9kIGlzIHNvIG5vIG90aGVyIGNvZGUgY2FuIGNhbGwgcmVzb2x2ZS9yZWplY3QgYnV0IGNhblxyXG4gICAgICAgICAgICAgKiBvbmx5IHJlYWN0IHRvIGEgZG9uZS9mYWlsL2NvbXBsZXRlLlxyXG4gICAgICAgICAgICAgKiA8cD5cclxuICAgICAgICAgICAgICogZGVmZXJyZWQud2hlbihwcm9taXNlMSwgcHJvbWlzZTIpIGNyZWF0ZXMgYSBuZXcgcHJvbWlzZSB0aGF0IGJlY29tZXMgJ3Jlc29sdmVkJyBvbmx5IHdoZW4gYWxsIHByb21pc2VzXHJcbiAgICAgICAgICAgICAqIGFyZSByZXNvbHZlZC4gSXQncyBhIGJpZyBcImFuZCBjb25kaXRpb25cIiBvZiByZXNvbHZlbWVudCwgYW5kIGlmIGFueSBvZiB0aGUgcHJvbWlzZXMgcGFzc2VkIHRvIGl0IGVuZCB1cFxyXG4gICAgICAgICAgICAgKiBmYWlsaW5nLCBpdCBmYWlscyB0aGlzIFwiQU5EZWRcIiBvbmUgYWxzby5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlyb25SZXF1ZXN0LmNvbXBsZXRlcy50aGVuKC8vXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIFN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hamF4Q291bnRlci0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0ludGVydmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9nQWpheCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgSlNPTi1SRVNVTFQ6IFwiICsgcG9zdE5hbWUgKyBcIlxcbiAgICBKU09OLVJFU1VMVC1EQVRBOiBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgSlNPTi5zdHJpbmdpZnkoaXJvblJlcXVlc3QucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIGlzIHVnbHkgYmVjYXVzZSBpdCBjb3ZlcnMgYWxsIGZvdXIgY2FzZXMgYmFzZWQgb24gdHdvIGJvb2xlYW5zLCBidXQgaXQncyBzdGlsbCB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHNpbXBsZXN0IHdheSB0byBkbyB0aGlzLiBXZSBoYXZlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBtYXkgb3IgbWF5IG5vdCBzcGVjaWZ5IGEgJ3RoaXMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBhbmQgYWx3YXlzIGNhbGxzIHdpdGggdGhlICdyZXBvbnNlJyBwYXJhbSBhbmQgb3B0aW9uYWxseSBhIGNhbGxiYWNrUGF5bG9hZCBwYXJhbS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrUGF5bG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UsIGNhbGxiYWNrUGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soPFJlc3BvbnNlVHlwZT5pcm9uUmVxdWVzdC5yZXNwb25zZSwgY2FsbGJhY2tQYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYW4ndCB3ZSBqdXN0IGxldCBjYWxsYmFja1BheWxvYWQgYmUgdW5kZWZpbmVkLCBhbmQgY2FsbCB0aGUgYWJvdmUgY2FsbGJhY2sgbWV0aG9kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIG5vdCBldmVuIGhhdmUgdGhpcyBlbHNlIGJsb2NrIGhlcmUgYXQgYWxsIChpLmUuIG5vdCBldmVuIGNoZWNrIGlmIGNhbGxiYWNrUGF5bG9hZCBpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbC91bmRlZmluZWQsIGJ1dCBqdXN0IHVzZSBpdCwgYW5kIG5vdCBoYXZlIHRoaXMgaWYgYmxvY2s/KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja1RoaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja1RoaXMsIDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDxSZXNwb25zZVR5cGU+aXJvblJlcXVlc3QucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgaGFuZGxpbmcgcmVzdWx0IG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRmFpbFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2FqYXhDb3VudGVyLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiB1dGlsLmpzb25cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXJvblJlcXVlc3Quc3RhdHVzID09IFwiNDAzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiBkZXRlY3RlZCBpbiB1dGlsLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZmxpbmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGltZW91dE1lc3NhZ2VTaG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXRNZXNzYWdlU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlc3Npb24gdGltZWQgb3V0LiBQYWdlIHdpbGwgcmVmcmVzaC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwiYmVmb3JldW5sb2FkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbXNnOiBzdHJpbmcgPSBcIlNlcnZlciByZXF1ZXN0IGZhaWxlZC5cXG5cXG5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNhdGNoIGJsb2NrIHNob3VsZCBmYWlsIHNpbGVudGx5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJTdGF0dXM6IFwiICsgaXJvblJlcXVlc3Quc3RhdHVzVGV4dCArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgKz0gXCJDb2RlOiBcIiArIGlyb25SZXF1ZXN0LnN0YXR1cyArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHRoaXMgY2F0Y2ggYmxvY2sgc2hvdWxkIGFsc28gZmFpbCBzaWxlbnRseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIHdhcyBzaG93aW5nIFwiY2xhc3NDYXN0RXhjZXB0aW9uXCIgd2hlbiBJIHRocmV3IGEgcmVndWxhciBcIkV4Y2VwdGlvblwiIGZyb20gc2VydmVyIHNvIGZvciBub3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogSSdtIGp1c3QgdHVybmluZyB0aGlzIG9mZiBzaW5jZSBpdHMnIG5vdCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IG1lc3NhZ2UuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtc2cgKz0gXCJSZXNwb25zZTogXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLmV4Y2VwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0FuZFJlVGhyb3coXCJGYWlsZWQgcHJvY2Vzc2luZyBzZXJ2ZXItc2lkZSBmYWlsIG9mOiBcIiArIHBvc3ROYW1lLCBleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaXJvblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvZ0FuZFRocm93ID0gZnVuY3Rpb24obWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFjayA9IFwiW3N0YWNrLCBub3Qgc3VwcG9ydGVkXVwiO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3RhY2sgPSAoPGFueT5uZXcgRXJyb3IoKSkuc3RhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UgKyBcIlNUQUNLOiBcIiArIHN0YWNrKTtcclxuICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nQW5kUmVUaHJvdyA9IGZ1bmN0aW9uKG1lc3NhZ2U6IHN0cmluZywgZXhjZXB0aW9uOiBhbnkpIHtcclxuICAgICAgICAgICAgbGV0IHN0YWNrID0gXCJbc3RhY2ssIG5vdCBzdXBwb3J0ZWRdXCI7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzdGFjayA9ICg8YW55Pm5ldyBFcnJvcigpKS5zdGFjaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSArIFwiU1RBQ0s6IFwiICsgc3RhY2spO1xyXG4gICAgICAgICAgICB0aHJvdyBleGNlcHRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFqYXhSZWFkeSA9IGZ1bmN0aW9uKHJlcXVlc3ROYW1lKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChfYWpheENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklnbm9yaW5nIHJlcXVlc3RzOiBcIiArIHJlcXVlc3ROYW1lICsgXCIuIEFqYXggY3VycmVudGx5IGluIHByb2dyZXNzLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNBamF4V2FpdGluZyA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gX2FqYXhDb3VudGVyID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHNldCBmb2N1cyB0byBlbGVtZW50IGJ5IGlkIChpZCBtdXN0IGJlIGFjdHVhbCBqcXVlcnkgc2VsZWN0b3IpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZWxheWVkRm9jdXMgPSBmdW5jdGlvbihpZCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBzbyB1c2VyIHNlZXMgdGhlIGZvY3VzIGZhc3Qgd2UgdHJ5IGF0IC41IHNlY29uZHMgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQoaWQpLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSB0cnkgYWdhaW4gYSBmdWxsIHNlY29uZCBsYXRlci4gTm9ybWFsbHkgbm90IHJlcXVpcmVkLCBidXQgbmV2ZXIgdW5kZXNpcmFibGUgKi9cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJGb2N1c2luZyBJRDogXCIraWQpO1xyXG4gICAgICAgICAgICAgICAgJChpZCkuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgMTMwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBjb3VsZCBoYXZlIHB1dCB0aGlzIGxvZ2ljIGluc2lkZSB0aGUganNvbiBtZXRob2QgaXRzZWxmLCBidXQgSSBjYW4gZm9yc2VlIGNhc2VzIHdoZXJlIHdlIGRvbid0IHdhbnQgYVxyXG5cdFx0ICogbWVzc2FnZSB0byBhcHBlYXIgd2hlbiB0aGUganNvbiByZXNwb25zZSByZXR1cm5zIHN1Y2Nlc3M9PWZhbHNlLCBzbyB3ZSB3aWxsIGhhdmUgdG8gY2FsbCBjaGVja1N1Y2Nlc3MgaW5zaWRlXHJcblx0XHQgKiBldmVyeSByZXNwb25zZSBtZXRob2QgaW5zdGVhZCwgaWYgd2Ugd2FudCB0aGF0IHJlc3BvbnNlIHRvIHByaW50IGEgbWVzc2FnZSB0byB0aGUgdXNlciB3aGVuIGZhaWwgaGFwcGVucy5cclxuXHRcdCAqXHJcblx0XHQgKiByZXF1aXJlczogcmVzLnN1Y2Nlc3MgcmVzLm1lc3NhZ2VcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY2hlY2tTdWNjZXNzID0gZnVuY3Rpb24ob3BGcmllbmRseU5hbWUsIHJlcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcob3BGcmllbmRseU5hbWUgKyBcIiBmYWlsZWQ6IFwiICsgcmVzLm1lc3NhZ2UpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdWNjZXNzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogYWRkcyBhbGwgYXJyYXkgb2JqZWN0cyB0byBvYmogYXMgYSBzZXQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGFkZEFsbCA9IGZ1bmN0aW9uKG9iaiwgYSk6IHZvaWQge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghYVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJudWxsIGVsZW1lbnQgaW4gYWRkQWxsIGF0IGlkeD1cIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbYVtpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG51bGxPclVuZGVmID0gZnVuY3Rpb24ob2JqKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBXZSBoYXZlIHRvIGJlIGFibGUgdG8gbWFwIGFueSBpZGVudGlmaWVyIHRvIGEgdWlkLCB0aGF0IHdpbGwgYmUgcmVwZWF0YWJsZSwgc28gd2UgaGF2ZSB0byB1c2UgYSBsb2NhbFxyXG5cdFx0ICogJ2hhc2hzZXQtdHlwZScgaW1wbGVtZW50YXRpb25cclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VWlkRm9ySWQgPSBmdW5jdGlvbihtYXA6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGlkKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLyogbG9vayBmb3IgdWlkIGluIG1hcCAqL1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBtYXBbaWRdO1xyXG5cclxuICAgICAgICAgICAgLyogaWYgbm90IGZvdW5kLCBnZXQgbmV4dCBudW1iZXIsIGFuZCBhZGQgdG8gbWFwICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBcIlwiICsgbWV0YTY0Lm5leHRVaWQrKztcclxuICAgICAgICAgICAgICAgIG1hcFtpZF0gPSB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHVpZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZWxlbWVudEV4aXN0cyA9IGZ1bmN0aW9uKGlkKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLnN0YXJ0c1dpdGgoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBpZC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGlkLCBcIiNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW52YWxpZCAjIGluIGRvbUVsbVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGUgIT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFRha2VzIHRleHRhcmVhIGRvbSBJZCAoIyBvcHRpb25hbCkgYW5kIHJldHVybnMgaXRzIHZhbHVlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRUZXh0QXJlYVZhbEJ5SWQgPSBmdW5jdGlvbihpZCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBkZTogSFRNTEVsZW1lbnQgPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxIVE1MSW5wdXRFbGVtZW50PmRlKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIEdldHMgdGhlIFJBVyBET00gZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZC4gRG8gbm90IHByZWZpeCB3aXRoIFwiI1wiXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGRvbUVsbSA9IGZ1bmN0aW9uKGlkKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9tRWxtIEVycm9yLiBSZXF1aXJlZCBlbGVtZW50IGlkIG5vdCBmb3VuZDogXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBvbHkgPSBmdW5jdGlvbihpZCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgUkFXIERPTSBlbGVtZW50IGFuZCBkaXNwbGF5cyBhbiBlcnJvciBtZXNzYWdlIGlmIGl0J3Mgbm90IGZvdW5kLiBEbyBub3QgcHJlZml4IHdpdGggXCIjXCJcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9seUVsbSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IGlkLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoaWQsIFwiI1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbnZhbGlkICMgaW4gZG9tRWxtXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgICAgIGlmICghZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb21FbG0gRXJyb3IuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFBvbHltZXIuZG9tKGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwb2x5RWxtTm9kZSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZS5ub2RlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogR2V0cyB0aGUgZWxlbWVudCBhbmQgZGlzcGxheXMgYW4gZXJyb3IgbWVzc2FnZSBpZiBpdCdzIG5vdCBmb3VuZFxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRSZXF1aXJlZEVsZW1lbnQgPSBmdW5jdGlvbihpZDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGUgPSAkKGlkKTtcclxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXRSZXF1aXJlZEVsZW1lbnQuIFJlcXVpcmVkIGVsZW1lbnQgaWQgbm90IGZvdW5kOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNPYmplY3QgPSBmdW5jdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5sZW5ndGggIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudFRpbWVNaWxsaXMgPSBmdW5jdGlvbigpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZW1wdHlTdHJpbmcgPSBmdW5jdGlvbih2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXZhbCB8fCB2YWwubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldElucHV0VmFsID0gZnVuY3Rpb24oaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwb2x5RWxtKGlkKS5ub2RlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgd2FzIGZvdW5kLCBvciBmYWxzZSBpZiBlbGVtZW50IG5vdCBmb3VuZCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2V0SW5wdXRWYWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVsbSA9IHBvbHlFbG0oaWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0ubm9kZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWxtICE9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRFbnRlcktleSA9IGZ1bmN0aW9uKGlkOiBzdHJpbmcsIGZ1bmM6IGFueSkge1xyXG4gICAgICAgICAgICBiaW5kS2V5KGlkLCBmdW5jLCAxMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJpbmRLZXkgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBmdW5jOiBhbnksIGtleUNvZGU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICAkKGlkKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSBrZXlDb2RlKSB7IC8vIDEzPT1lbnRlciBrZXkgY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBSZW1vdmVkIG9sZENsYXNzIGZyb20gZWxlbWVudCBhbmQgcmVwbGFjZXMgd2l0aCBuZXdDbGFzcywgYW5kIGlmIG9sZENsYXNzIGlzIG5vdCBwcmVzZW50IGl0IHNpbXBseSBhZGRzXHJcblx0XHQgKiBuZXdDbGFzcy4gSWYgb2xkIGNsYXNzIGV4aXN0ZWQsIGluIHRoZSBsaXN0IG9mIGNsYXNzZXMsIHRoZW4gdGhlIG5ldyBjbGFzcyB3aWxsIG5vdyBiZSBhdCB0aGF0IHBvc2l0aW9uLiBJZlxyXG5cdFx0ICogb2xkIGNsYXNzIGRpZG4ndCBleGlzdCwgdGhlbiBuZXcgQ2xhc3MgaXMgYWRkZWQgYXQgZW5kIG9mIGNsYXNzIGxpc3QuXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGNoYW5nZU9yQWRkQ2xhc3MgPSBmdW5jdGlvbihlbG06IHN0cmluZywgb2xkQ2xhc3M6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgZWxtZW1lbnQgPSAkKGVsbSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG9sZENsYXNzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGVsbWVtZW50LnRvZ2dsZUNsYXNzKG5ld0NsYXNzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGRpc3BsYXlzIG1lc3NhZ2UgKG1zZykgb2Ygb2JqZWN0IGlzIG5vdCBvZiBzcGVjaWZpZWQgdHlwZVxyXG5cdFx0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB2ZXJpZnlUeXBlID0gZnVuY3Rpb24ob2JqOiBhbnksIHR5cGU6IGFueSwgbXNnOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhtc2cpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldEh0bWwgPSBmdW5jdGlvbihpZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBkb21FbG0oaWQpO1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IFBvbHltZXIuZG9tKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAvL0ZvciBQb2x5bWVyIDEuMC4wLCB5b3UgbmVlZCB0aGlzLi4uXHJcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBwb2x5RWxtLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBQb2x5bWVyLmRvbS5mbHVzaCgpO1xyXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRQcm9wZXJ0eUNvdW50ID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBudW1iZXIge1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvcDtcclxuXHJcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9XHJcblxyXG5cdFx0LypcclxuXHRcdCAqIGl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0IGNyZWF0aW5nIGEgc3RyaW5nIGNvbnRhaW5pbmcgaXQncyBrZXlzIGFuZCB2YWx1ZXNcclxuXHRcdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRPYmplY3QgPSBmdW5jdGlvbihvYmo6IE9iamVjdCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCJcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5W1wiICsgY291bnQgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gayArIFwiICwgXCIgKyB2ICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVyclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBpdGVyYXRlcyBvdmVyIGFuIG9iamVjdCBjcmVhdGluZyBhIHN0cmluZyBjb250YWluaW5nIGl0J3Mga2V5cyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJpbnRLZXlzID0gZnVuY3Rpb24ob2JqOiBPYmplY3QpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW9iailcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGssIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gJywnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsICs9IGs7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgZW5hYmxlZCBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldEVuYWJsZW1lbnQgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCBlbmFibGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFlbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRW5hYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNhYmxpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogTWFrZXMgZWxlSWQgdmlzaWJsZSBiYXNlZCBvbiB2aXMgZmxhZ1xyXG5cdFx0ICpcclxuXHRcdCAqIGVsZUlkIGNhbiBiZSBhIERPTSBlbGVtZW50IG9yIHRoZSBJRCBvZiBhIGRvbSBlbGVtZW50LCB3aXRoIG9yIHdpdGhvdXQgbGVhZGluZyAjXHJcblx0XHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihlbG1JZDogc3RyaW5nLCB2aXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsbUlkID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsbSA9IGRvbUVsbShlbG1JZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbG0gPSBlbG1JZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVsbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldFZpc2liaWxpdHkgY291bGRuJ3QgZmluZCBpdGVtOiBcIiArIGVsbUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHZpcykge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaG93aW5nIGVsZW1lbnQ6IFwiICsgZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgLy9lbG0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICAkKGVsbSkuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJoaWRpbmcgZWxlbWVudDogXCIgKyBlbG1JZCk7XHJcbiAgICAgICAgICAgICAgICAvL2VsbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgJChlbG0pLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUHJvZ3JhbWF0aWNhbGx5IGNyZWF0ZXMgb2JqZWN0cyBieSBuYW1lLCBzaW1pbGFyIHRvIHdoYXQgSmF2YSByZWZsZWN0aW9uIGRvZXNcclxuXHJcbiAgICAgICAgKiBleDogdmFyIGV4YW1wbGUgPSBJbnN0YW5jZUxvYWRlci5nZXRJbnN0YW5jZTxOYW1lZFRoaW5nPih3aW5kb3csICdFeGFtcGxlQ2xhc3MnLCBhcmdzLi4uKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiA8VD4oY29udGV4dDogT2JqZWN0LCBuYW1lOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogVCB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoY29udGV4dFtuYW1lXS5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgYXJncyk7XHJcbiAgICAgICAgICAgIHJldHVybiA8VD5pbnN0YW5jZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogamNyQ25zdC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBqY3JDbnN0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBDT01NRU5UX0JZOiBzdHJpbmcgPSBcImNvbW1lbnRCeVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFVCTElDX0FQUEVORDogc3RyaW5nID0gXCJwdWJsaWNBcHBlbmRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBSSU1BUllfVFlQRTogc3RyaW5nID0gXCJqY3I6cHJpbWFyeVR5cGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFBPTElDWTogc3RyaW5nID0gXCJyZXA6cG9saWN5XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgTUlYSU5fVFlQRVM6IHN0cmluZyA9IFwiamNyOm1peGluVHlwZXNcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9DT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBFTUFJTF9SRUNJUDogc3RyaW5nID0gXCJyZWNpcFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUxfU1VCSkVDVDogc3RyaW5nID0gXCJzdWJqZWN0XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRDogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgQ1JFQVRFRF9CWTogc3RyaW5nID0gXCJqY3I6Y3JlYXRlZEJ5XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBDT05URU5UOiBzdHJpbmcgPSBcImpjcjpjb250ZW50XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBUQUdTOiBzdHJpbmcgPSBcInRhZ3NcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFVVSUQ6IHN0cmluZyA9IFwiamNyOnV1aWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExBU1RfTU9ESUZJRUQ6IHN0cmluZyA9IFwiamNyOmxhc3RNb2RpZmllZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEFTVF9NT0RJRklFRF9CWTogc3RyaW5nID0gXCJqY3I6bGFzdE1vZGlmaWVkQnlcIjtcclxuICAgICAgICBleHBvcnQgbGV0IEpTT05fRklMRV9TRUFSQ0hfUkVTVUxUOiBzdHJpbmcgPSBcIm1ldGE2NDpqc29uXCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgRElTQUJMRV9JTlNFUlQ6IHN0cmluZyA9IFwiZGlzYWJsZUluc2VydFwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IFVTRVI6IHN0cmluZyA9IFwidXNlclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUFdEOiBzdHJpbmcgPSBcInB3ZFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgRU1BSUw6IHN0cmluZyA9IFwiZW1haWxcIjtcclxuICAgICAgICBleHBvcnQgbGV0IENPREU6IHN0cmluZyA9IFwiY29kZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IEJJTl9WRVI6IHN0cmluZyA9IFwiYmluVmVyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fREFUQTogc3RyaW5nID0gXCJqY3JEYXRhXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBCSU5fTUlNRTogc3RyaW5nID0gXCJqY3I6bWltZVR5cGVcIjtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBJTUdfV0lEVEg6IHN0cmluZyA9IFwiaW1nV2lkdGhcIjtcclxuICAgICAgICBleHBvcnQgbGV0IElNR19IRUlHSFQ6IHN0cmluZyA9IFwiaW1nSGVpZ2h0XCI7XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogYXR0YWNobWVudC5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBhdHRhY2htZW50IHtcclxuICAgICAgICAvKiBOb2RlIGJlaW5nIHVwbG9hZGVkIHRvICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGxvYWROb2RlOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5VcGxvYWRGcm9tRmlsZURsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIG02NC5uYW1lc3BhY2UgdmVyc2lvbiFcIik7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tRmlsZURyb3B6b25lRGxnKCkpLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFRvIHJ1biBsZWdhY3kgdXBsb2FkZXIganVzdCBwdXQgdGhpcyB2ZXJzaW9uIG9mIHRoZSBkaWFsb2cgaGVyZSwgYW5kXHJcbiAgICAgICAgICAgIG5vdGhpbmcgZWxzZSBpcyByZXF1aXJlZC4gU2VydmVyIHNpZGUgcHJvY2Vzc2luZyBpcyBzdGlsbCBpbiBwbGFjZSBmb3IgaXRcclxuXHJcbiAgICAgICAgICAgIChuZXcgVXBsb2FkRnJvbUZpbGVEbGcoKSkub3BlbigpO1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBvcGVuVXBsb2FkRnJvbVVybERsZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGxvYWROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBVcGxvYWRGcm9tVXJsRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIERlbGV0ZSBBdHRhY2htZW50XCIsIFwiRGVsZXRlIHRoZSBBdHRhY2htZW50IG9uIHRoZSBOb2RlP1wiLCBcIlllcywgZGVsZXRlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVBdHRhY2htZW50UmVxdWVzdCwganNvbi5EZWxldGVBdHRhY2htZW50UmVzcG9uc2U+KFwiZGVsZXRlQXR0YWNobWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgbnVsbCwgbm9kZS51aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQXR0YWNobWVudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkRlbGV0ZUF0dGFjaG1lbnRSZXNwb25zZSwgdWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIGF0dGFjaG1lbnRcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnJlbW92ZUJpbmFyeUJ5VWlkKHVpZCk7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3JjZSByZS1yZW5kZXIgZnJvbSBsb2NhbCBkYXRhLlxyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmdvVG9NYWluUGFnZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBlZGl0LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIGVkaXQge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNyZWF0ZU5vZGUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBtNjQuQ3JlYXRlTm9kZURsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5zZXJ0Qm9va1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkluc2VydEJvb2tSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEJvb2tSZXNwb25zZSBydW5uaW5nLlwiKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IEJvb2tcIiwgcmVzKTtcclxuICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlbGV0ZU5vZGVzUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZSwgcGF5bG9hZDogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkRlbGV0ZSBub2RlXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbE5vZGUgPSBwYXlsb2FkW1wicG9zdERlbGV0ZVNlbE5vZGVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0SWQgPSBzZWxOb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBoaWdobGlnaHRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpbml0Tm9kZUVkaXRSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Jbml0Tm9kZUVkaXRSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFZGl0aW5nIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSByZXMubm9kZUluZm87XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNSZXA6IGJvb2xlYW4gPSB1dGlsLnN0YXJ0c1dpdGgobm9kZS5uYW1lLCBcInJlcDpcIikgfHwgLyogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnPyAqL1xuICAgICAgICAgICAgICAgIHV0aWwuY29udGFpbnMobm9kZS5wYXRoLCBcIi9yZXA6XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlmIHRoaXMgaXMgYSBjb21tZW50IG5vZGUgYW5kIHdlIGFyZSB0aGUgY29tbWVudGVyICovXHJcbiAgICAgICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIXByb3BzLmlzTm9uT3duZWROb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlZGl0aW5nQWxsb3dlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogU2VydmVyIHdpbGwgaGF2ZSBzZW50IHVzIGJhY2sgdGhlIHJhdyB0ZXh0IGNvbnRlbnQsIHRoYXQgc2hvdWxkIGJlIG1hcmtkb3duIGluc3RlYWQgb2YgYW55IEhUTUwsIHNvXHJcbiAgICAgICAgICAgICAgICAgICAgICogdGhhdCB3ZSBjYW4gZGlzcGxheSB0aGlzIGFuZCBzYXZlLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlID0gcmVzLm5vZGVJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdCA9IG5ldyBFZGl0Tm9kZURsZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBjYW5ub3QgZWRpdCBub2RlcyB0aGF0IHlvdSBkb24ndCBvd24uXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtb3ZlTm9kZXNSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Nb3ZlTm9kZXNSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJNb3ZlIG5vZGVzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gbnVsbDsgLy8gcmVzZXRcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0ID0ge307XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNldE5vZGVQb3NpdGlvblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkNoYW5nZSBub2RlIHBvc2l0aW9uXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1JlYWRPbmx5UHJvcGVydGllczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBOb2RlIElEIGFycmF5IG9mIG5vZGVzIHRoYXQgYXJlIHJlYWR5IHRvIGJlIG1vdmVkIHdoZW4gdXNlciBjbGlja3MgJ0ZpbmlzaCBNb3ZpbmcnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2Rlc1RvTW92ZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogdG9kby0xOiBuZWVkIHRvIGZpbmQgb3V0IGlmIHRoZXJlJ3MgYSBiZXR0ZXIgd2F5IHRvIGRvIGFuIG9yZGVyZWQgc2V0IGluIGphdmFzY3JpcHQgc28gSSBkb24ndCBuZWVkXHJcbiAgICAgICAgYm90aCBub2Rlc1RvTW92ZSBhbmQgbm9kZXNUb01vdmVTZXRcclxuICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbm9kZXNUb01vdmVTZXQ6IE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudE9mTmV3Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogaW5kaWNhdGVzIGVkaXRvciBpcyBkaXNwbGF5aW5nIGEgbm9kZSB0aGF0IGlzIG5vdCB5ZXQgc2F2ZWQgb24gdGhlIHNlcnZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdGluZ1Vuc2F2ZWROb2RlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbm9kZSAoTm9kZUluZm8uamF2YSkgdGhhdCBpcyBiZWluZyBjcmVhdGVkIHVuZGVyIHdoZW4gbmV3IG5vZGUgaXMgY3JlYXRlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogTm9kZSBiZWluZyBlZGl0ZWRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMjogdGhpcyBhbmQgc2V2ZXJhbCBvdGhlciB2YXJpYWJsZXMgY2FuIG5vdyBiZSBtb3ZlZCBpbnRvIHRoZSBkaWFsb2cgY2xhc3M/IElzIHRoYXQgZ29vZCBvciBiYWRcclxuICAgICAgICAgKiBjb3VwbGluZy9yZXNwb25zaWJpbGl0eT9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyogSW5zdGFuY2Ugb2YgRWRpdE5vZGVEaWFsb2c6IEZvciBub3cgY3JlYXRpbmcgbmV3IG9uZSBlYWNoIHRpbWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXROb2RlRGxnSW5zdDogRWRpdE5vZGVEbGcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR5cGU9Tm9kZUluZm8uamF2YVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogV2hlbiBpbnNlcnRpbmcgYSBuZXcgbm9kZSwgdGhpcyBob2xkcyB0aGUgbm9kZSB0aGF0IHdhcyBjbGlja2VkIG9uIGF0IHRoZSB0aW1lIHRoZSBpbnNlcnQgd2FzIHJlcXVlc3RlZCwgYW5kXHJcbiAgICAgICAgICogaXMgc2VudCB0byBzZXJ2ZXIgZm9yIG9yZGluYWwgcG9zaXRpb24gYXNzaWdubWVudCBvZiBuZXcgbm9kZS4gQWxzbyBpZiB0aGlzIHZhciBpcyBudWxsLCBpdCBpbmRpY2F0ZXMgd2UgYXJlXHJcbiAgICAgICAgICogY3JlYXRpbmcgaW4gYSAnY3JlYXRlIHVuZGVyIHBhcmVudCcgbW9kZSwgdmVyc3VzIG5vbi1udWxsIG1lYW5pbmcgJ2luc2VydCBpbmxpbmUnIHR5cGUgb2YgaW5zZXJ0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBub2RlSW5zZXJ0VGFyZ2V0OiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKiByZXR1cm5zIHRydWUgaWYgd2UgY2FuICd0cnkgdG8nIGluc2VydCB1bmRlciAnbm9kZScgb3IgZmFsc2UgaWYgbm90ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0VkaXRBbGxvd2VkID0gZnVuY3Rpb24obm9kZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIG5vZGUucGF0aCAhPSBcIi9cIiAmJlxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIENoZWNrIHRoYXQgaWYgd2UgaGF2ZSBhIGNvbW1lbnRCeSBwcm9wZXJ0eSB3ZSBhcmUgdGhlIGNvbW1lbnRlciwgYmVmb3JlIGFsbG93aW5nIGVkaXQgYnV0dG9uIGFsc28uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICghcHJvcHMuaXNOb25Pd25lZENvbW1lbnROb2RlKG5vZGUpIHx8IHByb3BzLmlzT3duZWRDb21tZW50Tm9kZShub2RlKSkgLy9cclxuICAgICAgICAgICAgICAgICYmICFwcm9wcy5pc05vbk93bmVkTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIGJlc3Qgd2UgY2FuIGRvIGhlcmUgaXMgYWxsb3cgdGhlIGRpc2FibGVJbnNlcnQgcHJvcCB0byBiZSBhYmxlIHRvIHR1cm4gdGhpbmdzIG9mZiwgbm9kZSBieSBub2RlICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0luc2VydEFsbG93ZWQgPSBmdW5jdGlvbihub2RlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkRJU0FCTEVfSU5TRVJULCBub2RlKSA9PSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzdGFydEVkaXRpbmdOZXdOb2RlID0gZnVuY3Rpb24odHlwZU5hbWU/OiBzdHJpbmcsIGNyZWF0ZUF0VG9wPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBlZGl0aW5nVW5zYXZlZE5vZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBlZGl0Tm9kZURsZ0luc3QgPSBuZXcgRWRpdE5vZGVEbGcodHlwZU5hbWUsIGNyZWF0ZUF0VG9wKTtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0LnNhdmVOZXdOb2RlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjYWxsZWQgdG8gZGlzcGxheSBlZGl0b3IgdGhhdCB3aWxsIGNvbWUgdXAgQkVGT1JFIGFueSBub2RlIGlzIHNhdmVkIG9udG8gdGhlIHNlcnZlciwgc28gdGhhdCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgICAqIGFueSBzYXZlIGlzIHBlcmZvcm1lZCB3ZSB3aWxsIGhhdmUgdGhlIGNvcnJlY3Qgbm9kZSBuYW1lLCBhdCBsZWFzdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFRoaXMgdmVyc2lvbiBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCwgYW5kIGN1cnJlbnRseSB0aGlzIG1lYW5zICdlZGl0aW5nVW5zYXZlZE5vZGUnIGlzIG5vdCBjdXJyZW50bHkgZXZlclxyXG4gICAgICAgICAqIHRyaWdnZXJlZC4gVGhlIG5ldyBhcHByb2FjaCBub3cgdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvICdyZW5hbWUnIG5vZGVzIGlzIHRvIGp1c3QgY3JlYXRlIG9uZSB3aXRoIGFcclxuICAgICAgICAgKiByYW5kb20gbmFtZSBhbiBsZXQgdXNlciBzdGFydCBlZGl0aW5nIHJpZ2h0IGF3YXkgYW5kIHRoZW4gcmVuYW1lIHRoZSBub2RlIElGIGEgY3VzdG9tIG5vZGUgbmFtZSBpcyBuZWVkZWQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGlzIG1lYW5zIGlmIHdlIGNhbGwgdGhpcyBmdW5jdGlvbiAoc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lKSBpbnN0ZWFkIG9mICdzdGFydEVkaXRpbmdOZXdOb2RlKCknXHJcbiAgICAgICAgICogdGhhdCB3aWxsIGNhdXNlIHRoZSBHVUkgdG8gYWx3YXlzIHByb21wdCBmb3IgdGhlIG5vZGUgbmFtZSBiZWZvcmUgY3JlYXRpbmcgdGhlIG5vZGUuIFRoaXMgd2FzIHRoZSBvcmlnaW5hbFxyXG4gICAgICAgICAqIGZ1bmN0aW9uYWxpdHkgYW5kIHN0aWxsIHdvcmtzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc3RhcnRFZGl0aW5nTmV3Tm9kZVdpdGhOYW1lID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGVkaXRpbmdVbnNhdmVkTm9kZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGVkaXROb2RlID0gbnVsbDtcclxuICAgICAgICAgICAgZWRpdE5vZGVEbGdJbnN0ID0gbmV3IEVkaXROb2RlRGxnKCk7XHJcbiAgICAgICAgICAgIGVkaXROb2RlRGxnSW5zdC5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGluc2VydE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5JbnNlcnROb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiSW5zZXJ0IG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmluaXROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKHJlcy5uZXdOb2RlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJ1bkVkaXROb2RlKHJlcy5uZXdOb2RlLnVpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY3JlYXRlU3ViTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNyZWF0ZVN1Yk5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJDcmVhdGUgc3Vibm9kZVwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUocmVzLm5ld05vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcnVuRWRpdE5vZGUocmVzLm5ld05vZGUudWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYXZlTm9kZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlNhdmVOb2RlUmVzcG9uc2UsIHBheWxvYWQ6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIG5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLyogYmVjYXN1c2UgSSBkb24ndCB1bmRlcnN0YW5kICdlZGl0aW5nVW5zYXZlZE5vZGUnIHZhcmlhYmxlIGFueSBsb25nZXIgdW50aWwgaSByZWZyZXNoIG15IG1lbW9yeSwgaSB3aWxsIHVzZVxyXG4gICAgICAgICAgICAgICAgdGhlIG9sZCBhcHByb2FjaCBvZiByZWZyZXNoaW5nIGVudGlyZSB0cmVlIHJhdGhlciB0aGFuIG1vcmUgZWZmaWNpZW50IHJlZnJlc25Ob2RlT25QYWdlLCBiZWN1YXNlIGl0IHJlcXVpcmVzXHJcbiAgICAgICAgICAgICAgICB0aGUgbm9kZSB0byBhbHJlYWR5IGJlIG9uIHRoZSBwYWdlLCBhbmQgdGhpcyByZXF1aXJlcyBpbiBkZXB0aCBhbmFseXMgaSdtIG5vdCBnb2luZyB0byBkbyByaWdodCB0aGlzIG1pbnV0ZS5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvL3JlbmRlci5yZWZyZXNoTm9kZU9uUGFnZShyZXMubm9kZSk7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlLCBwYXlsb2FkLnNhdmVkSWQpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVkaXRNb2RlID0gZnVuY3Rpb24obW9kZVZhbD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2RlVmFsICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID0gbW9kZVZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgPSBtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRvZG8tMzogcmVhbGx5IGVkaXQgbW9kZSBidXR0b24gbmVlZHMgdG8gYmUgc29tZSBraW5kIG9mIGJ1dHRvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGNhbiBzaG93IGFuIG9uL29mZiBzdGF0ZS5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2luY2UgZWRpdCBtb2RlIHR1cm5zIG9uIGxvdHMgb2YgYnV0dG9ucywgdGhlIGxvY2F0aW9uIG9mIHRoZSBub2RlIHdlIGFyZSB2aWV3aW5nIGNhbiBjaGFuZ2Ugc28gbXVjaCBpdFxyXG4gICAgICAgICAgICAgKiBnb2VzIGNvbXBsZXRlbHkgb2Zmc2NyZWVuIG91dCBvZiB2aWV3LCBzbyB3ZSBzY3JvbGwgaXQgYmFjayBpbnRvIHZpZXcgZXZlcnkgdGltZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnNhdmVVc2VyUHJlZmVyZW5jZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbW92ZU5vZGVVcCA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaWJsaW5nSWRcIjogXCJbbm9kZUFib3ZlXVwiXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlRG93biA9IGZ1bmN0aW9uKHVpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvKiBpZiBubyB1aWQgd2FzIHBhc3NlZCwgdXNlIHRoZSBoaWdobGlnaHRlZCBub2RlICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHVpZCA9IHNlbE5vZGUudWlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldE5vZGVQb3NpdGlvblJlcXVlc3QsIGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2U+KFwic2V0Tm9kZVBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudE5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLm5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogXCJbbm9kZUJlbG93XVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2libGluZ0lkXCI6IG5vZGUubmFtZVxyXG4gICAgICAgICAgICAgICAgfSwgc2V0Tm9kZVBvc2l0aW9uUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZFRvTm9kZU1hcCBkb2VzIG5vdCBjb250YWluIFwiICsgdWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtb3ZlTm9kZVRvVG9wID0gZnVuY3Rpb24odWlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIGlmIG5vIHVpZCB3YXMgcGFzc2VkLCB1c2UgdGhlIGhpZ2hsaWdodGVkIG5vZGUgKi9cclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdWlkID0gc2VsTm9kZS51aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2V0Tm9kZVBvc2l0aW9uUmVxdWVzdCwganNvbi5TZXROb2RlUG9zaXRpb25SZXNwb25zZT4oXCJzZXROb2RlUG9zaXRpb25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFyZW50Tm9kZUlkXCI6IG1ldGE2NC5jdXJyZW50Tm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBcIlt0b3BOb2RlXVwiXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1vdmVOb2RlVG9Cb3R0b20gPSBmdW5jdGlvbih1aWQ/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogaWYgbm8gdWlkIHdhcyBwYXNzZWQsIHVzZSB0aGUgaGlnaGxpZ2h0ZWQgbm9kZSAqL1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbE5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgICAgICB1aWQgPSBzZWxOb2RlLnVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TZXROb2RlUG9zaXRpb25SZXF1ZXN0LCBqc29uLlNldE5vZGVQb3NpdGlvblJlc3BvbnNlPihcInNldE5vZGVQb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnROb2RlSWRcIjogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5ub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInNpYmxpbmdJZFwiOiBudWxsXHJcbiAgICAgICAgICAgICAgICB9LCBzZXROb2RlUG9zaXRpb25SZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkVG9Ob2RlTWFwIGRvZXMgbm90IGNvbnRhaW4gXCIgKyB1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYWJvdmUgdGhlIHNwZWNpZmllZCBub2RlIG9yIG51bGwgaWYgbm9kZSBpcyBpdHNlbGYgdGhlIHRvcCBub2RlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlQWJvdmUgPSBmdW5jdGlvbihub2RlKTogYW55IHtcclxuICAgICAgICAgICAgbGV0IG9yZGluYWw6IG51bWJlciA9IG1ldGE2NC5nZXRPcmRpbmFsT2ZOb2RlKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAob3JkaW5hbCA8PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW29yZGluYWwgLSAxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBiZWxvdyB0aGUgc3BlY2lmaWVkIG5vZGUgb3IgbnVsbCBpZiBub2RlIGlzIGl0c2VsZiB0aGUgYm90dG9tIG5vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCZWxvdyA9IGZ1bmN0aW9uKG5vZGU6IGFueSk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgb3JkaW5hbDogbnVtYmVyID0gbWV0YTY0LmdldE9yZGluYWxPZk5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3JkaW5hbCA9IFwiICsgb3JkaW5hbCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRpbmFsID09IC0xIHx8IG9yZGluYWwgPj0gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LmN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbltvcmRpbmFsICsgMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEZpcnN0Q2hpbGROb2RlID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhIHx8ICFtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJ1bkVkaXROb2RlID0gZnVuY3Rpb24odWlkOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiVW5rbm93biBub2RlSWQgaW4gZWRpdE5vZGVDbGljazogXCIgKyB1aWQpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWRpdGluZ1Vuc2F2ZWROb2RlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Jbml0Tm9kZUVkaXRSZXF1ZXN0LCBqc29uLkluaXROb2RlRWRpdFJlc3BvbnNlPihcImluaXROb2RlRWRpdFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkXHJcbiAgICAgICAgICAgIH0sIGluaXROb2RlRWRpdFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Tm9kZSA9IGZ1bmN0aW9uKHVpZD86IGFueSwgdHlwZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgaWYgKCFwYXJlbnRPZk5ld05vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBwYXJlbnRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGdldCB0aGUgbm9kZSBzZWxlY3RlZCBmb3IgdGhlIGluc2VydCBwb3NpdGlvbiBieSB1c2luZyB0aGUgdWlkIGlmIG9uZSB3YXMgcGFzc2VkIGluIG9yIHVzaW5nIHRoZVxyXG4gICAgICAgICAgICAgKiBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBubyB1aWQgd2FzIHBhc3NlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCF1aWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZUluc2VydFRhcmdldCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBzdGFydEVkaXRpbmdOZXdOb2RlKHR5cGVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjcmVhdGVTdWJOb2RlID0gZnVuY3Rpb24odWlkPzogYW55LCB0eXBlTmFtZT86IHN0cmluZywgY3JlYXRlQXRUb3A/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBubyB1aWQgcHJvdmlkZWQgd2UgZGVhZnVsdCB0byBjcmVhdGluZyBhIG5vZGUgdW5kZXIgdGhlIGN1cnJlbnRseSB2aWV3ZWQgbm9kZSAocGFyZW50IG9mIGN1cnJlbnQgcGFnZSksIG9yIGFueSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgKiBub2RlIGlmIHRoZXJlIGlzIGEgc2VsZWN0ZWQgbm9kZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICghdWlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0Tm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50T2ZOZXdOb2RlID0gaGlnaGxpZ2h0Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC5jdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mTmV3Tm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50T2ZOZXdOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmtub3duIG5vZGVJZCBpbiBjcmVhdGVTdWJOb2RlOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0aGlzIGluZGljYXRlcyB3ZSBhcmUgTk9UIGluc2VydGluZyBpbmxpbmUuIEFuIGlubGluZSBpbnNlcnQgd291bGQgYWx3YXlzIGhhdmUgYSB0YXJnZXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlSW5zZXJ0VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgc3RhcnRFZGl0aW5nTmV3Tm9kZSh0eXBlTmFtZSwgY3JlYXRlQXRUb3ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZXBseVRvQ29tbWVudCA9IGZ1bmN0aW9uKHVpZDogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNyZWF0ZVN1Yk5vZGUodWlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xlYXJTZWxlY3Rpb25zID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jbGVhclNlbGVjdGVkTm9kZXMoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFdlIGNvdWxkIHdyaXRlIGNvZGUgdGhhdCBvbmx5IHNjYW5zIGZvciBhbGwgdGhlIFwiU0VMXCIgYnV0dG9ucyBhbmQgdXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlbSwgYnV0IGZvciBub3dcclxuICAgICAgICAgICAgICogd2UgdGFrZSB0aGUgc2ltcGxlIGFwcHJvYWNoIGFuZCBqdXN0IHJlLXJlbmRlciB0aGUgcGFnZS4gVGhlcmUgaXMgbm8gY2FsbCB0byB0aGUgc2VydmVyLCBzbyB0aGlzIGlzXHJcbiAgICAgICAgICAgICAqIGFjdHVhbGx5IHZlcnkgZWZmaWNpZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIERlbGV0ZSB0aGUgc2luZ2xlIG5vZGUgaWRlbnRpZmllZCBieSAndWlkJyBwYXJhbWV0ZXIgaWYgdWlkIHBhcmFtZXRlciBpcyBwYXNzZWQsIGFuZCBpZiB1aWQgcGFyYW1ldGVyIGlzIG5vdFxyXG4gICAgICAgICAqIHBhc3NlZCB0aGVuIHVzZSB0aGUgbm9kZSBzZWxlY3Rpb25zIGZvciBtdWx0aXBsZSBzZWxlY3Rpb25zIG9uIHRoZSBwYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlU2VsTm9kZXMgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHNlbE5vZGVzQXJyYXkgPSBtZXRhNjQuZ2V0U2VsZWN0ZWROb2RlSWRzQXJyYXkoKTtcclxuICAgICAgICAgICAgaWYgKCFzZWxOb2Rlc0FycmF5IHx8IHNlbE5vZGVzQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIllvdSBoYXZlIG5vdCBzZWxlY3RlZCBhbnkgbm9kZXMuIFNlbGVjdCBub2RlcyB0byBkZWxldGUgZmlyc3QuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm0gRGVsZXRlXCIsIFwiRGVsZXRlIFwiICsgc2VsTm9kZXNBcnJheS5sZW5ndGggKyBcIiBub2RlKHMpID9cIiwgXCJZZXMsIGRlbGV0ZS5cIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3N0RGVsZXRlU2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5EZWxldGVOb2Rlc1JlcXVlc3QsIGpzb24uRGVsZXRlTm9kZXNSZXNwb25zZT4oXCJkZWxldGVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibm9kZUlkc1wiOiBzZWxOb2Rlc0FycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZGVsZXRlTm9kZXNSZXNwb25zZSwgbnVsbCwgeyBcInBvc3REZWxldGVTZWxOb2RlXCI6IHBvc3REZWxldGVTZWxOb2RlIH0pO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgdGhlIG5vZGUgd2Ugd2FudCB0byBzY3JvbGwgdG8gYWZ0ZXIgYSBkZWxldGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldEJlc3RQb3N0RGVsZXRlU2VsTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICAvKiBVc2UgYSBoYXNobWFwLXR5cGUgYXBwcm9hY2ggdG8gc2F2aW5nIGFsbCBzZWxlY3RlZCBub2RlcyBpbnRvIGEgbG9vdXAgbWFwICovXHJcbiAgICAgICAgICAgIGxldCBub2Rlc01hcDogT2JqZWN0ID0gbWV0YTY0LmdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQoKTtcclxuICAgICAgICAgICAgbGV0IGJlc3ROb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHRha2VOZXh0Tm9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLyogbm93IHdlIHNjYW4gdGhlIGNoaWxkcmVuLCBhbmQgdGhlIGxhc3QgY2hpbGQgd2UgZW5jb3VudGVyZCB1cCB1bnRpbCB3ZSBmaW5kIHRoZSByaXN0IG9uZW4gaW4gbm9kZXNNYXAgd2lsbCBiZSB0aGVcclxuICAgICAgICAgICAgbm9kZSB3ZSB3aWxsIHdhbnQgdG8gc2VsZWN0IGFuZCBzY3JvbGwgdGhlIHVzZXIgdG8gQUZURVIgdGhlIGRlbGV0aW5nIGlzIGRvbmUgKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhNjQuY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW5baV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRha2VOZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIGlzIHRoaXMgbm9kZSBvbmUgdG8gYmUgZGVsZXRlZCAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzTWFwW25vZGUuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZU5leHROb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlc3ROb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmVzdE5vZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1dFNlbE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsTm9kZXNBcnJheSA9IG1ldGE2NC5nZXRTZWxlY3RlZE5vZGVJZHNBcnJheSgpO1xyXG4gICAgICAgICAgICBpZiAoIXNlbE5vZGVzQXJyYXkgfHwgc2VsTm9kZXNBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiWW91IGhhdmUgbm90IHNlbGVjdGVkIGFueSBub2Rlcy4gU2VsZWN0IG5vZGVzIGZpcnN0LlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXHJcbiAgICAgICAgICAgICAgICBcIkNvbmZpcm0gQ3V0XCIsXHJcbiAgICAgICAgICAgICAgICBcIkN1dCBcIiArIHNlbE5vZGVzQXJyYXkubGVuZ3RoICsgXCIgbm9kZShzKSwgdG8gcGFzdGUvbW92ZSB0byBuZXcgbG9jYXRpb24gP1wiLFxyXG4gICAgICAgICAgICAgICAgXCJZZXNcIixcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlID0gc2VsTm9kZXNBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkTm9kZXNUb01vdmVTZXQoc2VsTm9kZXNBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogdG9kby0wOiBuZWVkIHRvIGhhdmUgYSB3YXkgdG8gZmluZCBhbGwgc2VsZWN0ZWQgY2hlY2tib3hlcyBpbiB0aGUgZ3VpIGFuZCByZXNldCB0aGVtIGFsbCB0byB1bmNoZWNrZWQgKi9cclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0ZWROb2RlcyA9IHt9OyAvLyBjbGVhciBzZWxlY3Rpb25zLlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBub3cgd2UgcmVuZGVyIGFnYWluIGFuZCB0aGUgbm9kZXMgdGhhdCB3ZXJlIGN1dCB3aWxsIGRpc2FwcGVhciBmcm9tIHZpZXcgKi9cclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxvYWROb2Rlc1RvTW92ZVNldCA9IGZ1bmN0aW9uKG5vZGVJZHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzVG9Nb3ZlU2V0W2lkXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcGFzdGVTZWxOb2RlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IENvbmZpcm1EbGcoXCJDb25maXJtIFBhc3RlXCIsIFwiUGFzdGUgXCIgKyBub2Rlc1RvTW92ZS5sZW5ndGggKyBcIiBub2RlKHMpIHVuZGVyIHNlbGVjdGVkIHBhcmVudCBub2RlID9cIixcclxuICAgICAgICAgICAgICAgIFwiWWVzLCBwYXN0ZS5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIEZvciBub3csIHdlIHdpbGwganVzdCBjcmFtIHRoZSBub2RlcyBvbnRvIHRoZSBlbmQgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBwYWdlLiBMYXRlciBvbiB3ZSBjYW4gZ2V0IG1vcmUgc3BlY2lmaWMgYWJvdXQgYWxsb3dpbmcgcHJlY2lzZSBkZXN0aW5hdGlvbiBsb2NhdGlvbiBmb3IgbW92ZWRcclxuICAgICAgICAgICAgICAgICAgICAgKiBub2Rlcy5cclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5Nb3ZlTm9kZXNSZXF1ZXN0LCBqc29uLk1vdmVOb2Rlc1Jlc3BvbnNlPihcIm1vdmVOb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Tm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0Q2hpbGRJZFwiOiBoaWdobGlnaHROb2RlICE9IG51bGwgPyBoaWdobGlnaHROb2RlLmlkIDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRzXCI6IG5vZGVzVG9Nb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbW92ZU5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5zZXJ0Qm9va1dhckFuZFBlYWNlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIkNvbmZpcm1cIiwgXCJJbnNlcnQgYm9vayBXYXIgYW5kIFBlYWNlPzxwLz5XYXJuaW5nOiBZb3Ugc2hvdWxkIGhhdmUgYW4gRU1QVFkgbm9kZSBzZWxlY3RlZCBub3csIHRvIHNlcnZlIGFzIHRoZSByb290IG5vZGUgb2YgdGhlIGJvb2shXCIsIFwiWWVzLCBpbnNlcnQgYm9vay5cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaW5zZXJ0aW5nIHVuZGVyIHdoYXRldmVyIG5vZGUgdXNlciBoYXMgZm9jdXNlZCAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Qm9va1JlcXVlc3QsIGpzb24uSW5zZXJ0Qm9va1Jlc3BvbnNlPihcImluc2VydEJvb2tcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImJvb2tOYW1lXCI6IFwiV2FyIGFuZCBQZWFjZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRydW5jYXRlZFwiOiB1c2VyLmlzVGVzdFVzZXJBY2NvdW50KClcclxuICAgICAgICAgICAgICAgICAgICB9LCBpbnNlcnRCb29rUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBtZXRhNjQuanNcIik7XHJcblxyXG4vKipcclxuICogTWFpbiBBcHBsaWNhdGlvbiBpbnN0YW5jZSwgYW5kIGNlbnRyYWwgcm9vdCBsZXZlbCBvYmplY3QgZm9yIGFsbCBjb2RlLCBhbHRob3VnaCBlYWNoIG1vZHVsZSBnZW5lcmFsbHkgY29udHJpYnV0ZXMgb25lXHJcbiAqIHNpbmdsZXRvbiB2YXJpYWJsZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCB3aXRoIGEgbmFtZSB1c3VhbGx5IGlkZW50aWNhbCB0byB0aGF0IGZpbGUuXHJcbiAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgbWV0YTY0IHtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhcHBJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGN1clVybFBhdGg6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICAgICAgZXhwb3J0IGxldCB1cmxDbWQ6IHN0cmluZztcclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlT3ZlcnJpZGU6IHN0cmluZztcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjb2RlRm9ybWF0RGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogdXNlZCBhcyBhIGtpbmQgb2YgJ3NlcXVlbmNlJyBpbiB0aGUgYXBwLCB3aGVuIHVuaXF1ZSB2YWxzIGEgbmVlZGVkICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBuZXh0R3VpZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLyogbmFtZSBvZiBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXIgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVzZXJOYW1lOiBzdHJpbmcgPSBcImFub255bW91c1wiO1xyXG5cclxuICAgICAgICAvKiBzY3JlZW4gY2FwYWJpbGl0aWVzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkZXZpY2VXaWR0aDogbnVtYmVyID0gMDtcclxuICAgICAgICBleHBvcnQgbGV0IGRldmljZUhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBVc2VyJ3Mgcm9vdCBub2RlLiBUb3AgbGV2ZWwgb2Ygd2hhdCBsb2dnZWQgaW4gdXNlciBpcyBhbGxvd2VkIHRvIHNlZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGhvbWVOb2RlSWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBob21lTm9kZVBhdGg6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc3BlY2lmaWVzIGlmIHRoaXMgaXMgYWRtaW4gdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGlzQWRtaW5Vc2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIGFsd2F5cyBzdGFydCBvdXQgYXMgYW5vbiB1c2VyIHVudGlsIGxvZ2luICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc0Fub25Vc2VyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBleHBvcnQgbGV0IGFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWxsb3dGaWxlU3lzdGVtU2VhcmNoOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogc2lnbmFscyB0aGF0IGRhdGEgaGFzIGNoYW5nZWQgYW5kIHRoZSBuZXh0IHRpbWUgd2UgZ28gdG8gdGhlIG1haW4gdHJlZSB2aWV3IHdpbmRvdyB3ZSBuZWVkIHRvIHJlZnJlc2ggZGF0YVxyXG4gICAgICAgICAqIGZyb20gdGhlIHNlcnZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdHJlZURpcnR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBUaGUgb25seSBjb250cmFjdCBhYm91dCB1aWQgdmFsdWVzIGlzIHRoYXQgdGhleSBhcmUgdW5pcXVlIGluc29mYXIgYXMgYW55IG9uZSBvZiB0aGVtIGFsd2F5cyBtYXBzIHRvIHRoZSBzYW1lXHJcbiAgICAgICAgICogbm9kZS4gTGltaXRlZCBsaWZldGltZSBob3dldmVyLiBUaGUgc2VydmVyIGlzIHNpbXBseSBudW1iZXJpbmcgbm9kZXMgc2VxdWVudGlhbGx5LiBBY3R1YWxseSByZXByZXNlbnRzIHRoZVxyXG4gICAgICAgICAqICdpbnN0YW5jZScgb2YgYSBtb2RlbCBvYmplY3QuIFZlcnkgc2ltaWxhciB0byBhICdoYXNoQ29kZScgb24gSmF2YSBvYmplY3RzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgdWlkVG9Ob2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZS5pZCB2YWx1ZXMgdG8gTm9kZUluZm8uamF2YSBvYmplY3RzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgLyogTWFwcyBmcm9tIHRoZSBET00gSUQgdG8gdGhlIGVkaXRvciBqYXZhc2NyaXB0IGluc3RhbmNlIChBY2UgRWRpdG9yIGluc3RhbmNlKSAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgYWNlRWRpdG9yc0J5SWQ6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBjb3VudGVyIGZvciBsb2NhbCB1aWRzICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBuZXh0VWlkOiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgbm9kZSAnaWRlbnRpZmllcicgKGFzc2lnbmVkIGF0IHNlcnZlcikgdG8gdWlkIHZhbHVlIHdoaWNoIGlzIGEgdmFsdWUgYmFzZWQgb2ZmIGxvY2FsIHNlcXVlbmNlLCBhbmQgdXNlc1xyXG4gICAgICAgICAqIG5leHRVaWQgYXMgdGhlIGNvdW50ZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBpZGVudFRvVWlkTWFwOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVW5kZXIgYW55IGdpdmVuIG5vZGUsIHRoZXJlIGNhbiBiZSBvbmUgYWN0aXZlICdzZWxlY3RlZCcgbm9kZSB0aGF0IGhhcyB0aGUgaGlnaGxpZ2h0aW5nLCBhbmQgd2lsbCBiZSBzY3JvbGxlZFxyXG4gICAgICAgICAqIHRvIHdoZW5ldmVyIHRoZSBwYWdlIHdpdGggdGhhdCBjaGlsZCBpcyB2aXNpdGVkLCBhbmQgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXAgaG9sZHMgdGhlIG1hcCBvZiBcInBhcmVudCB1aWQgdG9cclxuICAgICAgICAgKiBzZWxlY3RlZCBub2RlIChOb2RlSW5mbyBvYmplY3QpXCIsIHdoZXJlIHRoZSBrZXkgaXMgdGhlIHBhcmVudCBub2RlIHVpZCwgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgY3VycmVudGx5XHJcbiAgICAgICAgICogc2VsZWN0ZWQgbm9kZSB3aXRoaW4gdGhhdCBwYXJlbnQuIE5vdGUgdGhpcyAnc2VsZWN0aW9uIHN0YXRlJyBpcyBvbmx5IHNpZ25pZmljYW50IG9uIHRoZSBjbGllbnQsIGFuZCBvbmx5IGZvclxyXG4gICAgICAgICAqIGJlaW5nIGFibGUgdG8gc2Nyb2xsIHRvIHRoZSBub2RlIGR1cmluZyBuYXZpZ2F0aW5nIGFyb3VuZCBvbiB0aGUgdHJlZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IGpzb24uTm9kZUluZm8gfSA9IHt9O1xyXG5cclxuICAgICAgICAvKiBVc2VyLXNlbGVjdGFibGUgdXNlci1hY2NvdW50IG9wdGlvbnMgZWFjaCB1c2VyIGNhbiBzZXQgb24gaGlzIGFjY291bnQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IE1PREVfQURWQU5DRUQ6IHN0cmluZyA9IFwiYWR2YW5jZWRcIjtcclxuICAgICAgICBleHBvcnQgbGV0IE1PREVfU0lNUExFOiBzdHJpbmcgPSBcInNpbXBsZVwiO1xyXG5cclxuICAgICAgICAvKiBjYW4gYmUgJ3NpbXBsZScgb3IgJ2FkdmFuY2VkJyAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE1vZGVPcHRpb246IHN0cmluZyA9IFwic2ltcGxlXCI7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9nZ2xlZCBieSBidXR0b24sIGFuZCBob2xkcyBpZiB3ZSBhcmUgZ29pbmcgdG8gc2hvdyBwcm9wZXJ0aWVzIG9yIG5vdCBvbiBlYWNoIG5vZGUgaW4gdGhlIG1haW4gdmlld1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2hvd1Byb3BlcnRpZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyogRmxhZyB0aGF0IGluZGljYXRlcyBpZiB3ZSBhcmUgcmVuZGVyaW5nIHBhdGgsIG93bmVyLCBtb2RUaW1lLCBldGMuIG9uIGVhY2ggcm93ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93TWV0YURhdGE6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBMaXN0IG9mIG5vZGUgcHJlZml4ZXMgdG8gZmxhZyBub2RlcyB0byBub3QgYWxsb3cgdG8gYmUgc2hvd24gaW4gdGhlIHBhZ2UgaW4gc2ltcGxlIG1vZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNpbXBsZU1vZGVOb2RlUHJlZml4QmxhY2tMaXN0OiBhbnkgPSB7XHJcbiAgICAgICAgICAgIFwicmVwOlwiOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaW1wbGVNb2RlUHJvcGVydHlCbGFja0xpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlYWRPbmx5UHJvcGVydHlMaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBiaW5hcnlQcm9wZXJ0eUxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIG1hcHMgYWxsIG5vZGUgdWlkcyB0byB0cnVlIGlmIHNlbGVjdGVkLCBvdGhlcndpc2UgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBkZWxldGVkIChub3QgZXhpc3RpbmcpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWxlY3RlZE5vZGVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgLyogU2V0IG9mIGFsbCBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZCAoZnJvbSB0aGUgYWJicmV2aWF0ZWQgZm9ybSkgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGV4cGFuZGVkQWJicmV2Tm9kZUlkczogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qIFJlbmRlck5vZGVSZXNwb25zZS5qYXZhIG9iamVjdCAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgY3VycmVudE5vZGVEYXRhOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGFsbCB2YXJpYWJsZXMgZGVyaXZhYmxlIGZyb20gY3VycmVudE5vZGVEYXRhLCBidXQgc3RvcmVkIGRpcmVjdGx5IGZvciBzaW1wbGVyIGNvZGUvYWNjZXNzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZToganNvbi5Ob2RlSW5mbyA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZVVpZDogYW55ID0gbnVsbDtcclxuICAgICAgICBleHBvcnQgbGV0IGN1cnJlbnROb2RlSWQ6IGFueSA9IG51bGw7XHJcbiAgICAgICAgZXhwb3J0IGxldCBjdXJyZW50Tm9kZVBhdGg6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qIE1hcHMgZnJvbSBndWlkIHRvIERhdGEgT2JqZWN0ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBkYXRhT2JqTWFwOiBhbnkgPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJGdW5jdGlvbnNCeUpjclR5cGU6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9O1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlOiB7IFtrZXk6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1c2VyUHJlZmVyZW5jZXM6IGpzb24uVXNlclByZWZlcmVuY2VzID0ge1xyXG4gICAgICAgICAgICBcImVkaXRNb2RlXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBcIlwiLFxyXG4gICAgICAgICAgICBcImltcG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgIFwiZXhwb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU1haW5NZW51UGFuZWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJidWlsZGluZyBtYWluIG1lbnUgcGFuZWxcIik7XHJcbiAgICAgICAgICAgIG1lbnVQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICBtZW51UGFuZWwuaW5pdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBDcmVhdGVzIGEgJ2d1aWQnIG9uIHRoaXMgb2JqZWN0LCBhbmQgbWFrZXMgZGF0YU9iak1hcCBhYmxlIHRvIGxvb2sgdXAgdGhlIG9iamVjdCB1c2luZyB0aGF0IGd1aWQgaW4gdGhlXHJcbiAgICAgICAgICogZnV0dXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVnaXN0ZXJEYXRhT2JqZWN0ID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEuZ3VpZCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ndWlkID0gKytuZXh0R3VpZDtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmpNYXBbZGF0YS5ndWlkXSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0T2JqZWN0QnlHdWlkID0gZnVuY3Rpb24oZ3VpZCkge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gZGF0YU9iak1hcFtndWlkXTtcclxuICAgICAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0YSBvYmplY3Qgbm90IGZvdW5kOiBndWlkPVwiICsgZ3VpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSWYgY2FsbGJhY2sgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgYSBzY3JpcHQgdG8gcnVuLCBvciBpZiBpdCdzIGEgZnVuY3Rpb24gb2JqZWN0IHRoYXQgd2lsbCBiZVxyXG4gICAgICAgICAqIHRoZSBmdW5jdGlvbiB0byBydW4uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBXaGVuZXZlciB3ZSBhcmUgYnVpbGRpbmcgYW4gb25DbGljayBzdHJpbmcsIGFuZCB3ZSBoYXZlIHRoZSBhY3R1YWwgZnVuY3Rpb24sIHJhdGhlciB0aGFuIHRoZSBuYW1lIG9mIHRoZVxyXG4gICAgICAgICAqIGZ1bmN0aW9uIChpLmUuIHdlIGhhdmUgdGhlIGZ1bmN0aW9uIG9iamVjdCBhbmQgbm90IGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIHdlIGhhbmRlIHRoYXQgYnkgYXNzaWduaW5nIGEgZ3VpZFxyXG4gICAgICAgICAqIHRvIHRoZSBmdW5jdGlvbiBvYmplY3QsIGFuZCB0aGVuIGVuY29kZSBhIGNhbGwgdG8gcnVuIHRoYXQgZ3VpZCBieSBjYWxsaW5nIHJ1bkNhbGxiYWNrLiBUaGVyZSBpcyBhIGxldmVsIG9mXHJcbiAgICAgICAgICogaW5kaXJlY3Rpb24gaGVyZSwgYnV0IHRoaXMgaXMgdGhlIHNpbXBsZXN0IGFwcHJvYWNoIHdoZW4gd2UgbmVlZCB0byBiZSBhYmxlIHRvIG1hcCBmcm9tIGEgc3RyaW5nIHRvIGFcclxuICAgICAgICAgKiBmdW5jdGlvbi5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGN0eD1jb250ZXh0LCB3aGljaCBpcyB0aGUgJ3RoaXMnIHRvIGNhbGwgd2l0aCBpZiB3ZSBoYXZlIGEgZnVuY3Rpb24sIGFuZCBoYXZlIGEgJ3RoaXMnIGNvbnRleHQgdG8gYmluZCB0byBpdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHBheWxvYWQgaXMgYW55IGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gYmUgcGFzc2VkIGF0IHJ1bnRpbWVcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG5vdGU6IGRvZXNuJ3QgY3VycmVudGx5IHN1cHBvcnQgaGF2aW5nbiBhIG51bGwgY3R4IGFuZCBub24tbnVsbCBwYXlsb2FkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZW5jb2RlT25DbGljayA9IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnksIGN0eD86IGFueSwgcGF5bG9hZD86IGFueSwgZGVsYXlDYWxsYmFjaz86IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlckRhdGFPYmplY3QoY3R4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJEYXRhT2JqZWN0KHBheWxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGF5bG9hZFN0ciA9IHBheWxvYWQgPyBwYXlsb2FkLmd1aWQgOiBcIm51bGxcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy90b2RvLTA6IHdoeSBpc24ndCBwYXlsb2FkU3RyIGluIHF1b3Rlcz8gSXQgd2FzIGxpa2UgdGhpcyBldmVuIGJlZm9yZSBzd2l0Y2hpbmcgdG8gYmFja3RpY2sgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBtNjQubWV0YTY0LnJ1bkNhbGxiYWNrKCR7Y2FsbGJhY2suZ3VpZH0sJHtjdHguZ3VpZH0sJHtwYXlsb2FkU3RyfSwke2RlbGF5Q2FsbGJhY2t9KTtgO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYG02NC5tZXRhNjQucnVuQ2FsbGJhY2soJHtjYWxsYmFjay5ndWlkfSxudWxsLG51bGwsJHtkZWxheUNhbGxiYWNrfSk7YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5leHBlY3RlZCBjYWxsYmFjayB0eXBlIGluIGVuY29kZU9uQ2xpY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBydW5DYWxsYmFjayA9IGZ1bmN0aW9uKGd1aWQsIGN0eCwgcGF5bG9hZCwgZGVsYXlDYWxsYmFjaz86IG51bWJlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxiYWNrIHJ1bjogXCIgKyBkZWxheUNhbGxiYWNrKTtcclxuICAgICAgICAgICAgLyogZGVwZW5kaW5nIG9uIGRlbGF5Q2FsbGJhY2ssIHJ1biB0aGUgY2FsbGJhY2sgZWl0aGVyIGltbWVkaWF0ZWx5IG9yIHdpdGggYSBkZWxheSAqL1xyXG4gICAgICAgICAgICBpZiAoZGVsYXlDYWxsYmFjayA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnVuQ2FsbGJhY2tJbW1lZGlhdGUoZ3VpZCwgY3R4LCBwYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgIH0sIGRlbGF5Q2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ1bkNhbGxiYWNrSW1tZWRpYXRlKGd1aWQsIGN0eCwgcGF5bG9hZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcnVuQ2FsbGJhY2tJbW1lZGlhdGUgPSBmdW5jdGlvbihndWlkLCBjdHgsIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFPYmogPSBnZXRPYmplY3RCeUd1aWQoZ3VpZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIG9iamVjdCwgd2UgZXhwZWN0IGl0IHRvIGhhdmUgYSAnY2FsbGJhY2snIHByb3BlcnR5XHJcbiAgICAgICAgICAgIC8vIHRoYXQgaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICBpZiAoZGF0YU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIG9yIGVsc2Ugc29tZXRpbWVzIHRoZSByZWdpc3RlcmVkIG9iamVjdCBpdHNlbGYgaXMgdGhlIGZ1bmN0aW9uLFxyXG4gICAgICAgICAgICAvLyB3aGljaCBpcyBvayB0b29cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFPYmogPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0eCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGl6ID0gZ2V0T2JqZWN0QnlHdWlkKGN0eCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBheWxvYWRPYmogPSBwYXlsb2FkID8gZ2V0T2JqZWN0QnlHdWlkKHBheWxvYWQpIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmNhbGwodGhpeiwgcGF5bG9hZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmooKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwidW5hYmxlIHRvIGZpbmQgY2FsbGJhY2sgb24gcmVnaXN0ZXJlZCBndWlkOiBcIiArIGd1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5TaW1wbGVNb2RlID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBlZGl0TW9kZU9wdGlvbiA9PT0gTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2ggPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgZ29Ub01haW5QYWdlKHRydWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnb1RvTWFpblBhZ2UgPSBmdW5jdGlvbihyZXJlbmRlcj86IGJvb2xlYW4sIGZvcmNlU2VydmVyUmVmcmVzaD86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChmb3JjZVNlcnZlclJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIHRyZWVEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXJlbmRlciB8fCB0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0cmVlRGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBub3QgcmUtcmVuZGVyaW5nIHBhZ2UgKGVpdGhlciBmcm9tIHNlcnZlciwgb3IgZnJvbSBsb2NhbCBkYXRhLCB0aGVuIHdlIGp1c3QgbmVlZCB0byBsaXR0ZXJhbGx5IHN3aXRjaFxyXG4gICAgICAgICAgICAgKiBwYWdlIGludG8gdmlzaWJsZSwgYW5kIHNjcm9sbCB0byBub2RlKVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VsZWN0VGFiID0gZnVuY3Rpb24ocGFnZU5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIGlyb25QYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTtcclxuICAgICAgICAgICAgKDxfSGFzU2VsZWN0Pmlyb25QYWdlcykuc2VsZWN0KHBhZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgY29kZSBjYW4gYmUgbWFkZSBtb3JlIERSWSwgYnV0IGknbSBqdXN0IHRyeWluZyBpdCBvdXQgZm9yIG5vdywgc28gaSdtIG5vdCBib3RoZXJpbmcgdG8gcGVyZmVjdCBpdCB5ZXQuICovXHJcbiAgICAgICAgICAgIC8vICQoXCIjbWFpblBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gJChcIiN0aW1lbGluZVBhZ2VCdXR0b25cIikuY3NzKFwiYm9yZGVyLWxlZnRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGlmIChwYWdlTmFtZSA9PSAnbWFpblRhYk5hbWUnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAkKFwiI21haW5QYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyBlbHNlIGlmIChwYWdlTmFtZSA9PSAnc2VhcmNoVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjc2VhcmNoUGFnZUJ1dHRvblwiKS5jc3MoXCJib3JkZXItbGVmdFwiLCBcIjhweCBzb2xpZCByZWRcIik7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZWxzZSBpZiAocGFnZU5hbWUgPT0gJ3RpbWVsaW5lVGFiTmFtZScpIHtcclxuICAgICAgICAgICAgLy8gICAgICQoXCIjdGltZWxpbmVQYWdlQnV0dG9uXCIpLmNzcyhcImJvcmRlci1sZWZ0XCIsIFwiOHB4IHNvbGlkIHJlZFwiKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJZiBkYXRhIChpZiBwcm92aWRlZCkgbXVzdCBiZSB0aGUgaW5zdGFuY2UgZGF0YSBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIGRpYWxvZywgYW5kIGFsbCB0aGUgZGlhbG9nXHJcbiAgICAgICAgICogbWV0aG9kcyBhcmUgb2YgY291cnNlIHNpbmdsZXRvbnMgdGhhdCBhY2NlcHQgdGhpcyBkYXRhIHBhcmFtZXRlciBmb3IgYW55IG9wdGVyYXRpb25zLiAob2xkc2Nob29sIHdheSBvZiBkb2luZ1xyXG4gICAgICAgICAqIE9PUCB3aXRoICd0aGlzJyBiZWluZyBmaXJzdCBwYXJhbWV0ZXIgYWx3YXlzKS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIE5vdGU6IGVhY2ggZGF0YSBpbnN0YW5jZSBpcyByZXF1aXJlZCB0byBoYXZlIGEgZ3VpZCBudW1iZXJpYyBwcm9wZXJ0eSwgdW5pcXVlIHRvIGl0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBjaGFuZ2VQYWdlID0gZnVuY3Rpb24ocGc/OiBhbnksIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwZy50YWJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib29wcywgd3Jvbmcgb2JqZWN0IHR5cGUgcGFzc2VkIHRvIGNoYW5nZVBhZ2UgZnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIHRoaXMgaXMgdGhlIHNhbWUgYXMgc2V0dGluZyB1c2luZyBtYWluSXJvblBhZ2VzPz8gKi9cclxuICAgICAgICAgICAgdmFyIHBhcGVyVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbklyb25QYWdlc1wiKTsgLy9cIiNtYWluUGFwZXJUYWJzXCIpO1xyXG4gICAgICAgICAgICAoPF9IYXNTZWxlY3Q+cGFwZXJUYWJzKS5zZWxlY3QocGcudGFiSWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpc05vZGVCbGFja0xpc3RlZCA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFpblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wO1xyXG4gICAgICAgICAgICBmb3IgKHByb3AgaW4gc2ltcGxlTW9kZU5vZGVQcmVmaXhCbGFja0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaW1wbGVNb2RlTm9kZVByZWZpeEJsYWNrTGlzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiB1dGlsLnN0YXJ0c1dpdGgobm9kZS5uYW1lLCBwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZVVpZHNBcnJheSA9IGZ1bmN0aW9uKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBzdHJpbmdbXSA9IFtdLCB1aWQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXkucHVzaCh1aWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxBcnJheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgIFJldHVybnMgYSBuZXdseSBjbG9uZWQgYXJyYXkgb2YgYWxsIHRoZSBzZWxlY3RlZCBub2RlcyBlYWNoIHRpbWUgaXQncyBjYWxsZWQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZUlkc0FycmF5ID0gZnVuY3Rpb24oKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IHN0cmluZ1tdID0gW10sIHVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyBzZWxlY3RlZCBub2Rlcy5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkTm9kZSBjb3VudDogXCIgKyB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2RlcykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1bmFibGUgdG8gZmluZCB1aWRUb05vZGVNYXAgZm9yIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXkucHVzaChub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogcmV0dXJuIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIGVhY2ggTm9kZUluZm8gd2hlcmUgdGhlIGtleSBpcyB0aGUgaWQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNlbGVjdGVkTm9kZXNBc01hcEJ5SWQgPSBmdW5jdGlvbigpOiBPYmplY3Qge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgbGV0IHNlbEFycmF5OiBqc29uLk5vZGVJbmZvW10gPSB0aGlzLmdldFNlbGVjdGVkTm9kZXNBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXRbc2VsQXJyYXlbaV0uaWRdID0gc2VsQXJyYXlbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEdldHMgc2VsZWN0ZWQgbm9kZXMgYXMgTm9kZUluZm8uamF2YSBvYmplY3RzIGFycmF5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZE5vZGVzQXJyYXkgPSBmdW5jdGlvbigpOiBqc29uLk5vZGVJbmZvW10ge1xyXG4gICAgICAgICAgICBsZXQgc2VsQXJyYXk6IGpzb24uTm9kZUluZm9bXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgaWR4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHVpZCBpbiBzZWxlY3RlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROb2Rlcy5oYXNPd25Qcm9wZXJ0eSh1aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsQXJyYXlbaWR4KytdID0gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlbEFycmF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbGVhclNlbGVjdGVkTm9kZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWROb2RlcyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVOb2RlSW5mb1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzLCBub2RlKSB7XHJcbiAgICAgICAgICAgIGxldCBvd25lckJ1Zjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IG1pbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMub3duZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzLm93bmVycywgZnVuY3Rpb24oaW5kZXgsIG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyQnVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJCdWYgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXIgPT09IG1ldGE2NC51c2VyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyQnVmICs9IG93bmVyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvd25lckJ1Zi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLm93bmVyID0gb3duZXJCdWY7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxtSWQgPSBcIiNvd25lckRpc3BsYXlcIiArIG5vZGUudWlkO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsbSA9ICQoZWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmh0bWwoXCIgKE1hbmFnZXI6IFwiICsgb3duZXJCdWYgKyBcIilcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhlbG1JZCwgXCJjcmVhdGVkLWJ5LW90aGVyXCIsIFwiY3JlYXRlZC1ieS1tZVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbUlkLCBcImNyZWF0ZWQtYnktbWVcIiwgXCJjcmVhdGVkLWJ5LW90aGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHVwZGF0ZU5vZGVJbmZvID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU5vZGVJbmZvUmVzcG9uc2UocmVzLCBub2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBSZXR1cm5zIHRoZSBub2RlIHdpdGggdGhlIGdpdmVuIG5vZGUuaWQgdmFsdWUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVGcm9tSWQgPSBmdW5jdGlvbihpZDogc3RyaW5nKToganNvbi5Ob2RlSW5mbyB7XHJcbiAgICAgICAgICAgIHJldHVybiBpZFRvTm9kZU1hcFtpZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFBhdGhPZlVpZCA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJbcGF0aCBlcnJvci4gaW52YWxpZCB1aWQ6IFwiICsgdWlkICsgXCJdXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldEhpZ2hsaWdodGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBqc29uLk5vZGVJbmZvID0gcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dCeUlkID0gZnVuY3Rpb24oaWQsIHNjcm9sbCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgbm9kZToganNvbi5Ob2RlSW5mbyA9IGdldE5vZGVGcm9tSWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0Tm9kZShub2RlLCBzY3JvbGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaWdobGlnaHRSb3dCeUlkIGZhaWxlZCB0byBmaW5kIGlkOiBcIiArIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBJbXBvcnRhbnQ6IFdlIHdhbnQgdGhpcyB0byBiZSB0aGUgb25seSBtZXRob2QgdGhhdCBjYW4gc2V0IHZhbHVlcyBvbiAncGFyZW50VWlkVG9Gb2N1c05vZGVNYXAnLCBhbmQgYWx3YXlzXHJcbiAgICAgICAgICogc2V0dGluZyB0aGF0IHZhbHVlIHNob3VsZCBnbyB0aHJ1IHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2Nyb2xsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBkb25lSGlnaGxpZ2h0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBVbmhpZ2hsaWdodCBjdXJyZW50bHkgaGlnaGxpZ2h0ZWQgbm9kZSBpZiBhbnkgKi9cclxuICAgICAgICAgICAgbGV0IGN1ckhpZ2hsaWdodGVkTm9kZToganNvbi5Ob2RlSW5mbyA9IHBhcmVudFVpZFRvRm9jdXNOb2RlTWFwW2N1cnJlbnROb2RlVWlkXTtcclxuICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ckhpZ2hsaWdodGVkTm9kZS51aWQgPT09IG5vZGUudWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhbHJlYWR5IGhpZ2hsaWdodGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb25lSGlnaGxpZ2h0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvd0VsbUlkID0gY3VySGlnaGxpZ2h0ZWROb2RlLnVpZCArIFwiX3Jvd1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByb3dFbG0gPSAkKFwiI1wiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhcIiNcIiArIHJvd0VsbUlkLCBcImFjdGl2ZS1yb3dcIiwgXCJpbmFjdGl2ZS1yb3dcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZG9uZUhpZ2hsaWdodGluZykge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50VWlkVG9Gb2N1c05vZGVNYXBbY3VycmVudE5vZGVVaWRdID0gbm9kZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWxtID0gJChcIiNcIiArIHJvd0VsbUlkKTtcclxuICAgICAgICAgICAgICAgIGlmICghcm93RWxtIHx8IHJvd0VsbS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGZpbmQgcm93RWxlbWVudCB0byBoaWdobGlnaHQ6IFwiICsgcm93RWxtSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKFwiI1wiICsgcm93RWxtSWQsIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJlYWxseSBuZWVkIHRvIHVzZSBwdWIvc3ViIGV2ZW50IHRvIGJyb2FkY2FzdCBlbmFibGVtZW50LCBhbmQgbGV0IGVhY2ggY29tcG9uZW50IGRvIHRoaXMgaW5kZXBlbmRlbnRseSBhbmRcclxuICAgICAgICAgKiBkZWNvdXBsZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyogbXVsdGlwbGUgc2VsZWN0IG5vZGVzICovXHJcbiAgICAgICAgICAgIGxldCBwcmV2UGFnZUV4aXN0czogYm9vbGVhbiA9IG5hdi5tYWluT2Zmc2V0ID4gMDtcclxuICAgICAgICAgICAgbGV0IG5leHRQYWdlRXhpc3RzOiBib29sZWFuID0gIW5hdi5lbmRSZWFjaGVkO1xyXG4gICAgICAgICAgICBsZXQgc2VsTm9kZUNvdW50OiBudW1iZXIgPSB1dGlsLmdldFByb3BlcnR5Q291bnQoc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgICAgIGxldCBoaWdobGlnaHROb2RlOiBqc29uLk5vZGVJbmZvID0gZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGxldCBzZWxOb2RlSXNNaW5lOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIChoaWdobGlnaHROb2RlLmNyZWF0ZWRCeSA9PT0gdXNlck5hbWUgfHwgXCJhZG1pblwiID09PSB1c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJob21lTm9kZUlkPVwiK21ldGE2NC5ob21lTm9kZUlkK1wiIGhpZ2hsaWdodE5vZGUuaWQ9XCIraGlnaGxpZ2h0Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGxldCBob21lTm9kZVNlbGVjdGVkOiBib29sZWFuID0gaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZDtcclxuICAgICAgICAgICAgbGV0IGltcG9ydEZlYXR1cmVFbmFibGVkID0gaXNBZG1pblVzZXIgfHwgdXNlclByZWZlcmVuY2VzLmltcG9ydEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIGxldCBleHBvcnRGZWF0dXJlRW5hYmxlZCA9IGlzQWRtaW5Vc2VyIHx8IHVzZXJQcmVmZXJlbmNlcy5leHBvcnRBbGxvd2VkO1xyXG4gICAgICAgICAgICBsZXQgaGlnaGxpZ2h0T3JkaW5hbDogbnVtYmVyID0gZ2V0T3JkaW5hbE9mTm9kZShoaWdobGlnaHROb2RlKTtcclxuICAgICAgICAgICAgbGV0IG51bUNoaWxkTm9kZXM6IG51bWJlciA9IGdldE51bUNoaWxkTm9kZXMoKTtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IChoaWdobGlnaHRPcmRpbmFsID4gMCAmJiBudW1DaGlsZE5vZGVzID4gMSkgfHwgcHJldlBhZ2VFeGlzdHM7XHJcbiAgICAgICAgICAgIGxldCBjYW5Nb3ZlRG93bjogYm9vbGVhbiA9IChoaWdobGlnaHRPcmRpbmFsIDwgbnVtQ2hpbGROb2RlcyAtIDEgJiYgbnVtQ2hpbGROb2RlcyA+IDEpIHx8IG5leHRQYWdlRXhpc3RzO1xyXG5cclxuICAgICAgICAgICAgLy90b2RvLTA6IG5lZWQgdG8gYWRkIHRvIHRoaXMgc2VsTm9kZUlzTWluZSB8fCBzZWxQYXJlbnRJc01pbmU7XHJcbiAgICAgICAgICAgIGxldCBjYW5DcmVhdGVOb2RlID0gdXNlclByZWZlcmVuY2VzLmVkaXRNb2RlICYmIChpc0FkbWluVXNlciB8fCAoIWlzQW5vblVzZXIgLyogJiYgc2VsTm9kZUlzTWluZSAqLykpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbmFibGVtZW50OiBpc0Fub25Vc2VyPVwiICsgaXNBbm9uVXNlciArIFwiIHNlbE5vZGVDb3VudD1cIiArIHNlbE5vZGVDb3VudCArIFwiIHNlbE5vZGVJc01pbmU9XCIgKyBzZWxOb2RlSXNNaW5lKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm5hdkxvZ291dEJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm9wZW5TaWdudXBQZ0J1dHRvblwiLCBpc0Fub25Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wc1RvZ2dsZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBwcm9wc1RvZ2dsZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsb3dFZGl0TW9kZTogYm9vbGVhbiA9IGN1cnJlbnROb2RlICYmICFpc0Fub25Vc2VyO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE1vZGVCdXR0b25cIiwgYWxsb3dFZGl0TW9kZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInVwTGV2ZWxCdXR0b25cIiwgY3VycmVudE5vZGUgJiYgbmF2LnBhcmVudFZpc2libGVUb1VzZXIoKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImN1dFNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIHNlbE5vZGVDb3VudCA+IDAgJiYgc2VsTm9kZUlzTWluZSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBzZWxOb2RlQ291bnQgPiAwKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicGFzdGVTZWxOb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBlZGl0Lm5vZGVzVG9Nb3ZlICE9IG51bGwgJiYgKHNlbE5vZGVJc01pbmUgfHwgaG9tZU5vZGVTZWxlY3RlZCkpO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwibW92ZU5vZGVVcEJ1dHRvblwiLCBjYW5Nb3ZlVXApO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZURvd25CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJtb3ZlTm9kZVRvVG9wQnV0dG9uXCIsIGNhbk1vdmVVcCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1vdmVOb2RlVG9Cb3R0b21CdXR0b25cIiwgY2FuTW92ZURvd24pO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY2hhbmdlUGFzc3dvcmRQZ0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImFjY291bnRQcmVmZXJlbmNlc0J1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcIm1hbmFnZUFjY291bnRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJpbnNlcnRCb29rV2FyQW5kUGVhY2VCdXR0b25cIiwgaXNBZG1pblVzZXIgfHwgKHVzZXIuaXNUZXN0VXNlckFjY291bnQoKSAmJiBzZWxOb2RlSXNNaW5lKSk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImdlbmVyYXRlUlNTQnV0dG9uXCIsIGlzQWRtaW5Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidXBsb2FkRnJvbUZpbGVCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIHNlbE5vZGVJc01pbmUpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1cGxvYWRGcm9tVXJsQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiBoaWdobGlnaHROb2RlLmhhc0JpbmFyeSAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZWRpdE5vZGVTaGFyaW5nQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwicmVuYW1lTm9kZVBnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCAmJiBzZWxOb2RlSXNNaW5lKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0YWdTZWFyY2hEbGdCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBhbGxvd0ZpbGVTeXN0ZW1TZWFyY2gpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzZWFyY2hNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInRpbWVsaW5lTWFpbkFwcEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ0aW1lbGluZUNyZWF0ZWRCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJzaG93U2VydmVySW5mb0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcInNob3dGdWxsTm9kZVVybEJ1dHRvblwiLCBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCAhaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0RW5hYmxlbWVudChcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCAhaXNBbm9uVXNlciAmJiBoaWdobGlnaHROb2RlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEVuYWJsZW1lbnQoXCJ1c2VyUHJlZmVyZW5jZXNNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiY3JlYXRlTm9kZUJ1dHRvblwiLCBjYW5DcmVhdGVOb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZCkpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwib3BlbkV4cG9ydERsZ1wiLCBleHBvcnRGZWF0dXJlRW5hYmxlZCAmJiAoc2VsTm9kZUlzTWluZSB8fCAoaGlnaGxpZ2h0Tm9kZSAhPSBudWxsICYmIGhvbWVOb2RlSWQgPT0gaGlnaGxpZ2h0Tm9kZS5pZCkpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRFbmFibGVtZW50KFwiYWRtaW5NZW51XCIsIGlzQWRtaW5Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIC8vVklTSUJJTElUWVxyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkltcG9ydERsZ1wiLCBpbXBvcnRGZWF0dXJlRW5hYmxlZCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm9wZW5FeHBvcnREbGdcIiwgZXhwb3J0RmVhdHVyZUVuYWJsZWQpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJlZGl0TW9kZUJ1dHRvblwiLCBhbGxvd0VkaXRNb2RlKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidXBMZXZlbEJ1dHRvblwiLCBjdXJyZW50Tm9kZSAmJiBuYXYucGFyZW50VmlzaWJsZVRvVXNlcigpKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIGlzQWRtaW5Vc2VyIHx8ICh1c2VyLmlzVGVzdFVzZXJBY2NvdW50KCkgJiYgc2VsTm9kZUlzTWluZSkpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBpc0FkbWluVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInByb3BzVG9nZ2xlQnV0dG9uXCIsICFpc0Fub25Vc2VyKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwib3BlbkxvZ2luRGxnQnV0dG9uXCIsIGlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJuYXZMb2dvdXRCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJvcGVuU2lnbnVwUGdCdXR0b25cIiwgaXNBbm9uVXNlcik7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInNlYXJjaE1haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIgJiYgaGlnaGxpZ2h0Tm9kZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwidGltZWxpbmVNYWluQXBwQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGhpZ2hsaWdodE5vZGUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcInVzZXJQcmVmZXJlbmNlc01haW5BcHBCdXR0b25cIiwgIWlzQW5vblVzZXIpO1xyXG4gICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJmaWxlU2VhcmNoRGxnQnV0dG9uXCIsICFpc0Fub25Vc2VyICYmIGFsbG93RmlsZVN5c3RlbVNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICAvL1RvcCBMZXZlbCBNZW51IFZpc2liaWxpdHlcclxuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiYWRtaW5NZW51XCIsIGlzQWRtaW5Vc2VyKTtcclxuXHJcbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXHJcbiAgICAgICAgICAgIFBvbHltZXIudXBkYXRlU3R5bGVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldFNpbmdsZVNlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCk6IGpzb24uTm9kZUluZm8ge1xyXG4gICAgICAgICAgICBsZXQgdWlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGZvciAodWlkIGluIHNlbGVjdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzLmhhc093blByb3BlcnR5KHVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImZvdW5kIGEgc2luZ2xlIFNlbCBOb2RlSUQ6IFwiICsgbm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE9yZGluYWxPZk5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlIHx8ICFjdXJyZW50Tm9kZURhdGEgfHwgIWN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pZCA9PT0gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROdW1DaGlsZE5vZGVzID0gZnVuY3Rpb24oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50Tm9kZURhdGEgfHwgIWN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlRGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldEN1cnJlbnROb2RlRGF0YSA9IGZ1bmN0aW9uKGRhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVEYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBkYXRhLm5vZGU7XHJcbiAgICAgICAgICAgIGN1cnJlbnROb2RlVWlkID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVJZCA9IGRhdGEubm9kZS5pZDtcclxuICAgICAgICAgICAgY3VycmVudE5vZGVQYXRoID0gZGF0YS5ub2RlLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGFub25QYWdlTG9hZFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkFub25QYWdlTG9hZFJlc3BvbnNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzLnJlbmRlck5vZGVSZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIm1haW5Ob2RlQ29udGVudFwiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcy5yZW5kZXJOb2RlUmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldFZpc2liaWxpdHkoXCJtYWluTm9kZUNvbnRlbnRcIiwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBsaXN0dmlldyB0bzogXCIgKyByZXMuY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJsaXN0Vmlld1wiLCByZXMuY29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVtb3ZlQmluYXJ5QnlVaWQgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudWlkID09PSB1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmhhc0JpbmFyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVwZGF0ZXMgY2xpZW50IHNpZGUgbWFwcyBhbmQgY2xpZW50LXNpZGUgaWRlbnRpZmllciBmb3IgbmV3IG5vZGUsIHNvIHRoYXQgdGhpcyBub2RlIGlzICdyZWNvZ25pemVkJyBieSBjbGllbnRcclxuICAgICAgICAgKiBzaWRlIGNvZGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaXROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgdXBkYXRlTWFwcz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluaXROb2RlIGhhcyBudWxsIG5vZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogYXNzaWduIGEgcHJvcGVydHkgZm9yIGRldGVjdGluZyB0aGlzIG5vZGUgdHlwZSwgSSdsbCBkbyB0aGlzIGluc3RlYWQgb2YgdXNpbmcgc29tZSBraW5kIG9mIGN1c3RvbSBKU1xyXG4gICAgICAgICAgICAgKiBwcm90b3R5cGUtcmVsYXRlZCBhcHByb2FjaFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbm9kZS51aWQgPSB1cGRhdGVNYXBzID8gdXRpbC5nZXRVaWRGb3JJZChpZGVudFRvVWlkTWFwLCBub2RlLmlkKSA6IGlkZW50VG9VaWRNYXBbbm9kZS5pZF07XHJcbiAgICAgICAgICAgIG5vZGUucHJvcGVydGllcyA9IHByb3BzLmdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlcihub2RlLCBub2RlLnByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogRm9yIHRoZXNlIHR3byBwcm9wZXJ0aWVzIHRoYXQgYXJlIGFjY2Vzc2VkIGZyZXF1ZW50bHkgd2UgZ28gYWhlYWQgYW5kIGxvb2t1cCB0aGUgcHJvcGVydGllcyBpbiB0aGVcclxuICAgICAgICAgICAgICogcHJvcGVydHkgYXJyYXksIGFuZCBhc3NpZ24gdGhlbSBkaXJlY3RseSBhcyBub2RlIG9iamVjdCBwcm9wZXJ0aWVzIHNvIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UsIGFuZCBhbHNvXHJcbiAgICAgICAgICAgICAqIHNpbXBsaWZ5IGNvZGUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBub2RlLmNyZWF0ZWRCeSA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmxhc3RNb2RpZmllZCA9IG5ldyBEYXRlKHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIG5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVNYXBzKSB7XHJcbiAgICAgICAgICAgICAgICB1aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIGlkVG9Ob2RlTWFwW25vZGUuaWRdID0gbm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0Q29uc3RhbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKHNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdCwgWyAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5NSVhJTl9UWVBFUywgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuUFJJTUFSWV9UWVBFLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5QT0xJQ1ksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LklNR19XSURUSCwvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKHJlYWRPbmx5UHJvcGVydHlMaXN0LCBbIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBSSU1BUllfVFlQRSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuVVVJRCwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuTUlYSU5fVFlQRVMsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNSRUFURUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNSRUFURURfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRUQsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlksLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuSU1HX1dJRFRILCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5JTUdfSEVJR0hULCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fVkVSLCAvL1xyXG4gICAgICAgICAgICAgICAgamNyQ25zdC5CSU5fREFUQSwgLy9cclxuICAgICAgICAgICAgICAgIGpjckNuc3QuQklOX01JTUUsIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LkNPTU1FTlRfQlksIC8vXHJcbiAgICAgICAgICAgICAgICBqY3JDbnN0LlBVQkxJQ19BUFBFTkRdKTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuYWRkQWxsKGJpbmFyeVByb3BlcnR5TGlzdCwgW2pjckNuc3QuQklOX0RBVEFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogdGhpcyBhbmQgZXZlcnkgb3RoZXIgbWV0aG9kIHRoYXQncyBjYWxsZWQgYnkgYSBsaXRzdGVuZXIgb3IgYSB0aW1lciBuZWVkcyB0byBoYXZlIHRoZSAnZmF0IGFycm93JyBzeW50YXggZm9yIHRoaXMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluaXRBcHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0QXBwIHJ1bm5pbmcuXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFwcEluaXRpYWxpemVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYXBwSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhYnMgPSB1dGlsLnBvbHkoXCJtYWluSXJvblBhZ2VzXCIpO1xyXG4gICAgICAgICAgICB0YWJzLmFkZEV2ZW50TGlzdGVuZXIoXCJpcm9uLXNlbGVjdFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRhYkNoYW5nZUV2ZW50KHRhYnMuc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGluaXRDb25zdGFudHMoKTtcclxuICAgICAgICAgICAgZGlzcGxheVNpZ251cE1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMzogaG93IGRvZXMgb3JpZW50YXRpb25jaGFuZ2UgbmVlZCB0byB3b3JrIGZvciBwb2x5bWVyPyBQb2x5bWVyIGRpc2FibGVkXHJcbiAgICAgICAgICAgICAqICQod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIF8ub3JpZW50YXRpb25IYW5kbGVyKTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAkKHdpbmRvdykuYmluZChcImJlZm9yZXVubG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIkxlYXZlIE1ldGE2NCA/XCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSSB0aG91Z2h0IHRoaXMgd2FzIGEgZ29vZCBpZGVhLCBidXQgYWN0dWFsbHkgaXQgZGVzdHJveXMgdGhlIHNlc3Npb24sIHdoZW4gdGhlIHVzZXIgaXMgZW50ZXJpbmcgYW5cclxuICAgICAgICAgICAgICogXCJpZD1cXG15XFxwYXRoXCIgdHlwZSBvZiB1cmwgdG8gb3BlbiBhIHNwZWNpZmljIG5vZGUuIE5lZWQgdG8gcmV0aGluayAgQmFzaWNhbGx5IGZvciBub3cgSSdtIHRoaW5raW5nXHJcbiAgICAgICAgICAgICAqIGdvaW5nIHRvIGEgZGlmZmVyZW50IHVybCBzaG91bGRuJ3QgYmxvdyB1cCB0aGUgc2Vzc2lvbiwgd2hpY2ggaXMgd2hhdCAnbG9nb3V0JyBkb2VzLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiAkKHdpbmRvdykub24oXCJ1bmxvYWRcIiwgZnVuY3Rpb24oKSB7IHVzZXIubG9nb3V0KGZhbHNlKTsgfSk7XHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgZGV2aWNlV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogVGhpcyBjYWxsIGNoZWNrcyB0aGUgc2VydmVyIHRvIHNlZSBpZiB3ZSBoYXZlIGEgc2Vzc2lvbiBhbHJlYWR5LCBhbmQgZ2V0cyBiYWNrIHRoZSBsb2dpbiBpbmZvcm1hdGlvbiBmcm9tXHJcbiAgICAgICAgICAgICAqIHRoZSBzZXNzaW9uLCBhbmQgdGhlbiByZW5kZXJzIHBhZ2UgY29udGVudCwgYWZ0ZXIgdGhhdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHVzZXIucmVmcmVzaExvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBDaGVjayBmb3Igc2NyZWVuIHNpemUgaW4gYSB0aW1lci4gV2UgZG9uJ3Qgd2FudCB0byBtb25pdG9yIGFjdHVhbCBzY3JlZW4gcmVzaXplIGV2ZW50cyBiZWNhdXNlIGlmIGEgdXNlclxyXG4gICAgICAgICAgICAgKiBpcyBleHBhbmRpbmcgYSB3aW5kb3cgd2UgYmFzaWNhbGx5IHdhbnQgdG8gbGltaXQgdGhlIENQVSBhbmQgY2hhb3MgdGhhdCB3b3VsZCBlbnN1ZSBpZiB3ZSB0cmllZCB0byBhZGp1c3RcclxuICAgICAgICAgICAgICogdGhpbmdzIGV2ZXJ5IHRpbWUgaXQgY2hhbmdlcy4gU28gd2UgdGhyb3R0bGUgYmFjayB0byBvbmx5IHJlb3JnYW5pemluZyB0aGUgc2NyZWVuIG9uY2UgcGVyIHNlY29uZC4gVGhpc1xyXG4gICAgICAgICAgICAgKiB0aW1lciBpcyBhIHRocm90dGxlIHNvcnQgb2YuIFllcyBJIGtub3cgaG93IHRvIGxpc3RlbiBmb3IgZXZlbnRzLiBObyBJJ20gbm90IGRvaW5nIGl0IHdyb25nIGhlcmUuIFRoaXNcclxuICAgICAgICAgICAgICogdGltZXIgaXMgY29ycmVjdCBpbiB0aGlzIGNhc2UgYW5kIGJlaGF2ZXMgc3VwZXJpb3IgdG8gZXZlbnRzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogUG9seW1lci0+ZGlzYWJsZVxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHsgdmFyIHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIGlmICh3aWR0aCAhPSBfLmRldmljZVdpZHRoKSB7IC8vIGNvbnNvbGUubG9nKFwiU2NyZWVuIHdpZHRoIGNoYW5nZWQ6IFwiICsgd2lkdGgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBfLmRldmljZVdpZHRoID0gd2lkdGg7IF8uZGV2aWNlSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBfLnNjcmVlblNpemVDaGFuZ2UoKTsgfSB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICB1cGRhdGVNYWluTWVudVBhbmVsKCk7XHJcbiAgICAgICAgICAgIHJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmluaXRQcm9ncmVzc01vbml0b3IoKTtcclxuXHJcbiAgICAgICAgICAgIHByb2Nlc3NVcmxQYXJhbXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcHJvY2Vzc1VybFBhcmFtcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB2YXIgcGFzc0NvZGUgPSB1dGlsLmdldFBhcmFtZXRlckJ5TmFtZShcInBhc3NDb2RlXCIpO1xyXG4gICAgICAgICAgICBpZiAocGFzc0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBDaGFuZ2VQYXNzd29yZERsZyhwYXNzQ29kZSkpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVybENtZCA9IHV0aWwuZ2V0UGFyYW1ldGVyQnlOYW1lKFwiY21kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWJDaGFuZ2VFdmVudCA9IGZ1bmN0aW9uKHRhYk5hbWUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRhYk5hbWUgPT0gXCJzZWFyY2hUYWJOYW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIHNyY2guc2VhcmNoVGFiQWN0aXZhdGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGlzcGxheVNpZ251cE1lc3NhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdmFyIHNpZ251cFJlc3BvbnNlID0gJChcIiNzaWdudXBDb2RlUmVzcG9uc2VcIikudGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoc2lnbnVwUmVzcG9uc2UgPT09IFwib2tcIikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiU2lnbnVwIGNvbXBsZXRlLiBZb3UgbWF5IG5vdyBsb2dpbi5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JlZW5TaXplQ2hhbmdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZURhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXIuYWRqdXN0SW1hZ2VTaXplKGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goY3VycmVudE5vZGVEYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuaW1nSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyLmFkanVzdEltYWdlU2l6ZShub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogRG9uJ3QgbmVlZCB0aGlzIG1ldGhvZCB5ZXQsIGFuZCBoYXZlbid0IHRlc3RlZCB0byBzZWUgaWYgd29ya3MgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG9yaWVudGF0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIGlmIChldmVudC5vcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICAvLyBpZiAoZXZlbnQub3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChldmVudC5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGxvYWRBbm9uUGFnZUhvbWUgPSBmdW5jdGlvbihpZ25vcmVVcmwpOiB2b2lkIHtcclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQW5vblBhZ2VMb2FkUmVxdWVzdCwganNvbi5Bbm9uUGFnZUxvYWRSZXNwb25zZT4oXCJhbm9uUGFnZUxvYWRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJpZ25vcmVVcmxcIjogaWdub3JlVXJsXHJcbiAgICAgICAgICAgIH0sIGFub25QYWdlTG9hZFJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2F2ZVVzZXJQcmVmZXJlbmNlcyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVxdWVzdCwganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2U+KFwic2F2ZVVzZXJQcmVmZXJlbmNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAvL3RvZG8tMDogYm90aCBvZiB0aGVzZSBvcHRpb25zIHNob3VsZCBjb21lIGZyb20gbWV0YTY0LnVzZXJQcmVmZXJuY2VzLCBhbmQgbm90IGJlIHN0b3JlZCBkaXJlY3RseSBvbiBtZXRhNjQgc2NvcGUuXHJcbiAgICAgICAgICAgICAgICBcInVzZXJQcmVmZXJlbmNlc1wiOiB1c2VyUHJlZmVyZW5jZXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5TeXN0ZW1GaWxlID0gZnVuY3Rpb24oZmlsZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5PcGVuU3lzdGVtRmlsZVJlcXVlc3QsIGpzb24uT3BlblN5c3RlbUZpbGVSZXNwb25zZT4oXCJvcGVuU3lzdGVtRmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImZpbGVOYW1lXCI6IGZpbGVOYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBlZGl0U3lzdGVtRmlsZSA9IGZ1bmN0aW9uKGZpbGVOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbmV3IEVkaXRTeXN0ZW1GaWxlRGxnKGZpbGVOYW1lKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0b2RvLTA6IGZvciBub3cgSSdsbCBqdXN0IGRyb3AgdGhpcyBpbnRvIGEgZ2xvYmFsIHZhcmlhYmxlLiBJIGtub3cgdGhlcmUncyBhIGJldHRlciB3YXkuIFRoaXMgaXMgdGhlIG9ubHkgdmFyaWFibGVcclxud2UgaGF2ZSBvbiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSwgYW5kIGlzIG9ubHkgcmVxdWlyZWQgZm9yIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uIGluIEpTIG9uIHRoZSBpbmRleC5odG1sIHBhZ2UgKi9cclxuaWYgKCF3aW5kb3dbXCJtZXRhNjRcIl0pIHtcclxuICAgIHZhciBtZXRhNjQgPSBtNjQubWV0YTY0O1xyXG59XHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IG5hdi5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBuYXYge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgX1VJRF9ST1dJRF9TVUZGSVg6IHN0cmluZyA9IFwiX3Jvd1wiO1xyXG5cclxuICAgICAgICAvKiB0b2RvLTA6IGV2ZW50dWFsbHkgd2hlbiB3ZSBkbyBwYWdpbmcgZm9yIG90aGVyIGxpc3RzLCB3ZSB3aWxsIG5lZWQgYSBzZXQgb2YgdGhlc2UgdmFyaWFibGVzIGZvciBlYWNoIGxpc3QgZGlzcGxheSAoaS5lLiBzZWFyY2gsIHRpbWVsaW5lLCBldGMpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWluT2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZW5kUmVhY2hlZDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgICAgIC8qIHRvZG8tMDogbmVlZCB0byBoYXZlIHRoaXMgdmFsdWUgcGFzc2VkIGZyb20gc2VydmVyIHJhdGhlciB0aGFuIGNvZGVkIGluIFR5cGVTY3JpcHQgKi9cclxuICAgICAgICBleHBvcnQgbGV0IFJPV1NfUEVSX1BBR0U6IG51bWJlciA9IDI1O1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5NYWluTWVudUhlbHAgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBcIi9tZXRhNjQvcHVibGljL2hlbHBcIixcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwib2Zmc2V0XCI6IG1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBuYXZQYWdlTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlblJzc0ZlZWRzTm9kZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IFwiL3Jzcy9mZWVkc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJ1cExldmVsXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcInJlbmRlclBhcmVudElmTGVhZlwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbWFpbk9mZnNldCxcclxuICAgICAgICAgICAgICAgIFwiZ29Ub0xhc3RQYWdlXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sIG5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBleHBhbmRNb3JlID0gZnVuY3Rpb24obm9kZUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8qIEknbSBzZXR0aW5nIHRoaXMgaGVyZSBzbyB0aGF0IHdlIGNhbiBjb21lIHVwIHdpdGggYSB3YXkgdG8gbWFrZSB0aGUgYWJicmV2IGV4cGFuZCBzdGF0ZSBiZSByZW1lbWJlcmVkLCBidXR0b25cclxuICAgICAgICAgICAgdGhpcyBpcyBsb3dlciBwcmlvcml0eSBmb3Igbm93LCBzbyBpJ20gbm90IHVzaW5nIGl0IHlldCAqL1xyXG4gICAgICAgICAgICBtZXRhNjQuZXhwYW5kZWRBYmJyZXZOb2RlSWRzW25vZGVJZF0gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwYW5kQWJicmV2aWF0ZWROb2RlUmVxdWVzdCwganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZT4oXCJleHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkXHJcbiAgICAgICAgICAgIH0sIGV4cGFuZEFiYnJldmlhdGVkTm9kZVJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBleHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5FeHBhbmRBYmJyZXZpYXRlZE5vZGVSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJFeHBhbmRBYmJyZXZpYXRlZE5vZGVcIiwgcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIlZBTDogXCIrSlNPTi5zdHJpbmdpZnkocmVzLm5vZGVJbmZvKSk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIucmVmcmVzaE5vZGVPblBhZ2UocmVzLm5vZGVJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBkaXNwbGF5aW5nSG9tZSA9IGZ1bmN0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhNjQuY3VycmVudE5vZGVJZCA9PT0gbWV0YTY0LmFub25Vc2VyTGFuZGluZ1BhZ2VOb2RlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5jdXJyZW50Tm9kZUlkID09PSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwYXJlbnRWaXNpYmxlVG9Vc2VyID0gZnVuY3Rpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhZGlzcGxheWluZ0hvbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgdXBMZXZlbFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFyZXMgfHwgIXJlcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBkYXRhIGlzIHZpc2libGUgdG8geW91IGFib3ZlIHRoaXMgbm9kZS5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlci5yZW5kZXJQYWdlRnJvbURhdGEocmVzKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKGlkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoQWxsR3VpRW5hYmxlbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdlVwTGV2ZWwgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFyZW50VmlzaWJsZVRvVXNlcigpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGF0IHJvb3QuIENhbid0IGdvIHVwLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiB0b2RvLTA6IGZvciBub3cgYW4gdXBsZXZlbCB3aWxsIHJlc2V0IHRvIHplcm8gb2Zmc2V0LCBidXQgZXZlbnR1YWxseSBJIHdhbnQgdG8gaGF2ZSBlYWNoIGxldmVsIG9mIHRoZSB0cmVlLCBiZSBhYmxlIHRvXHJcbiAgICAgICAgICAgIHJlbWVtYmVyIHdoaWNoIG9mZnNldCBpdCB3YXMgYXQgc28gd2hlbiB1c2VyIGRyaWxscyBkb3duLCBhbmQgdGhlbiBjb21lcyBiYWNrIG91dCwgdGhleSBwYWdlIGJhY2sgb3V0IGZyb20gdGhlIHNhbWUgcGFnZXMgdGhleVxyXG4gICAgICAgICAgICBkcmlsbGVkIGRvd24gZnJvbSAqL1xyXG4gICAgICAgICAgICBtYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgdmFyIGlyb25SZXMgPSB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiAxLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiOiBtYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdXBMZXZlbFJlc3BvbnNlKGlyb25SZXMucmVzcG9uc2UsIG1ldGE2NC5jdXJyZW50Tm9kZUlkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZERvbUVsZW1lbnQgPSBmdW5jdGlvbigpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxOb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlbE5vZGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFtjdXJyZW50U2VsTm9kZS51aWRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIG5vdyBtYWtlIENTUyBpZCBmcm9tIG5vZGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUlkOiBzdHJpbmcgPSBub2RlLnVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIitub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5kb21FbG0obm9kZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBET00gZWxlbWVudCBvZiB3aGF0ZXZlciByb3cgaXMgY3VycmVudGx5IHNlbGVjdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRTZWxlY3RlZFBvbHlFbGVtZW50ID0gZnVuY3Rpb24oKTogYW55IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2VsTm9kZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgbm9kZSBieSBub2RlIGlkZW50aWZpZXIgKi9cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbY3VycmVudFNlbE5vZGUudWlkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmb3VuZCBoaWdobGlnaHRlZCBub2RlLmlkPVwiICsgbm9kZS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBub3cgbWFrZSBDU1MgaWQgZnJvbSBub2RlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlSWQ6IHN0cmluZyA9IG5vZGUudWlkICsgX1VJRF9ST1dJRF9TVUZGSVg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9va2luZyB1cCB1c2luZyBlbGVtZW50IGlkOiBcIiArIG5vZGVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbC5wb2x5RWxtKG5vZGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIG5vZGUgaGlnaGxpZ2h0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwubG9nQW5kVGhyb3coXCJnZXRTZWxlY3RlZFBvbHlFbGVtZW50IGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsaWNrT25Ob2RlUm93ID0gZnVuY3Rpb24ocm93RWxtLCB1aWQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tPbk5vZGVSb3cgcmVjaWV2ZWQgdWlkIHRoYXQgZG9lc24ndCBtYXAgdG8gYW55IG5vZGUuIHVpZD1cIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHNldHMgd2hpY2ggbm9kZSBpcyBzZWxlY3RlZCBvbiB0aGlzIHBhZ2UgKGkuZS4gcGFyZW50IG5vZGUgb2YgdGhpcyBwYWdlIGJlaW5nIHRoZSAna2V5JylcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHROb2RlKG5vZGUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogaWYgbm9kZS5vd25lciBpcyBjdXJyZW50bHkgbnVsbCwgdGhhdCBtZWFucyB3ZSBoYXZlIG5vdCByZXRyaWV2ZWQgdGhlIG93bmVyIGZyb20gdGhlIHNlcnZlciB5ZXQsIGJ1dFxyXG4gICAgICAgICAgICAgICAgICogaWYgbm9uLW51bGwgaXQncyBhbHJlYWR5IGRpc3BsYXlpbmcgYW5kIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZS5vd25lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbGluZyB1cGRhdGVOb2RlSW5mb1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQudXBkYXRlTm9kZUluZm8obm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5Ob2RlID0gZnVuY3Rpb24odWlkKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcclxuICAgICAgICAgICAgbWV0YTY0LmhpZ2hsaWdodE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVua25vd24gbm9kZUlkIGluIG9wZW5Ob2RlOiBcIiArIHVpZCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUobm9kZS5pZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHVuZm9ydHVuYXRlbHkgd2UgaGF2ZSB0byByZWx5IG9uIG9uQ2xpY2ssIGJlY2F1c2Ugb2YgdGhlIGZhY3QgdGhhdCBldmVudHMgdG8gY2hlY2tib3hlcyBkb24ndCBhcHBlYXIgdG8gd29ya1xyXG4gICAgICAgICAqIGluIFBvbG1lciBhdCBhbGwsIGFuZCBzaW5jZSBvbkNsaWNrIHJ1bnMgQkVGT1JFIHRoZSBzdGF0ZSBjaGFuZ2UgaXMgY29tcGxldGVkLCB0aGF0IGlzIHRoZSByZWFzb24gZm9yIHRoZVxyXG4gICAgICAgICAqIHNpbGx5IGxvb2tpbmcgYXN5bmMgdGltZXIgaGVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHRvZ2dsZU5vZGVTZWwgPSBmdW5jdGlvbih1aWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IHRvZ2dsZUJ1dHRvbjogYW55ID0gdXRpbC5wb2x5RWxtKHVpZCArIFwiX3NlbFwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVCdXR0b24ubm9kZS5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXNbdWlkXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRhNjQuc2VsZWN0ZWROb2Rlc1t1aWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpZXcudXBkYXRlU3RhdHVzQmFyKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2UGFnZU5vZGVSZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNsZWFyU2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICByZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKHJlcyk7XHJcbiAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICAgICAgbWV0YTY0LnJlZnJlc2hBbGxHdWlFbmFibGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5hdkhvbWUgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG1ldGE2NC5ob21lTm9kZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbWFpbk9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSwgbmF2UGFnZU5vZGVSZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbmF2UHVibGljSG9tZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcHJlZnMuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgcHJlZnMge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNsb3NlQWNjb3VudFJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkNsb3NlQWNjb3VudFJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8qIFJlbW92ZSB3YXJuaW5nIGRpYWxvZyB0byBhc2sgdXNlciBhYm91dCBsZWF2aW5nIHRoZSBwYWdlICovXHJcbiAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJiZWZvcmV1bmxvYWRcIik7XHJcblxyXG4gICAgICAgICAgICAvKiByZWxvYWRzIGJyb3dzZXIgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVycyBzdHJpcHBlZCBvZmYgdGhlIHBhdGggKi9cclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjbG9zZUFjY291bnQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiT2ggTm8hXCIsIFwiQ2xvc2UgeW91ciBBY2NvdW50PzxwPiBBcmUgeW91IHN1cmU/XCIsIFwiWWVzLCBDbG9zZSBBY2NvdW50LlwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIChuZXcgQ29uZmlybURsZyhcIk9uZSBtb3JlIENsaWNrXCIsIFwiWW91ciBkYXRhIHdpbGwgYmUgZGVsZXRlZCBhbmQgY2FuIG5ldmVyIGJlIHJlY292ZXJlZC48cD4gQXJlIHlvdSBzdXJlP1wiLCBcIlllcywgQ2xvc2UgQWNjb3VudC5cIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kZWxldGVBbGxVc2VyQ29va2llcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNsb3NlQWNjb3VudFJlcXVlc3QsIGpzb24uQ2xvc2VBY2NvdW50UmVzcG9uc2U+KFwiY2xvc2VBY2NvdW50XCIsIHt9LCBjbG9zZUFjY291bnRSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBwcm9wcy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBwcm9wcyB7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JkZXJQcm9wcyA9IGZ1bmN0aW9uKHByb3BPcmRlcjogc3RyaW5nW10sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wc05ldzoganNvbi5Qcm9wZXJ0eUluZm9bXSA9IHV0aWwuYXJyYXlDbG9uZShwcm9wcyk7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXRJZHg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BPcmRlcikge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SWR4ID0gbW92ZU5vZGVQb3NpdGlvbihwcm9wc05ldywgdGFyZ2V0SWR4LCBwcm9wKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BzTmV3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1vdmVOb2RlUG9zaXRpb24gPSBmdW5jdGlvbihwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSwgaWR4OiBudW1iZXIsIHR5cGVOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgdGFnSWR4OiBudW1iZXIgPSB1dGlsLmFycmF5SW5kZXhPZkl0ZW1CeVByb3AocHJvcHMsIFwibmFtZVwiLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCBpZHgrKyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVG9nZ2xlcyBkaXNwbGF5IG9mIHByb3BlcnRpZXMgaW4gdGhlIGd1aS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHByb3BzVG9nZ2xlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93UHJvcGVydGllcyA9IG1ldGE2NC5zaG93UHJvcGVydGllcyA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc2V0RGF0YUljb25Vc2luZ0lkKFwiI2VkaXRNb2RlQnV0dG9uXCIsIGVkaXRNb2RlID8gXCJlZGl0XCIgOlxyXG4gICAgICAgICAgICAvLyBcImZvcmJpZGRlblwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpeCBmb3IgcG9seW1lclxyXG4gICAgICAgICAgICAvLyB2YXIgZWxtID0gJChcIiNwcm9wc1RvZ2dsZUJ1dHRvblwiKTtcclxuICAgICAgICAgICAgLy8gZWxtLnRvZ2dsZUNsYXNzKFwidWktaWNvbi1ncmlkXCIsIG1ldGE2NC5zaG93UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIC8vIGVsbS50b2dnbGVDbGFzcyhcInVpLWljb24tZm9yYmlkZGVuXCIsICFtZXRhNjQuc2hvd1Byb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YSgpO1xyXG4gICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlUHJvcGVydHlGcm9tTG9jYWxEYXRhID0gZnVuY3Rpb24ocHJvcGVydHlOYW1lKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpcyBob3cgeW91IGRlbGV0ZSBhcnJheSBlbGVtZW50cyBpbiBqcy5cclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFNvcnRzIHByb3BzIGlucHV0IGFycmF5IGludG8gdGhlIHByb3BlciBvcmRlciB0byBzaG93IGZvciBlZGl0aW5nLiBTaW1wbGUgYWxnb3JpdGhtIGZpcnN0IGdyYWJzICdqY3I6Y29udGVudCdcclxuICAgICAgICAgKiBub2RlIGFuZCBwdXRzIGl0IG9uIHRoZSB0b3AsIGFuZCB0aGVuIGRvZXMgc2FtZSBmb3IgJ2pjdENuc3QuVEFHUydcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGdldFByb3BlcnRpZXNJbkVkaXRpbmdPcmRlciA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BzOiBqc29uLlByb3BlcnR5SW5mb1tdKToganNvbi5Qcm9wZXJ0eUluZm9bXSB7XHJcbiAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IG1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbbm9kZS5wcmltYXJ5VHlwZU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMobm9kZSwgcHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvcHNOZXc6IGpzb24uUHJvcGVydHlJbmZvW10gPSB1dGlsLmFycmF5Q2xvbmUocHJvcHMpO1xyXG4gICAgICAgICAgICBtb3ZlUHJvcHNUb1RvcChbamNyQ25zdC5DT05URU5ULCBqY3JDbnN0LlRBR1NdLCBwcm9wc05ldyk7XHJcbiAgICAgICAgICAgIG1vdmVQcm9wc1RvRW5kKFtqY3JDbnN0LkNSRUFURUQsIGpjckNuc3QuQ1JFQVRFRF9CWSwgamNyQ25zdC5MQVNUX01PRElGSUVELCBqY3JDbnN0LkxBU1RfTU9ESUZJRURfQlldLCBwcm9wc05ldyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcHNOZXc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBNb3ZlcyBhbGwgdGhlIHByb3BlcnRpZXMgbGlzdGVkIGluIHByb3BMaXN0IGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQga2VlcHMgdGhlbSBpbiB0aGUgb3JkZXIgc3BlY2lmaWVkICovXHJcbiAgICAgICAgbGV0IG1vdmVQcm9wc1RvVG9wID0gZnVuY3Rpb24ocHJvcHNMaXN0OiBzdHJpbmdbXSwgcHJvcHM6IGpzb24uUHJvcGVydHlJbmZvW10pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBwcm9wc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdJZHggPSB1dGlsLmFycmF5SW5kZXhPZkl0ZW1CeVByb3AocHJvcHMsIFwibmFtZVwiLCBwcm9wKTtcclxuICAgICAgICAgICAgICAgIGlmICh0YWdJZHggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlsLmFycmF5TW92ZUl0ZW0ocHJvcHMsIHRhZ0lkeCwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIE1vdmVzIGFsbCB0aGUgcHJvcGVydGllcyBsaXN0ZWQgaW4gcHJvcExpc3QgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCBrZWVwcyB0aGVtIGluIHRoZSBvcmRlciBzcGVjaWZpZWQgKi9cclxuICAgICAgICBsZXQgbW92ZVByb3BzVG9FbmQgPSBmdW5jdGlvbihwcm9wc0xpc3Q6IHN0cmluZ1tdLCBwcm9wczoganNvbi5Qcm9wZXJ0eUluZm9bXSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIG9mIHByb3BzTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZ0lkeCA9IHV0aWwuYXJyYXlJbmRleE9mSXRlbUJ5UHJvcChwcm9wcywgXCJuYW1lXCIsIHByb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhZ0lkeCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYXJyYXlNb3ZlSXRlbShwcm9wcywgdGFnSWR4LCBwcm9wcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHByb3BlcnRpZXMgd2lsbCBiZSBudWxsIG9yIGEgbGlzdCBvZiBQcm9wZXJ0eUluZm8gb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihwcm9wZXJ0aWVzKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWJsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHByb3BlcnRpZXMsIGZ1bmN0aW9uKGksIHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlci5hbGxvd1Byb3BlcnR5VG9EaXNwbGF5KHByb3BlcnR5Lm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0JpbmFyeVByb3AgPSByZW5kZXIuaXNCaW5hcnlQcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGQ6IHN0cmluZyA9IHJlbmRlci50YWcoXCJ0ZFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJvcC10YWJsZS1uYW1lLWNvbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlbmRlci5zYW5pdGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eS5uYW1lKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JpbmFyeVByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IFwiW2JpbmFyeV1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSByZW5kZXIud3JhcEh0bWwocHJvcGVydHkudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcHJvcHMucmVuZGVyUHJvcGVydHlWYWx1ZXMocHJvcGVydHkudmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGQgKz0gcmVuZGVyLnRhZyhcInRkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXZhbC1jb2xcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGUgKz0gcmVuZGVyLnRhZyhcInRyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwcm9wLXRhYmxlLXJvd1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIaWRpbmcgcHJvcGVydHk6IFwiICsgcHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJ0YWJsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJib3JkZXJcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByb3BlcnR5LXRhYmxlXCJcclxuICAgICAgICAgICAgICAgIH0sIHRhYmxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogYnJ1dGUgZm9yY2Ugc2VhcmNoZXMgb24gbm9kZSAoTm9kZUluZm8uamF2YSkgb2JqZWN0IHByb3BlcnRpZXMgbGlzdCwgYW5kIHJldHVybnMgdGhlIGZpcnN0IHByb3BlcnR5XHJcbiAgICAgICAgICogKFByb3BlcnR5SW5mby5qYXZhKSB3aXRoIG5hbWUgbWF0Y2hpbmcgcHJvcGVydHlOYW1lLCBlbHNlIG51bGwuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXROb2RlUHJvcGVydHkgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIG5vZGUpOiBqc29uLlByb3BlcnR5SW5mbyB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZSB8fCAhbm9kZS5wcm9wZXJ0aWVzKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3A6IGpzb24uUHJvcGVydHlJbmZvID0gbm9kZS5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3AubmFtZSA9PT0gcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVQcm9wZXJ0eVZhbCA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgbm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IGdldE5vZGVQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIG5vZGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcCA/IHByb3AudmFsdWUgOiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydXMgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb25Pd25lZE5vZGUgPSBmdW5jdGlvbihub2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IGdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3Qga25vdyB3aG8gb3ducyB0aGlzIG5vZGUgYXNzdW1lIHRoZSBhZG1pbiBvd25zIGl0LlxyXG4gICAgICAgICAgICBpZiAoIWNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZEJ5ID0gXCJhZG1pblwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBUaGlzIGlzIE9SIGNvbmRpdGlvbiBiZWNhdXNlIG9mIGNyZWF0ZWRCeSBpcyBudWxsIHdlIGFzc3VtZSB3ZSBkbyBub3Qgb3duIGl0ICovXHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBpcyBhIGNvbW1lbnQgbm9kZSwgdGhhdCB0aGUgY3VycmVudCB1c2VyIGRvZXNuJ3Qgb3duLiBVc2VkIHRvIGRpc2FibGUgXCJlZGl0XCIsIFwiZGVsZXRlXCIsXHJcbiAgICAgICAgICogZXRjLiBvbiB0aGUgR1VJLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNOb25Pd25lZENvbW1lbnROb2RlID0gZnVuY3Rpb24obm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBnZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRCeSAhPSBudWxsICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGlzT3duZWRDb21tZW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21tZW50QnkgIT0gbnVsbCAmJiBjb21tZW50QnkgPT0gbWV0YTY0LnVzZXJOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBwcm9wZXJ0eSB2YWx1ZSwgZXZlbiBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZW5kZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLyogSWYgdGhpcyBpcyBhIHNpbmdsZS12YWx1ZSB0eXBlIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkudmFsdWVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogaWYgcHJvcGVydHkgaXMgbWlzc2luZyByZXR1cm4gZW1wdHkgc3RyaW5nICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5LnZhbHVlIHx8IHByb3BlcnR5LnZhbHVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIGVsc2UgcmVuZGVyIG11bHRpLXZhbHVlIHByb3BlcnR5ICovXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlclByb3BlcnR5VmFsdWVzKHByb3BlcnR5LnZhbHVlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbih2YWx1ZXMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgJC5lYWNoKHZhbHVlcywgZnVuY3Rpb24oaSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gY25zdC5CUjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIud3JhcEh0bWwodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiByZW5kZXIuanNcIik7XHJcblxyXG5kZWNsYXJlIHZhciBwb3N0VGFyZ2V0VXJsO1xyXG5kZWNsYXJlIHZhciBwcmV0dHlQcmludDtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSByZW5kZXIge1xyXG4gICAgICAgIGxldCBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIGNvbnRlbnQgZGlzcGxheWVkIHdoZW4gdGhlIHVzZXIgc2lnbnMgaW4sIGFuZCB3ZSBzZWUgdGhhdCB0aGV5IGhhdmUgbm8gY29udGVudCBiZWluZyBkaXNwbGF5ZWQuIFdlXHJcbiAgICAgICAgICogd2FudCB0byBnaXZlIHRoZW0gc29tZSBpbnN0cnVjdGlvbnMgYW5kIHRoZSBhYmlsaXR5IHRvIGFkZCBjb250ZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBnZXRFbXB0eVBhZ2VQcm9tcHQgPSBmdW5jdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8cD5UaGVyZSBhcmUgbm8gc3Vibm9kZXMgdW5kZXIgdGhpcyBub2RlLiA8YnI+PGJyPkNsaWNrICdFRElUIE1PREUnIGFuZCB0aGVuIHVzZSB0aGUgJ0FERCcgYnV0dG9uIHRvIGNyZWF0ZSBjb250ZW50LjwvcD5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZW5kZXJCaW5hcnkgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhbiBpbWFnZSByZW5kZXIgdGhlIGltYWdlIGRpcmVjdGx5IG9udG8gdGhlIHBhZ2UgYXMgYSB2aXNpYmxlIGltYWdlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAobm9kZS5iaW5hcnlJc0ltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUltYWdlVGFnKG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIG5vdCBhbiBpbWFnZSB3ZSByZW5kZXIgYSBsaW5rIHRvIHRoZSBhdHRhY2htZW50LCBzbyB0aGF0IGl0IGNhbiBiZSBkb3dubG9hZGVkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW5jaG9yOiBzdHJpbmcgPSB0YWcoXCJhXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIjogZ2V0VXJsRm9yTm9kZUF0dGFjaG1lbnQobm9kZSlcclxuICAgICAgICAgICAgICAgIH0sIFwiW0Rvd25sb2FkIEF0dGFjaG1lbnRdXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJiaW5hcnktbGlua1wiXHJcbiAgICAgICAgICAgICAgICB9LCBhbmNob3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEltcG9ydGFudCBsaXR0bGUgbWV0aG9kIGhlcmUuIEFsbCBHVUkgcGFnZS9kaXZzIGFyZSBjcmVhdGVkIHVzaW5nIHRoaXMgc29ydCBvZiBzcGVjaWZpY2F0aW9uIGhlcmUgdGhhdCB0aGV5XHJcbiAgICAgICAgICogYWxsIG11c3QgaGF2ZSBhICdidWlsZCcgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZpcnN0IHRpbWUgb25seSwgYW5kIHRoZW4gdGhlICdpbml0JyBtZXRob2QgY2FsbGVkIGJlZm9yZSBlYWNoXHJcbiAgICAgICAgICogdGltZSB0aGUgY29tcG9uZW50IGdldHMgZGlzcGxheWVkIHdpdGggbmV3IGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogSWYgJ2RhdGEnIGlzIHByb3ZpZGVkLCB0aGlzIGlzIHRoZSBpbnN0YW5jZSBkYXRhIGZvciB0aGUgZGlhbG9nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBidWlkUGFnZSA9IGZ1bmN0aW9uKHBnLCBkYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVpbGRQYWdlOiBwZy5kb21JZD1cIiArIHBnLmRvbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGcuYnVpbHQgfHwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcGcuYnVpbGQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwZy5idWlsdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwZy5pbml0KSB7XHJcbiAgICAgICAgICAgICAgICBwZy5pbml0KGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1aWxkUm93SGVhZGVyID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGg6IGJvb2xlYW4sIHNob3dOYW1lOiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGVhZGVyVGV4dDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9PTl9ST1dTKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdiBjbGFzcz0ncGF0aC1kaXNwbGF5Jz5QYXRoOiBcIiArIGZvcm1hdFBhdGgobm9kZSkgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPGRpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGF6ejogc3RyaW5nID0gKGNvbW1lbnRCeSA9PT0gbWV0YTY0LnVzZXJOYW1lKSA/IFwiY3JlYXRlZC1ieS1tZVwiIDogXCJjcmVhdGVkLWJ5LW90aGVyXCI7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IFwiPHNwYW4gY2xhc3M9J1wiICsgY2xhenogKyBcIic+Q29tbWVudCBCeTogXCIgKyBjb21tZW50QnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfSAvL1xyXG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLmNyZWF0ZWRCeSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYXp6OiBzdHJpbmcgPSAobm9kZS5jcmVhdGVkQnkgPT09IG1ldGE2NC51c2VyTmFtZSkgPyBcImNyZWF0ZWQtYnktbWVcIiA6IFwiY3JlYXRlZC1ieS1vdGhlclwiO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBcIjxzcGFuIGNsYXNzPSdcIiArIGNsYXp6ICsgXCInPkNyZWF0ZWQgQnk6IFwiICsgbm9kZS5jcmVhdGVkQnkgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBgPHNwYW4gaWQ9J293bmVyRGlzcGxheSR7bm9kZS51aWR9Jz48L3NwYW4+YDtcclxuICAgICAgICAgICAgaWYgKG5vZGUubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0ICs9IGAgIE1vZDogJHtub2RlLmxhc3RNb2RpZmllZH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhlYWRlclRleHQgKz0gXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIG9uIHJvb3Qgbm9kZSBuYW1lIHdpbGwgYmUgZW1wdHkgc3RyaW5nIHNvIGRvbid0IHNob3cgdGhhdFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBjb21tZW50aW5nOiBJIGRlY2lkZWQgdXNlcnMgd2lsbCB1bmRlcnN0YW5kIHRoZSBwYXRoIGFzIGEgc2luZ2xlIGxvbmcgZW50aXR5IHdpdGggbGVzcyBjb25mdXNpb24gdGhhblxyXG4gICAgICAgICAgICAgKiBicmVha2luZyBvdXQgdGhlIG5hbWUgZm9yIHRoZW0uIFRoZXkgYWxyZWFkeSB1bnNlcnN0YW5kIGludGVybmV0IFVSTHMuIFRoaXMgaXMgdGhlIHNhbWUgY29uY2VwdC4gTm8gbmVlZFxyXG4gICAgICAgICAgICAgKiB0byBiYWJ5IHRoZW0uXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIFRoZSAhc2hvd1BhdGggY29uZGl0aW9uIGhlcmUgaXMgYmVjYXVzZSBpZiB3ZSBhcmUgc2hvd2luZyB0aGUgcGF0aCB0aGVuIHRoZSBlbmQgb2YgdGhhdCBpcyBhbHdheXMgdGhlXHJcbiAgICAgICAgICAgICAqIG5hbWUsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2hvdyB0aGUgcGF0aCBBTkQgdGhlIG5hbWUuIE9uZSBpcyBhIHN1YnN0cmluZyBvZiB0aGUgb3RoZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAoc2hvd05hbWUgJiYgIXNob3dQYXRoICYmIG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dCArPSBgTmFtZTogJHtub2RlLm5hbWV9IFt1aWQ9JHtub2RlLnVpZH1dYDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyVGV4dCA9IHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaGVhZGVyLXRleHRcIlxyXG4gICAgICAgICAgICB9LCBoZWFkZXJUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXJUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBQZWdkb3duIG1hcmtkb3duIHByb2Nlc3NvciB3aWxsIGNyZWF0ZSA8Y29kZT4gYmxvY2tzIGFuZCB0aGUgY2xhc3MgaWYgcHJvdmlkZWQsIHNvIGluIG9yZGVyIHRvIGdldCBnb29nbGVcclxuICAgICAgICAgKiBwcmV0dGlmaWVyIHRvIHByb2Nlc3MgaXQgdGhlIHJlc3Qgb2YgdGhlIHdheSAod2hlbiB3ZSBjYWxsIHByZXR0eVByaW50KCkgZm9yIHRoZSB3aG9sZSBwYWdlKSB3ZSBub3cgcnVuXHJcbiAgICAgICAgICogYW5vdGhlciBzdGFnZSBvZiB0cmFuc2Zvcm1hdGlvbiB0byBnZXQgdGhlIDxwcmU+IHRhZyBwdXQgaW4gd2l0aCAncHJldHR5cHJpbnQnIGV0Yy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IGluamVjdENvZGVGb3JtYXR0aW5nID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFjb250ZW50KSByZXR1cm4gY29udGVudDtcclxuICAgICAgICAgICAgLy8gZXhhbXBsZSBtYXJrZG93bjpcclxuICAgICAgICAgICAgLy8gYGBganNcclxuICAgICAgICAgICAgLy8gdmFyIHggPSAxMDtcclxuICAgICAgICAgICAgLy8gdmFyIHkgPSBcInRlc3RcIjtcclxuICAgICAgICAgICAgLy8gYGBgXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKGNvbnRlbnQsIFwiPGNvZGVcIikpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5jb2RlRm9ybWF0RGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IGVuY29kZUxhbmd1YWdlcyhjb250ZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCI8L2NvZGU+XCIsIFwiPC9wcmU+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5qZWN0U3Vic3RpdHV0aW9ucyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCJ7e2xvY2F0aW9uT3JpZ2lufX1cIiwgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGVuY29kZUxhbmd1YWdlcyA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRvZG8tMTogbmVlZCB0byBwcm92aWRlIHNvbWUgd2F5IG9mIGhhdmluZyB0aGVzZSBsYW5ndWFnZSB0eXBlcyBjb25maWd1cmFibGUgaW4gYSBwcm9wZXJ0aWVzIGZpbGVcclxuICAgICAgICAgICAgICogc29tZXdoZXJlLCBhbmQgZmlsbCBvdXQgYSBsb3QgbW9yZSBmaWxlIHR5cGVzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGxhbmdzID0gW1wianNcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwiY3NzXCJdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhbmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50ID0gdXRpbC5yZXBsYWNlQWxsKGNvbnRlbnQsIFwiPGNvZGUgY2xhc3M9XFxcIlwiICsgbGFuZ3NbaV0gKyBcIlxcXCI+XCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8P3ByZXR0aWZ5IGxhbmc9XCIgKyBsYW5nc1tpXSArIFwiPz48cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSB1dGlsLnJlcGxhY2VBbGwoY29udGVudCwgXCI8Y29kZT5cIiwgXCI8cHJlIGNsYXNzPSdwcmV0dHlwcmludCc+XCIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBhZnRlciBhIHByb3BlcnR5LCBvciBub2RlIGlzIHVwZGF0ZWQgKHNhdmVkKSB3ZSBjYW4gbm93IGNhbGwgdGhpcyBtZXRob2QgaW5zdGVhZCBvZiByZWZyZXNoaW5nIHRoZSBlbnRpcmUgcGFnZVxyXG4gICAgICAgIHdoaWNoIGlzIHdoYXQncyBkb25lIGluIG1vc3Qgb2YgdGhlIGFwcCwgd2hpY2ggaXMgbXVjaCBsZXNzIGVmZmljaWVudCBhbmQgc25hcHB5IHZpc3VhbGx5ICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoTm9kZU9uUGFnZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy9uZWVkIHRvIGxvb2t1cCB1aWQgZnJvbSBOb2RlSW5mby5pZCB0aGVuIHNldCB0aGUgY29udGVudCBvZiB0aGlzIGRpdi5cclxuICAgICAgICAgICAgLy9cImlkXCI6IHVpZCArIFwiX2NvbnRlbnRcIlxyXG4gICAgICAgICAgICAvL3RvIHRoZSB2YWx1ZSBmcm9tIHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpKSk7XHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG1ldGE2NC5pZGVudFRvVWlkTWFwW25vZGUuaWRdO1xyXG4gICAgICAgICAgICBpZiAoIXVpZCkgdGhyb3cgYFVuYWJsZSB0byBmaW5kIG5vZGVJZCAke25vZGUuaWR9IGluIHVpZCBtYXBgO1xyXG4gICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAodWlkICE9IG5vZGUudWlkKSB0aHJvdyBcInVpZCBjaGFuZ2VkIHVuZXhwZWN0bHkgYWZ0ZXIgaW5pdE5vZGVcIjtcclxuICAgICAgICAgICAgbGV0IHJvd0NvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KG5vZGUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdWlkICsgXCJfY29udGVudFwiKS5odG1sKHJvd0NvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJlbmRlcnMgZWFjaCBub2RlIGluIHRoZSBtYWluIHdpbmRvdy4gVGhlIHJlbmRlcmluZyBpbiBoZXJlIGlzIHZlcnkgY2VudHJhbCB0byB0aGVcclxuICAgICAgICAgKiBhcHAgYW5kIGlzIHdoYXQgdGhlIHVzZXIgc2VlcyBjb3ZlcmluZyA5MCUgb2YgdGhlIHNjcmVlbiBtb3N0IG9mIHRoZSB0aW1lLiBUaGUgXCJjb250ZW50KiBub2Rlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIHRvZG8tMDogUmF0aGVyIHRoYW4gaGF2aW5nIHRoaXMgbm9kZSByZW5kZXJlciBpdHNlbGYgYmUgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyBhbGwgdGhlIGRpZmZlcmVudCB0eXBlc1xyXG4gICAgICAgICAqIG9mIG5vZGVzLCBuZWVkIGEgbW9yZSBwbHVnZ2FibGUgZGVzaWduLCB3aGVyZSByZW5kZWluZyBvZiBkaWZmZXJlbnQgdGhpbmdzIGlzIGRlbGV0YWdlZCB0byBzb21lXHJcbiAgICAgICAgICogYXBwcm9wcmlhdGUgb2JqZWN0L3NlcnZpY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlck5vZGVDb250ZW50ID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgc2hvd1BhdGgsIHNob3dOYW1lLCByZW5kZXJCaW4sIHJvd1N0eWxpbmcsIHNob3dIZWFkZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmV0OiBzdHJpbmcgPSBnZXRUb3BSaWdodEltYWdlVGFnKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0yOiBlbmFibGUgaGVhZGVyVGV4dCB3aGVuIGFwcHJvcHJpYXRlIGhlcmUgKi9cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5zaG93TWV0YURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBzaG93SGVhZGVyID8gYnVpbGRSb3dIZWFkZXIobm9kZSwgc2hvd1BhdGgsIHNob3dOYW1lKSA6IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuc2hvd1Byb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcHMucmVuZGVyUHJvcGVydGllcyhub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVuZGVyQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU3BlY2lhbCBSZW5kZXJpbmcgZm9yIE5vZGVzIHRoYXQgaGF2ZSBhIHBsdWdpbi1yZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gbWV0YTY0LnJlbmRlckZ1bmN0aW9uc0J5SmNyVHlwZVtub2RlLnByaW1hcnlUeXBlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gZnVuYyhub2RlLCByb3dTdHlsaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShqY3JDbnN0LkNPTlRFTlQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY29udGVudFByb3A6IFwiICsgY29udGVudFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50UHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgamNyQ29udGVudCA9IHByb3BzLnJlbmRlclByb3BlcnR5KGNvbnRlbnRQcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKiogamNyQ29udGVudCBmb3IgTUFSS0RPV046XFxuXCIramNyQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWFya2VkQ29udGVudCA9IFwiPG1hcmtlZC1lbGVtZW50IHNhbml0aXplPSd0cnVlJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21hcmtkb3duLWh0bWwnPjwvZGl2PlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNjcmlwdCB0eXBlPSd0ZXh0L21hcmtkb3duJz5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50ICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zY3JpcHQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8L21hcmtlZC1lbGVtZW50PlwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9XaGVuIGRvaW5nIHNlcnZlci1zaWRlIG1hcmtkb3duIHdlIGhhZCB0aGlzIHByb2Nlc3NpbmcgdGhlIEhUTUwgdGhhdCB3YXMgZ2VuZXJhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYnV0IEkgaGF2ZW4ndCBsb29rZWQgaW50byBob3cgdG8gZ2V0IHRoaXMgYmFjayBub3cgdGhhdCB3ZSBhcmUgZG9pbmcgbWFya2Rvd24gb24gY2xpZW50LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2pjckNvbnRlbnQgPSBpbmplY3RDb2RlRm9ybWF0dGluZyhqY3JDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9qY3JDb250ZW50ID0gaW5qZWN0U3Vic3RpdHV0aW9ucyhqY3JDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbWFya2VkQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBtYXJrZWRDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlbmRlckNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUucGF0aC50cmltKCkgPT0gXCIvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9IFwiUm9vdCBOb2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldCArPSBcIjxkaXY+W05vIENvbnRlbnQgUHJvcGVydHldPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BlcnRpZXM6IHN0cmluZyA9IHByb3BzLnJlbmRlclByb3BlcnRpZXMobm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gLyogXCI8YnI+XCIgKyAqL3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVuZGVyQmluICYmIG5vZGUuaGFzQmluYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmluYXJ5OiBzdHJpbmcgPSByZW5kZXJCaW5hcnkobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIFdlIGFwcGVuZCB0aGUgYmluYXJ5IGltYWdlIG9yIHJlc291cmNlIGxpbmsgZWl0aGVyIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgb3IgYXQgdGhlIGxvY2F0aW9uIHdoZXJlXHJcbiAgICAgICAgICAgICAgICAgKiB0aGUgdXNlciBoYXMgcHV0IHt7aW5zZXJ0LWF0dGFjaG1lbnR9fSBpZiB0aGV5IGFyZSB1c2luZyB0aGF0IHRvIG1ha2UgdGhlIGltYWdlIGFwcGVhciBpbiBhIHNwZWNpZmljXHJcbiAgICAgICAgICAgICAgICAgKiBsb2NhdGlvIGluIHRoZSBjb250ZW50IHRleHQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKHJldCwgY25zdC5JTlNFUlRfQVRUQUNITUVOVCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSB1dGlsLnJlcGxhY2VBbGwocmV0LCBjbnN0LklOU0VSVF9BVFRBQ0hNRU5ULCBiaW5hcnkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgKz0gYmluYXJ5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFnczogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuVEFHUywgbm9kZSk7XHJcbiAgICAgICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidGFncy1jb250ZW50XCJcclxuICAgICAgICAgICAgICAgIH0sIFwiVGFnczogXCIgKyB0YWdzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKGpzb25Db250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbjogXCIgKyBqc29uQ29udGVudCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdDogYW55W10gPSBKU09OLnBhcnNlKGpzb25Db250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3lzdGVtRmlsZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogYG02NC5tZXRhNjQuZWRpdFN5c3RlbUZpbGUoJyR7ZW50cnkuZmlsZU5hbWV9JylgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZW50cnkuZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBvcGVuU3lzdGVtRmlsZSB3b3JrZWQgb24gbGludXgsIGJ1dCBpJ20gc3dpdGNoaW5nIHRvIGZ1bGwgdGV4dCBmaWxlIGVkaXQgY2FwYWJpbGl0eSBvbmx5IGFuZCBkb2luZyB0aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlIG1ldGE2NCBmcm9tIG5vdyBvbiwgc28gb3BlblN5c3RlbUZpbGUgaXMgbm8gbG9uZ2VyIGJlaW5nIHVzZWQgKi9cclxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgbG9jYWxPcGVuTGluayA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFwib25jbGlja1wiOiBcIm02NC5tZXRhNjQub3BlblN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgICAgICAvLyB9LCBcIkxvY2FsIE9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgZG93bmxvYWRMaW5rID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAvL2hhdmVuJ3QgaW1wbGVtZW50ZWQgZG93bmxvYWQgY2FwYWJpbGl0eSB5ZXQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXCJvbmNsaWNrXCI6IFwibTY0Lm1ldGE2NC5kb3dubG9hZFN5c3RlbUZpbGUoJ1wiICsgZW50cnkuZmlsZU5hbWUgKyBcIicpXCJcclxuICAgICAgICAgICAgICAgICAgICAvLyB9LCBcIkRvd25sb2FkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IGxpbmtzRGl2ID0gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9LCBsb2NhbE9wZW5MaW5rICsgZG93bmxvYWRMaW5rKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGVudCArPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sIGZpbGVOYW1lRGl2KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5sb2dBbmRSZVRocm93KFwicmVuZGVyIGZhaWxlZFwiLCBlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIltyZW5kZXIgZmFpbGVkXVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoaXMgaXMgdGhlIHByaW1hcnkgbWV0aG9kIGZvciByZW5kZXJpbmcgZWFjaCBub2RlIChsaWtlIGEgcm93KSBvbiB0aGUgbWFpbiBIVE1MIHBhZ2UgdGhhdCBkaXNwbGF5cyBub2RlXHJcbiAgICAgICAgICogY29udGVudC4gVGhpcyBnZW5lcmF0ZXMgdGhlIEhUTUwgZm9yIGEgc2luZ2xlIHJvdy9ub2RlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogbm9kZSBpcyBhIE5vZGVJbmZvLmphdmEgSlNPTlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZUFzTGlzdEl0ZW0gPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCBpbmRleDogbnVtYmVyLCBjb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB1aWQ6IHN0cmluZyA9IG5vZGUudWlkO1xyXG4gICAgICAgICAgICBsZXQgcHJldlBhZ2VFeGlzdHM6IGJvb2xlYW4gPSBuYXYubWFpbk9mZnNldCA+IDA7XHJcbiAgICAgICAgICAgIGxldCBuZXh0UGFnZUV4aXN0czogYm9vbGVhbiA9ICFuYXYuZW5kUmVhY2hlZDtcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVVcDogYm9vbGVhbiA9IChpbmRleCA+IDAgJiYgcm93Q291bnQgPiAxKSB8fCBwcmV2UGFnZUV4aXN0cztcclxuICAgICAgICAgICAgbGV0IGNhbk1vdmVEb3duOiBib29sZWFuID0gKGluZGV4IDwgY291bnQgLSAxKSB8fCBuZXh0UGFnZUV4aXN0cztcclxuXHJcbiAgICAgICAgICAgIGxldCBpc1JlcDogYm9vbGVhbiA9IHV0aWwuc3RhcnRzV2l0aChub2RlLm5hbWUsIFwicmVwOlwiKSB8fCAvKlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICogbWV0YTY0LmN1cnJlbnROb2RlRGF0YS4gYnVnP1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICovdXRpbC5jb250YWlucyhub2RlLnBhdGgsIFwiL3JlcDpcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgZWRpdGluZ0FsbG93ZWQ6IGJvb2xlYW4gPSBwcm9wcy5pc093bmVkQ29tbWVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIGlmICghZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRpbmdBbGxvd2VkID0gKG1ldGE2NC5pc0FkbWluVXNlciB8fCAhaXNSZXApICYmICFwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAhcHJvcHMuaXNOb25Pd25lZE5vZGUobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIE5vZGUgUm93W1wiICsgaW5kZXggKyBcIl0gZWRpdGluZ0FsbG93ZWQ9XCIrZWRpdGluZ0FsbG93ZWQpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogaWYgbm90IHNlbGVjdGVkIGJ5IGJlaW5nIHRoZSBuZXcgY2hpbGQsIHRoZW4gd2UgdHJ5IHRvIHNlbGVjdCBiYXNlZCBvbiBpZiB0aGlzIG5vZGUgd2FzIHRoZSBsYXN0IG9uZVxyXG4gICAgICAgICAgICAgKiBjbGlja2VkIG9uIGZvciB0aGlzIHBhZ2UuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRlc3Q6IFtcIiArIHBhcmVudElkVG9Gb2N1c0lkTWFwW2N1cnJlbnROb2RlSWRdXHJcbiAgICAgICAgICAgIC8vICtcIl09PVtcIisgbm9kZS5pZCArIFwiXVwiKVxyXG4gICAgICAgICAgICBsZXQgZm9jdXNOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSAoZm9jdXNOb2RlICYmIGZvY3VzTm9kZS51aWQgPT09IHVpZCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFySHRtbFJldDogc3RyaW5nID0gbWFrZVJvd0J1dHRvbkJhckh0bWwobm9kZSwgY2FuTW92ZVVwLCBjYW5Nb3ZlRG93biwgZWRpdGluZ0FsbG93ZWQpO1xyXG4gICAgICAgICAgICBsZXQgYmtnU3R5bGU6IHN0cmluZyA9IGdldE5vZGVCa2dJbWFnZVN0eWxlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNzc0lkOiBzdHJpbmcgPSB1aWQgKyBcIl9yb3dcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3dcIiArIChzZWxlY3RlZCA/IFwiIGFjdGl2ZS1yb3dcIiA6IFwiIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0Lm5hdi5jbGlja09uTm9kZVJvdyh0aGlzLCAnJHt1aWR9Jyk7YCwgLy9cclxuICAgICAgICAgICAgICAgIFwiaWRcIjogY3NzSWQsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IGJrZ1N0eWxlXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhckh0bWxSZXQgKyB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdWlkICsgXCJfY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCByZW5kZXJOb2RlQ29udGVudChub2RlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93Tm9kZVVybCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgbm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJZb3UgbXVzdCBmaXJzdCBjbGljayBvbiBhIG5vZGUuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSB1dGlsLnN0cmlwSWZTdGFydHNXaXRoKG5vZGUucGF0aCwgXCIvcm9vdFwiKTtcclxuICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgcGF0aDtcclxuICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2U6IHN0cmluZyA9IFwiVVJMIHVzaW5nIHBhdGg6IDxicj5cIiArIHVybDtcclxuICAgICAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChcImpjcjp1dWlkXCIsIG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArPSBcIjxwPlVSTCBmb3IgVVVJRDogPGJyPlwiICsgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiP2lkPVwiICsgdXVpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKG1lc3NhZ2UsIFwiVVJMIG9mIE5vZGVcIikpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZ2V0VG9wUmlnaHRJbWFnZVRhZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nOiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoJ2ltZy50b3AucmlnaHQnLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IHRvcFJpZ2h0SW1nVGFnOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodG9wUmlnaHRJbWcpIHtcclxuICAgICAgICAgICAgICAgIHRvcFJpZ2h0SW1nVGFnID0gdGFnKFwiaW1nXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiB0b3BSaWdodEltZyxcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwidG9wLXJpZ2h0LWltYWdlXCJcclxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG9wUmlnaHRJbWdUYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGdldE5vZGVCa2dJbWFnZVN0eWxlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWc6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbCgnaW1nLm5vZGUuYmtnJywgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBia2dJbWdTdHlsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGJrZ0ltZykge1xyXG4gICAgICAgICAgICAgICAgLy90b2RvLTA6IGFzIEkgd2FzIGNvbnZlcnRpbmdpIHNvbWUgc3RyaW5ncyB0byBiYWNrdGljayBpIG5vdGljZWQgdGhpcyBVUkwgbWlzc2luZyB0aGUgcXVvdGVzIGFyb3VuZCB0aGUgc3RyaW5nLiBJcyB0aGlzIGEgYnVnP1xyXG4gICAgICAgICAgICAgICAgYmtnSW1nU3R5bGUgPSBgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7YmtnSW1nfSk7YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmtnSW1nU3R5bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGNlbnRlcmVkQnV0dG9uQmFyID0gZnVuY3Rpb24oYnV0dG9ucz86IHN0cmluZywgY2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBjZW50ZXJDb250ZW50ID0gZnVuY3Rpb24oY29udGVudDogc3RyaW5nLCB3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGRpdjogc3RyaW5nID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwic3R5bGVcIjogYHdpZHRoOiR7d2lkdGh9cHg7YCB9LCBjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhdHRycyA9IHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3dcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwgYXR0cnMsIGRpdiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IGJ1dHRvbkJhciA9IGZ1bmN0aW9uKGJ1dHRvbnM6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMgfHwgXCJcIjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGVmdC1qdXN0aWZpZWQgbGF5b3V0IHZlcnRpY2FsLWxheW91dC1yb3cgXCIgKyBjbGFzc2VzXHJcbiAgICAgICAgICAgIH0sIGJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlUm93QnV0dG9uQmFySHRtbCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIGNhbk1vdmVVcDogYm9vbGVhbiwgY2FuTW92ZURvd246IGJvb2xlYW4sIGVkaXRpbmdBbGxvd2VkOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlZEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DUkVBVEVEX0JZLCBub2RlKTtcclxuICAgICAgICAgICAgbGV0IGNvbW1lbnRCeTogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuQ09NTUVOVF9CWSwgbm9kZSk7XHJcbiAgICAgICAgICAgIGxldCBwdWJsaWNBcHBlbmQ6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LlBVQkxJQ19BUFBFTkQsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9wZW5CdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBzZWxCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBjcmVhdGVTdWJOb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgZWRpdE5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBtb3ZlTm9kZVVwQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgbW92ZU5vZGVEb3duQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZUJ1dHRvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IHJlcGx5QnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgKiBvciBoYXZpbmcgYmVlbiBhZGRlZCBhcyBjb21tZW50IGJ5IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHB1YmxpY0FwcGVuZCAmJiBjcmVhdGVkQnkgIT0gbWV0YTY0LnVzZXJOYW1lICYmIGNvbW1lbnRCeSAhPSBtZXRhNjQudXNlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcGx5QnV0dG9uID0gdGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQucmVwbHlUb0NvbW1lbnQoJyR7bm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgICAgICBcIlJlcGx5XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvKiBDb25zdHJ1Y3QgT3BlbiBCdXR0b24gKi9cclxuICAgICAgICAgICAgaWYgKG5vZGVIYXNDaGlsZHJlbihub2RlLnVpZCkpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbkJ1dHRvbiA9IHRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzb21lIHVua25vd24gcmVhc29uIHRoZSBhYmlsaXR5IHRvIHN0eWxlIHRoaXMgd2l0aCB0aGUgY2xhc3MgYnJva2UsIGFuZCBldmVuXHJcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgZGVkaWNhdGluZyBzZXZlcmFsIGhvdXJzIHRyeWluZyB0byBmaWd1cmUgb3V0IHdoeSBJJ20gc3RpbGwgYmFmZmxlZC4gSSBjaGVja2VkIGV2ZXJ5dGhpbmdcclxuICAgICAgICAgICAgICAgICAgICBhIGh1bmRyZWQgdGltZXMgYW5kIHN0aWxsIGRvbid0IGtub3cgd2hhdCBJJ20gZG9pbmcgd3JvbmcuLi5JIGp1c3QgZmluYWxseSBwdXQgdGhlIGdvZCBkYW1uIGZ1Y2tpbmcgc3R5bGUgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgaGVyZSB0byBhY2NvbXBsaXNoIHRoZSBzYW1lIHRoaW5nICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy9cImNsYXNzXCI6IFwiZ3JlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiYmFja2dyb3VuZC1jb2xvcjogIzRjYWY1MDtjb2xvcjp3aGl0ZTtcIixcclxuICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0Lm5hdi5vcGVuTm9kZSgnJHtub2RlLnVpZH0nKTtgLy9cclxuICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBJZiBpbiBlZGl0IG1vZGUgd2UgYWx3YXlzIGF0IGxlYXN0IGNyZWF0ZSB0aGUgcG90ZW50aWFsIChidXR0b25zKSBmb3IgYSB1c2VyIHRvIGluc2VydCBjb250ZW50LCBhbmQgaWZcclxuICAgICAgICAgICAgICogdGhleSBkb24ndCBoYXZlIHByaXZpbGVnZXMgdGhlIHNlcnZlciBzaWRlIHNlY3VyaXR5IHdpbGwgbGV0IHRoZW0ga25vdy4gSW4gdGhlIGZ1dHVyZSB3ZSBjYW4gYWRkIG1vcmVcclxuICAgICAgICAgICAgICogaW50ZWxsaWdlbmNlIHRvIHdoZW4gdG8gc2hvdyB0aGVzZSBidXR0b25zIG9yIG5vdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlclByZWZlcmVuY2VzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVkaXRpbmcgYWxsb3dlZDogXCIgKyBub2RlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IG1ldGE2NC5zZWxlY3RlZE5vZGVzW25vZGUudWlkXSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIiBub2RlSWQgXCIgKyBub2RlLnVpZCArIFwiIHNlbGVjdGVkPVwiICsgc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzOiBPYmplY3QgPSBzZWxlY3RlZCA/IHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUudWlkICsgXCJfc2VsXCIsLy9cclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2hlY2tlZFwiOiBcImNoZWNrZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAvL3BhZGRpbmcgaXMgYSBiYWNrIGhhY2sgdG8gbWFrZSBjaGVja2JveCBsaW5lIHVwIHdpdGggb3RoZXIgaWNvbnMuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8oaSB3aWxsIHByb2JhYmx5IGVuZCB1cCB1c2luZyBhIHBhcGVyLWljb24tYnV0dG9uIHRoYXQgdG9nZ2xlcyBoZXJlLCBpbnN0ZWFkIG9mIGNoZWNrYm94KVxyXG4gICAgICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJtYXJnaW4tdG9wOiAxMXB4O1wiXHJcbiAgICAgICAgICAgICAgICB9IDogLy9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS51aWQgKyBcIl9zZWxcIiwvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYudG9nZ2xlTm9kZVNlbCgnJHtub2RlLnVpZH0nKTtgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWFyZ2luLXRvcDogMTFweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsQnV0dG9uID0gdGFnKFwicGFwZXItY2hlY2tib3hcIiwgY3NzLCBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY25zdC5ORVdfT05fVE9PTEJBUiAmJiAhY29tbWVudEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL1wiaWNvbnM6bW9yZS12ZXJ0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJhZGROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFwiQWRkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbnN0LklOU19PTl9UT09MQkFSICYmICFjb21tZW50QnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczpwaWN0dXJlLWluLXBpY3R1cmVcIiwgLy9cImljb25zOm1vcmUtaG9yaXpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImluc2VydE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQuaW5zZXJ0Tm9kZSgnJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXCJJbnNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vUG9sbWVyIEljb25zIFJlZmVyZW5jZTogaHR0cHM6Ly9lbGVtZW50cy5wb2x5bWVyLXByb2plY3Qub3JnL2VsZW1lbnRzL2lyb24taWNvbnM/dmlldz1kZW1vOmRlbW8vaW5kZXguaHRtbFxyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgZWRpdGluZ0FsbG93ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICBlZGl0Tm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIC8vXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsdFwiOiBcIkVkaXQgbm9kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiZWRpdG9yOm1vZGUtZWRpdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LnJ1bkVkaXROb2RlKCcke25vZGUudWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNuc3QuTU9WRV9VUERPV05fT05fVE9PTEJBUiAmJiBtZXRhNjQuY3VycmVudE5vZGUuY2hpbGRyZW5PcmRlcmVkICYmICFjb21tZW50QnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVVcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgQ3JlYXRlIFN1Ym5vZGUgQnV0dG9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVOb2RlVXBCdXR0b24gPSB0YWcoXCJwYXBlci1pY29uLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJpY29uczphcnJvdy11cHdhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0Lm1vdmVOb2RlVXAoJyR7bm9kZS51aWR9Jyk7YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcIlVwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbk1vdmVEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCBDcmVhdGUgU3Vibm9kZSBCdXR0b24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZU5vZGVEb3duQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6YXJyb3ctZG93bndhcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0Lm1vdmVOb2RlRG93bignJHtub2RlLnVpZH0nKTtgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwiRG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBpIHdpbGwgYmUgZmluZGluZyBhIHJldXNhYmxlL0RSWSB3YXkgb2YgZG9pbmcgdG9vbHRvcHMgc29vbiwgdGhpcyBpcyBqdXN0IG15IGZpcnN0IGV4cGVyaW1lbnQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEhvd2V2ZXIgdG9vbHRpcHMgQUxXQVlTIGNhdXNlIHByb2JsZW1zLiBNeXN0ZXJ5IGZvciBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0Tm9kZVRvb2x0aXA6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IHRhZyhcInBhcGVyLXRvb2x0aXBcIiwge1xyXG4gICAgICAgICAgICAvL1x0XHRcdCBcImZvclwiIDogXCJpbnNlcnROb2RlQnV0dG9uSWRcIiArIG5vZGUudWlkXHJcbiAgICAgICAgICAgIC8vXHRcdFx0IH0sIFwiSU5TRVJUUyBhIG5ldyBub2RlIGF0IHRoZSBjdXJyZW50IHRyZWUgcG9zaXRpb24uIEFzIGEgc2libGluZyBvbiB0aGlzIGxldmVsLlwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhZGROb2RlVG9vbHRpcDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgLy9cdFx0XHQgdGFnKFwicGFwZXItdG9vbHRpcFwiLCB7XHJcbiAgICAgICAgICAgIC8vXHRcdFx0IFwiZm9yXCIgOiBcImFkZE5vZGVCdXR0b25JZFwiICsgbm9kZS51aWRcclxuICAgICAgICAgICAgLy9cdFx0XHQgfSwgXCJBRERTIGEgbmV3IG5vZGUgaW5zaWRlIHRoZSBjdXJyZW50IG5vZGUsIGFzIGEgY2hpbGQgb2YgaXQuXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbEJ1dHRvbnM6IHN0cmluZyA9IHNlbEJ1dHRvbiArIG9wZW5CdXR0b24gKyBpbnNlcnROb2RlQnV0dG9uICsgY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGluc2VydE5vZGVUb29sdGlwXHJcbiAgICAgICAgICAgICAgICArIGFkZE5vZGVUb29sdGlwICsgZWRpdE5vZGVCdXR0b24gKyBtb3ZlTm9kZVVwQnV0dG9uICsgbW92ZU5vZGVEb3duQnV0dG9uICsgcmVwbHlCdXR0b247XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWxsQnV0dG9ucy5sZW5ndGggPiAwID8gbWFrZUhvcml6b250YWxGaWVsZFNldChhbGxCdXR0b25zLCBcInJvdy10b29sYmFyXCIpIDogXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUhvcml6b250YWxGaWVsZFNldCA9IGZ1bmN0aW9uKGNvbnRlbnQ/OiBzdHJpbmcsIGV4dHJhQ2xhc3Nlcz86IHN0cmluZyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgICAgICAvKiBOb3cgYnVpbGQgZW50aXJlIGNvbnRyb2wgYmFyICovXHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwgLy9cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiaG9yaXpvbnRhbCBsYXlvdXRcIiArIChleHRyYUNsYXNzZXMgPyAoXCIgXCIgKyBleHRyYUNsYXNzZXMpIDogXCJcIilcclxuICAgICAgICAgICAgICAgIH0sIGNvbnRlbnQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSG9yekNvbnRyb2xHcm91cCA9IGZ1bmN0aW9uKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImhvcml6b250YWwgbGF5b3V0XCJcclxuICAgICAgICAgICAgfSwgY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VSYWRpb0J1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItcmFkaW8tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogaWRcclxuICAgICAgICAgICAgfSwgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG5vZGVJZCAoc2VlIG1ha2VOb2RlSWQoKSkgTm9kZUluZm8gb2JqZWN0IGhhcyAnaGFzQ2hpbGRyZW4nIHRydWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IG5vZGVIYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LnVpZFRvTm9kZU1hcFt1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBub2RlSWQgaW4gbm9kZUhhc0NoaWxkcmVuOiBcIiArIHVpZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmb3JtYXRQYXRoID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBub2RlLnBhdGg7XHJcblxyXG4gICAgICAgICAgICAvKiB3ZSBpbmplY3Qgc3BhY2UgaW4gaGVyZSBzbyB0aGlzIHN0cmluZyBjYW4gd3JhcCBhbmQgbm90IGFmZmVjdCB3aW5kb3cgc2l6ZXMgYWR2ZXJzZWx5LCBvciBuZWVkIHNjcm9sbGluZyAqL1xyXG4gICAgICAgICAgICBwYXRoID0gdXRpbC5yZXBsYWNlQWxsKHBhdGgsIFwiL1wiLCBcIiAvIFwiKTtcclxuICAgICAgICAgICAgbGV0IHNob3J0UGF0aDogc3RyaW5nID0gcGF0aC5sZW5ndGggPCA1MCA/IHBhdGggOiBwYXRoLnN1YnN0cmluZygwLCA0MCkgKyBcIi4uLlwiO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vUm9vdFBhdGg6IHN0cmluZyA9IHNob3J0UGF0aDtcclxuICAgICAgICAgICAgaWYgKHV0aWwuc3RhcnRzV2l0aChub1Jvb3RQYXRoLCBcIi9yb290XCIpKSB7XHJcbiAgICAgICAgICAgICAgICBub1Jvb3RQYXRoID0gbm9Sb290UGF0aC5zdWJzdHJpbmcoMCwgNSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IG1ldGE2NC5pc0FkbWluVXNlciA/IHNob3J0UGF0aCA6IG5vUm9vdFBhdGg7XHJcbiAgICAgICAgICAgIHJldCArPSBcIiBbXCIgKyBub2RlLnByaW1hcnlUeXBlTmFtZSArIFwiXVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB3cmFwSHRtbCA9IGZ1bmN0aW9uKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxkaXY+XCIgKyB0ZXh0ICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVuZGVycyBwYWdlIGFuZCBhbHdheXMgYWxzbyB0YWtlcyBjYXJlIG9mIHNjcm9sbGluZyB0byBzZWxlY3RlZCBub2RlIGlmIHRoZXJlIGlzIG9uZSB0byBzY3JvbGwgdG9cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlclBhZ2VGcm9tRGF0YSA9IGZ1bmN0aW9uKGRhdGE/OiBqc29uLlJlbmRlck5vZGVSZXNwb25zZSwgc2Nyb2xsVG9Ub3A/OiBib29sZWFuKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbWV0YTY0LmNvZGVGb3JtYXREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm02NC5yZW5kZXIucmVuZGVyUGFnZUZyb21EYXRhKClcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBtZXRhNjQuY3VycmVudE5vZGVEYXRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hdi5lbmRSZWFjaGVkID0gZGF0YSAmJiBkYXRhLmVuZFJlYWNoZWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI2xpc3RWaWV3XCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQoXCIjbWFpbk5vZGVDb250ZW50XCIpLmh0bWwoXCJObyBjb250ZW50IGlzIGF2YWlsYWJsZSBoZXJlLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNsaXN0Vmlld1wiLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC51aWRUb05vZGVNYXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pZFRvTm9kZU1hcCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmlkZW50VG9VaWRNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogSSdtIGNob29zaW5nIHRvIHJlc2V0IHNlbGVjdGVkIG5vZGVzIHdoZW4gYSBuZXcgcGFnZSBsb2FkcywgYnV0IHRoaXMgaXMgbm90IGEgcmVxdWlyZW1lbnQuIEkganVzdFxyXG4gICAgICAgICAgICAgICAgICogZG9uJ3QgaGF2ZSBhIFwiY2xlYXIgc2VsZWN0aW9uc1wiIGZlYXR1cmUgd2hpY2ggd291bGQgYmUgbmVlZGVkIHNvIHVzZXIgaGFzIGEgd2F5IHRvIGNsZWFyIG91dC5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdGVkTm9kZXMgPSB7fTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5wYXJlbnRVaWRUb0ZvY3VzTm9kZU1hcCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIG1ldGE2NC5pbml0Tm9kZShkYXRhLm5vZGUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnNldEN1cnJlbnROb2RlRGF0YShkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3BDb3VudDogbnVtYmVyID0gbWV0YTY0LmN1cnJlbnROb2RlLnByb3BlcnRpZXMgPyBtZXRhNjQuY3VycmVudE5vZGUucHJvcGVydGllcy5sZW5ndGggOiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJFTkRFUiBOT0RFOiBcIiArIGRhdGEubm9kZS5pZCArIFwiIHByb3BDb3VudD1cIiArIHByb3BDb3VudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBvdXRwdXQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGxldCBia2dTdHlsZTogc3RyaW5nID0gZ2V0Tm9kZUJrZ0ltYWdlU3R5bGUoZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIE5PVEU6IG1haW5Ob2RlQ29udGVudCBpcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhZ2UgY29udGVudCwgYW5kIGlzIGFsd2F5cyB0aGUgbm9kZSBkaXNwbGF5ZWQgYXQgdGhlIHRvXHJcbiAgICAgICAgICAgICAqIG9mIHRoZSBwYWdlIGFib3ZlIGFsbCB0aGUgb3RoZXIgbm9kZXMgd2hpY2ggYXJlIGl0cyBjaGlsZCBub2Rlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxldCBtYWluTm9kZUNvbnRlbnQ6IHN0cmluZyA9IHJlbmRlck5vZGVDb250ZW50KGRhdGEubm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIm1haW5Ob2RlQ29udGVudDogXCIrbWFpbk5vZGVDb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtYWluTm9kZUNvbnRlbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gZGF0YS5ub2RlLnVpZDtcclxuICAgICAgICAgICAgICAgIGxldCBjc3NJZDogc3RyaW5nID0gdWlkICsgXCJfcm93XCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uQmFyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVkaXROb2RlQnV0dG9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNyZWF0ZVN1Yk5vZGVCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVwbHlCdXR0b246IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJkYXRhLm5vZGUucGF0aD1cIitkYXRhLm5vZGUucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWRDb21tZW50Tm9kZT1cIitwcm9wcy5pc05vbk93bmVkQ29tbWVudE5vZGUoZGF0YS5ub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImlzTm9uT3duZWROb2RlPVwiK3Byb3BzLmlzTm9uT3duZWROb2RlKGRhdGEubm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVkQnk6IHN0cmluZyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eVZhbChqY3JDbnN0LkNSRUFURURfQlksIGRhdGEubm9kZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29tbWVudEJ5OiBzdHJpbmcgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoamNyQ25zdC5DT01NRU5UX0JZLCBkYXRhLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB1YmxpY0FwcGVuZDogc3RyaW5nID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5VmFsKGpjckNuc3QuUFVCTElDX0FQUEVORCwgZGF0YS5ub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogU2hvdyBSZXBseSBidXR0b24gaWYgdGhpcyBpcyBhIHB1YmxpY2x5IGFwcGVuZGFibGUgbm9kZSBhbmQgbm90IGNyZWF0ZWQgYnkgY3VycmVudCB1c2VyLFxyXG4gICAgICAgICAgICAgICAgICogb3IgaGF2aW5nIGJlZW4gYWRkZWQgYXMgY29tbWVudCBieSBjdXJyZW50IHVzZXJcclxuICAgICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwdWJsaWNBcHBlbmQgJiYgY3JlYXRlZEJ5ICE9IG1ldGE2NC51c2VyTmFtZSAmJiBjb21tZW50QnkgIT0gbWV0YTY0LnVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbHlCdXR0b24gPSB0YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LnJlcGx5VG9Db21tZW50KCcke2RhdGEubm9kZS51aWR9Jyk7YCAvL1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmVwbHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG1ldGE2NC51c2VyUHJlZmVyZW5jZXMuZWRpdE1vZGUgJiYgY25zdC5ORVdfT05fVE9PTEJBUiAmJiBlZGl0LmlzSW5zZXJ0QWxsb3dlZChkYXRhLm5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlU3ViTm9kZUJ1dHRvbiA9IHRhZyhcInBhcGVyLWljb24tYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6IFwiaWNvbnM6cGljdHVyZS1pbi1waWN0dXJlLWFsdFwiLCAvL2ljb25zOm1vcmUtdmVydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5lZGl0LmNyZWF0ZVN1Yk5vZGUoJyR7dWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkFkZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBBZGQgZWRpdCBidXR0b24gaWYgZWRpdCBtb2RlIGFuZCB0aGlzIGlzbid0IHRoZSByb290ICovXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRpdC5pc0VkaXRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXROb2RlQnV0dG9uID0gdGFnKFwicGFwZXItaWNvbi1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImljb25cIjogXCJlZGl0b3I6bW9kZS1lZGl0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBgbTY0LmVkaXQucnVuRWRpdE5vZGUoJyR7dWlkfScpO2BcclxuICAgICAgICAgICAgICAgICAgICB9LCBcIkVkaXRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IENyZWF0ZSBTdWJub2RlIEJ1dHRvbiAqL1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvY3VzTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZDogYm9vbGVhbiA9IGZvY3VzTm9kZSAmJiBmb2N1c05vZGUudWlkID09PSB1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcm93SGVhZGVyID0gYnVpbGRSb3dIZWFkZXIoZGF0YS5ub2RlLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlU3ViTm9kZUJ1dHRvbiB8fCBlZGl0Tm9kZUJ1dHRvbiB8fCByZXBseUJ1dHRvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciA9IG1ha2VIb3Jpem9udGFsRmllbGRTZXQoY3JlYXRlU3ViTm9kZUJ1dHRvbiArIGVkaXROb2RlQnV0dG9uICsgcmVwbHlCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50OiBzdHJpbmcgPSB0YWcoXCJkaXZcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogKHNlbGVjdGVkID8gXCJtYWluTm9kZUNvbnRlbnRTdHlsZSBhY3RpdmUtcm93XCIgOiBcIm1haW5Ob2RlQ29udGVudFN0eWxlIGluYWN0aXZlLXJvd1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5uYXYuY2xpY2tPbk5vZGVSb3codGhpcywgJyR7dWlkfScpO2AsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBjc3NJZFxyXG4gICAgICAgICAgICAgICAgfSwvL1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbkJhciArIG1haW5Ob2RlQ29udGVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNtYWluTm9kZUNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBmb3JjZSBhbGwgbGlua3MgdG8gb3BlbiBhIG5ldyB3aW5kb3cvdGFiICovXHJcbiAgICAgICAgICAgICAgICAvLyQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7IDwtLS0tIHRoaXMgZG9lc24ndCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgLy8gJCgnI21haW5Ob2RlQ29udGVudCcpLmZpbmQoXCJhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJCh0aGlzKS5hdHRyKFwidGFyZ2V0XCIsIFwiX2JsYW5rXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Ob2RlQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidXBkYXRlIHN0YXR1cyBiYXIuXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnVwZGF0ZVN0YXR1c0JhcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5hdi5tYWluT2Zmc2V0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpcnN0QnV0dG9uOiBzdHJpbmcgPSBtYWtlQnV0dG9uKFwiRmlyc3QgUGFnZVwiLCBcImZpcnN0UGFnZUJ1dHRvblwiLCBmaXJzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZCdXR0b246IHN0cmluZyA9IG1ha2VCdXR0b24oXCJQcmV2IFBhZ2VcIiwgXCJwcmV2UGFnZUJ1dHRvblwiLCBwcmV2UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gY2VudGVyZWRCdXR0b25CYXIoZmlyc3RCdXR0b24gKyBwcmV2QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcm93Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRDb3VudDogbnVtYmVyID0gZGF0YS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoaWxkQ291bnQ6IFwiICsgY2hpbGRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvblxyXG4gICAgICAgICAgICAgICAgICogdGhlIGNsaWVudCBzaWRlIGZvciB2YXJpb3VzIHJlYXNvbnMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVkaXQubm9kZXNUb01vdmVTZXRbbm9kZS5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvdzogc3RyaW5nID0gZ2VuZXJhdGVSb3coaSwgbm9kZSwgbmV3RGF0YSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm93Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcm93O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVkaXQuaXNJbnNlcnRBbGxvd2VkKGRhdGEubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb3dDb3VudCA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IGdldEVtcHR5UGFnZVByb21wdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEuZW5kUmVhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHRCdXR0b24gPSBtYWtlQnV0dG9uKFwiTmV4dCBQYWdlXCIsIFwibmV4dFBhZ2VCdXR0b25cIiwgbmV4dFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RCdXR0b24gPSBtYWtlQnV0dG9uKFwiTGFzdCBQYWdlXCIsIFwibGFzdFBhZ2VCdXR0b25cIiwgbGFzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGNlbnRlcmVkQnV0dG9uQmFyKG5leHRCdXR0b24gKyBsYXN0QnV0dG9uLCBcInBhZ2luZy1idXR0b24tYmFyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJsaXN0Vmlld1wiLCBvdXRwdXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1ldGE2NC5jb2RlRm9ybWF0RGlydHkpIHtcclxuICAgICAgICAgICAgICAgIHByZXR0eVByaW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCJhXCIpLmF0dHIoXCJ0YXJnZXRcIiwgXCJfYmxhbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBUT0RPLTM6IEluc3RlYWQgb2YgY2FsbGluZyBzY3JlZW5TaXplQ2hhbmdlIGhlcmUgaW1tZWRpYXRlbHksIGl0IHdvdWxkIGJlIGJldHRlciB0byBzZXQgdGhlIGltYWdlIHNpemVzXHJcbiAgICAgICAgICAgICAqIGV4YWN0bHkgb24gdGhlIGF0dHJpYnV0ZXMgb2YgZWFjaCBpbWFnZSwgYXMgdGhlIEhUTUwgdGV4dCBpcyByZW5kZXJlZCBiZWZvcmUgd2UgZXZlbiBjYWxsXHJcbiAgICAgICAgICAgICAqIHNldEh0bWwsIHNvIHRoYXQgaW1hZ2VzIGFsd2F5cyBhcmUgR1VBUkFOVEVFRCB0byByZW5kZXIgY29ycmVjdGx5IGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWV0YTY0LnNjcmVlblNpemVDaGFuZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxUb1RvcCB8fCAhbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZmlyc3RQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmlyc3QgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgICAgICB2aWV3LmZpcnN0UGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBwcmV2UGFnZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByZXYgcGFnZSBidXR0b24gY2xpY2suXCIpO1xyXG4gICAgICAgICAgICB2aWV3LnByZXZQYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV4dCBwYWdlIGJ1dHRvbiBjbGljay5cIik7XHJcbiAgICAgICAgICAgIHZpZXcubmV4dFBhZ2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbGFzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMYXN0IHBhZ2UgYnV0dG9uIGNsaWNrLlwiKTtcclxuICAgICAgICAgICAgdmlldy5sYXN0UGFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJvdyA9IGZ1bmN0aW9uKGk6IG51bWJlciwgbm9kZToganNvbi5Ob2RlSW5mbywgbmV3RGF0YTogYm9vbGVhbiwgY2hpbGRDb3VudDogbnVtYmVyLCByb3dDb3VudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtZXRhNjQuaXNOb2RlQmxhY2tMaXN0ZWQobm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZXdEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhNjQuaW5pdE5vZGUobm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgUkVOREVSIFJPV1tcIiArIGkgKyBcIl06IG5vZGUuaWQ9XCIgKyBub2RlLmlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcm93Q291bnQrKzsgLy8gd2FybmluZzogdGhpcyBpcyB0aGUgbG9jYWwgdmFyaWFibGUvcGFyYW1ldGVyXHJcbiAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXJOb2RlQXNMaXN0SXRlbShub2RlLCBpLCBjaGlsZENvdW50LCByb3dDb3VudCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm93W1wiICsgcm93Q291bnQgKyBcIl09XCIgKyByb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBnZXRVcmxGb3JOb2RlQXR0YWNobWVudCA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcG9zdFRhcmdldFVybCArIFwiYmluL2ZpbGUtbmFtZT9ub2RlSWQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5wYXRoKSArIFwiJnZlcj1cIiArIG5vZGUuYmluVmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IG1ha2VJbWFnZVRhZygpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBhZGp1c3RJbWFnZVNpemUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxtID0gJChcIiNcIiArIG5vZGUuaW1nSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgd2lkdGggPSBlbG0uYXR0cihcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IGVsbS5hdHRyKFwiaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3aWR0aD1cIiArIHdpZHRoICsgXCIgaGVpZ2h0PVwiICsgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZS53aWR0aCAmJiBub2RlLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIE5ldyBMb2dpYyBpcyB0cnkgdG8gZGlzcGxheSBpbWFnZSBhdCAxNTAlIG1lYW5pbmcgaXQgY2FuIGdvIG91dHNpZGUgdGhlIGNvbnRlbnQgZGl2IGl0J3MgaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2hpY2ggd2Ugd2FudCwgYnV0IHRoZW4gd2UgYWxzbyBsaW1pdCBpdCB3aXRoIG1heC13aWR0aCBzbyBvbiBzbWFsbGVyIHNjcmVlbiBkZXZpY2VzIG9yIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICogd2luZG93IHJlc2l6aW5ncyBldmVuIG9uIGRlc2t0b3AgYnJvd3NlcnMgdGhlIGltYWdlIHdpbGwgYWx3YXlzIGJlIGVudGlyZWx5IHZpc2libGUgYW5kIG5vdFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGNsaXBwZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1heFdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJ3aWR0aFwiLCBcIjE1MCVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsbS5hdHRyKFwic3R5bGVcIiwgXCJtYXgtd2lkdGg6IFwiICsgbWF4V2lkdGggKyBcInB4O1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIERPIE5PVCBERUxFVEUgKGZvciBhIGxvbmcgdGltZSBhdCBsZWFzdCkgVGhpcyBpcyB0aGUgb2xkIGxvZ2ljIGZvciByZXNpemluZyBpbWFnZXMgcmVzcG9uc2l2ZWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGFuZCBpdCB3b3JrcyBmaW5lIGJ1dCBteSBuZXcgbG9naWMgaXMgYmV0dGVyLCB3aXRoIGxpbWl0aW5nIG1heCB3aWR0aCBiYXNlZCBvbiBzY3JlZW4gc2l6ZS4gQnV0XHJcbiAgICAgICAgICAgICAgICAgICAgICoga2VlcCB0aGlzIG9sZCBjb2RlIGZvciBub3cuLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gODApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHNldCB0aGUgd2lkdGggd2Ugd2FudCB0byBnbyBmb3IgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHdpZHRoID0gbWV0YTY0LmRldmljZVdpZHRoIC0gODA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFuZCBzZXQgdGhlIGhlaWdodCB0byB0aGUgdmFsdWUgaXQgbmVlZHMgdG8gYmUgYXQgZm9yIHNhbWUgdy9oIHJhdGlvIChubyBpbWFnZSBzdHJldGNoaW5nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGhlaWdodCA9IHdpZHRoICogbm9kZS5oZWlnaHQgLyBub2RlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG0uYXR0cihcIndpZHRoXCIsIFwiMTAwJVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbG0uYXR0cihcInN0eWxlXCIsIFwibWF4LXdpZHRoOiBcIiArIG1heFdpZHRoICsgXCJweDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemVcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJ3aWR0aFwiLCBub2RlLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxtLmF0dHIoXCJoZWlnaHRcIiwgbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogc2VlIGFsc286IGFkanVzdEltYWdlU2l6ZSgpICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlSW1hZ2VUYWcgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCBzcmM6IHN0cmluZyA9IGdldFVybEZvck5vZGVBdHRhY2htZW50KG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLmltZ0lkID0gXCJpbWdVaWRfXCIgKyBub2RlLnVpZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIGlmIGltYWdlIHdvbid0IGZpdCBvbiBzY3JlZW4gd2Ugd2FudCB0byBzaXplIGl0IGRvd24gdG8gZml0XHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogWWVzLCBpdCB3b3VsZCBoYXZlIGJlZW4gc2ltcGxlciB0byBqdXN0IHVzZSBzb21ldGhpbmcgbGlrZSB3aWR0aD0xMDAlIGZvciB0aGUgaW1hZ2Ugd2lkdGggYnV0IHRoZW5cclxuICAgICAgICAgICAgICAgICAqIHRoZSBoaWdodCB3b3VsZCBub3QgYmUgc2V0IGV4cGxpY2l0bHkgYW5kIHRoYXQgd291bGQgbWVhbiB0aGF0IGFzIGltYWdlcyBhcmUgbG9hZGluZyBpbnRvIHRoZSBwYWdlLFxyXG4gICAgICAgICAgICAgICAgICogdGhlIGVmZmVjdGl2ZSBzY3JvbGwgcG9zaXRpb24gb2YgZWFjaCByb3cgd2lsbCBiZSBpbmNyZWFzaW5nIGVhY2ggdGltZSB0aGUgVVJMIHJlcXVlc3QgZm9yIGEgbmV3XHJcbiAgICAgICAgICAgICAgICAgKiBpbWFnZSBjb21wbGV0ZXMuIFdoYXQgd2Ugd2FudCBpcyB0byBoYXZlIGl0IHNvIHRoYXQgb25jZSB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byBzY3JvbGwgYVxyXG4gICAgICAgICAgICAgICAgICogcGFydGljdWxhciByb3cgaW50byB2aWV3LCBpdCB3aWxsIHN0YXkgdGhlIGNvcnJlY3Qgc2Nyb2xsIGxvY2F0aW9uIEVWRU4gQVMgdGhlIGltYWdlcyBhcmUgc3RyZWFtaW5nXHJcbiAgICAgICAgICAgICAgICAgKiBpbiBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLndpZHRoID4gbWV0YTY0LmRldmljZVdpZHRoIC0gNTApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogc2V0IHRoZSB3aWR0aCB3ZSB3YW50IHRvIGdvIGZvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gbWV0YTY0LmRldmljZVdpZHRoIC0gNTA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICogYW5kIHNldCB0aGUgaGVpZ2h0IHRvIHRoZSB2YWx1ZSBpdCBuZWVkcyB0byBiZSBhdCBmb3Igc2FtZSB3L2ggcmF0aW8gKG5vIGltYWdlIHN0cmV0Y2hpbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2lkdGggKiBub2RlLmhlaWdodCAvIG5vZGUud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiB3aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLyogSW1hZ2UgZG9lcyBmaXQgb24gc2NyZWVuIHNvIHJlbmRlciBpdCBhdCBpdCdzIGV4YWN0IHNpemUgKi9cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogbm9kZS5pbWdJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBub2RlLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodFwiOiBub2RlLmhlaWdodCArIFwicHhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWcoXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IG5vZGUuaW1nSWRcclxuICAgICAgICAgICAgICAgIH0sIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBjcmVhdGVzIEhUTUwgdGFnIHdpdGggYWxsIGF0dHJpYnV0ZXMvdmFsdWVzIHNwZWNpZmllZCBpbiBhdHRyaWJ1dGVzIG9iamVjdCwgYW5kIGNsb3NlcyB0aGUgdGFnIGFsc28gaWZcclxuICAgICAgICAgKiBjb250ZW50IGlzIG5vbi1udWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWcgPSBmdW5jdGlvbih0YWc6IHN0cmluZywgYXR0cmlidXRlcz86IE9iamVjdCwgY29udGVudD86IHN0cmluZywgY2xvc2VUYWc/OiBib29sZWFuKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgICAgIC8qIGRlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjbG9zZVRhZykgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgY2xvc2VUYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLyogSFRNTCB0YWcgaXRzZWxmICovXHJcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiPFwiICsgdGFnO1xyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIiBcIjtcclxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihrLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IFN0cmluZyh2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgaW50ZWxsaWdlbnRseSB3cmFwIHN0cmluZ3MgdGhhdCBjb250YWluIHNpbmdsZSBxdW90ZXMgaW4gZG91YmxlIHF1b3RlcyBhbmQgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWwuY29udGFpbnModiwgXCInXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldCArPSBrICsgXCI9XFxcIlwiICsgdiArIFwiXFxcIiBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCArPSBgJHtrfT1cIiR7dn1cIiBgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXQgKz0gayArIFwiPSdcIiArIHYgKyBcIicgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gYCR7a309JyR7dn0nIGA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgKz0gayArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xvc2VUYWcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9yZXQgKz0gXCI+XCIgKyBjb250ZW50ICsgXCI8L1wiICsgdGFnICsgXCI+XCI7XHJcbiAgICAgICAgICAgICAgICByZXQgKz0gYD4ke2NvbnRlbnR9PC8ke3RhZ30+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSBcIi8+XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VUZXh0QXJlYSA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZUVkaXRGaWVsZCA9IGZ1bmN0aW9uKGZpZWxkTmFtZTogc3RyaW5nLCBmaWVsZElkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnKFwicGFwZXItaW5wdXRcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkSWQsXHJcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGZpZWxkTmFtZSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogZmllbGRJZFxyXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFrZVBhc3N3b3JkRmllbGQgPSBmdW5jdGlvbihmaWVsZE5hbWU6IHN0cmluZywgZmllbGRJZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZyhcInBhcGVyLWlucHV0XCIsIHtcclxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRJZCxcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBmaWVsZElkLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXHJcbiAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBtYWtlQnV0dG9uID0gZnVuY3Rpb24odGV4dDogc3RyaW5nLCBpZDogc3RyaW5nLCBjYWxsYmFjazogYW55LCBjdHg/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBhbGxvd1Byb3BlcnR5VG9EaXNwbGF5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIW1ldGE2NC5pblNpbXBsZU1vZGUoKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnNpbXBsZU1vZGVQcm9wZXJ0eUJsYWNrTGlzdFtwcm9wTmFtZV0gPT0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNSZWFkT25seVByb3BlcnR5ID0gZnVuY3Rpb24ocHJvcE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YTY0LnJlYWRPbmx5UHJvcGVydHlMaXN0W3Byb3BOYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNCaW5hcnlQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC5iaW5hcnlQcm9wZXJ0eUxpc3RbcHJvcE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzYW5pdGl6ZVByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uKHByb3BOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBcInNpbXBsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWUgPT09IGpjckNuc3QuQ09OVEVOVCA/IFwiQ29udGVudFwiIDogcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoLmpzXCIpO1xyXG5cclxuLypcclxuICogdG9kby0zOiB0cnkgdG8gcmVuYW1lIHRvICdzZWFyY2gnLCBidXQgcmVtZW1iZXIgeW91IGhhZCBpbmV4cGxpYWJsZSBwcm9ibGVtcyB0aGUgZmlyc3QgdGltZSB5b3UgdHJpZWQgdG8gdXNlICdzZWFyY2gnXHJcbiAqIGFzIHRoZSB2YXIgbmFtZS5cclxuICovXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzcmNoIHtcclxuICAgICAgICBleHBvcnQgbGV0IF9VSURfUk9XSURfU1VGRklYOiBzdHJpbmcgPSBcIl9zcmNoX3Jvd1wiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE5vZGVzOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoUGFnZVRpdGxlOiBzdHJpbmcgPSBcIlNlYXJjaCBSZXN1bHRzXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVBhZ2VUaXRsZTogc3RyaW5nID0gXCJUaW1lbGluZVwiO1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNlYXJjaE9mZnNldCA9IDA7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZU9mZnNldCA9IDA7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogSG9sZHMgdGhlIE5vZGVTZWFyY2hSZXNwb25zZS5qYXZhIEpTT04sIG9yIG51bGwgaWYgbm8gc2VhcmNoIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hSZXN1bHRzOiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEhvbGRzIHRoZSBOb2RlU2VhcmNoUmVzcG9uc2UuamF2YSBKU09OLCBvciBudWxsIGlmIG5vIHRpbWVsaW5lIGhhcyBiZWVuIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZVJlc3VsdHM6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogV2lsbCBiZSB0aGUgbGFzdCByb3cgY2xpY2tlZCBvbiAoTm9kZUluZm8uamF2YSBvYmplY3QpIGFuZCBoYXZpbmcgdGhlIHJlZCBoaWdobGlnaHQgYmFyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBoaWdobGlnaHRSb3dOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBtYXBzIG5vZGUgJ2lkZW50aWZpZXInIChhc3NpZ25lZCBhdCBzZXJ2ZXIpIHRvIHVpZCB2YWx1ZSB3aGljaCBpcyBhIHZhbHVlIGJhc2VkIG9mZiBsb2NhbCBzZXF1ZW5jZSwgYW5kIHVzZXNcclxuICAgICAgICAgKiBuZXh0VWlkIGFzIHRoZSBjb3VudGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaWRlbnRUb1VpZE1hcDogYW55ID0ge307XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbWFwcyBub2RlLnVpZCB2YWx1ZXMgdG8gdGhlIE5vZGVJbmZvLmphdmEgb2JqZWN0c1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIG9ubHkgY29udHJhY3QgYWJvdXQgdWlkIHZhbHVlcyBpcyB0aGF0IHRoZXkgYXJlIHVuaXF1ZSBpbnNvZmFyIGFzIGFueSBvbmUgb2YgdGhlbSBhbHdheXMgbWFwcyB0byB0aGUgc2FtZVxyXG4gICAgICAgICAqIG5vZGUuIExpbWl0ZWQgbGlmZXRpbWUgaG93ZXZlci4gVGhlIHNlcnZlciBpcyBzaW1wbHkgbnVtYmVyaW5nIG5vZGVzIHNlcXVlbnRpYWxseS4gQWN0dWFsbHkgcmVwcmVzZW50cyB0aGVcclxuICAgICAgICAgKiAnaW5zdGFuY2UnIG9mIGEgbW9kZWwgb2JqZWN0LiBWZXJ5IHNpbWlsYXIgdG8gYSAnaGFzaENvZGUnIG9uIEphdmEgb2JqZWN0cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVpZFRvTm9kZU1hcDogeyBba2V5OiBzdHJpbmddOiBqc29uLk5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBudW1TZWFyY2hSZXN1bHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcmNoLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMgIT0gbnVsbCAmJiAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoICE9IG51bGwgPyAvL1xyXG4gICAgICAgICAgICAgICAgc3JjaC5zZWFyY2hSZXN1bHRzLnNlYXJjaFJlc3VsdHMubGVuZ3RoIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2VhcmNoVGFiQWN0aXZhdGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIElmIGEgbG9nZ2VkIGluIHVzZXIgY2xpY2tzIHRoZSBzZWFyY2ggdGFiLCBhbmQgbm8gc2VhcmNoIHJlc3VsdHMgYXJlIGN1cnJlbnRseSBkaXNwbGF5aW5nLCB0aGVuIGdvIGFoZWFkXHJcbiAgICAgICAgICAgICAqIGFuZCBvcGVuIHVwIHRoZSBzZWFyY2ggZGlhbG9nLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKG51bVNlYXJjaFJlc3VsdHMoKSA9PSAwICYmICFtZXRhNjQuaXNBbm9uVXNlcikge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBTZWFyY2hDb250ZW50RGxnKCkpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hOb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLk5vZGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gcmVzO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0c1BhbmVsID0gbmV3IFNlYXJjaFJlc3VsdHNQYW5lbCgpO1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHNlYXJjaFJlc3VsdHNQYW5lbC5idWlsZCgpO1xyXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwoXCJzZWFyY2hSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc3VsdHNQYW5lbC5pbml0KCk7XHJcbiAgICAgICAgICAgIG1ldGE2NC5jaGFuZ2VQYWdlKHNlYXJjaFJlc3VsdHNQYW5lbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHRpbWVsaW5lUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTm9kZVNlYXJjaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0cyA9IHJlcztcclxuICAgICAgICAgICAgbGV0IHRpbWVsaW5lUmVzdWx0c1BhbmVsID0gbmV3IFRpbWVsaW5lUmVzdWx0c1BhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGltZWxpbmVSZXN1bHRzUGFuZWwuYnVpbGQoKTtcclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKFwidGltZWxpbmVSZXN1bHRzUGFuZWxcIiwgY29udGVudCk7XHJcbiAgICAgICAgICAgIHRpbWVsaW5lUmVzdWx0c1BhbmVsLmluaXQoKTtcclxuICAgICAgICAgICAgbWV0YTY0LmNoYW5nZVBhZ2UodGltZWxpbmVSZXN1bHRzUGFuZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2hGaWxlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkZpbGVTZWFyY2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHJlcy5zZWFyY2hSZXN1bHROb2RlSWQsXHJcbiAgICAgICAgICAgICAgICBcInVwTGV2ZWxcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwicmVuZGVyUGFyZW50SWZMZWFmXCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm9mZnNldFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZmFsc2VcclxuICAgICAgICAgICAgfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5TW9kVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuTEFTVF9NT0RJRklFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB0aW1lbGluZUJ5Q3JlYXRlVGltZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvICd0aW1lbGluZScgdW5kZXIuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogXCJcIixcclxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIkRFU0NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IGpjckNuc3QuQ1JFQVRFRCxcclxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBudWxsXHJcbiAgICAgICAgICAgIH0sIHRpbWVsaW5lUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBpbml0U2VhcmNoTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8pIHtcclxuICAgICAgICAgICAgbm9kZS51aWQgPSB1dGlsLmdldFVpZEZvcklkKGlkZW50VG9VaWRNYXAsIG5vZGUuaWQpO1xyXG4gICAgICAgICAgICB1aWRUb05vZGVNYXBbbm9kZS51aWRdID0gbm9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcG9wdWxhdGVTZWFyY2hSZXN1bHRzUGFnZSA9IGZ1bmN0aW9uKGRhdGEsIHZpZXdOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcclxuICAgICAgICAgICAgdmFyIGNoaWxkQ291bnQgPSBkYXRhLnNlYXJjaFJlc3VsdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogTnVtYmVyIG9mIHJvd3MgdGhhdCBoYXZlIGFjdHVhbGx5IG1hZGUgaXQgb250byB0aGUgcGFnZSB0byBmYXIuIE5vdGU6IHNvbWUgbm9kZXMgZ2V0IGZpbHRlcmVkIG91dCBvbiB0aGVcclxuICAgICAgICAgICAgICogY2xpZW50IHNpZGUgZm9yIHZhcmlvdXMgcmVhc29ucy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciByb3dDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5zZWFyY2hSZXN1bHRzLCBmdW5jdGlvbihpLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0YTY0LmlzTm9kZUJsYWNrTGlzdGVkKG5vZGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0U2VhcmNoTm9kZShub2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHJlbmRlclNlYXJjaFJlc3VsdEFzTGlzdEl0ZW0obm9kZSwgaSwgY2hpbGRDb3VudCwgcm93Q291bnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh2aWV3TmFtZSwgb3V0cHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmVuZGVycyBhIHNpbmdsZSBsaW5lIG9mIHNlYXJjaCByZXN1bHRzIG9uIHRoZSBzZWFyY2ggcmVzdWx0cyBwYWdlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogbm9kZSBpcyBhIE5vZGVJbmZvLmphdmEgSlNPTlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyU2VhcmNoUmVzdWx0QXNMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGUsIGluZGV4LCBjb3VudCwgcm93Q291bnQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1aWQgPSBub2RlLnVpZDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJTZWFyY2hSZXN1bHQ6IFwiICsgdWlkKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjc3NJZCA9IHVpZCArIF9VSURfUk9XSURfU1VGRklYO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBOb2RlIFJvd1tcIiArIGluZGV4ICsgXCJdIHdpdGggaWQ6IFwiICtjc3NJZClcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXJIdG1sID0gbWFrZUJ1dHRvbkJhckh0bWwoXCJcIiArIHVpZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ1dHRvbkJhckh0bWw9XCIgKyBidXR0b25CYXJIdG1sKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSByZW5kZXIucmVuZGVyTm9kZUNvbnRlbnQobm9kZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcImRpdlwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibm9kZS10YWJsZS1yb3cgaW5hY3RpdmUtcm93XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogYG02NC5zcmNoLmNsaWNrT25TZWFyY2hSZXN1bHRSb3codGhpcywgJyR7dWlkfScpO2AsIC8vXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IGNzc0lkXHJcbiAgICAgICAgICAgIH0sLy9cclxuICAgICAgICAgICAgICAgIGJ1dHRvbkJhckh0bWwvL1xyXG4gICAgICAgICAgICAgICAgKyByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHVpZCArIFwiX3NyY2hfY29udGVudFwiXHJcbiAgICAgICAgICAgICAgICB9LCBjb250ZW50KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG1ha2VCdXR0b25CYXJIdG1sID0gZnVuY3Rpb24odWlkKSB7XHJcbiAgICAgICAgICAgIHZhciBnb3RvQnV0dG9uID0gcmVuZGVyLm1ha2VCdXR0b24oXCJHbyB0byBOb2RlXCIsIHVpZCwgYG02NC5zcmNoLmNsaWNrU2VhcmNoTm9kZSgnJHt1aWR9Jyk7YCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChnb3RvQnV0dG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xpY2tPblNlYXJjaFJlc3VsdFJvdyA9IGZ1bmN0aW9uKHJvd0VsbSwgdWlkKSB7XHJcbiAgICAgICAgICAgIHVuaGlnaGxpZ2h0Um93KCk7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodFJvd05vZGUgPSB1aWRUb05vZGVNYXBbdWlkXTtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuY2hhbmdlT3JBZGRDbGFzcyhyb3dFbG0sIFwiaW5hY3RpdmUtcm93XCIsIFwiYWN0aXZlLXJvd1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgY2xpY2tTZWFyY2hOb2RlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdXBkYXRlIGhpZ2hsaWdodCBub2RlIHRvIHBvaW50IHRvIHRoZSBub2RlIGNsaWNrZWQgb24sIGp1c3QgdG8gcGVyc2lzdCBpdCBmb3IgbGF0ZXJcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNyY2guaGlnaGxpZ2h0Um93Tm9kZSA9IHNyY2gudWlkVG9Ob2RlTWFwW3VpZF07XHJcbiAgICAgICAgICAgIGlmICghc3JjaC5oaWdobGlnaHRSb3dOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBmaW5kIHVpZCBpbiBzZWFyY2ggcmVzdWx0czogXCIgKyB1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZpZXcucmVmcmVzaFRyZWUoc3JjaC5oaWdobGlnaHRSb3dOb2RlLmlkLCB0cnVlLCBzcmNoLmhpZ2hsaWdodFJvd05vZGUuaWQpO1xyXG4gICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIHR1cm4gb2Ygcm93IHNlbGVjdGlvbiBzdHlsaW5nIG9mIHdoYXRldmVyIHJvdyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHVuaGlnaGxpZ2h0Um93ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWhpZ2hsaWdodFJvd05vZGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogbm93IG1ha2UgQ1NTIGlkIGZyb20gbm9kZSAqL1xyXG4gICAgICAgICAgICB2YXIgbm9kZUlkID0gaGlnaGxpZ2h0Um93Tm9kZS51aWQgKyBfVUlEX1JPV0lEX1NVRkZJWDtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbG0gPSB1dGlsLmRvbUVsbShub2RlSWQpO1xyXG4gICAgICAgICAgICBpZiAoZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBjaGFuZ2UgY2xhc3Mgb24gZWxlbWVudCAqL1xyXG4gICAgICAgICAgICAgICAgdXRpbC5jaGFuZ2VPckFkZENsYXNzKGVsbSwgXCJhY3RpdmUtcm93XCIsIFwiaW5hY3RpdmUtcm93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHNoYXJlLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHNoYXJlIHtcclxuXHJcbiAgICAgICAgbGV0IGZpbmRTaGFyZWROb2Rlc1Jlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkdldFNoYXJlZE5vZGVzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgc3JjaC5zZWFyY2hOb2Rlc1Jlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNoYXJpbmdOb2RlOiBqc29uLk5vZGVJbmZvID0gbnVsbDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBIYW5kbGVzICdTaGFyaW5nJyBidXR0b24gb24gYSBzcGVjaWZpYyBub2RlLCBmcm9tIGJ1dHRvbiBiYXIgYWJvdmUgbm9kZSBkaXNwbGF5IGluIGVkaXQgbW9kZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZWRpdE5vZGVTaGFyaW5nID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYXJpbmdOb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZmluZFNoYXJlZE5vZGVzID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBmb2N1c05vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XHJcbiAgICAgICAgICAgIGlmIChmb2N1c05vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzcmNoLnNlYXJjaFBhZ2VUaXRsZSA9IFwiU2hhcmVkIE5vZGVzXCI7XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRTaGFyZWROb2Rlc1JlcXVlc3QsIGpzb24uR2V0U2hhcmVkTm9kZXNSZXNwb25zZT4oXCJnZXRTaGFyZWROb2Rlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBmb2N1c05vZGUuaWRcclxuICAgICAgICAgICAgfSwgZmluZFNoYXJlZE5vZGVzUmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB1c2VyLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHVzZXIge1xyXG5cclxuICAgICAgICBsZXQgbG9nb3V0UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uTG9nb3V0UmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgLyogcmVsb2FkcyBicm93c2VyIHdpdGggdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgc3RyaXBwZWQgb2ZmIHRoZSBwYXRoICovXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogZm9yIHRlc3RpbmcgcHVycG9zZXMsIEkgd2FudCB0byBhbGxvdyBjZXJ0YWluIHVzZXJzIGFkZGl0aW9uYWwgcHJpdmlsZWdlcy4gQSBiaXQgb2YgYSBoYWNrIGJlY2F1c2UgaXQgd2lsbCBnb1xyXG4gICAgICAgICAqIGludG8gcHJvZHVjdGlvbiwgYnV0IG9uIG15IG93biBwcm9kdWN0aW9uIHRoZXNlIGFyZSBteSBcInRlc3RVc2VyQWNjb3VudHNcIiwgc28gbm8gcmVhbCB1c2VyIHdpbGwgYmUgYWJsZSB0b1xyXG4gICAgICAgICAqIHVzZSB0aGVzZSBuYW1lc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgaXNUZXN0VXNlckFjY291bnQgPSBmdW5jdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImFkYW1cIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiYm9iXCIgfHwgLy9cclxuICAgICAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImNvcnlcIiB8fCAvL1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LnVzZXJOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGFuXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNldFRpdGxlVXNpbmdMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IEJSQU5ESU5HX1RJVExFX1NIT1JUO1xyXG5cclxuICAgICAgICAgICAgLyogdG9kby0wOiBJZiB1c2VycyBnbyB3aXRoIHZlcnkgbG9uZyB1c2VybmFtZXMgdGhpcyBpcyBnb25uYSBiZSB1Z2x5ICovXHJcbiAgICAgICAgICAgIGlmICghbWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlICs9IFwiOlwiICsgcmVzLnVzZXJOYW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiI2hlYWRlckFwcE5hbWVcIikuaHRtbCh0aXRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBUT0RPLTM6IG1vdmUgdGhpcyBpbnRvIG1ldGE2NCBtb2R1bGUgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHNldFN0YXRlVmFyc1VzaW5nTG9naW5SZXNwb25zZSA9IGZ1bmN0aW9uKHJlczoganNvbi5Mb2dpblJlc3BvbnNlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChyZXMucm9vdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5ob21lTm9kZUlkID0gcmVzLnJvb3ROb2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlUGF0aCA9IHJlcy5yb290Tm9kZS5wYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1ldGE2NC51c2VyTmFtZSA9IHJlcy51c2VyTmFtZTtcclxuICAgICAgICAgICAgbWV0YTY0LmlzQWRtaW5Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFkbWluXCI7XHJcbiAgICAgICAgICAgIG1ldGE2NC5pc0Fub25Vc2VyID0gcmVzLnVzZXJOYW1lID09PSBcImFub255bW91c1wiO1xyXG4gICAgICAgICAgICBtZXRhNjQuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGUgPSByZXMuYW5vblVzZXJMYW5kaW5nUGFnZU5vZGU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5hbGxvd0ZpbGVTeXN0ZW1TZWFyY2ggPSByZXMuYWxsb3dGaWxlU3lzdGVtU2VhcmNoO1xyXG5cclxuICAgICAgICAgICAgbWV0YTY0LnVzZXJQcmVmZXJlbmNlcyA9IHJlcy51c2VyUHJlZmVyZW5jZXM7XHJcbiAgICAgICAgICAgIG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9IHJlcy51c2VyUHJlZmVyZW5jZXMuYWR2YW5jZWRNb2RlID8gbWV0YTY0Lk1PREVfQURWQU5DRUQgOiBtZXRhNjQuTU9ERV9TSU1QTEU7XHJcbiAgICAgICAgICAgIG1ldGE2NC5zaG93TWV0YURhdGEgPSByZXMudXNlclByZWZlcmVuY2VzLnNob3dNZXRhRGF0YTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZnJvbSBzZXJ2ZXI6IG1ldGE2NC5lZGl0TW9kZU9wdGlvbj1cIiArIG1ldGE2NC5lZGl0TW9kZU9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG9wZW5TaWdudXBQZyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAobmV3IFNpZ251cERsZygpKS5vcGVuKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBXcml0ZSBhIGNvb2tpZSB0aGF0IGV4cGlyZXMgaW4gYSB5ZWFyIGZvciBhbGwgcGF0aHMgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHdyaXRlQ29va2llID0gZnVuY3Rpb24obmFtZSwgdmFsKTogdm9pZCB7XHJcbiAgICAgICAgICAgICQuY29va2llKG5hbWUsIHZhbCwge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlczogMzY1LFxyXG4gICAgICAgICAgICAgICAgcGF0aDogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyB1Z2x5LiBJdCBpcyB0aGUgYnV0dG9uIHRoYXQgY2FuIGJlIGxvZ2luICpvciogbG9nb3V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3BlbkxvZ2luUGcgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGxvZ2luRGxnOiBMb2dpbkRsZyA9IG5ldyBMb2dpbkRsZygpO1xyXG4gICAgICAgICAgICBsb2dpbkRsZy5wb3B1bGF0ZUZyb21Db29raWVzKCk7XHJcbiAgICAgICAgICAgIGxvZ2luRGxnLm9wZW4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgcmVmcmVzaExvZ2luID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbi5cIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FsbFVzcjogc3RyaW5nO1xyXG4gICAgICAgICAgICBsZXQgY2FsbFB3ZDogc3RyaW5nO1xyXG4gICAgICAgICAgICBsZXQgdXNpbmdDb29raWVzOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9naW5TZXNzaW9uUmVhZHkgPSAkKFwiI2xvZ2luU2Vzc2lvblJlYWR5XCIpLnRleHQoKTtcclxuICAgICAgICAgICAgaWYgKGxvZ2luU2Vzc2lvblJlYWR5ID09PSBcInRydWVcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgbG9naW5TZXNzaW9uUmVhZHkgPSB0cnVlXCIpO1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAqIHVzaW5nIGJsYW5rIGNyZWRlbnRpYWxzIHdpbGwgY2F1c2Ugc2VydmVyIHRvIGxvb2sgZm9yIGEgdmFsaWQgc2Vzc2lvblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjYWxsVXNyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGNhbGxQd2QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdXNpbmdDb29raWVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIGxvZ2luU2Vzc2lvblJlYWR5ID0gZmFsc2VcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxvZ2luU3RhdGU6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1NUQVRFKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIGtub3duIHN0YXRlIGFzIGxvZ2dlZCBvdXQsIHRoZW4gZG8gbm90aGluZyBoZXJlICovXHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5TdGF0ZSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRhNjQubG9hZEFub25QYWdlSG9tZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1c3I6IHN0cmluZyA9ICQuY29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHdkOiBzdHJpbmcgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xyXG5cclxuICAgICAgICAgICAgICAgIHVzaW5nQ29va2llcyA9ICF1dGlsLmVtcHR5U3RyaW5nKHVzcikgJiYgIXV0aWwuZW1wdHlTdHJpbmcocHdkKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29va2llVXNlcj1cIiArIHVzciArIFwiIHVzaW5nQ29va2llcyA9IFwiICsgdXNpbmdDb29raWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICogZW1weXQgY3JlZGVudGlhbHMgY2F1c2VzIHNlcnZlciB0byB0cnkgdG8gbG9nIGluIHdpdGggYW55IGFjdGl2ZSBzZXNzaW9uIGNyZWRlbnRpYWxzLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjYWxsVXNyID0gdXNyID8gdXNyIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGNhbGxQd2QgPSBwd2QgPyBwd2QgOiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hMb2dpbiB3aXRoIG5hbWU6IFwiICsgY2FsbFVzcik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNhbGxVc3IpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5sb2FkQW5vblBhZ2VIb21lKGZhbHNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkxvZ2luUmVxdWVzdCwganNvbi5Mb2dpblJlc3BvbnNlPihcImxvZ2luXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IGNhbGxVc3IsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBjYWxsUHdkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidHpPZmZzZXRcIjogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZHN0XCI6IHV0aWwuZGF5bGlnaHRTYXZpbmdzVGltZVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNpbmdDb29raWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUmVzcG9uc2UocmVzLCBjYWxsVXNyLCBjYWxsUHdkLCB1c2luZ0Nvb2tpZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hMb2dpblJlc3BvbnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbG9nb3V0ID0gZnVuY3Rpb24odXBkYXRlTG9naW5TdGF0ZUNvb2tpZSkge1xyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmlzQW5vblVzZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogUmVtb3ZlIHdhcm5pbmcgZGlhbG9nIHRvIGFzayB1c2VyIGFib3V0IGxlYXZpbmcgdGhlIHBhZ2UgKi9cclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVMb2dpblN0YXRlQ29va2llKSB7XHJcbiAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dvdXRSZXF1ZXN0LCBqc29uLkxvZ291dFJlc3BvbnNlPihcImxvZ291dFwiLCB7fSwgbG9nb3V0UmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRGxnLCB1c3IsIHB3ZCkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Mb2dpblJlcXVlc3QsIGpzb24uTG9naW5SZXNwb25zZT4oXCJsb2dpblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInVzZXJOYW1lXCI6IHVzcixcclxuICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIjogcHdkLFxyXG4gICAgICAgICAgICAgICAgXCJ0ek9mZnNldFwiOiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICBcImRzdFwiOiB1dGlsLmRheWxpZ2h0U2F2aW5nc1RpbWVcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luUmVzcG9uc2UocmVzLCB1c3IsIHB3ZCwgbnVsbCwgbG9naW5EbGcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgZGVsZXRlQWxsVXNlckNvb2tpZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBsb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzPzoganNvbi5Mb2dpblJlc3BvbnNlLCB1c3I/OiBzdHJpbmcsIHB3ZD86IHN0cmluZywgdXNpbmdDb29raWVzPzogYm9vbGVhbiwgbG9naW5EbGc/OiBMb2dpbkRsZykge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJMb2dpblwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luUmVzcG9uc2U6IHVzcj1cIiArIHVzciArIFwiIGhvbWVOb2RlT3ZlcnJpZGU6IFwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh1c3IgIT0gXCJhbm9ueW1vdXNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUiwgdXNyKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QsIHB3ZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fU1RBVEUsIFwiMVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5EbGcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbkRsZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGU6IFwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdE5vZGUgaXMgbnVsbC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogc2V0IElEIHRvIGJlIHRoZSBwYWdlIHdlIHdhbnQgdG8gc2hvdyB1c2VyIHJpZ2h0IGFmdGVyIGxvZ2luICovXHJcbiAgICAgICAgICAgICAgICBsZXQgaWQ6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLmVtcHR5U3RyaW5nKHJlcy5ob21lTm9kZU92ZXJyaWRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBob21lTm9kZU92ZXJyaWRlPVwiICsgcmVzLmhvbWVOb2RlT3ZlcnJpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLmhvbWVOb2RlT3ZlcnJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YTY0LmhvbWVOb2RlT3ZlcnJpZGUgPSBpZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyUHJlZmVyZW5jZXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGxhc3ROb2RlPVwiICsgcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gcmVzLnVzZXJQcmVmZXJlbmNlcy5sYXN0Tm9kZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcgaG9tZU5vZGVJZD1cIiArIG1ldGE2NC5ob21lTm9kZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQgPSBtZXRhNjQuaG9tZU5vZGVJZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShpZCwgZmFsc2UsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh1c2luZ0Nvb2tpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJDb29raWUgbG9naW4gZmFpbGVkLlwiKSkub3BlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIGJsb3cgYXdheSBmYWlsZWQgY29va2llIGNyZWRlbnRpYWxzIGFuZCByZWxvYWQgcGFnZSwgc2hvdWxkIHJlc3VsdCBpbiBicmFuZCBuZXcgcGFnZSBsb2FkIGFzIGFub25cclxuICAgICAgICAgICAgICAgICAgICAgKiB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKGNuc3QuQ09PS0lFX0xPR0lOX1VTUik7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY25zdC5DT09LSUVfTE9HSU5fUFdEKTtcclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9TVEFURSwgXCIwXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXMgaXMgSlNPTiByZXNwb25zZSBvYmplY3QgZnJvbSBzZXJ2ZXIuXHJcbiAgICAgICAgbGV0IHJlZnJlc2hMb2dpblJlc3BvbnNlID0gZnVuY3Rpb24ocmVzOiBqc29uLkxvZ2luUmVzcG9uc2UpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoTG9naW5SZXNwb25zZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgdXNlci5zZXRTdGF0ZVZhcnNVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgICAgIHVzZXIuc2V0VGl0bGVVc2luZ0xvZ2luUmVzcG9uc2UocmVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWV0YTY0LmxvYWRBbm9uUGFnZUhvbWUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiB2aWV3LmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIHZpZXcge1xyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHNjcm9sbFRvU2VsTm9kZVBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCB1cGRhdGVTdGF0dXNCYXIgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhNjQuY3VycmVudE5vZGVEYXRhKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RhdHVzTGluZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LmVkaXRNb2RlT3B0aW9uID09PSBtZXRhNjQuTU9ERV9BRFZBTkNFRCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcImNvdW50OiBcIiArIG1ldGE2NC5jdXJyZW50Tm9kZURhdGEuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTGluZSArPSBcIiBTZWxlY3Rpb25zOiBcIiArIHV0aWwuZ2V0UHJvcGVydHlDb3VudChtZXRhNjQuc2VsZWN0ZWROb2Rlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogbmV3SWQgaXMgb3B0aW9uYWwgcGFyYW1ldGVyIHdoaWNoLCBpZiBzdXBwbGllZCwgc2hvdWxkIGJlIHRoZSBpZCB3ZSBzY3JvbGwgdG8gd2hlbiBmaW5hbGx5IGRvbmUgd2l0aCB0aGVcclxuICAgICAgICAgKiByZW5kZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoVHJlZVJlc3BvbnNlID0gZnVuY3Rpb24ocmVzPzoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UsIHRhcmdldElkPzogYW55LCBzY3JvbGxUb1RvcD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgcmVuZGVyLnJlbmRlclBhZ2VGcm9tRGF0YShyZXMsIHNjcm9sbFRvVG9wKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxUb1RvcCkge1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5oaWdobGlnaHRSb3dCeUlkKHRhcmdldElkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjbWFpbk5vZGVDb250ZW50XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBuZXdJZCBpcyBvcHRpb25hbCBhbmQgaWYgc3BlY2lmaWVkIG1ha2VzIHRoZSBwYWdlIHNjcm9sbCB0byBhbmQgaGlnaGxpZ2h0IHRoYXQgbm9kZSB1cG9uIHJlLXJlbmRlcmluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgbGV0IHJlZnJlc2hUcmVlID0gZnVuY3Rpb24obm9kZUlkPzogYW55LCByZW5kZXJQYXJlbnRJZkxlYWY/OiBhbnksIGhpZ2hsaWdodElkPzogYW55LCBpc0luaXRpYWxSZW5kZXI/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBtZXRhNjQuY3VycmVudE5vZGVJZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWZyZXNoaW5nIHRyZWU6IG5vZGVJZD1cIiArIG5vZGVJZCk7XHJcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0SWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodElkID0gY3VycmVudFNlbE5vZGUgIT0gbnVsbCA/IGN1cnJlbnRTZWxOb2RlLmlkIDogbm9kZUlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBJIGRvbid0IGtub3cgb2YgYW55IHJlYXNvbiAncmVmcmVzaFRyZWUnIHNob3VsZCBpdHNlbGYgcmVzZXQgdGhlIG9mZnNldCwgYnV0IEkgbGVhdmUgdGhpcyBjb21tZW50IGhlcmVcclxuICAgICAgICAgICAgYXMgYSBoaW50IGZvciB0aGUgZnV0dXJlLlxyXG4gICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmRlck5vZGVSZXF1ZXN0LCBqc29uLlJlbmRlck5vZGVSZXNwb25zZT4oXCJyZW5kZXJOb2RlXCIsIHtcclxuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IG5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogcmVuZGVyUGFyZW50SWZMZWFmID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgXCJvZmZzZXRcIjogbmF2Lm1haW5PZmZzZXQsXHJcbiAgICAgICAgICAgICAgICBcImdvVG9MYXN0UGFnZVwiOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLm9mZnNldE9mTm9kZUZvdW5kID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXYubWFpbk9mZnNldCA9IHJlcy5vZmZzZXRPZk5vZGVGb3VuZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlZnJlc2hUcmVlUmVzcG9uc2UocmVzLCBoaWdobGlnaHRJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzSW5pdGlhbFJlbmRlciAmJiBtZXRhNjQudXJsQ21kID09IFwiYWRkTm9kZVwiICYmIG1ldGE2NC5ob21lTm9kZU92ZXJyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdC5lZGl0TW9kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobWV0YTY0LmN1cnJlbnROb2RlLnVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBmaXJzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGZpcnN0UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBsb2FkUGFnZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IHByZXZQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBwcmV2UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgLT0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgICAgIGlmIChuYXYubWFpbk9mZnNldCA8IDApIHtcclxuICAgICAgICAgICAgICAgIG5hdi5tYWluT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsb2FkUGFnZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBleHBvcnQgbGV0IG5leHRQYWdlID0gZnVuY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBuZXh0UGFnZSBRdWVyeVwiKTtcclxuICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgKz0gbmF2LlJPV1NfUEVSX1BBR0U7XHJcbiAgICAgICAgICAgIGxvYWRQYWdlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgbGFzdFBhZ2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIGxhc3RQYWdlIFF1ZXJ5XCIpO1xyXG4gICAgICAgICAgICAvL25hdi5tYWluT2Zmc2V0ICs9IG5hdi5ST1dTX1BFUl9QQUdFO1xyXG4gICAgICAgICAgICBsb2FkUGFnZSh0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsb2FkUGFnZSA9IGZ1bmN0aW9uKGdvVG9MYXN0UGFnZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW5kZXJOb2RlUmVxdWVzdCwganNvbi5SZW5kZXJOb2RlUmVzcG9uc2U+KFwicmVuZGVyTm9kZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBtZXRhNjQuY3VycmVudE5vZGVJZCxcclxuICAgICAgICAgICAgICAgIFwidXBMZXZlbFwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIFwib2Zmc2V0XCI6IG5hdi5tYWluT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgXCJnb1RvTGFzdFBhZ2VcIjogZ29Ub0xhc3RQYWdlXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5SZW5kZXJOb2RlUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnb1RvTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLm9mZnNldE9mTm9kZUZvdW5kID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2Lm1haW5PZmZzZXQgPSByZXMub2Zmc2V0T2ZOb2RlRm91bmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRyZWVSZXNwb25zZShyZXMsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9kby0zOiB0aGlzIHNjcm9sbGluZyBpcyBzbGlnaHRseSBpbXBlcmZlY3QuIHNvbWV0aW1lcyB0aGUgY29kZSBzd2l0Y2hlcyB0byBhIHRhYiwgd2hpY2ggdHJpZ2dlcnNcclxuICAgICAgICAgKiBzY3JvbGxUb1RvcCwgYW5kIHRoZW4gc29tZSBvdGhlciBjb2RlIHNjcm9sbHMgdG8gYSBzcGVjaWZpYyBsb2NhdGlvbiBhIGZyYWN0aW9uIG9mIGEgc2Vjb25kIGxhdGVyLiB0aGVcclxuICAgICAgICAgKiAncGVuZGluZycgYm9vbGVhbiBoZXJlIGlzIGEgY3J1dGNoIGZvciBub3cgdG8gaGVscCB2aXN1YWwgYXBwZWFsIChpLmUuIHN0b3AgaWYgZnJvbSBzY3JvbGxpbmcgdG8gb25lIHBsYWNlXHJcbiAgICAgICAgICogYW5kIHRoZW4gc2Nyb2xsaW5nIHRvIGEgZGlmZmVyZW50IHBsYWNlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgbGF0ZXIpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGxldCBzY3JvbGxUb1NlbGVjdGVkTm9kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1NlbE5vZGVQZW5kaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVsbTogYW55ID0gbmF2LmdldFNlbGVjdGVkUG9seUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbG0gJiYgZWxtLm5vZGUgJiYgdHlwZW9mIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgY291bGRuJ3QgZmluZCBhIHNlbGVjdGVkIG5vZGUgb24gdGhpcyBwYWdlLCBzY3JvbGwgdG9cclxuICAgICAgICAgICAgICAgIC8vIHRvcCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNtYWluQ29udGFpbmVyXCIpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RvZG8tMDogcmVtb3ZlZCBtYWluUGFwZXJUYWJzIGZyb20gdmlzaWJpbGl0eSwgYnV0IHdoYXQgY29kZSBzaG91bGQgZ28gaGVyZSBub3c/XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxtID0gdXRpbC5wb2x5RWxtKFwibWFpblBhcGVyVGFic1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxtICYmIGVsbS5ub2RlICYmIHR5cGVvZiBlbG0ubm9kZS5zY3JvbGxJbnRvVmlldyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVsbS5ub2RlLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgc2Nyb2xsVG9Ub3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvU2VsTm9kZVBlbmRpbmcpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvL2xldCBlID0gJChcIiNtYWluQ29udGFpbmVyXCIpO1xyXG4gICAgICAgICAgICAkKFwiI21haW5Db250YWluZXJcIikuc2Nyb2xsVG9wKDApO1xyXG5cclxuICAgICAgICAgICAgLy90b2RvLTA6IG5vdCB1c2luZyBtYWluUGFwZXJUYWJzIGFueSBsb25nZXIgc28gc2h3IHNob3VsZCBnbyBoZXJlIG5vdyA/XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVG9TZWxOb2RlUGVuZGluZylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAkKFwiI21haW5Db250YWluZXJcIikuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdEVkaXRQYXRoRGlzcGxheUJ5SWQgPSBmdW5jdGlvbihkb21JZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gZWRpdC5lZGl0Tm9kZTtcclxuICAgICAgICAgICAgbGV0IGU6IGFueSA9ICQoXCIjXCIgKyBkb21JZCk7XHJcbiAgICAgICAgICAgIGlmICghZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgZS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgZS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aERpc3BsYXkgPSBcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgobm9kZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdG9kby0yOiBEbyB3ZSByZWFsbHkgbmVlZCBJRCBpbiBhZGRpdGlvbiB0byBQYXRoIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAvLyBwYXRoRGlzcGxheSArPSBcIjxicj5JRDogXCIgKyBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmxhc3RNb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhEaXNwbGF5ICs9IFwiPGJyPk1vZDogXCIgKyBub2RlLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGUuaHRtbChwYXRoRGlzcGxheSk7XHJcbiAgICAgICAgICAgICAgICBlLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXhwb3J0IGxldCBzaG93U2VydmVySW5mbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXRTZXJ2ZXJJbmZvUmVxdWVzdCwganNvbi5HZXRTZXJ2ZXJJbmZvUmVzcG9uc2U+KFwiZ2V0U2VydmVySW5mb1wiLCB7fSwgZnVuY3Rpb24ocmVzOiBqc29uLkdldFNlcnZlckluZm9SZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKHJlcy5zZXJ2ZXJJbmZvKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogbWVudVBhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIG1lbnVQYW5lbCB7XHJcblxyXG4gICAgICAgIGxldCBtYWtlVG9wTGV2ZWxNZW51ID0gZnVuY3Rpb24odGl0bGU6IHN0cmluZywgY29udGVudDogc3RyaW5nLCBpZD86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwYXBlckl0ZW1BdHRycyA9IHtcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcIm1lbnUtdHJpZ2dlclwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgcGFwZXJJdGVtID0gcmVuZGVyLnRhZyhcInBhcGVyLWl0ZW1cIiwgcGFwZXJJdGVtQXR0cnMsIHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwYXBlclN1Ym1lbnVBdHRycyA9IHtcclxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogdGl0bGUsXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGFibGVcIjogXCJcIlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAoPGFueT5wYXBlclN1Ym1lbnVBdHRycykuaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1zdWJtZW51XCIsIHBhcGVyU3VibWVudUF0dHJzXHJcbiAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgIC8vXCJsYWJlbFwiOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1ldGE2NC1tZW51LWhlYWRpbmdcIixcclxuICAgICAgICAgICAgICAgIC8vXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0XCJcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLCBwYXBlckl0ZW0gKyAvL1wiPHBhcGVyLWl0ZW0gY2xhc3M9J21lbnUtdHJpZ2dlcic+XCIgKyB0aXRsZSArIFwiPC9wYXBlci1pdGVtPlwiICsgLy9cclxuICAgICAgICAgICAgICAgIG1ha2VTZWNvbmRMZXZlbExpc3QoY29udGVudCksIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1ha2VTZWNvbmRMZXZlbExpc3QgPSBmdW5jdGlvbihjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyLnRhZyhcInBhcGVyLW1lbnVcIiwge1xyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1lbnUtY29udGVudCBzdWJsaXN0IG15LW1lbnUtc2VjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RhYmxlXCI6IFwiXCJcclxuICAgICAgICAgICAgICAgIC8vLFxyXG4gICAgICAgICAgICAgICAgLy9cIm11bHRpXCI6IFwibXVsdGlcIlxyXG4gICAgICAgICAgICB9LCBjb250ZW50LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtZW51SXRlbSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgb25DbGljazogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pdGVtXCIsIHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogb25DbGljayxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiBcIlwiXHJcbiAgICAgICAgICAgIH0sIG5hbWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRvbUlkOiBzdHJpbmcgPSBcIm1haW5BcHBNZW51XCI7XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgYnVpbGQgPSBmdW5jdGlvbigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEkgZW5kZWQgdXAgbm90IHJlYWxseSBsaWtpbmcgdGhpcyB3YXkgb2Ygc2VsZWN0aW5nIHRhYnMuIEkgY2FuIGp1c3QgdXNlIG5vcm1hbCBwb2x5bWVyIHRhYnMuXHJcbiAgICAgICAgICAgIC8vIHZhciBwYWdlTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiTWFpblwiLCBcIm1haW5QYWdlQnV0dG9uXCIsIFwibTY0Lm1ldGE2NC5zZWxlY3RUYWIoJ21haW5UYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiU2VhcmNoXCIsIFwic2VhcmNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQuc2VsZWN0VGFiKCdzZWFyY2hUYWJOYW1lJyk7XCIpICsgLy9cclxuICAgICAgICAgICAgLy8gICAgIG1lbnVJdGVtKFwiVGltZWxpbmVcIiwgXCJ0aW1lbGluZVBhZ2VCdXR0b25cIiwgXCJtNjQubWV0YTY0LnNlbGVjdFRhYigndGltZWxpbmVUYWJOYW1lJyk7XCIpO1xyXG4gICAgICAgICAgICAvLyB2YXIgcGFnZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiUGFnZVwiLCBwYWdlTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByc3NJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZlZWRzXCIsIFwibWFpbk1lbnVSc3NcIiwgXCJtNjQubmF2Lm9wZW5Sc3NGZWVkc05vZGUoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBtYWluTWVudVJzcyA9IG1ha2VUb3BMZXZlbE1lbnUoXCJSU1NcIiwgcnNzSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVkaXRNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVcIiwgXCJjcmVhdGVOb2RlQnV0dG9uXCIsIFwibTY0LmVkaXQuY3JlYXRlTm9kZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlbmFtZVwiLCBcInJlbmFtZU5vZGVQZ0J1dHRvblwiLCBcIihuZXcgbTY0LlJlbmFtZU5vZGVEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkN1dFwiLCBcImN1dFNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuY3V0U2VsTm9kZXMoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJQYXN0ZVwiLCBcInBhc3RlU2VsTm9kZXNCdXR0b25cIiwgXCJtNjQuZWRpdC5wYXN0ZVNlbE5vZGVzKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiQ2xlYXIgU2VsZWN0aW9uc1wiLCBcImNsZWFyU2VsZWN0aW9uc0J1dHRvblwiLCBcIm02NC5lZGl0LmNsZWFyU2VsZWN0aW9ucygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkltcG9ydFwiLCBcIm9wZW5JbXBvcnREbGdcIiwgXCIobmV3IG02NC5JbXBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkV4cG9ydFwiLCBcIm9wZW5FeHBvcnREbGdcIiwgXCIobmV3IG02NC5FeHBvcnREbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZVwiLCBcImRlbGV0ZVNlbE5vZGVzQnV0dG9uXCIsIFwibTY0LmVkaXQuZGVsZXRlU2VsTm9kZXMoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBlZGl0TWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJFZGl0XCIsIGVkaXRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1vdmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJVcFwiLCBcIm1vdmVOb2RlVXBCdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVVwKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiRG93blwiLCBcIm1vdmVOb2RlRG93bkJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlRG93bigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcInRvIFRvcFwiLCBcIm1vdmVOb2RlVG9Ub3BCdXR0b25cIiwgXCJtNjQuZWRpdC5tb3ZlTm9kZVRvVG9wKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwidG8gQm90dG9tXCIsIFwibW92ZU5vZGVUb0JvdHRvbUJ1dHRvblwiLCBcIm02NC5lZGl0Lm1vdmVOb2RlVG9Cb3R0b20oKTtcIik7Ly9cclxuICAgICAgICAgICAgdmFyIG1vdmVNZW51ID0gbWFrZVRvcExldmVsTWVudShcIk1vdmVcIiwgbW92ZU1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXR0YWNobWVudE1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIEZpbGVcIiwgXCJ1cGxvYWRGcm9tRmlsZUJ1dHRvblwiLCBcIm02NC5hdHRhY2htZW50Lm9wZW5VcGxvYWRGcm9tRmlsZURsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlVwbG9hZCBmcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5vcGVuVXBsb2FkRnJvbVVybERsZygpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkRlbGV0ZSBBdHRhY2htZW50XCIsIFwiZGVsZXRlQXR0YWNobWVudHNCdXR0b25cIiwgXCJtNjQuYXR0YWNobWVudC5kZWxldGVBdHRhY2htZW50KCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgYXR0YWNobWVudE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiQXR0YWNoXCIsIGF0dGFjaG1lbnRNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNoYXJpbmdNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJFZGl0IE5vZGUgU2hhcmluZ1wiLCBcImVkaXROb2RlU2hhcmluZ0J1dHRvblwiLCBcIm02NC5zaGFyZS5lZGl0Tm9kZVNoYXJpbmcoKTtcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJGaW5kIFNoYXJlZCBTdWJub2Rlc1wiLCBcImZpbmRTaGFyZWROb2Rlc0J1dHRvblwiLCBcIm02NC5zaGFyZS5maW5kU2hhcmVkTm9kZXMoKTtcIik7XHJcbiAgICAgICAgICAgIHZhciBzaGFyaW5nTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJTaGFyZVwiLCBzaGFyaW5nTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDb250ZW50XCIsIFwiY29udGVudFNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaENvbnRlbnREbGcoKSkub3BlbigpO1wiKSArLy9cclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBtYWtlIGEgdmVyc2lvbiBvZiB0aGUgZGlhbG9nIHRoYXQgZG9lcyBhIHRhZyBzZWFyY2hcclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVGFnc1wiLCBcInRhZ1NlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaFRhZ3NEbGcoKSkub3BlbigpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkZpbGVzXCIsIFwiZmlsZVNlYXJjaERsZ0J1dHRvblwiLCBcIihuZXcgbTY0LlNlYXJjaEZpbGVzRGxnKHRydWUpKS5vcGVuKCk7XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlYXJjaE1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiU2VhcmNoXCIsIHNlYXJjaE1lbnVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGltZWxpbmVNZW51SXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJDcmVhdGVkXCIsIFwidGltZWxpbmVDcmVhdGVkQnV0dG9uXCIsIFwibTY0LnNyY2gudGltZWxpbmVCeUNyZWF0ZVRpbWUoKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1vZGlmaWVkXCIsIFwidGltZWxpbmVNb2RpZmllZEJ1dHRvblwiLCBcIm02NC5zcmNoLnRpbWVsaW5lQnlNb2RUaW1lKCk7XCIpOy8vXHJcbiAgICAgICAgICAgIHZhciB0aW1lbGluZU1lbnUgPSBtYWtlVG9wTGV2ZWxNZW51KFwiVGltZWxpbmVcIiwgdGltZWxpbmVNZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudUl0ZW1zID0gLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiVG9nZ2xlIFByb3BlcnRpZXNcIiwgXCJwcm9wc1RvZ2dsZUJ1dHRvblwiLCBcIm02NC5wcm9wcy5wcm9wc1RvZ2dsZSgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlJlZnJlc2hcIiwgXCJyZWZyZXNoUGFnZUJ1dHRvblwiLCBcIm02NC5tZXRhNjQucmVmcmVzaCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlNob3cgVVJMXCIsIFwic2hvd0Z1bGxOb2RlVXJsQnV0dG9uXCIsIFwibTY0LnJlbmRlci5zaG93Tm9kZVVybCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIlByZWZlcmVuY2VzXCIsIFwiYWNjb3VudFByZWZlcmVuY2VzQnV0dG9uXCIsIFwiKG5ldyBtNjQuUHJlZnNEbGcoKSkub3BlbigpO1wiKTsgLy9cclxuICAgICAgICAgICAgdmFyIHZpZXdPcHRpb25zTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJWaWV3XCIsIHZpZXdPcHRpb25zTWVudUl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdPUksgSU4gUFJPR1JFU1MgKCBkbyBub3QgZGVsZXRlKVxyXG4gICAgICAgICAgICAvLyB2YXIgZmlsZVN5c3RlbU1lbnVJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlJlaW5kZXhcIiwgXCJmaWxlU3lzUmVpbmRleEJ1dHRvblwiLCBcIm02NC5zeXN0ZW1mb2xkZXIucmVpbmRleCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIC8vICAgICBtZW51SXRlbShcIlNlYXJjaFwiLCBcImZpbGVTeXNTZWFyY2hCdXR0b25cIiwgXCJtNjQuc3lzdGVtZm9sZGVyLnNlYXJjaCgpO1wiKTsgLy9cclxuICAgICAgICAgICAgLy8gICAgIC8vbWVudUl0ZW0oXCJCcm93c2VcIiwgXCJmaWxlU3lzQnJvd3NlQnV0dG9uXCIsIFwibTY0LnN5c3RlbWZvbGRlci5icm93c2UoKTtcIik7XHJcbiAgICAgICAgICAgIC8vIHZhciBmaWxlU3lzdGVtTWVudSA9IG1ha2VUb3BMZXZlbE1lbnUoXCJGaWxlU3lzXCIsIGZpbGVTeXN0ZW1NZW51SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogd2hhdGV2ZXIgaXMgY29tbWVudGVkIGlzIG9ubHkgY29tbWVudGVkIGZvciBwb2x5bWVyIGNvbnZlcnNpb25cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkNoYW5nZSBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkUGdCdXR0b25cIiwgXCIobmV3IG02NC5DaGFuZ2VQYXNzd29yZERsZygpKS5vcGVuKCk7XCIpICsgLy9cclxuICAgICAgICAgICAgICAgIG1lbnVJdGVtKFwiTWFuYWdlIEFjY291bnRcIiwgXCJtYW5hZ2VBY2NvdW50QnV0dG9uXCIsIFwiKG5ldyBtNjQuTWFuYWdlQWNjb3VudERsZygpKS5vcGVuKCk7XCIpOyAvL1xyXG5cclxuICAgICAgICAgICAgLy8gbWVudUl0ZW0oXCJGdWxsIFJlcG9zaXRvcnkgRXhwb3J0XCIsIFwiZnVsbFJlcG9zaXRvcnlFeHBvcnRcIiwgXCJcclxuICAgICAgICAgICAgLy8gZWRpdC5mdWxsUmVwb3NpdG9yeUV4cG9ydCgpO1wiKSArIC8vXHJcbiAgICAgICAgICAgIHZhciBteUFjY291bnRNZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFjY291bnRcIiwgbXlBY2NvdW50SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGFkbWluSXRlbXMgPSAvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJHZW5lcmF0ZSBSU1NcIiwgXCJnZW5lcmF0ZVJTU0J1dHRvblwiLCBcIm02NC5wb2RjYXN0LmdlbmVyYXRlUlNTKCk7XCIpICsvL1xyXG4gICAgICAgICAgICAgICAgbWVudUl0ZW0oXCJTZXJ2ZXIgSW5mb1wiLCBcInNob3dTZXJ2ZXJJbmZvQnV0dG9uXCIsIFwibTY0LnZpZXcuc2hvd1NlcnZlckluZm8oKTtcIikgKy8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIkluc2VydCBCb29rOiBXYXIgYW5kIFBlYWNlXCIsIFwiaW5zZXJ0Qm9va1dhckFuZFBlYWNlQnV0dG9uXCIsIFwibTY0LmVkaXQuaW5zZXJ0Qm9va1dhckFuZFBlYWNlKCk7XCIpOyAvL1xyXG4gICAgICAgICAgICB2YXIgYWRtaW5NZW51ID0gbWFrZVRvcExldmVsTWVudShcIkFkbWluXCIsIGFkbWluSXRlbXMsIFwiYWRtaW5NZW51XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlbHBJdGVtcyA9IC8vXHJcbiAgICAgICAgICAgICAgICBtZW51SXRlbShcIk1haW4gTWVudSBIZWxwXCIsIFwibWFpbk1lbnVIZWxwXCIsIFwibTY0Lm5hdi5vcGVuTWFpbk1lbnVIZWxwKCk7XCIpO1xyXG4gICAgICAgICAgICB2YXIgbWFpbk1lbnVIZWxwID0gbWFrZVRvcExldmVsTWVudShcIkhlbHAvRG9jc1wiLCBoZWxwSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAvKiBwYWdlTWVudSsgKi8gbWFpbk1lbnVSc3MgKyBlZGl0TWVudSArIG1vdmVNZW51ICsgYXR0YWNobWVudE1lbnUgKyBzaGFyaW5nTWVudSArIHZpZXdPcHRpb25zTWVudSAvKiArIGZpbGVTeXN0ZW1NZW51ICovICsgc2VhcmNoTWVudSArIHRpbWVsaW5lTWVudSArIG15QWNjb3VudE1lbnVcclxuICAgICAgICAgICAgICAgICsgYWRtaW5NZW51ICsgbWFpbk1lbnVIZWxwO1xyXG5cclxuICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGRvbUlkLCBjb250ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV4cG9ydCBsZXQgaW5pdCA9IGZ1bmN0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBtZXRhNjQucmVmcmVzaEFsbEd1aUVuYWJsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogcG9kY2FzdC5qc1wiKTtcblxuLypcbk5PVEU6IFRoZSBBdWRpb1BsYXllckRsZyBBTkQgdGhpcyBzaW5nbGV0b24taXNoIGNsYXNzIGJvdGggc2hhcmUgc29tZSBzdGF0ZSBhbmQgY29vcGVyYXRlXG5cblJlZmVyZW5jZTogaHR0cHM6Ly93d3cudzMub3JnLzIwMTAvMDUvdmlkZW8vbWVkaWFldmVudHMuaHRtbFxuKi9cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBuYW1lc3BhY2UgcG9kY2FzdCB7XG4gICAgICAgIGV4cG9ydCBsZXQgcGxheWVyOiBhbnkgPSBudWxsO1xuICAgICAgICBleHBvcnQgbGV0IHN0YXJ0VGltZVBlbmRpbmc6IG51bWJlciA9IG51bGw7XG5cbiAgICAgICAgbGV0IHVpZDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBudWxsO1xuICAgICAgICBsZXQgYWRTZWdtZW50czogQWRTZWdtZW50W10gPSBudWxsO1xuXG4gICAgICAgIGxldCBwdXNoVGltZXI6IGFueSA9IG51bGw7XG5cbiAgICAgICAgZXhwb3J0IGxldCBnZW5lcmF0ZVJTUyA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2VuZXJhdGVSU1NSZXF1ZXN0LCBqc29uLkdlbmVyYXRlUlNTUmVzcG9uc2U+KFwiZ2VuZXJhdGVSU1NcIiwge1xuICAgICAgICAgICAgfSwgZ2VuZXJhdGVSU1NSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ2VuZXJhdGVSU1NSZXNwb25zZSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgYWxlcnQoJ3JzcyBjb21wbGV0ZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRmVlZE5vZGUgPSBmdW5jdGlvbihub2RlOiBqc29uLk5vZGVJbmZvLCByb3dTdHlsaW5nOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCByZXQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQgdGl0bGU6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWRUaXRsZVwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCBkZXNjOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NGZWVkRGVzY1wiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCBpbWdVcmw6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0ZlZWRJbWFnZVVybFwiLCBub2RlKTtcblxuICAgICAgICAgICAgbGV0IGZlZWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgdGl0bGUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgICAgICBmZWVkICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCBkZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgZmVlZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImpjci1yb290LWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGZlZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW1nVXJsKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwibWF4LXdpZHRoOiAyMDBweDtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzcmNcIjogaW1nVXJsLnZhbHVlXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBnZXRNZWRpYVBsYXllclVybEZyb21Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbyk6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgbGluazoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbUxpbmtcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAobGluayAmJiBsaW5rLnZhbHVlICYmIHV0aWwuY29udGFpbnMobGluay52YWx1ZS50b0xvd2VyQ2FzZSgpLCBcIi5tcDNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluay52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHVyaToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLCBub2RlKTtcbiAgICAgICAgICAgIGlmICh1cmkgJiYgdXJpLnZhbHVlICYmIHV0aWwuY29udGFpbnModXJpLnZhbHVlLnRvTG93ZXJDYXNlKCksIFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cmkudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBlbmNVcmw6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1FbmNVcmxcIiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAoZW5jVXJsICYmIGVuY1VybC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBlbmNUeXBlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtRW5jVHlwZVwiLCBub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZW5jVHlwZSAmJiBlbmNUeXBlLnZhbHVlICYmIHV0aWwuc3RhcnRzV2l0aChlbmNUeXBlLnZhbHVlLCBcImF1ZGlvL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jVXJsLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHJlbmRlckl0ZW1Ob2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IHJzc1RpdGxlOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtVGl0bGVcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzRGVzYzoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbURlc2NcIiwgbm9kZSk7XG4gICAgICAgICAgICBsZXQgcnNzQXV0aG9yOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc0xpbms6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwibWV0YTY0OnJzc0l0ZW1MaW5rXCIsIG5vZGUpO1xuICAgICAgICAgICAgbGV0IHJzc1VyaToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVVyaVwiLCBub2RlKTtcblxuICAgICAgICAgICAgbGV0IGVudHJ5OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocnNzTGluayAmJiByc3NMaW5rLnZhbHVlICYmIHJzc1RpdGxlICYmIHJzc1RpdGxlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcImFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImhyZWZcIjogcnNzTGluay52YWx1ZVxuICAgICAgICAgICAgICAgIH0sIHJlbmRlci50YWcoXCJoM1wiLCB7fSwgcnNzVGl0bGUudmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHBsYXllclVybCA9IGdldE1lZGlhUGxheWVyVXJsRnJvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICBpZiAocGxheWVyVXJsKSB7XG4gICAgICAgICAgICAgICAgZW50cnkgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0Lm9wZW5QbGF5ZXJEaWFsb2coJ1wiICsgbm9kZS51aWQgKyBcIicpO1wiLFxuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgICAgIH0sIC8vXG4gICAgICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJzc0Rlc2MgJiYgcnNzRGVzYy52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVudHJ5ICs9IHJlbmRlci50YWcoXCJwXCIsIHtcbiAgICAgICAgICAgICAgICB9LCByc3NEZXNjLnZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJzc0F1dGhvciAmJiByc3NBdXRob3IudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICB9LCBcIkJ5OiBcIiArIHJzc0F1dGhvci52YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdHlsaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH0sIGVudHJ5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZW50cnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdGZWVkTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZFRpdGxlXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZERlc2NcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkTGlua1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0ZlZWRVcmlcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NGZWVkU3JjXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzRmVlZEltYWdlVXJsXCJdO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBwcm9wT3JkZXJpbmdJdGVtTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cnNzSXRlbURlc2NcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtTGlua1wiLFxuICAgICAgICAgICAgICAgIFwibWV0YTY0OnJzc0l0ZW1VcmlcIixcbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpyc3NJdGVtQXV0aG9yXCJdO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBvcGVuUGxheWVyRGlhbG9nID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICB1aWQgPSBfdWlkO1xuICAgICAgICAgICAgbm9kZSA9IG1ldGE2NC51aWRUb05vZGVNYXBbdWlkXTtcblxuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbXAzVXJsID0gZ2V0TWVkaWFQbGF5ZXJVcmxGcm9tTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAobXAzVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkdldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLkdldFBsYXllckluZm9SZXNwb25zZT4oXCJnZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidXJsXCI6IG1wM1VybFxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uR2V0UGxheWVySW5mb1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFVpZCh1aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRsZyA9IG5ldyBBdWRpb1BsYXllckRsZyhtcDNVcmwsIHVpZCwgcmVzLnRpbWVPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VWlkID0gZnVuY3Rpb24oX3VpZDogc3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBhZFNlZ3M6IGpzb24uUHJvcGVydHlJbmZvID0gcHJvcHMuZ2V0Tm9kZVByb3BlcnR5KFwiYWQtc2VnbWVudHNcIiwgbm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFkU2Vncykge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZUFkU2VnbWVudFRleHQoYWRTZWdzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgbm9kZSB1aWQ6IFwiICsgdWlkO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlQWRTZWdtZW50VGV4dCA9IGZ1bmN0aW9uKGFkU2Vnczogc3RyaW5nKSB7XG4gICAgICAgICAgICBhZFNlZ21lbnRzID0gW107XG5cbiAgICAgICAgICAgIGxldCBzZWdMaXN0OiBzdHJpbmdbXSA9IGFkU2Vncy5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBzZWdMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlZ1RpbWVzOiBzdHJpbmdbXSA9IHNlZy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgaWYgKHNlZ1RpbWVzLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW52YWxpZCB0aW1lIHJhbmdlOiBcIiArIHNlZyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBiZWdpblNlY3M6IG51bWJlciA9IGNvbnZlcnRUb1NlY29uZHMoc2VnVGltZXNbMF0pO1xuICAgICAgICAgICAgICAgIGxldCBlbmRTZWNzOiBudW1iZXIgPSBjb252ZXJ0VG9TZWNvbmRzKHNlZ1RpbWVzWzFdKTtcblxuICAgICAgICAgICAgICAgIGFkU2VnbWVudHMucHVzaChuZXcgQWRTZWdtZW50KGJlZ2luU2VjcywgZW5kU2VjcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogY29udmVydCBmcm9tIGZvbXJhdCBcIm1pbnV0ZXM6c2Vjb250c1wiIHRvIGFic29sdXRlIG51bWJlciBvZiBzZWNvbmRzXG4gICAgICAgICpcbiAgICAgICAgKiB0b2RvLTA6IG1ha2UgdGhpcyBhY2NlcHQganVzdCBzZWNvbmRzLCBvciBtaW46c2VjLCBvciBob3VyOm1pbjpzZWMsIGFuZCBiZSBhYmxlIHRvXG4gICAgICAgICogcGFyc2UgYW55IG9mIHRoZW0gY29ycmVjdGx5LlxuICAgICAgICAqL1xuICAgICAgICBsZXQgY29udmVydFRvU2Vjb25kcyA9IGZ1bmN0aW9uKHRpbWVWYWw6IHN0cmluZykge1xuICAgICAgICAgICAgLyogZW5kIHRpbWUgaXMgZGVzaWduYXRlZCB3aXRoIGFzdGVyaXNrIGJ5IHVzZXIsIGFuZCByZXByZXNlbnRlZCBieSAtMSBpbiB2YXJpYWJsZXMgKi9cbiAgICAgICAgICAgIGlmICh0aW1lVmFsID09ICcqJykgcmV0dXJuIC0xO1xuICAgICAgICAgICAgbGV0IHRpbWVQYXJ0czogc3RyaW5nW10gPSB0aW1lVmFsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgICAgIGlmICh0aW1lUGFydHMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWQgdGltZSB2YWx1ZTogXCIgKyB0aW1lVmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWludXRlcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzBdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IG5ldyBOdW1iZXIodGltZVBhcnRzWzFdKS52YWx1ZU9mKCk7XG4gICAgICAgICAgICByZXR1cm4gbWludXRlcyAqIDYwICsgc2Vjb25kcztcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVzdG9yZVN0YXJ0VGltZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogbWFrZXMgcGxheWVyIGFsd2F5cyBzdGFydCB3aGVyZXZlciB0aGUgdXNlciBsYXN0IHdhcyB3aGVuIHRoZXkgY2xpY2tlZCBcInBhdXNlXCIgKi9cbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgc3RhcnRUaW1lUGVuZGluZykge1xuICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50VGltZSA9IHN0YXJ0VGltZVBlbmRpbmc7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lUGVuZGluZyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IG9uQ2FuUGxheSA9IGZ1bmN0aW9uKHVpZDogc3RyaW5nLCBlbG06IGFueSk6IHZvaWQge1xuICAgICAgICAgICAgcGxheWVyID0gZWxtO1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgb25UaW1lVXBkYXRlID0gZnVuY3Rpb24odWlkOiBzdHJpbmcsIGVsbTogYW55KTogdm9pZCB7XG4gICAgICAgICAgICBpZiAoIXB1c2hUaW1lcikge1xuICAgICAgICAgICAgICAgIC8qIHBpbmcgc2VydmVyIG9uY2UgZXZlcnkgZml2ZSBtaW51dGVzICovXG4gICAgICAgICAgICAgICAgcHVzaFRpbWVyID0gc2V0SW50ZXJ2YWwocHVzaFRpbWVyRnVuY3Rpb24sIDUgKiA2MCAqIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkN1cnJlbnRUaW1lPVwiICsgZWxtLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIHBsYXllciA9IGVsbTtcblxuICAgICAgICAgICAgLyogdG9kby0xOiB3ZSBjYWxsIHJlc3RvcmVTdGFydFRpbWUgdXBvbiBsb2FkaW5nIG9mIHRoZSBjb21wb25lbnQgYnV0IGl0IGRvZXNuJ3Qgc2VlbSB0byBoYXZlIHRoZSBlZmZlY3QgZG9pbmcgYW55dGhpbmcgYXQgYWxsXG4gICAgICAgICAgICBhbmQgY2FuJ3QgZXZlbiB1cGRhdGUgdGhlIHNsaWRlciBkaXNwbGF5ZWQgcG9zaXRpb24sIHVudGlsIHBsYXlpbnMgaXMgU1RBUlRFRC4gTmVlZCB0byBjb21lIGJhY2sgYW5kIGZpeCB0aGlzIGJlY2F1c2UgdXNlcnNcbiAgICAgICAgICAgIGN1cnJlbnRseSBoYXZlIHRoZSBnbGl0Y2ggb2YgYWx3YXlzIGhlYXJpbmcgdGhlIGZpcnN0IGZyYWN0aW9uIG9mIGEgc2Vjb25kIG9mIHZpZGVvLCB3aGljaCBvZiBjb3Vyc2UgYW5vdGhlciB3YXkgdG8gZml4XG4gICAgICAgICAgICB3b3VsZCBiZSBieSBhbHRlcmluZyB0aGUgdm9sdW1uIHRvIHplcm8gdW50aWwgcmVzdG9yZVN0YXJ0VGltZSBoYXMgZ29uZSBpbnRvIGVmZmVjdCAqL1xuICAgICAgICAgICAgcmVzdG9yZVN0YXJ0VGltZSgpO1xuXG4gICAgICAgICAgICBpZiAoIWFkU2VnbWVudHMpIHJldHVybjtcbiAgICAgICAgICAgIGZvciAobGV0IHNlZyBvZiBhZFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgLyogZW5kVGltZSBvZiAtMSBtZWFucyB0aGUgcmVzdCBvZiB0aGUgbWVkaWEgc2hvdWxkIGJlIGNvbnNpZGVyZWQgQURzICovXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5jdXJyZW50VGltZSA+PSBzZWcuYmVnaW5UaW1lICYmIC8vXG4gICAgICAgICAgICAgICAgICAgIChwbGF5ZXIuY3VycmVudFRpbWUgPD0gc2VnLmVuZFRpbWUgfHwgc2VnLmVuZFRpbWUgPCAwKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIGp1bXAgdG8gZW5kIG9mIGF1ZGlvIGlmIHJlc3QgaXMgYW4gYWRkLCB3aXRoIGxvZ2ljIG9mIC0zIHRvIGVuc3VyZSB3ZSBkb24ndFxuICAgICAgICAgICAgICAgICAgICBnbyBpbnRvIGEgbG9vcCBqdW1waW5nIHRvIGVuZCBvdmVyIGFuZCBvdmVyIGFnYWluICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWcuZW5kVGltZSA8IDAgJiYgcGxheWVyLmN1cnJlbnRUaW1lIDwgcGxheWVyLmR1cmF0aW9uIC0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoganVtcCB0byBsYXN0IHRvIHNlY29uZHMgb2YgYXVkaW8sIGknbGwgZG8gdGhpcyBpbnN0ZWFkIG9mIHBhdXNpbmcsIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBhcmUgaXMgbW9yZSBhdWRpbyBhdXRvbWF0aWNhbGx5IGFib3V0IHRvIHBsYXksIHdlIGRvbid0IHdhbnQgdG8gaGFsdCBpdCBhbGwgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBwbGF5ZXIuZHVyYXRpb24gLSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIG9yIGVsc2Ugd2UgYXJlIGluIGEgY29tZXJjaWFsIHNlZ21lbnQgc28ganVtcCB0byBvbmUgc2Vjb25kIHBhc3QgaXQgKi9cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSBzZWcuZW5kVGltZSArIDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kby0wOiBmb3IgcHJvZHVjdGlvbiwgYm9vc3QgdGhpcyB1cCB0byBvbmUgbWludXRlICovXG4gICAgICAgIGV4cG9ydCBsZXQgcHVzaFRpbWVyRnVuY3Rpb24gPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGltZXJcIik7XG4gICAgICAgICAgICAvKiB0aGUgcHVycG9zZSBvZiB0aGlzIHRpbWVyIGlzIHRvIGJlIHN1cmUgdGhlIGJyb3dzZXIgc2Vzc2lvbiBkb2Vzbid0IHRpbWVvdXQgd2hpbGUgdXNlciBpcyBwbGF5aW5nXG4gICAgICAgICAgICBidXQgaWYgdGhlIG1lZGlhIGlzIHBhdXNlZCB3ZSBETyBhbGxvdyBpdCB0byB0aW1lb3V0LiBPdGh3ZXJ3aXNlIGlmIHVzZXIgaXMgbGlzdGVuaW5nIHRvIGF1ZGlvLCB3ZVxuICAgICAgICAgICAgY29udGFjdCB0aGUgc2VydmVyIGR1cmluZyB0aGlzIHRpbWVyIHRvIHVwZGF0ZSB0aGUgdGltZSBvbiB0aGUgc2VydmVyIEFORCBrZWVwIHNlc3Npb24gZnJvbSB0aW1pbmcgb3V0XG5cbiAgICAgICAgICAgIHRvZG8tMDogd291bGQgZXZlcnl0aGluZyB3b3JrIGlmICdwbGF5ZXInIFdBUyB0aGUganF1ZXJ5IG9iamVjdCBhbHdheXMuXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHBsYXllciAmJiAhcGxheWVyLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIC8qIHRoaXMgc2FmZXR5IGNoZWNrIHRvIGJlIHN1cmUgbm8gaGlkZGVuIGF1ZGlvIGNhbiBzdGlsbCBiZSBwbGF5aW5nIHNob3VsZCBubyBsb25nZXIgYmUgbmVlZGVkXG4gICAgICAgICAgICAgICAgbm93IHRoYXQgSSBoYXZlIHRoZSBjbG9zZSBsaXRlbmVyIGV2ZW4gb24gdGhlIGRpYWxvZywgYnV0IGknbGwgbGVhdmUgdGhpcyBoZXJlIGFueXdheS4gQ2FuJ3QgaHVydC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoISQocGxheWVyKS5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2luZyBwbGF5ZXIsIGJlY2F1c2UgaXQgd2FzIGRldGVjdGVkIGFzIG5vdCB2aXNpYmxlLiBwbGF5ZXIgZGlhbG9nIGdldCBoaWRkZW4/XCIpO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkF1dG9zYXZlIHBsYXllciBpbmZvLlwiKTtcbiAgICAgICAgICAgICAgICBzYXZlUGxheWVySW5mbyhwbGF5ZXIuc3JjLCBwbGF5ZXIuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIHBvZGNhc3QgaGFuZGxpbmcgaGFjayBpcyBvbmx5IGluIHRoaXMgZmlsZSB0ZW1wb3JhcmlseVxuICAgICAgICBleHBvcnQgbGV0IHBhdXNlID0gZnVuY3Rpb24oKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgc2F2ZVBsYXllckluZm8ocGxheWVyLnNyYywgcGxheWVyLmN1cnJlbnRUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgZGVzdHJveVBsYXllciA9IGZ1bmN0aW9uKGRsZzogQXVkaW9QbGF5ZXJEbGcpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVQbGF5ZXJJbmZvKHBsYXllci5zcmMsIHBsYXllci5jdXJyZW50VGltZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBsYXllciA9ICQocGxheWVyKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxQbGF5ZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRsZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGxnLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcGxheSA9IGZ1bmN0aW9uKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICAgICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNwZWVkID0gZnVuY3Rpb24ocmF0ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBsYXliYWNrUmF0ZSA9IHJhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgcG9kY2FzdCBoYW5kbGluZyBoYWNrIGlzIG9ubHkgaW4gdGhpcyBmaWxlIHRlbXBvcmFyaWx5XG4gICAgICAgIGV4cG9ydCBsZXQgc2tpcCA9IGZ1bmN0aW9uKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY3VycmVudFRpbWUgKz0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHNhdmVQbGF5ZXJJbmZvID0gZnVuY3Rpb24odXJsOiBzdHJpbmcsIHRpbWVPZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKG1ldGE2NC5pc0Fub25Vc2VyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNldFBsYXllckluZm9SZXF1ZXN0LCBqc29uLlNldFBsYXllckluZm9SZXNwb25zZT4oXCJzZXRQbGF5ZXJJbmZvXCIsIHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB1cmwsXG4gICAgICAgICAgICAgICAgXCJ0aW1lT2Zmc2V0XCI6IHRpbWVPZmZzZXQgLy8sXG4gICAgICAgICAgICAgICAgLy9cIm5vZGVQYXRoXCI6IG5vZGUucGF0aFxuICAgICAgICAgICAgfSwgc2V0UGxheWVySW5mb1Jlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZXRQbGF5ZXJJbmZvUmVzcG9uc2UgPSBmdW5jdGlvbigpOiB2b2lkIHtcbiAgICAgICAgICAgIC8vYWxlcnQoJ3NhdmUgY29tcGxldGUuJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBtNjQucG9kY2FzdC5yZW5kZXJGZWVkTm9kZTtcbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBtNjQucG9kY2FzdC5yZW5kZXJJdGVtTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2ZlZWRcIl0gPSBtNjQucG9kY2FzdC5wcm9wT3JkZXJpbmdGZWVkTm9kZTtcbm02NC5tZXRhNjQucHJvcE9yZGVyaW5nRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OnJzc2l0ZW1cIl0gPSBtNjQucG9kY2FzdC5wcm9wT3JkZXJpbmdJdGVtTm9kZTtcbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IHN5c3RlbWZvbGRlci5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IG5hbWVzcGFjZSBzeXN0ZW1mb2xkZXIge1xuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyTm9kZSA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHJvd1N0eWxpbmc6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICAgICAgbGV0IHJldDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGxldCBwYXRoUHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cGF0aFwiLCBub2RlKTtcbiAgICAgICAgICAgIGxldCBwYXRoOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocGF0aFByb3ApIHtcbiAgICAgICAgICAgICAgICBwYXRoICs9IHJlbmRlci50YWcoXCJoMlwiLCB7XG4gICAgICAgICAgICAgICAgfSwgcGF0aFByb3AudmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBUaGlzIHdhcyBhbiBleHBlcmltZW50IHRvIGxvYWQgYSBub2RlIHByb3BlcnR5IHdpdGggdGhlIHJlc3VsdHMgb2YgYSBkaXJlY3RvcnkgbGlzdGluZywgYnV0IEkgZGVjaWRlZCB0aGF0XG4gICAgICAgICAgICByZWFsbHkgaWYgSSB3YW50IHRvIGhhdmUgYSBmaWxlIGJyb3dzZXIsIHRoZSByaWdodCB3YXkgdG8gZG8gdGhhdCBpcyB0byBoYXZlIGEgZGVkaWNhdGVkIHRhYiB0aGF0IGNhbiBkbyBpdFxuICAgICAgICAgICAganVzdCBsaWtlIHRoZSBvdGhlciB0b3AtbGV2ZWwgdGFicyAqL1xuICAgICAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmdQcm9wOiBqc29uLlByb3BlcnR5SW5mbyA9IHByb3BzLmdldE5vZGVQcm9wZXJ0eShcIm1ldGE2NDpqc29uXCIsIG5vZGUpO1xuICAgICAgICAgICAgLy9sZXQgZmlsZUxpc3RpbmcgPSBmaWxlTGlzdGluZ1Byb3AgPyByZW5kZXIucmVuZGVySnNvbkZpbGVTZWFyY2hSZXN1bHRQcm9wZXJ0eShmaWxlTGlzdGluZ1Byb3AudmFsdWUpIDogXCJcIjtcblxuICAgICAgICAgICAgaWYgKHJvd1N0eWxpbmcpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJqY3ItY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSwgcGF0aCAvKiArIGZpbGVMaXN0aW5nICovKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCAvKiArIGZpbGVMaXN0aW5nICovKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydCBsZXQgcmVuZGVyRmlsZUxpc3ROb2RlID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcm93U3R5bGluZzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgICAgICBsZXQgcmV0OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0UHJvcDoganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoamNyQ25zdC5KU09OX0ZJTEVfU0VBUkNIX1JFU1VMVCwgbm9kZSk7XG4gICAgICAgICAgICBpZiAoc2VhcmNoUmVzdWx0UHJvcCkge1xuICAgICAgICAgICAgICAgIGxldCBqY3JDb250ZW50ID0gcmVuZGVyLnJlbmRlckpzb25GaWxlU2VhcmNoUmVzdWx0UHJvcGVydHkoc2VhcmNoUmVzdWx0UHJvcC52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocm93U3R5bGluZykge1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLWNvbnRlbnRcIlxuICAgICAgICAgICAgICAgICAgICB9LCBqY3JDb250ZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiamNyLXJvb3QtY29udGVudFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBqY3JDb250ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGZpbGVMaXN0UHJvcE9yZGVyaW5nID0gZnVuY3Rpb24obm9kZToganNvbi5Ob2RlSW5mbywgcHJvcGVydGllczoganNvbi5Qcm9wZXJ0eUluZm9bXSk6IGpzb24uUHJvcGVydHlJbmZvW10ge1xuICAgICAgICAgICAgbGV0IHByb3BPcmRlcjogc3RyaW5nW10gPSBbLy9cbiAgICAgICAgICAgICAgICBcIm1ldGE2NDpqc29uXCJdO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvcHMub3JkZXJQcm9wcyhwcm9wT3JkZXIsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZWluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRmlsZVNlYXJjaFJlcXVlc3QsIGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlPihcImZpbGVTZWFyY2hcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzZWxOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInJlaW5kZXhcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWFyY2hUZXh0XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LCByZWluZGV4UmVzcG9uc2UsIHN5c3RlbWZvbGRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IGJyb3dzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gVGhpcyBicm93c2UgZnVuY3Rpb24gd29ya3MsIGJ1dCBpJ20gZGlzYWJsaW5nIGl0LCBmb3Igbm93IGJlY2F1c2Ugd2hhdCBJJ2xsIGJlIGRvaW5nIGluc3RlYWQgaXMgbWFraW5nIGl0XG4gICAgICAgICAgICAvLyBzd2l0Y2ggdG8gYSBGaWxlQnJvd3NlciBUYWIgKG1haW4gdGFiKSB3aGVyZSBicm93c2luZyB3aWxsIGFsbCBiZSBkb25lLiBObyBKQ1Igbm9kZXMgd2lsbCBiZSB1cGRhdGVkIGR1cmluZ1xuICAgICAgICAgICAgLy8gdGhlIHByb2Nlc3Mgb2YgYnJvd3NpbmcgYW5kIGVkaXRpbmcgZmlsZXMgb24gdGhlIHNlcnZlci5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBsZXQgc2VsTm9kZToganNvbi5Ob2RlSW5mbyA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIC8vIGlmIChzZWxOb2RlKSB7XG4gICAgICAgICAgICAvLyAgICAgdXRpbC5qc29uPGpzb24uQnJvd3NlRm9sZGVyUmVxdWVzdCwganNvbi5Ccm93c2VGb2xkZXJSZXNwb25zZT4oXCJicm93c2VGb2xkZXJcIiwge1xuICAgICAgICAgICAgLy8gICAgICAgICBcIm5vZGVJZFwiOiBzZWxOb2RlLnBhdGhcbiAgICAgICAgICAgIC8vICAgICB9LCBzeXN0ZW1mb2xkZXIucmVmcmVzaFJlc3BvbnNlLCBzeXN0ZW1mb2xkZXIpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZWZyZXNoUmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uQnJvd3NlRm9sZGVyUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vbmF2Lm1haW5PZmZzZXQgPSAwO1xuICAgICAgICAgICAgLy8gdXRpbC5qc29uPGpzb24uUmVuZGVyTm9kZVJlcXVlc3QsIGpzb24uUmVuZGVyTm9kZVJlc3BvbnNlPihcInJlbmRlck5vZGVcIiwge1xuICAgICAgICAgICAgLy8gICAgIFwibm9kZUlkXCI6IHJlcy5zZWFyY2hSZXN1bHROb2RlSWQsXG4gICAgICAgICAgICAvLyAgICAgXCJ1cExldmVsXCI6IG51bGwsXG4gICAgICAgICAgICAvLyAgICAgXCJyZW5kZXJQYXJlbnRJZkxlYWZcIjogbnVsbCxcbiAgICAgICAgICAgIC8vICAgICBcIm9mZnNldFwiOiAwLFxuICAgICAgICAgICAgLy8gICAgIFwiZ29Ub0xhc3RQYWdlXCIgOiBmYWxzZVxuICAgICAgICAgICAgLy8gfSwgbmF2Lm5hdlBhZ2VOb2RlUmVzcG9uc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCByZWluZGV4UmVzcG9uc2UgPSBmdW5jdGlvbihyZXM6IGpzb24uRmlsZVNlYXJjaFJlc3BvbnNlKSB7XG4gICAgICAgICAgICBhbGVydChcIlJlaW5kZXggY29tcGxldGUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IGxldCBzZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIChuZXcgbTY0LlNlYXJjaEZpbGVzRGxnKHRydWUpKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgbGV0IHByb3BPcmRlcmluZyA9IGZ1bmN0aW9uKG5vZGU6IGpzb24uTm9kZUluZm8sIHByb3BlcnRpZXM6IGpzb24uUHJvcGVydHlJbmZvW10pOiBqc29uLlByb3BlcnR5SW5mb1tdIHtcbiAgICAgICAgICAgIGxldCBwcm9wT3JkZXI6IHN0cmluZ1tdID0gWy8vXG4gICAgICAgICAgICAgICAgXCJtZXRhNjQ6cGF0aFwiXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BzLm9yZGVyUHJvcHMocHJvcE9yZGVyLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubTY0Lm1ldGE2NC5yZW5kZXJGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gbTY0LnN5c3RlbWZvbGRlci5yZW5kZXJOb2RlO1xubTY0Lm1ldGE2NC5wcm9wT3JkZXJpbmdGdW5jdGlvbnNCeUpjclR5cGVbXCJtZXRhNjQ6c3lzdGVtZm9sZGVyXCJdID0gbTY0LnN5c3RlbWZvbGRlci5wcm9wT3JkZXJpbmc7XG5cbm02NC5tZXRhNjQucmVuZGVyRnVuY3Rpb25zQnlKY3JUeXBlW1wibWV0YTY0OmZpbGVsaXN0XCJdID0gbTY0LnN5c3RlbWZvbGRlci5yZW5kZXJGaWxlTGlzdE5vZGU7XG5tNjQubWV0YTY0LnByb3BPcmRlcmluZ0Z1bmN0aW9uc0J5SmNyVHlwZVtcIm1ldGE2NDpmaWxlbGlzdFwiXSA9IG02NC5zeXN0ZW1mb2xkZXIuZmlsZUxpc3RQcm9wT3JkZXJpbmc7XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBEaWFsb2dCYXNlLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICAvKlxuICAgICAqIEJhc2UgY2xhc3MgZm9yIGFsbCBkaWFsb2cgYm94ZXMuXG4gICAgICpcbiAgICAgKiB0b2RvOiB3aGVuIHJlZmFjdG9yaW5nIGFsbCBkaWFsb2dzIHRvIHRoaXMgbmV3IGJhc2UtY2xhc3MgZGVzaWduIEknbSBhbHdheXNcbiAgICAgKiBjcmVhdGluZyBhIG5ldyBkaWFsb2cgZWFjaCB0aW1lLCBzbyB0aGUgbmV4dCBvcHRpbWl6YXRpb24gd2lsbCBiZSB0byBtYWtlXG4gICAgICogY2VydGFpbiBkaWFsb2dzIChpbmRlZWQgbW9zdCBvZiB0aGVtKSBiZSBhYmxlIHRvIGJlaGF2ZSBhcyBzaW5nbGV0b25zIG9uY2VcbiAgICAgKiB0aGV5IGhhdmUgYmVlbiBjb25zdHJ1Y3RlZCB3aGVyZSB0aGV5IG1lcmVseSBoYXZlIHRvIGJlIHJlc2hvd24gYW5kXG4gICAgICogcmVwb3B1bGF0ZWQgdG8gcmVvcGVuIG9uZSBvZiB0aGVtLCBhbmQgY2xvc2luZyBhbnkgb2YgdGhlbSBpcyBtZXJlbHkgZG9uZSBieVxuICAgICAqIG1ha2luZyB0aGVtIGludmlzaWJsZS5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBob3JpekNlbnRlckRsZ0NvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgICAgIGRhdGE6IGFueTtcbiAgICAgICAgYnVpbHQ6IGJvb2xlYW47XG4gICAgICAgIGd1aWQ6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZG9tSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBXZSByZWdpc3RlciAndGhpcycgc28gd2UgY2FuIGRvIG1ldGE2NC5nZXRPYmplY3RCeUd1aWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBvbiB0aGUgZGlhbG9nIGFuZCBiZSBhYmxlIHRvIGhhdmUgJ3RoaXMnIGF2YWlsYWJsZSB0byB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGVuY29kZWQgaW4gb25DbGljayBtZXRob2RzXG4gICAgICAgICAgICAgKiBhcyBzdHJpbmdzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQucmVnaXN0ZXJEYXRhT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgbWV0YTY0LnJlZ2lzdGVyRGF0YU9iamVjdCh0aGlzLmRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbnRlbnQgb2YgdGhlIGRpYWxvZyB3aGVuIGl0J3MgZGlzcGxheWVkLCBhbmQgc2hvdWxkIGJlIHRoZSBwbGFjZSB3aGVyZVxuICAgICAgICBhbnkgZGVmYXVsdHMgb3IgdmFsdWVzIGluIGZvciBmaWVsZHMsIGV0Yy4gc2hvdWxkIGJlIHNldCB3aGVuIHRoZSBkaWFsb2cgaXMgZGlzcGxheWVkICovXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIH1cblxuICAgICAgICBjbG9zZUV2ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG5cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIH07XG5cbiAgICAgICAgb3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBnZXQgY29udGFpbmVyIHdoZXJlIGFsbCBkaWFsb2dzIGFyZSBjcmVhdGVkICh0cnVlIHBvbHltZXIgZGlhbG9ncylcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IG1vZGFsc0NvbnRhaW5lciA9IHV0aWwucG9seUVsbShcIm1vZGFsc0NvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgLyogc3VmZml4IGRvbUlkIGZvciB0aGlzIGluc3RhbmNlL2d1aWQgKi9cbiAgICAgICAgICAgIGxldCBpZCA9IHRoaXMuaWQodGhpcy5kb21JZCk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUT0RPLiBJTVBPUlRBTlQ6IG5lZWQgdG8gcHV0IGNvZGUgaW4gdG8gcmVtb3ZlIHRoaXMgZGlhbG9nIGZyb20gdGhlIGRvbVxuICAgICAgICAgICAgICogb25jZSBpdCdzIGNsb3NlZCwgQU5EIHRoYXQgc2FtZSBjb2RlIHNob3VsZCBkZWxldGUgdGhlIGd1aWQncyBvYmplY3QgaW5cbiAgICAgICAgICAgICAqIG1hcCBpbiB0aGlzIG1vZHVsZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwYXBlci1kaWFsb2dcIik7XG5cbiAgICAgICAgICAgIC8vTk9URTogVGhpcyB3b3JrcywgYnV0IGlzIGFuIGV4YW1wbGUgb2Ygd2hhdCBOT1QgdG8gZG8gYWN0dWFsbHkuIEluc3RlYWQgYWx3YXlzXG4gICAgICAgICAgICAvL3NldCB0aGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSAncG9seUVsbS5ub2RlJyBiZWxvdy5cbiAgICAgICAgICAgIC8vbm9kZS5zZXRBdHRyaWJ1dGUoXCJ3aXRoLWJhY2tkcm9wXCIsIFwid2l0aC1iYWNrZHJvcFwiKTtcblxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XG4gICAgICAgICAgICBtb2RhbHNDb250YWluZXIubm9kZS5hcHBlbmRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgLy8gdG9kby0zOiBwdXQgaW4gQ1NTIG5vd1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5ib3JkZXIgPSBcIjNweCBzb2xpZCBncmF5XCI7XG5cbiAgICAgICAgICAgIFBvbHltZXIuZG9tLmZsdXNoKCk7IC8vIDwtLS0tIGlzIHRoaXMgbmVlZGVkID8gdG9kby0zXG4gICAgICAgICAgICBQb2x5bWVyLnVwZGF0ZVN0eWxlcygpO1xuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhvcml6Q2VudGVyRGxnQ29udGVudCkge1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9ob3d0bzogZXhhbXBsZSBvZiBob3cgdG8gY2VudGVyIGEgZGl2IGluIGFub3RoZXIgZGl2LiBUaGlzIGRpdiBpcyB0aGUgb25lIGJlaW5nIGNlbnRlcmVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGUgdHJpY2sgdG8gZ2V0dGluZyB0aGUgbGF5b3V0IHdvcmtpbmcgd2FzIE5PVCBzZXR0aW5nIHRoaXMgd2lkdGggdG8gMTAwJSBldmVuIHRob3VnaCBzb21laG93XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoZSBsYXlvdXQgZG9lcyByZXN1bHQgaW4gaXQgYmVpbmcgMTAwJSBpIHRoaW5rLlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbjogMCBhdXRvOyBtYXgtd2lkdGg6IDgwMHB4O1wiIC8vXCJtYXJnaW46IDAgYXV0bzsgd2lkdGg6IDgwMHB4O1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCkpO1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SHRtbChpZCwgY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBsZXQgbGVmdCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImRpc3BsYXlcIjogXCJ0YWJsZS1jb2x1bW5cIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJzdHlsZVwiOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiXG4gICAgICAgICAgICAgICAgLy8gfSwgXCJsZWZ0XCIpO1xuICAgICAgICAgICAgICAgIC8vIGxldCBjZW50ZXIgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJkaXNwbGF5XCI6IFwidGFibGUtY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwic3R5bGVcIjogXCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxuICAgICAgICAgICAgICAgIC8vIH0sIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAgICAgLy8gbGV0IHJpZ2h0ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZGlzcGxheVwiOiBcInRhYmxlLWNvbHVtblwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInN0eWxlXCI6IFwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcbiAgICAgICAgICAgICAgICAvLyB9LCBcInJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gbGV0IHJvdyA9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBsZWZ0ICsgY2VudGVyICsgcmlnaHQpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gbGV0IHRhYmxlOiBzdHJpbmcgPSByZW5kZXIudGFnKFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sIHJvdyk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyB1dGlsLnNldEh0bWwoaWQsIHRhYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qIHRvZG8tMDogbG9va3VwIHBhcGVyLWRpYWxvZy1zY3JvbGxhYmxlLCBmb3IgZXhhbXBsZXMgb24gaG93IHdlIGNhbiBpbXBsZW1lbnQgaGVhZGVyIGFuZCBmb290ZXIgdG8gYnVpbGRcbiAgICAgICAgICAgICAgICBhIG11Y2ggYmV0dGVyIGRpYWxvZy4gKi9cbiAgICAgICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgICAgICAvLyByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJjbGFzc1wiIDogXCJtYWluLWRpYWxvZy1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIC8vIHRoaXMuYnVpbGQoKSk7XG4gICAgICAgICAgICAgICAgdXRpbC5zZXRIdG1sKGlkLCBjb250ZW50KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNob3dpbmcgZGlhbG9nOiBcIiArIGlkKTtcblxuICAgICAgICAgICAgLyogbm93IG9wZW4gYW5kIGRpc3BsYXkgcG9seW1lciBkaWFsb2cgd2UganVzdCBjcmVhdGVkICovXG4gICAgICAgICAgICBsZXQgcG9seUVsbSA9IHV0aWwucG9seUVsbShpZCk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBpIHRyaWVkIHRvIHR3ZWFrIHRoZSBwbGFjZW1lbnQgb2YgdGhlIGRpYWxvZyB1c2luZyBmaXRJbnRvLCBhbmQgaXQgZGlkbid0IHdvcmtcbiAgICAgICAgICAgIHNvIEknbSBqdXN0IHVzaW5nIHRoZSBwYXBlci1kaWFsb2cgQ1NTIHN0eWxpbmcgdG8gYWx0ZXIgdGhlIGRpYWxvZyBzaXplIHRvIGZ1bGxzY3JlZW5cbiAgICAgICAgICAgIGxldCBpcm9uUGFnZXMgPSB1dGlsLnBvbHlFbG0oXCJtYWluSXJvblBhZ2VzXCIpO1xuXG4gICAgICAgICAgICBBZnRlciB0aGUgVHlwZVNjcmlwdCBjb252ZXJzaW9uIEkgbm90aWNlZCBoYXZpbmcgYSBtb2RhbCBmbGFnIHdpbGwgY2F1c2VcbiAgICAgICAgICAgIGFuIGluZmluaXRlIGxvb3AgKGNvbXBsZXRlbHkgaGFuZykgQ2hyb21lIGJyb3dzZXIsIGJ1dCB0aGlzIGlzc3VlIGlzIG1vc3QgbGlrZWx5XG4gICAgICAgICAgICBub3QgcmVsYXRlZCB0byBUeXBlU2NyaXB0IGF0IGFsbCwgYnV0IGknbSBqdXN0IG1lbnRpb24gVFMganVzdCBpbiBjYXNlLCBiZWNhdXNlXG4gICAgICAgICAgICB0aGF0J3Mgd2hlbiBJIG5vdGljZWQgaXQuIERpYWxvZ3MgYXJlIGZpbmUgYnV0IG5vdCBhIGRpYWxvZyBvbiB0b3Agb2YgYW5vdGhlciBkaWFsb2csIHdoaWNoIGlzXG4gICAgICAgICAgICB0aGUgY2FzZSB3aGVyZSBpdCBoYW5ncyBpZiBtb2RlbD10cnVlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUubW9kYWwgPSB0cnVlO1xuXG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLm5vQ2FuY2VsT25PdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgLy9wb2x5RWxtLm5vZGUuaG9yaXpvbnRhbE9mZnNldCA9IDA7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS52ZXJ0aWNhbE9mZnNldCA9IDA7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5maXRJbnRvID0gaXJvblBhZ2VzLm5vZGU7XG4gICAgICAgICAgICAvL3BvbHlFbG0ubm9kZS5jb25zdHJhaW4oKTtcbiAgICAgICAgICAgIC8vcG9seUVsbS5ub2RlLmNlbnRlcigpO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLm9wZW4oKTtcblxuICAgICAgICAgICAgLy92YXIgZGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luRGlhbG9nJyk7XG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lyb24tb3ZlcmxheS1jbG9zZWQnLCBmdW5jdGlvbihjdXN0b21FdmVudCkge1xuICAgICAgICAgICAgICAgIC8vdmFyIGlkID0gKDxhbnk+Y3VzdG9tRXZlbnQuY3VycmVudFRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKiBEaWFsb2c6IFwiICsgaWQgKyBcIiBpcyBjbG9zZWQhXCIpO1xuICAgICAgICAgICAgICAgIHRoaXouY2xvc2VFdmVudCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBzZXR0aW5nIHRvIHplcm8gbWFyZ2luIGltbWVkaWF0ZWx5LCBhbmQgdGhlbiBhbG1vc3QgaW1tZWRpYXRlbHksIGFuZCB0aGVuIGFmdGUgMS41IHNlY29uZHNcbiAgICAgICAgICAgIGlzIGEgcmVhbGx5IHVnbHkgaGFjaywgYnV0IEkgY291bGRuJ3QgZmluZCB0aGUgcmlnaHQgc3R5bGUgY2xhc3Mgb3Igd2F5IG9mIGRvaW5nIHRoaXMgaW4gdGhlIGdvb2dsZVxuICAgICAgICAgICAgZG9jcyBvbiB0aGUgZGlhbG9nIGNsYXNzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgcG9seUVsbS5ub2RlLnJlZml0KCk7XG5cbiAgICAgICAgICAgIC8qIEknbSBkb2luZyB0aGlzIGluIGRlc3BhcmF0aW9uLiBub3RoaW5nIGVsc2Ugc2VlbXMgdG8gZ2V0IHJpZCBvZiB0aGUgbWFyZ2luICovXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xuICAgICAgICAgICAgICAgIHBvbHlFbG0ubm9kZS5yZWZpdCgpO1xuICAgICAgICAgICAgfSwgMTApO1xuXG4gICAgICAgICAgICAvKiBJJ20gZG9pbmcgdGhpcyBpbiBkZXNwYXJhdGlvbi4gbm90aGluZyBlbHNlIHNlZW1zIHRvIGdldCByaWQgb2YgdGhlIG1hcmdpbiAqL1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcbiAgICAgICAgICAgICAgICBwb2x5RWxtLm5vZGUucmVmaXQoKTtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogdG9kbzogbmVlZCB0byBjbGVhbnVwIHRoZSByZWdpc3RlcmVkIElEcyB0aGF0IGFyZSBpbiBtYXBzIGZvciB0aGlzIGRpYWxvZyAqL1xuICAgICAgICBwdWJsaWMgY2FuY2VsKCkge1xuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZCh0aGlzLmRvbUlkKSk7XG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuY2FuY2VsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIZWxwZXIgbWV0aG9kIHRvIGdldCB0aGUgdHJ1ZSBpZCB0aGF0IGlzIHNwZWNpZmljIHRvIHRoaXMgZGlhbG9nIChpLmUuIGd1aWRcbiAgICAgICAgICogc3VmZml4IGFwcGVuZGVkKVxuICAgICAgICAgKi9cbiAgICAgICAgaWQgPSAoaWQpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgaWYgKGlkID09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIC8qIGlmIGRpYWxvZyBhbHJlYWR5IHN1ZmZpeGVkICovXG4gICAgICAgICAgICBpZiAodXRpbC5jb250YWlucyhpZCwgXCJfZGxnSWRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaWQgKyBcIl9kbGdJZFwiICsgdGhpcy5kYXRhLmd1aWQ7XG4gICAgICAgIH1cblxuICAgICAgICBlbCA9IChpZCk6IGFueSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuc3RhcnRzV2l0aChpZCwgXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoXCIjXCIgKyB0aGlzLmlkKGlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzLmlkKGlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlUGFzc3dvcmRGaWVsZCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci5tYWtlUGFzc3dvcmRGaWVsZCh0ZXh0LCB0aGlzLmlkKGlkKSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlRWRpdEZpZWxkID0gKGZpZWxkTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogZmllbGROYW1lLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm1ldGE2NC1pbnB1dFwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VNZXNzYWdlQXJlYSA9IChtZXNzYWdlOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwiZGlhbG9nLW1lc3NhZ2VcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiaWRcIl0gPSB0aGlzLmlkKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicFwiLCBhdHRycywgbWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2RvOiB0aGVyZSdzIGEgbWFrZUJ1dHRvbiAoYW5kIG90aGVyIHNpbWlsYXIgbWV0aG9kcykgdGhhdCBkb24ndCBoYXZlIHRoZVxuICAgICAgICAvLyBlbmNvZGVDYWxsYmFjayBjYXBhYmlsaXR5IHlldFxuICAgICAgICBtYWtlQnV0dG9uID0gKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSwgY3R4PzogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGxldCBhdHRyaWJzID0ge1xuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gbWV0YTY0LmVuY29kZU9uQ2xpY2soY2FsbGJhY2ssIGN0eCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIGF0dHJpYnMsIHRleHQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogVGhlIHJlYXNvbiBkZWxheUNsb3NlQ2FsbGJhY2sgaXMgaGVyZSBpcyBzbyB0aGF0IHdlIGNhbiBlbmNvZGUgYSBidXR0b24gdG8gcG9wdXAgYSBuZXcgZGlhbG9nIG92ZXIgdGhlIHRvcCBvZlxuICAgICAgICBhbiBleGlzdGluZyBkaWFsb2csIGFuZCBoYXZlIHRoYXQgaGFwcGVuIGluc3RhbnRseSwgcmF0aGVyIHRoYW4gbGV0dGluZyBpdCBjbG9zZSwgYW5kIFRIRU4gcG9waW5nIHVwIGEgc2Vjb25kIGRpYWxvZyxcbiAgICAgICAgYmVjYXN1ZSB1c2luZyB0aGUgZGVsYXkgbWVhbnMgdGhhdCB0aGUgb25lIGJlaW5nIGhpZGRlbiBpcyBub3QgYWJsZSB0byBiZWNvbWUgaGlkZGVuIGJlZm9yZSB0aGUgb25lIGNvbWVzIHVwIGJlY2F1c2VcbiAgICAgICAgdGhhdCBjcmVhdGVzIGFuIHVnbHluZXNzLiBJdCdzIGJldHRlciB0byBwb3B1cCBvbmUgcmlnaHQgb3ZlciB0aGUgb3RoZXIgYW5kIG5vIGZsaWNrZXIgaGFwcGVucyBpbiB0aGF0IGNhc2UuICovXG4gICAgICAgIG1ha2VDbG9zZUJ1dHRvbiA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogYW55LCBjdHg/OiBhbnksIGluaXRpYWxseVZpc2libGU6IGJvb2xlYW4gPSB0cnVlLCBkZWxheUNsb3NlQ2FsbGJhY2s6IG51bWJlciA9IDApOiBzdHJpbmcgPT4ge1xuXG4gICAgICAgICAgICBsZXQgYXR0cmlicyA9IHtcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxuXG4gICAgICAgICAgICAgICAgLyogd2FybmluZzogdGhpcyBkaWFsb2ctY29uZmlybSB3aWxsIGNhdXNlIGdvb2dsZSBwb2x5bWVyIHRvIGNsb3NlIHRoZSBkaWFsb2cgaW5zdGFudGx5IHdoZW4gdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgICBpcyBjbGlja2VkIGFuZCBzb21ldGltZXMgd2UgZG9uJ3Qgd2FudCB0aGF0LCBsaWtlIGZvciBleGFtcGxlLCB3aGVuIHdlIG9wZW4gYSBkaWFsb2cgb3ZlciBhbm90aGVyIGRpYWxvZyxcbiAgICAgICAgICAgICAgICAgd2UgZG9uJ3Qgd2FudCB0aGUgaW5zdGFudGFuZW91cyBjbG9zZSBhbmQgZGlzcGxheSBvZiBiYWNrZ3JvdW5kLiBJdCBjcmVhdGVzIGEgZmxpY2tlciBlZmZlY3QuXG5cbiAgICAgICAgICAgICAgICBcImRpYWxvZy1jb25maXJtXCI6IFwiZGlhbG9nLWNvbmZpcm1cIixcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGlkKSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IG9uQ2xpY2sgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb25DbGljayA9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKGNhbGxiYWNrLCBjdHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvbkNsaWNrICs9IG1ldGE2NC5lbmNvZGVPbkNsaWNrKHRoaXMuY2FuY2VsLCB0aGlzLCBudWxsLCBkZWxheUNsb3NlQ2FsbGJhY2spO1xuXG4gICAgICAgICAgICBpZiAob25DbGljaykge1xuICAgICAgICAgICAgICAgIGF0dHJpYnNbXCJvbkNsaWNrXCJdID0gb25DbGljaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpbml0aWFsbHlWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlic1tcInN0eWxlXCJdID0gXCJkaXNwbGF5Om5vbmU7XCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwgYXR0cmlicywgdGV4dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kRW50ZXJLZXkgPSAoaWQ6IHN0cmluZywgY2FsbGJhY2s6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5iaW5kRW50ZXJLZXkodGhpcy5pZChpZCksIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldElucHV0VmFsID0gKGlkOiBzdHJpbmcsIHZhbDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXZhbCkge1xuICAgICAgICAgICAgICAgIHZhbCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoaWQpLCB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0SW5wdXRWYWwgPSAoaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5nZXRJbnB1dFZhbCh0aGlzLmlkKGlkKSkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SHRtbCA9ICh0ZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKGlkKSwgdGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlUmFkaW9CdXR0b24gPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1idXR0b25cIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkXG4gICAgICAgICAgICB9LCBsYWJlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYWtlQ2hlY2tCb3ggPSAobGFiZWw6IHN0cmluZywgaWQ6IHN0cmluZywgaW5pdGlhbFN0YXRlOiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlkID0gdGhpcy5pZChpZCk7XG5cbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICAvL1wib25DbGlja1wiOiBcIm02NC5tZXRhNjQuZ2V0T2JqZWN0QnlHdWlkKFwiICsgdGhpcy5ndWlkICsgXCIpLnB1YmxpY0NvbW1lbnRpbmdDaGFuZ2VkKCk7XCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IGlkLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgPHBhcGVyLWNoZWNrYm94IG9uLWNoYW5nZT1cImNoZWNrYm94Q2hhbmdlZFwiPmNsaWNrPC9wYXBlci1jaGVja2JveD5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjaGVja2JveENoYW5nZWQgOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAvLyAgICAgaWYoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgaWYgKGluaXRpYWxTdGF0ZSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW1wiY2hlY2tlZFwiXSA9IFwiY2hlY2tlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgY2hlY2tib3g6IHN0cmluZyA9IHJlbmRlci50YWcoXCJwYXBlci1jaGVja2JveFwiLCBhdHRycywgXCJcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBjaGVja2JveCArPSByZW5kZXIudGFnKFwibGFiZWxcIiwge1xuICAgICAgICAgICAgICAgIFwiZm9yXCI6IGlkXG4gICAgICAgICAgICB9LCBsYWJlbCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBjaGVja2JveDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VIZWFkZXIgPSAodGV4dDogc3RyaW5nLCBpZD86IHN0cmluZywgY2VudGVyZWQ/OiBib29sZWFuKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBhdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IC8qXCJkaWFsb2ctaGVhZGVyIFwiICsqLyAoY2VudGVyZWQgPyBcImhvcml6b250YWwgY2VudGVyLWp1c3RpZmllZCBsYXlvdXRcIiA6IFwiXCIpICsgXCIgZGlhbG9nLWhlYWRlclwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2FkZCBpZCBpZiBvbmUgd2FzIHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1tcImlkXCJdID0gdGhpcy5pZChpZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIG1ha2luZyB0aGlzIEgyIHRhZyBjYXVzZXMgZ29vZ2xlIHRvIGRyYWcgaW4gYSBidW5jaCBvZiBpdHMgb3duIHN0eWxlcyBhbmQgYXJlIGhhcmQgdG8gb3ZlcnJpZGUgKi9cbiAgICAgICAgICAgIHJldHVybiByZW5kZXIudGFnKFwiZGl2XCIsIGF0dHJzLCB0ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvY3VzID0gKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5zdGFydHNXaXRoKGlkLCBcIiNcIikpIHtcbiAgICAgICAgICAgICAgICBpZCA9IFwiI1wiICsgaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZCA9IHRoaXMuaWQoaWQpO1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoaWQpO1xuICAgICAgICAgICAgLy8gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vICAgICAkKGlkKS5mb2N1cygpO1xuICAgICAgICAgICAgLy8gfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBQcm9ncmVzc0RsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFByb2dyZXNzRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlByb2dyZXNzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQcm9jZXNzaW5nIFJlcXVlc3RcIiwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHZhciBwcm9ncmVzc0JhciA9IHJlbmRlci50YWcoXCJwYXBlci1wcm9ncmVzc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJpbmRldGVybWluYXRlXCI6IFwiaW5kZXRlcm1pbmF0ZVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCI4MDBcIixcbiAgICAgICAgICAgICAgICBcIm1pblwiOiBcIjEwMFwiLFxuICAgICAgICAgICAgICAgIFwibWF4XCI6IFwiMTAwMFwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGJhckNvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDoyODBweDsgbWFyZ2luOiAwIGF1dG87IG1hcmdpbi10b3A6MjRweDsgbWFyZ2luLWJvdHRvbToyNHB4O1wiLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJob3Jpem9udGFsIGNlbnRlci1qdXN0aWZpZWQgbGF5b3V0XCJcbiAgICAgICAgICAgIH0sIHByb2dyZXNzQmFyKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGJhckNvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogQ29uZmlybURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIENvbmZpcm1EbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRpdGxlOiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIGJ1dHRvblRleHQ6IHN0cmluZywgcHJpdmF0ZSB5ZXNDYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgICAgICBwcml2YXRlIG5vQ2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICAgICAgc3VwZXIoXCJDb25maXJtRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBjb250ZW50OiBzdHJpbmcgPSB0aGlzLm1ha2VIZWFkZXIoXCJcIiwgXCJDb25maXJtRGxnVGl0bGVcIikgKyB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIlwiLCBcIkNvbmZpcm1EbGdNZXNzYWdlXCIpO1xuICAgICAgICAgICAgY29udGVudCA9IHJlbmRlci5jZW50ZXJDb250ZW50KGNvbnRlbnQsIDMwMCk7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJZZXNcIiwgXCJDb25maXJtRGxnWWVzQnV0dG9uXCIsIHRoaXMueWVzQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgKyB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIk5vXCIsIFwiQ29uZmlybURsZ05vQnV0dG9uXCIsIHRoaXMubm9DYWxsYmFjayk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihidXR0b25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMudGl0bGUsIFwiQ29uZmlybURsZ1RpdGxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRoaXMubWVzc2FnZSwgXCJDb25maXJtRGxnTWVzc2FnZVwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SHRtbCh0aGlzLmJ1dHRvblRleHQsIFwiQ29uZmlybURsZ1llc0J1dHRvblwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRTeXN0ZW1GaWxlLmpzXCIpO1xuXG4vKiBUaGlzIGRpYWxvZyBpcyBjdXJyZW5ldGx5IGEgd29yayBpbiBwcm9ncmVzcyBhbmQgd2lsbCBldmVudHVhbGx5IGJlIGFibGUgdG8gZWRpdCBhIHRleHQgZmlsZSBvbiB0aGUgc2VydmVyICovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRWRpdFN5c3RlbUZpbGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdFN5c3RlbUZpbGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IFwiPGgyPkZpbGUgRWRpdG9yOiBcIiArIHRoaXMuZmlsZU5hbWUgKyBcIjwvaDI+XCI7XG5cbiAgICAgICAgICAgIGxldCBidXR0b25zID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwiU2F2ZUZpbGVCdXR0b25cIiwgdGhpcy5zYXZlRWRpdClcbiAgICAgICAgICAgICAgICArIHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiQ2FuY2VsRmlsZUVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0KTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKGJ1dHRvbnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbmNlbEVkaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhbmNlbC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWVzc2FnZURsZy5qc1wiKTtcclxuXHJcbi8qXHJcbiAqIENhbGxiYWNrIGNhbiBiZSBudWxsIGlmIHlvdSBkb24ndCBuZWVkIHRvIHJ1biBhbnkgZnVuY3Rpb24gd2hlbiB0aGUgZGlhbG9nIGlzIGNsb3NlZFxyXG4gKi9cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWVzc2FnZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2U/OiBhbnksIHByaXZhdGUgdGl0bGU/OiBhbnksIHByaXZhdGUgY2FsbGJhY2s/OiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJNZXNzYWdlRGxnXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aXRsZSkge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBcIk1lc3NhZ2VcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnRpdGxlKSArIFwiPHA+XCIgKyB0aGlzLm1lc3NhZ2UgKyBcIjwvcD5cIjtcclxuICAgICAgICAgICAgY29udGVudCArPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJPa1wiLCBcIm1lc3NhZ2VEbGdPa0J1dHRvblwiLCB0aGlzLmNhbGxiYWNrKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBMb2dpbkRsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIExvZ2luRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJMb2dpbkRsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiTG9naW5cIik7XG5cbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwidXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInBhc3N3b3JkXCIpO1xuXG4gICAgICAgICAgICB2YXIgbG9naW5CdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJMb2dpblwiLCBcImxvZ2luQnV0dG9uXCIsIHRoaXMubG9naW4sIHRoaXMpO1xuICAgICAgICAgICAgdmFyIHJlc2V0UGFzc3dvcmRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJGb3Jnb3QgUGFzc3dvcmRcIiwgXCJyZXNldFBhc3N3b3JkQnV0dG9uXCIsIHRoaXMucmVzZXRQYXNzd29yZCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxMb2dpbkJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIobG9naW5CdXR0b24gKyByZXNldFBhc3N3b3JkQnV0dG9uICsgYmFja0J1dHRvbik7XG4gICAgICAgICAgICB2YXIgZGl2aWRlciA9IFwiPGRpdj48aDM+T3IgTG9naW4gV2l0aC4uLjwvaDM+PC9kaXY+XCI7XG5cbiAgICAgICAgICAgIHZhciBmb3JtID0gZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRlbnQgPSBmb3JtO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBoZWFkZXIgKyBtYWluQ29udGVudDtcblxuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJ1c2VyTmFtZVwiLCB1c2VyLmxvZ2luKTtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwicGFzc3dvcmRcIiwgdXNlci5sb2dpbik7XG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRnJvbUNvb2tpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVsYXRlRnJvbUNvb2tpZXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdXNyID0gJC5jb29raWUoY25zdC5DT09LSUVfTE9HSU5fVVNSKTtcbiAgICAgICAgICAgIHZhciBwd2QgPSAkLmNvb2tpZShjbnN0LkNPT0tJRV9MT0dJTl9QV0QpO1xuXG4gICAgICAgICAgICBpZiAodXNyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInVzZXJOYW1lXCIsIHVzcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHdkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInBhc3N3b3JkXCIsIHB3ZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2dpbiA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBwd2QgPSB0aGlzLmdldElucHV0VmFsKFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIHVzZXIubG9naW4odGhpcywgdXNyLCBwd2QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXRQYXNzd29yZCA9ICgpOiBhbnkgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHVzciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKTtcblxuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBSZXNldCBQYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgIFwiUmVzZXQgeW91ciBwYXNzd29yZCA/PHA+WW91J2xsIHN0aWxsIGJlIGFibGUgdG8gbG9naW4gd2l0aCB5b3VyIG9sZCBwYXNzd29yZCB1bnRpbCB0aGUgbmV3IG9uZSBpcyBzZXQuXCIsXG4gICAgICAgICAgICAgICAgXCJZZXMsIHJlc2V0LlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpei5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgKG5ldyBSZXNldFBhc3N3b3JkRGxnKHVzcikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2lnbnVwRGxnLmpzXCIpO1xuXG5kZWNsYXJlIHZhciBCUkFORElOR19USVRMRTtcbmRlY2xhcmUgdmFyIEJSQU5ESU5HX1RJVExFX1NIT1JUO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2lnbnVwRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNpZ251cERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKEJSQU5ESU5HX1RJVExFICsgXCIgU2lnbnVwXCIpO1xuXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwic2lnbnVwVXNlck5hbWVcIikgKyAvL1xuICAgICAgICAgICAgICAgIHRoaXMubWFrZVBhc3N3b3JkRmllbGQoXCJQYXNzd29yZFwiLCBcInNpZ251cFBhc3N3b3JkXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJFbWFpbFwiLCBcInNpZ251cEVtYWlsXCIpICsgLy9cbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VFZGl0RmllbGQoXCJDYXB0Y2hhXCIsIFwic2lnbnVwQ2FwdGNoYVwiKTtcblxuICAgICAgICAgICAgdmFyIGNhcHRjaGFJbWFnZSA9IHJlbmRlci50YWcoXCJkaXZcIiwgLy9cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjYXB0Y2hhLWltYWdlXCIgLy9cbiAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgIHJlbmRlci50YWcoXCJpbWdcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiY2FwdGNoYUltYWdlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImNhcHRjaGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3JjXCI6IFwiXCIvL1xuICAgICAgICAgICAgICAgICAgICB9LCAvL1xuICAgICAgICAgICAgICAgICAgICBcIlwiLCBmYWxzZSkpO1xuXG4gICAgICAgICAgICB2YXIgc2lnbnVwQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiU2lnbnVwXCIsIFwic2lnbnVwQnV0dG9uXCIsIHRoaXMuc2lnbnVwLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBuZXdDYXB0Y2hhQnV0dG9uID0gdGhpcy5tYWtlQnV0dG9uKFwiVHJ5IERpZmZlcmVudCBJbWFnZVwiLCBcInRyeUFub3RoZXJDYXB0Y2hhQnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgdGhpcy50cnlBbm90aGVyQ2FwdGNoYSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTaWdudXBCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2lnbnVwQnV0dG9uICsgbmV3Q2FwdGNoYUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgZm9ybUNvbnRyb2xzICsgY2FwdGNoYUltYWdlICsgYnV0dG9uQmFyO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogJChcIiNcIiArIF8uZG9tSWQgKyBcIi1tYWluXCIpLmNzcyh7IFwiYmFja2dyb3VuZEltYWdlXCIgOiBcInVybCgvaWJtLTcwMi1icmlnaHQuanBnKTtcIiBcImJhY2tncm91bmQtcmVwZWF0XCIgOlxuICAgICAgICAgICAgICogXCJuby1yZXBlYXQ7XCIsIFwiYmFja2dyb3VuZC1zaXplXCIgOiBcIjEwMCUgYXV0b1wiIH0pO1xuICAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICBzaWdudXAgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdXNlck5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwVXNlck5hbWVcIik7XG4gICAgICAgICAgICB2YXIgcGFzc3dvcmQgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwUGFzc3dvcmRcIik7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSB0aGlzLmdldElucHV0VmFsKFwic2lnbnVwRW1haWxcIik7XG4gICAgICAgICAgICB2YXIgY2FwdGNoYSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaWdudXBDYXB0Y2hhXCIpO1xuXG4gICAgICAgICAgICAvKiBubyByZWFsIHZhbGlkYXRpb24geWV0LCBvdGhlciB0aGFuIG5vbi1lbXB0eSAqL1xuICAgICAgICAgICAgaWYgKCF1c2VyTmFtZSB8fCB1c2VyTmFtZS5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT0gMCB8fCAvL1xuICAgICAgICAgICAgICAgICFjYXB0Y2hhIHx8IGNhcHRjaGEubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJTb3JyeSwgeW91IGNhbm5vdCBsZWF2ZSBhbnkgZmllbGRzIGJsYW5rLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU2lnbnVwUmVxdWVzdCwganNvbi5TaWdudXBSZXNwb25zZT4oXCJzaWdudXBcIiwge1xuICAgICAgICAgICAgICAgIFwidXNlck5hbWVcIjogdXNlck5hbWUsXG4gICAgICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IGVtYWlsLFxuICAgICAgICAgICAgICAgIFwiY2FwdGNoYVwiOiBjYXB0Y2hhXG4gICAgICAgICAgICB9LCB0aGlzLnNpZ251cFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpZ251cFJlc3BvbnNlID0gKHJlczoganNvbi5TaWdudXBSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2lnbnVwIG5ldyB1c2VyXCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qIGNsb3NlIHRoZSBzaWdudXAgZGlhbG9nICovXG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcblxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcbiAgICAgICAgICAgICAgICAgICAgXCJVc2VyIEluZm9ybWF0aW9uIEFjY2VwdGVkLjxwLz5DaGVjayB5b3VyIGVtYWlsIGZvciBzaWdudXAgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcIlNpZ251cFwiXG4gICAgICAgICAgICAgICAgKSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5QW5vdGhlckNhcHRjaGEgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciBuID0gdXRpbC5jdXJyZW50VGltZU1pbGxpcygpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogZW1iZWQgYSB0aW1lIHBhcmFtZXRlciBqdXN0IHRvIHRod2FydCBicm93c2VyIGNhY2hpbmcsIGFuZCBlbnN1cmUgc2VydmVyIGFuZCBicm93c2VyIHdpbGwgbmV2ZXIgcmV0dXJuIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBpbWFnZSB0d2ljZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHNyYyA9IHBvc3RUYXJnZXRVcmwgKyBcImNhcHRjaGE/dD1cIiArIG47XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImNhcHRjaGFJbWFnZVwiKSkuYXR0cihcInNyY1wiLCBzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZUluaXRTaWdudXBQZyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJ5QW5vdGhlckNhcHRjaGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VJbml0U2lnbnVwUGcoKTtcbiAgICAgICAgICAgIHV0aWwuZGVsYXllZEZvY3VzKFwiI1wiICsgdGhpcy5pZChcInNpZ251cFVzZXJOYW1lXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFByZWZzRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgUHJlZnNEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJQcmVmc0RsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJQZWZlcmVuY2VzXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZGlvQnV0dG9ucyA9IHRoaXMubWFrZVJhZGlvQnV0dG9uKFwiU2ltcGxlXCIsIFwiZWRpdE1vZGVTaW1wbGVcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUmFkaW9CdXR0b24oXCJBZHZhbmNlZFwiLCBcImVkaXRNb2RlQWR2YW5jZWRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFkaW9CdXR0b25Hcm91cCA9IHJlbmRlci50YWcoXCJwYXBlci1yYWRpby1ncm91cFwiLCB7XHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJzaW1wbGVNb2RlUmFkaW9Hcm91cFwiKSxcclxuICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRcIjogdGhpcy5pZChcImVkaXRNb2RlU2ltcGxlXCIpXHJcbiAgICAgICAgICAgIH0sIHJhZGlvQnV0dG9ucyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvd01ldGFEYXRhQ2hlY2tCb3ggPSB0aGlzLm1ha2VDaGVja0JveChcIlNob3cgUm93IE1ldGFkYXRhXCIsIFwic2hvd01ldGFEYXRhXCIsIG1ldGE2NC5zaG93TWV0YURhdGEpO1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tib3hCYXIgPSByZW5kZXIubWFrZUhvcnpDb250cm9sR3JvdXAoc2hvd01ldGFEYXRhQ2hlY2tCb3gpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHJhZGlvQnV0dG9uR3JvdXA7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVnZW5kID0gXCI8bGVnZW5kPkVkaXQgTW9kZTo8L2xlZ2VuZD5cIjtcclxuICAgICAgICAgICAgdmFyIHJhZGlvQmFyID0gcmVuZGVyLm1ha2VIb3J6Q29udHJvbEdyb3VwKGxlZ2VuZCArIGZvcm1Db250cm9scyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcmVmZXJlbmNlc0J1dHRvblwiLCB0aGlzLnNhdmVQcmVmZXJlbmNlcywgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2F2ZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgcmFkaW9CYXIgKyBjaGVja2JveEJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlcyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvbHlFbG0gPSB1dGlsLnBvbHlFbG0odGhpcy5pZChcInNpbXBsZU1vZGVSYWRpb0dyb3VwXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LmVkaXRNb2RlT3B0aW9uID0gcG9seUVsbS5ub2RlLnNlbGVjdGVkID09IHRoaXMuaWQoXCJlZGl0TW9kZVNpbXBsZVwiKSA/IG1ldGE2NC5NT0RFX1NJTVBMRVxyXG4gICAgICAgICAgICAgICAgOiBtZXRhNjQuTU9ERV9BRFZBTkNFRDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzaG93TWV0YURhdGFDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgbWV0YTY0LnNob3dNZXRhRGF0YSA9IHNob3dNZXRhRGF0YUNoZWNrYm94Lm5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXF1ZXN0LCBqc29uLlNhdmVVc2VyUHJlZmVyZW5jZXNSZXNwb25zZT4oXCJzYXZlVXNlclByZWZlcmVuY2VzXCIsIHtcclxuICAgICAgICAgICAgICAgIC8vdG9kby0wOiBib3RoIG9mIHRoZXNlIG9wdGlvbnMgc2hvdWxkIGNvbWUgZnJvbSBtZXRhNjQudXNlclByZWZlcm5jZXMsIGFuZCBub3QgYmUgc3RvcmVkIGRpcmVjdGx5IG9uIG1ldGE2NCBzY29wZS5cclxuICAgICAgICAgICAgICAgIFwidXNlclByZWZlcmVuY2VzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImFkdmFuY2VkTW9kZVwiOiBtZXRhNjQuZWRpdE1vZGVPcHRpb24gPT09IG1ldGE2NC5NT0RFX0FEVkFOQ0VELFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZWRpdE1vZGVcIjogbWV0YTY0LnVzZXJQcmVmZXJlbmNlcy5lZGl0TW9kZSxcclxuICAgICAgICAgICAgICAgICAgICAvKiB0b2RvLTE6IGhvdyBjYW4gSSBmbGFnIGEgcHJvcGVydHkgYXMgb3B0aW9uYWwgaW4gVHlwZVNjcmlwdCBnZW5lcmF0b3IgPyBXb3VsZCBiZSBwcm9iYWJseSBzb21lIGtpbmQgb2YganNvbi9qYWNrc29uIEByZXF1aXJlZCBhbm5vdGF0aW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsYXN0Tm9kZVwiOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1wb3J0QWxsb3dlZFwiOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBcImV4cG9ydEFsbG93ZWRcIjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaG93TWV0YURhdGFcIjogbWV0YTY0LnNob3dNZXRhRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLnNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNhdmVQcmVmZXJlbmNlc1Jlc3BvbnNlID0gKHJlczoganNvbi5TYXZlVXNlclByZWZlcmVuY2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2F2aW5nIFByZWZlcmVuY2VzXCIsIHJlcykpIHtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0b2RvLTI6IHRyeSBhbmQgbWFpbnRhaW4gc2Nyb2xsIHBvc2l0aW9uID8gdGhpcyBpcyBnb2luZyB0byBiZSBhc3luYywgc28gd2F0Y2ggb3V0LlxyXG4gICAgICAgICAgICAgICAgLy8gdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2ltcGxlTW9kZVJhZGlvR3JvdXBcIikpO1xyXG4gICAgICAgICAgICBwb2x5RWxtLm5vZGUuc2VsZWN0KG1ldGE2NC5lZGl0TW9kZU9wdGlvbiA9PSBtZXRhNjQuTU9ERV9TSU1QTEUgPyB0aGlzLmlkKFwiZWRpdE1vZGVTaW1wbGVcIikgOiB0aGlzXHJcbiAgICAgICAgICAgICAgICAuaWQoXCJlZGl0TW9kZUFkdmFuY2VkXCIpKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBwdXQgdGhlc2UgdHdvIGxpbmVzIGluIGEgdXRpbGl0eSBtZXRob2RcclxuICAgICAgICAgICAgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGlzLmlkKFwic2hvd01ldGFEYXRhXCIpKTtcclxuICAgICAgICAgICAgcG9seUVsbS5ub2RlLmNoZWNrZWQgPSBtZXRhNjQuc2hvd01ldGFEYXRhO1xyXG5cclxuICAgICAgICAgICAgUG9seW1lci5kb20uZmx1c2goKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogTWFuYWdlQWNjb3VudERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hbmFnZUFjY291bnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwiTWFuYWdlQWNjb3VudERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJNYW5hZ2UgQWNjb3VudFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDYW5jZWxcIiwgXCJjYW5jZWxQcmVmZXJlbmNlc0RsZ0J1dHRvblwiKTtcclxuICAgICAgICAgICAgdmFyIGNsb3NlQWNjb3VudEJ1dHRvbiA9IG1ldGE2NC5pc0FkbWluVXNlciA/IFwiQWRtaW4gQ2Fubm90IENsb3NlIEFjb3VudFwiIDogdGhpcy5tYWtlQnV0dG9uKFwiQ2xvc2UgQWNjb3VudFwiLCBcImNsb3NlQWNjb3VudEJ1dHRvblwiLCBcInByZWZzLmNsb3NlQWNjb3VudCgpO1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2xvc2VBY2NvdW50QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoYmFja0J1dHRvbik7XHJcbiAgICAgICAgICAgIHZhciBib3R0b21CdXR0b25CYXJEaXYgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjbG9zZS1hY2NvdW50LWJhclwiXHJcbiAgICAgICAgICAgIH0sIGJvdHRvbUJ1dHRvbkJhcik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgYnV0dG9uQmFyICsgYm90dG9tQnV0dG9uQmFyRGl2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBFeHBvcnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBFeHBvcnREbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIkV4cG9ydERsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiRXhwb3J0IHRvIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkV4cG9ydCB0byBGaWxlIE5hbWVcIiwgXCJleHBvcnRUYXJnZXROb2RlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGV4cG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkV4cG9ydFwiLCBcImV4cG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuZXhwb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsRXhwb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihleHBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwiZXhwb3J0VGFyZ2V0Tm9kZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHRhcmdldEZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBleHBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uRXhwb3J0UmVxdWVzdCwganNvbi5FeHBvcnRSZXNwb25zZT4oXCJleHBvcnRUb1htbFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGhpZ2hsaWdodE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIFwidGFyZ2V0RmlsZU5hbWVcIjogdGFyZ2V0RmlsZU5hbWVcbiAgICAgICAgICAgICAgICB9LCB0aGlzLmV4cG9ydFJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cG9ydFJlc3BvbnNlID0gKHJlczoganNvbi5FeHBvcnRSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRXhwb3J0XCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFeHBvcnQgU3VjY2Vzc2Z1bC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogSW1wb3J0RGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgSW1wb3J0RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJJbXBvcnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkltcG9ydCBmcm9tIFhNTFwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkZpbGUgbmFtZSB0byBpbXBvcnRcIiwgXCJzb3VyY2VGaWxlTmFtZVwiKTtcblxuICAgICAgICAgICAgdmFyIGltcG9ydEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkltcG9ydFwiLCBcImltcG9ydE5vZGVzQnV0dG9uXCIsIHRoaXMuaW1wb3J0Tm9kZXMsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsSW1wb3J0QnV0dG9uXCIpO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihpbXBvcnRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltcG9ydE5vZGVzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodE5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgc291cmNlRmlsZU5hbWUgPSB0aGlzLmdldElucHV0VmFsKFwic291cmNlRmlsZU5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNvdXJjZUZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBpbXBvcnQgZmlsZS5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW1wb3J0UmVxdWVzdCwganNvbi5JbXBvcnRSZXNwb25zZT4oXCJpbXBvcnRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZUZpbGVOYW1lXCI6IHNvdXJjZUZpbGVOYW1lXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5pbXBvcnRSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbXBvcnRSZXNwb25zZSA9IChyZXM6IGpzb24uSW1wb3J0UmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIkltcG9ydFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiSW1wb3J0IFN1Y2Nlc3NmdWwuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2Nyb2xsVG9TZWxlY3RlZE5vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNlYXJjaENvbnRlbnREbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hDb250ZW50RGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaENvbnRlbnREbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlNlYXJjaCBDb250ZW50XCIpO1xuXG4gICAgICAgICAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gdGhpcy5tYWtlTWVzc2FnZUFyZWEoXCJFbnRlciBzb21lIHRleHQgdG8gZmluZC4gT25seSBjb250ZW50IHRleHQgd2lsbCBiZSBzZWFyY2hlZC4gQWxsIHN1Yi1ub2RlcyB1bmRlciB0aGUgc2VsZWN0ZWQgbm9kZSBhcmUgaW5jbHVkZWQgaW4gdGhlIHNlYXJjaC5cIik7XG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlRWRpdEZpZWxkKFwiU2VhcmNoXCIsIFwic2VhcmNoVGV4dFwiKTtcblxuICAgICAgICAgICAgdmFyIHNlYXJjaEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2VhcmNoXCIsIFwic2VhcmNoTm9kZXNCdXR0b25cIiwgdGhpcy5zZWFyY2hOb2RlcywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hOb2RlcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlYXJjaFByb3BlcnR5KGpjckNuc3QuQ09OVEVOVCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hQcm9wZXJ0eSA9IChzZWFyY2hQcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICghdXRpbC5hamF4UmVhZHkoXCJzZWFyY2hOb2Rlc1wiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgaSBnZXQgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBub2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiTm8gbm9kZSBpcyBzZWxlY3RlZCB0byBzZWFyY2ggdW5kZXIuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIHNlYXJjaFRleHQgPSB0aGlzLmdldElucHV0VmFsKFwic2VhcmNoVGV4dFwiKTtcbiAgICAgICAgICAgIGlmICh1dGlsLmVtcHR5U3RyaW5nKHNlYXJjaFRleHQpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBNZXNzYWdlRGxnKFwiRW50ZXIgc2VhcmNoIHRleHQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5Ob2RlU2VhcmNoUmVxdWVzdCwganNvbi5Ob2RlU2VhcmNoUmVzcG9uc2U+KFwibm9kZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBcInNvcnREaXJcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcInNvcnRGaWVsZFwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoUHJvcFwiOiBzZWFyY2hQcm9wXG4gICAgICAgICAgICB9LCBzcmNoLnNlYXJjaE5vZGVzUmVzcG9uc2UsIHNyY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgICAgICAgICAgdGhpcy5mb2N1cyhcInNlYXJjaFRleHRcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTZWFyY2hUYWdzRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoVGFnc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTZWFyY2hUYWdzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggVGFnc1wiKTtcblxuICAgICAgICAgICAgdmFyIGluc3RydWN0aW9ucyA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgc29tZSB0ZXh0IHRvIGZpbmQuIE9ubHkgdGFncyB0ZXh0IHdpbGwgYmUgc2VhcmNoZWQuIEFsbCBzdWItbm9kZXMgdW5kZXIgdGhlIHNlbGVjdGVkIG5vZGUgYXJlIGluY2x1ZGVkIGluIHRoZSBzZWFyY2guXCIpO1xuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlNlYXJjaFwiLCBcInNlYXJjaFRleHRcIik7XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2hCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlNlYXJjaFwiLCBcInNlYXJjaE5vZGVzQnV0dG9uXCIsIHRoaXMuc2VhcmNoVGFncywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxTZWFyY2hCdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNlYXJjaEJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGhlYWRlciArIGluc3RydWN0aW9ucyArIGZvcm1Db250cm9scyArIGJ1dHRvbkJhcjtcbiAgICAgICAgICAgIHRoaXMuYmluZEVudGVyS2V5KFwic2VhcmNoVGV4dFwiLCBzcmNoLnNlYXJjaE5vZGVzKVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWFyY2hUYWdzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoUHJvcGVydHkoamNyQ25zdC5UQUdTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFByb3BlcnR5ID0gKHNlYXJjaFByb3A6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmFqYXhSZWFkeShcInNlYXJjaE5vZGVzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1bnRpbCBpIGdldCBiZXR0ZXIgdmFsaWRhdGlvblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBtZXRhNjQuZ2V0SGlnaGxpZ2h0ZWROb2RlKCk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJObyBub2RlIGlzIHNlbGVjdGVkIHRvIHNlYXJjaCB1bmRlci5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgc2VhcmNoVGV4dCA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzZWFyY2hUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHV0aWwuZW1wdHlTdHJpbmcoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJFbnRlciBzZWFyY2ggdGV4dC5cIikpLm9wZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLk5vZGVTZWFyY2hSZXF1ZXN0LCBqc29uLk5vZGVTZWFyY2hSZXNwb25zZT4oXCJub2RlU2VhcmNoXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgIFwic2VhcmNoVGV4dFwiOiBzZWFyY2hUZXh0LFxuICAgICAgICAgICAgICAgIFwic29ydERpclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgIFwic29ydEZpZWxkXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzZWFyY2hQcm9wXCI6IHNlYXJjaFByb3BcbiAgICAgICAgICAgIH0sIHNyY2guc2VhcmNoTm9kZXNSZXNwb25zZSwgc3JjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXModGhpcy5pZChcInNlYXJjaFRleHRcIikpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogU2VhcmNoRmlsZXNEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTZWFyY2hGaWxlc0RsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbHVjZW5lOiBib29sZWFuKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNlYXJjaEZpbGVzRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTZWFyY2ggRmlsZXNcIik7XG5cbiAgICAgICAgICAgIHZhciBpbnN0cnVjdGlvbnMgPSB0aGlzLm1ha2VNZXNzYWdlQXJlYShcIkVudGVyIHNvbWUgdGV4dCB0byBmaW5kLlwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJTZWFyY2hcIiwgXCJzZWFyY2hUZXh0XCIpO1xuXG4gICAgICAgICAgICB2YXIgc2VhcmNoQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTZWFyY2hcIiwgXCJzZWFyY2hCdXR0b25cIiwgdGhpcy5zZWFyY2hUYWdzLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFNlYXJjaEJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2VhcmNoQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaGVhZGVyICsgaW5zdHJ1Y3Rpb25zICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICAgICAgdGhpcy5iaW5kRW50ZXJLZXkoXCJzZWFyY2hUZXh0XCIsIHNyY2guc2VhcmNoTm9kZXMpXG4gICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlYXJjaFRhZ3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hQcm9wZXJ0eShqY3JDbnN0LlRBR1MpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VhcmNoUHJvcGVydHkgPSAoc2VhcmNoUHJvcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXV0aWwuYWpheFJlYWR5KFwic2VhcmNoRmlsZXNcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVudGlsIGkgZ2V0IGJldHRlciB2YWxpZGF0aW9uXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk5vIG5vZGUgaXMgc2VsZWN0ZWQgdG8gc2VhcmNoIHVuZGVyLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdW50aWwgYmV0dGVyIHZhbGlkYXRpb25cbiAgICAgICAgICAgIHZhciBzZWFyY2hUZXh0ID0gdGhpcy5nZXRJbnB1dFZhbChcInNlYXJjaFRleHRcIik7XG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhzZWFyY2hUZXh0KSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkVudGVyIHNlYXJjaCB0ZXh0LlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG5vZGVJZDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgICAgIGxldCBzZWxOb2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHNlbE5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlSWQgPSBzZWxOb2RlLmlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5GaWxlU2VhcmNoUmVxdWVzdCwganNvbi5GaWxlU2VhcmNoUmVzcG9uc2U+KFwiZmlsZVNlYXJjaFwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogbm9kZUlkLFxuICAgICAgICAgICAgICAgIFwicmVpbmRleFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlYXJjaFRleHRcIjogc2VhcmNoVGV4dFxuICAgICAgICAgICAgfSwgc3JjaC5zZWFyY2hGaWxlc1Jlc3BvbnNlLCBzcmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmRlbGF5ZWRGb2N1cyh0aGlzLmlkKFwic2VhcmNoVGV4dFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDaGFuZ2VQYXNzd29yZERsZy5qc1wiKTtcclxuXHJcbm5hbWVzcGFjZSBtNjQge1xyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5nZVBhc3N3b3JkRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XHJcblxyXG4gICAgICAgIHB3ZDogc3RyaW5nO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhc3NDb2RlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJDaGFuZ2VQYXNzd29yZERsZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIElmIHRoZSB1c2VyIGlzIGRvaW5nIGEgXCJSZXNldCBQYXNzd29yZFwiIHdlIHdpbGwgaGF2ZSBhIG5vbi1udWxsIHBhc3NDb2RlIGhlcmUsIGFuZCB3ZSBzaW1wbHkgc2VuZCB0aGlzIHRvIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiB3aGVyZSBpdCB3aWxsIHZhbGlkYXRlIHRoZSBwYXNzQ29kZSwgYW5kIGlmIGl0J3MgdmFsaWQgdXNlIGl0IHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgcGFzc3dvcmQgY2hhbmdlIG9uIHRoZSBjb3JyZWN0XHJcbiAgICAgICAgICogdXNlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG5cclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcih0aGlzLnBhc3NDb2RlID8gXCJQYXNzd29yZCBSZXNldFwiIDogXCJDaGFuZ2UgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHJlbmRlci50YWcoXCJwXCIsIHtcclxuXHJcbiAgICAgICAgICAgIH0sIFwiRW50ZXIgeW91ciBuZXcgcGFzc3dvcmQgYmVsb3cuLi5cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybUNvbnRyb2xzID0gdGhpcy5tYWtlUGFzc3dvcmRGaWVsZChcIk5ldyBQYXNzd29yZFwiLCBcImNoYW5nZVBhc3N3b3JkMVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjaGFuZ2VQYXNzd29yZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2hhbmdlIFBhc3N3b3JkXCIsIFwiY2hhbmdlUGFzc3dvcmRBY3Rpb25CdXR0b25cIixcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFzc3dvcmQsIHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjYW5jZWxDaGFuZ2VQYXNzd29yZEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoY2hhbmdlUGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHdkID0gdGhpcy5nZXRJbnB1dFZhbChcImNoYW5nZVBhc3N3b3JkMVwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wd2QgJiYgdGhpcy5wd2QubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkNoYW5nZVBhc3N3b3JkUmVxdWVzdCwganNvbi5DaGFuZ2VQYXNzd29yZFJlc3BvbnNlPihcImNoYW5nZVBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5ld1Bhc3N3b3JkXCI6IHRoaXMucHdkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc0NvZGVcIjogdGhpcy5wYXNzQ29kZVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5jaGFuZ2VQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIkludmFsaWQgcGFzc3dvcmQocykuXCIpKS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkUmVzcG9uc2UgPSAocmVzOiBqc29uLkNoYW5nZVBhc3N3b3JkUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQ2hhbmdlIHBhc3N3b3JkXCIsIHJlcykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0gXCJQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1zZyArPSBcIjxwPllvdSBtYXkgbm93IGxvZ2luIGFzIDxiPlwiICsgcmVzLnVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyBcIjwvYj4gd2l0aCB5b3VyIG5ldyBwYXNzd29yZC5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcobXNnLCBcIlBhc3N3b3JkIENoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpei5wYXNzQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbG9naW4gY2FsbCBET0VTIHdvcmssIGJ1dCB0aGUgcmVhc29uIHdlIGRvbid0IGRvIHRoaXMgaXMgYmVjYXVzZSB0aGUgVVJMIHN0aWxsIGhhcyB0aGUgcGFzc0NvZGUgb24gaXQgYW5kIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vd2FudCB0byBkaXJlY3QgdGhlIHVzZXIgdG8gYSB1cmwgd2l0aG91dCB0aGF0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VzZXIubG9naW4obnVsbCwgcmVzLnVzZXIsIHRoaXoucHdkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKFwiY2hhbmdlUGFzc3dvcmQxXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBSZXNldFBhc3N3b3JkRGxnLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgUmVzZXRQYXNzd29yZERsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVzZXI6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcIlJlc2V0UGFzc3dvcmREbGdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiUmVzZXQgUGFzc3dvcmRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubWFrZU1lc3NhZ2VBcmVhKFwiRW50ZXIgeW91ciB1c2VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MgYW5kIGEgY2hhbmdlLXBhc3N3b3JkIGxpbmsgd2lsbCBiZSBzZW50IHRvIHlvdVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtQ29udHJvbHMgPSB0aGlzLm1ha2VFZGl0RmllbGQoXCJVc2VyXCIsIFwidXNlck5hbWVcIikgKyAvL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlRWRpdEZpZWxkKFwiRW1haWwgQWRkcmVzc1wiLCBcImVtYWlsQWRkcmVzc1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXNldFBhc3N3b3JkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJSZXNldCBteSBQYXNzd29yZFwiLCBcInJlc2V0UGFzc3dvcmRCdXR0b25cIixcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbFJlc2V0UGFzc3dvcmRCdXR0b25cIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHJlc2V0UGFzc3dvcmRCdXR0b24gKyBiYWNrQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtZXNzYWdlICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzZXRQYXNzd29yZCA9ICgpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1c2VyTmFtZSA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJ1c2VyTmFtZVwiKS50cmltKCk7XHJcbiAgICAgICAgICAgIHZhciBlbWFpbEFkZHJlc3MgPSB0aGlzLmdldElucHV0VmFsKFwiZW1haWxBZGRyZXNzXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1c2VyTmFtZSAmJiBlbWFpbEFkZHJlc3MpIHtcclxuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlc2V0UGFzc3dvcmRSZXF1ZXN0LCBqc29uLlJlc2V0UGFzc3dvcmRSZXNwb25zZT4oXCJyZXNldFBhc3N3b3JkXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBcInVzZXJcIjogdXNlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiBlbWFpbEFkZHJlc3NcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMucmVzZXRQYXNzd29yZFJlc3BvbnNlLCB0aGlzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIk9vcHMuIFRyeSB0aGF0IGFnYWluLlwiKSkub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNldFBhc3N3b3JkUmVzcG9uc2UgPSAocmVzOiBqc29uLlJlc2V0UGFzc3dvcmRSZXNwb25zZSk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5jaGVja1N1Y2Nlc3MoXCJSZXNldCBwYXNzd29yZFwiLCByZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQYXNzd29yZCByZXNldCBlbWFpbCB3YXMgc2VudC4gQ2hlY2sgeW91ciBpbmJveC5cIikpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbnB1dFZhbChcInVzZXJOYW1lXCIsIHRoaXMudXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbUZpbGVEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRGcm9tRmlsZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJVcGxvYWRGcm9tRmlsZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiVXBsb2FkIEZpbGUgQXR0YWNobWVudFwiKTtcblxuICAgICAgICAgICAgbGV0IHVwbG9hZFBhdGhEaXNwbGF5ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICB1cGxvYWRQYXRoRGlzcGxheSArPSByZW5kZXIudGFnKFwiZGl2XCIsIHsvL1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInBhdGgtZGlzcGxheS1pbi1lZGl0b3JcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdXBsb2FkRmllbGRDb250YWluZXIgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRm9yIG5vdyBJIGp1c3QgaGFyZC1jb2RlIGluIDcgZWRpdCBmaWVsZHMsIGJ1dCB3ZSBjb3VsZCB0aGVvcmV0aWNhbGx5IG1ha2UgdGhpcyBkeW5hbWljIHNvIHVzZXIgY2FuIGNsaWNrICdhZGQnXG4gICAgICAgICAgICAgKiBidXR0b24gYW5kIGFkZCBuZXcgb25lcyBvbmUgYXQgYSB0aW1lLiBKdXN0IG5vdCB0YWtpbmcgdGhlIHRpbWUgdG8gZG8gdGhhdCB5ZXQuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogdG9kby0wOiBUaGlzIGlzIHVnbHkgdG8gcHJlLWNyZWF0ZSB0aGVzZSBpbnB1dCBmaWVsZHMuIE5lZWQgdG8gbWFrZSB0aGVtIGFibGUgdG8gYWRkIGR5bmFtaWNhbGx5LlxuICAgICAgICAgICAgICogKFdpbGwgZG8gdGhpcyBtb2RpZmljYXRpb24gb25jZSBJIGdldCB0aGUgZHJhZy1uLWRyb3Agc3R1ZmYgd29ya2luZyBmaXJzdClcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSByZW5kZXIudGFnKFwiaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmaWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImZpbGVzXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8qIHdyYXAgaW4gRElWIHRvIGZvcmNlIHZlcnRpY2FsIGFsaWduICovXG4gICAgICAgICAgICAgICAgZm9ybUZpZWxkcyArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIm1hcmdpbi1ib3R0b206IDEwcHg7XCJcbiAgICAgICAgICAgICAgICB9LCBpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcm1GaWVsZHMgKz0gcmVuZGVyLnRhZyhcImlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVJZFwiXG4gICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLyogYm9vbGVhbiBmaWVsZCB0byBzcGVjaWZ5IGlmIHdlIGV4cGxvZGUgemlwIGZpbGVzIG9udG8gdGhlIEpDUiB0cmVlICovXG4gICAgICAgICAgICBmb3JtRmllbGRzICs9IHJlbmRlci50YWcoXCJpbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZXhwbG9kZVppcHNcIiksXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhwbG9kZVppcHNcIlxuICAgICAgICAgICAgfSwgXCJcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtID0gcmVuZGVyLnRhZyhcImZvcm1cIiwge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcInVwbG9hZEZvcm1cIiksXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJlbmN0eXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuICAgICAgICAgICAgICAgIFwiZGF0YS1hamF4XCI6IFwiZmFsc2VcIiAvLyBORVcgZm9yIG11bHRpcGxlIGZpbGUgdXBsb2FkIHN1cHBvcnQ/Pz9cbiAgICAgICAgICAgIH0sIGZvcm1GaWVsZHMpO1xuXG4gICAgICAgICAgICB1cGxvYWRGaWVsZENvbnRhaW5lciA9IHJlbmRlci50YWcoXCJkaXZcIiwgey8vXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkRmllbGRDb250YWluZXJcIilcbiAgICAgICAgICAgIH0sIFwiPHA+VXBsb2FkIGZyb20geW91ciBjb21wdXRlcjwvcD5cIiArIGZvcm0pO1xuXG4gICAgICAgICAgICBsZXQgdXBsb2FkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJVcGxvYWRcIiwgXCJ1cGxvYWRCdXR0b25cIiwgdGhpcy51cGxvYWRGaWxlTm93LCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBiYWNrQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlVXBsb2FkQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcih1cGxvYWRCdXR0b24gKyBiYWNrQnV0dG9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIHVwbG9hZFBhdGhEaXNwbGF5ICsgdXBsb2FkRmllbGRDb250YWluZXIgKyBidXR0b25CYXI7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNBbnlaaXBGaWxlcyA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsID0gJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRcIiArIGkgKyBcIkZvcm1JbnB1dElkXCIpKS52YWwoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWwudG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRGdW5jID0gKGV4cGxvZGVaaXBzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogVXBsb2FkIGZvcm0gaGFzIGhpZGRlbiBpbnB1dCBlbGVtZW50IGZvciBub2RlSWQgcGFyYW1ldGVyICovXG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRGb3JtTm9kZUlkXCIpKS5hdHRyKFwidmFsdWVcIiwgYXR0YWNobWVudC51cGxvYWROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImV4cGxvZGVaaXBzXCIpKS5hdHRyKFwidmFsdWVcIiwgZXhwbG9kZVppcHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XG5cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2Ugd2UgZG8gc29tZXRoaW5nIGRpZmZlcmVudGx5IGZyb20gdGhlIG5vcm1hbCAndXRpbC5qc29uKCknIGNhbGxzIHRvIHRoZSBzZXJ2ZXIsIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgKiB0aGlzIGlzIGhpZ2hseSBzcGVjaWFsaXplZCBoZXJlIGZvciBmb3JtIHVwbG9hZGluZywgYW5kIGlzIGRpZmZlcmVudCBmcm9tIG5vcm1hbCBhamF4IGNhbGxzLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKDxIVE1MRm9ybUVsZW1lbnQ+KCQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkRm9ybVwiKSlbMF0pKTtcblxuICAgICAgICAgICAgICAgIGxldCBwcm1zID0gJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGE2NC5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBwcm1zLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlVwbG9hZCBmYWlsZWQuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNBbnlaaXBGaWxlcygpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9LC8vXG4gICAgICAgICAgICAgICAgICAgIC8vTm8gZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRGdW5jKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwbG9hZEZ1bmMoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qIGRpc3BsYXkgdGhlIG5vZGUgcGF0aCBhdCB0aGUgdG9wIG9mIHRoZSBlZGl0IHBhZ2UgKi9cbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIikpLmh0bWwoXCJQYXRoOiBcIiArIHJlbmRlci5mb3JtYXRQYXRoKGF0dGFjaG1lbnQudXBsb2FkTm9kZSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFVwbG9hZEZyb21GaWxlRHJvcHpvbmVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiVXBsb2FkRnJvbUZpbGVEcm9wem9uZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVMaXN0OiBPYmplY3RbXSA9IG51bGw7XG4gICAgICAgIHppcFF1ZXN0aW9uQW5zd2VyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZXhwbG9kZVppcHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1GaWVsZHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZCBBY3Rpb24gVVJMOiBcIiArIHBvc3RUYXJnZXRVcmwgKyBcInVwbG9hZFwiKTtcblxuICAgICAgICAgICAgbGV0IGhpZGRlbklucHV0Q29udGFpbmVyID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiaGlkZGVuSW5wdXRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcImRpc3BsYXk6IG5vbmU7XCJcbiAgICAgICAgICAgIH0sIFwiXCIpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybSA9IHJlbmRlci50YWcoXCJmb3JtXCIsIHtcbiAgICAgICAgICAgICAgICBcImFjdGlvblwiOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICBcImF1dG9Qcm9jZXNzUXVldWVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgLyogTm90ZTogd2UgYWxzbyBoYXZlIHNvbWUgc3R5bGluZyBpbiBtZXRhNjQuY3NzIGZvciAnZHJvcHpvbmUnICovXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImRyb3B6b25lXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwiZHJvcHpvbmUtZm9ybS1pZFwiKVxuICAgICAgICAgICAgfSwgXCJcIik7XG5cbiAgICAgICAgICAgIGxldCB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVVwbG9hZEJ1dHRvblwiKTtcbiAgICAgICAgICAgIGxldCBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIGZvcm0gKyBoaWRkZW5JbnB1dENvbnRhaW5lciArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ3VyZURyb3Bab25lID0gKCk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgY29uZmlnOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VGFyZ2V0VXJsICsgXCJ1cGxvYWRcIixcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50cyBEcm9wem9uZSBmcm9tIHVwbG9hZGluZyBkcm9wcGVkIGZpbGVzIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgYXV0b1Byb2Nlc3NRdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiBcImZpbGVzXCIsXG4gICAgICAgICAgICAgICAgbWF4RmlsZXNpemU6IDIsXG4gICAgICAgICAgICAgICAgcGFyYWxsZWxVcGxvYWRzOiAxMCxcblxuICAgICAgICAgICAgICAgIC8qIE5vdCBzdXJlIHdoYXQncyB0aGlzIGlzIGZvciwgYnV0IHRoZSAnZmlsZXMnIHBhcmFtZXRlciBvbiB0aGUgc2VydmVyIGlzIGFsd2F5cyBOVUxMLCB1bmxlc3NcbiAgICAgICAgICAgICAgICB0aGUgdXBsb2FkTXVsdGlwbGUgaXMgZmFsc2UgKi9cbiAgICAgICAgICAgICAgICB1cGxvYWRNdWx0aXBsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgICAgICAgICAgICAgZGljdERlZmF1bHRNZXNzYWdlOiBcIkRyYWcgJiBEcm9wIGZpbGVzIGhlcmUsIG9yIENsaWNrXCIsXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXRDb250YWluZXI6IFwiI1wiICsgdGhpei5pZChcImhpZGRlbklucHV0Q29udGFpbmVyXCIpLFxuXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBUaGlzIGRvZXNuJ3Qgd29yayBhdCBhbGwuIERyb3B6b25lIGFwcGFyZW50bHkgY2xhaW1zIHRvIHN1cHBvcnQgdGhpcyBidXQgZG9lc24ndC5cbiAgICAgICAgICAgICAgICBTZWUgdGhlIFwic2VuZGluZ1wiIGZ1bmN0aW9uIGJlbG93LCB3aGVyZSBJIGVuZGVkIHVwIHBhc3NpbmcgdGhlc2UgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiIDogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcImV4cGxvZGVaaXBzXCIgOiBleHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkcm9wem9uZSA9IHRoaXM7IC8vIGNsb3N1cmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGl6LmlkKFwidXBsb2FkQnV0dG9uXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIGdldCB1cGxvYWQgYnV0dG9uLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wem9uZS5wcm9jZXNzUXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbihcImFkZGVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJyZW1vdmVkZmlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXoudXBkYXRlRmlsZUxpc3QodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LnJ1bkJ1dHRvbkVuYWJsZW1lbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub24oXCJzZW5kaW5nXCIsIGZ1bmN0aW9uKGZpbGUsIHhociwgZm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcIm5vZGVJZFwiLCBhdHRhY2htZW50LnVwbG9hZE5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZXhwbG9kZVppcHNcIiwgdGhpcy5leHBsb2RlWmlwcyA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uKFwicXVldWVjb21wbGV0ZVwiLCBmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAoPGFueT4kKFwiI1wiICsgdGhpcy5pZChcImRyb3B6b25lLWZvcm0taWRcIikpKS5kcm9wem9uZShjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlRmlsZUxpc3QgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5maWxlTGlzdCA9IGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKTtcbiAgICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSB0aGlzLmZpbGVMaXN0LmNvbmNhdChkcm9wem9uZUV2dC5nZXRRdWV1ZWRGaWxlcygpKTtcblxuICAgICAgICAgICAgLyogRGV0ZWN0IGlmIGFueSBaSVAgZmlsZXMgYXJlIGN1cnJlbnRseSBzZWxlY3RlZCwgYW5kIGFzayB1c2VyIHRoZSBxdWVzdGlvbiBhYm91dCB3aGV0aGVyIHRoZXlcbiAgICAgICAgICAgIHNob3VsZCBiZSBleHRyYWN0ZWQgYXV0b21hdGljYWxseSBkdXJpbmcgdGhlIHVwbG9hZCwgYW5kIHVwbG9hZGVkIGFzIGluZGl2aWR1YWwgbm9kZXNcbiAgICAgICAgICAgIGZvciBlYWNoIGZpbGUgKi9cbiAgICAgICAgICAgIGlmICghdGhpcy56aXBRdWVzdGlvbkFuc3dlcmVkICYmIHRoaXMuaGFzQW55WmlwRmlsZXMoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuemlwUXVlc3Rpb25BbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiRXhwbG9kZSBaaXBzP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkRvIHlvdSB3YW50IFppcCBmaWxlcyBleHBsb2RlZCBvbnRvIHRoZSB0cmVlIHdoZW4gdXBsb2FkZWQ/XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiWWVzLCBleHBsb2RlIHppcHNcIiwgLy9cbiAgICAgICAgICAgICAgICAgICAgLy9ZZXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGl6LmV4cGxvZGVaaXBzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSwvL1xuICAgICAgICAgICAgICAgICAgICAvL05vIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpei5leHBsb2RlWmlwcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KSkub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaGFzQW55WmlwRmlsZXMgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICBsZXQgcmV0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBmaWxlIG9mIHRoaXMuZmlsZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZVtcIm5hbWVcIl0udG9Mb3dlckNhc2UoKS5lbmRzV2l0aChcIi56aXBcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bkJ1dHRvbkVuYWJsZW1lbnQgPSAoZHJvcHpvbmVFdnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKGRyb3B6b25lRXZ0LmdldEFkZGVkRmlsZXMoKS5sZW5ndGggPiAwIHx8XG4gICAgICAgICAgICAgICAgZHJvcHpvbmVFdnQuZ2V0UXVldWVkRmlsZXMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRCdXR0b25cIikpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLmlkKFwidXBsb2FkQnV0dG9uXCIpKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLyogZGlzcGxheSB0aGUgbm9kZSBwYXRoIGF0IHRoZSB0b3Agb2YgdGhlIGVkaXQgcGFnZSAqL1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJ1cGxvYWRQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgcmVuZGVyLmZvcm1hdFBhdGgoYXR0YWNobWVudC51cGxvYWROb2RlKSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJlRHJvcFpvbmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFVwbG9hZEZyb21VcmxEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBVcGxvYWRGcm9tVXJsRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlVwbG9hZEZyb21VcmxEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlVwbG9hZCBGaWxlIEF0dGFjaG1lbnRcIik7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRQYXRoRGlzcGxheSA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmIChjbnN0LlNIT1dfUEFUSF9JTl9ETEdTKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkUGF0aERpc3BsYXkgKz0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKFwidXBsb2FkUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVwbG9hZEZpZWxkQ29udGFpbmVyID0gXCJcIjtcbiAgICAgICAgICAgIHZhciB1cGxvYWRGcm9tVXJsRGl2ID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHVwbG9hZEZyb21VcmxGaWVsZCA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVwbG9hZCBGcm9tIFVSTFwiLCBcInVwbG9hZEZyb21VcmxcIik7XG4gICAgICAgICAgICB1cGxvYWRGcm9tVXJsRGl2ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7Ly9cbiAgICAgICAgICAgIH0sIHVwbG9hZEZyb21VcmxGaWVsZCk7XG5cbiAgICAgICAgICAgIHZhciB1cGxvYWRCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIlVwbG9hZFwiLCBcInVwbG9hZEJ1dHRvblwiLCB0aGlzLnVwbG9hZEZpbGVOb3csIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2xvc2VVcGxvYWRCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIodXBsb2FkQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyB1cGxvYWRQYXRoRGlzcGxheSArIHVwbG9hZEZpZWxkQ29udGFpbmVyICsgdXBsb2FkRnJvbVVybERpdiArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwbG9hZEZpbGVOb3cgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlVXJsID0gdGhpcy5nZXRJbnB1dFZhbChcInVwbG9hZEZyb21VcmxcIik7XG5cbiAgICAgICAgICAgIC8qIGlmIHVwbG9hZGluZyBmcm9tIFVSTCAqL1xuICAgICAgICAgICAgaWYgKHNvdXJjZVVybCkge1xuICAgICAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlVwbG9hZEZyb21VcmxSZXF1ZXN0LCBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZT4oXCJ1cGxvYWRGcm9tVXJsXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJub2RlSWRcIjogYXR0YWNobWVudC51cGxvYWROb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVVybFwiOiBzb3VyY2VVcmxcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnVwbG9hZEZyb21VcmxSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGxvYWRGcm9tVXJsUmVzcG9uc2UgPSAocmVzOiBqc29uLlVwbG9hZEZyb21VcmxSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiVXBsb2FkIGZyb20gVVJMXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBtZXRhNjQucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChcInVwbG9hZEZyb21VcmxcIiksIFwiXCIpO1xuXG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcInVwbG9hZFBhdGhEaXNwbGF5XCIpKS5odG1sKFwiUGF0aDogXCIgKyByZW5kZXIuZm9ybWF0UGF0aChhdHRhY2htZW50LnVwbG9hZE5vZGUpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXROb2RlRGxnLmpzXCIpO1xuXG4vKlxuICogRWRpdG9yIERpYWxvZyAoRWRpdHMgTm9kZXMpXG4gKlxuICovXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgRWRpdE5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcblxuICAgICAgICBjb250ZW50RmllbGREb21JZDogc3RyaW5nO1xuICAgICAgICBmaWVsZElkVG9Qcm9wTWFwOiBhbnkgPSB7fTtcbiAgICAgICAgcHJvcEVudHJpZXM6IEFycmF5PFByb3BFbnRyeT4gPSBuZXcgQXJyYXk8UHJvcEVudHJ5PigpO1xuICAgICAgICBlZGl0UHJvcGVydHlEbGdJbnN0OiBhbnk7XG5cbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB0eXBlTmFtZT86IHN0cmluZywgcHJpdmF0ZSBjcmVhdGVBdFRvcD86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiRWRpdE5vZGVEbGdcIik7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBQcm9wZXJ0eSBmaWVsZHMgYXJlIGdlbmVyYXRlZCBkeW5hbWljYWxseSBhbmQgdGhpcyBtYXBzIHRoZSBET00gSURzIG9mIGVhY2ggZmllbGQgdG8gdGhlIHByb3BlcnR5IG9iamVjdCBpdFxuICAgICAgICAgICAgICogZWRpdHMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVOb2RlQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJTYXZlXCIsIFwic2F2ZU5vZGVCdXR0b25cIiwgdGhpcy5zYXZlTm9kZSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWRkUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgUHJvcGVydHlcIiwgXCJhZGRQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLmFkZFByb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBhZGRUYWdzUHJvcGVydHlCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJBZGQgVGFnc1wiLCBcImFkZFRhZ3NQcm9wZXJ0eUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGFnc1Byb3BlcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzcGxpdENvbnRlbnRCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJTcGxpdFwiLCBcInNwbGl0Q29udGVudEJ1dHRvblwiLCB0aGlzLnNwbGl0Q29udGVudCwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGVsZXRlUHJvcEJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIkRlbGV0ZVwiLCBcImRlbGV0ZVByb3BCdXR0b25cIiwgdGhpcy5kZWxldGVQcm9wZXJ0eUJ1dHRvbkNsaWNrLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBjYW5jZWxFZGl0QnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJDbG9zZVwiLCBcImNhbmNlbEVkaXRCdXR0b25cIiwgdGhpcy5jYW5jZWxFZGl0LCB0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlTm9kZUJ1dHRvbiArIGFkZFByb3BlcnR5QnV0dG9uICsgYWRkVGFnc1Byb3BlcnR5QnV0dG9uICsgZGVsZXRlUHJvcEJ1dHRvblxuICAgICAgICAgICAgICAgICsgc3BsaXRDb250ZW50QnV0dG9uICsgY2FuY2VsRWRpdEJ1dHRvbiwgXCJidXR0b25zXCIpO1xuXG4gICAgICAgICAgICAvKiB0b2RvOiBuZWVkIHNvbWV0aGluZyBiZXR0ZXIgZm9yIHRoaXMgd2hlbiBzdXBwb3J0aW5nIG1vYmlsZSAqL1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gODAwOyAvL3dpbmRvdy5pbm5lcldpZHRoICogMC42O1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDYwMDsgLy93aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKGNuc3QuU0hPV19QQVRIX0lOX0RMR1MpIHtcbiAgICAgICAgICAgICAgICBpbnRlcm5hbE1haW5Db250ZW50ICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlUGF0aERpc3BsYXlcIiksXG4gICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwYXRoLWRpc3BsYXktaW4tZWRpdG9yXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW50ZXJuYWxNYWluQ29udGVudCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5pZChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpXG4gICAgICAgICAgICB9KSArIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmlkKFwicHJvcGVydHlFZGl0RmllbGRDb250YWluZXJcIiksXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBjcmVhdGUgQ1NTIGNsYXNzIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDogMHB4OyBtYXgtd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDt3aWR0aDoxMDAlOyBvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBcInZlcnRpY2FsLWxheW91dC1yb3dcIlxuICAgICAgICAgICAgICAgIC8vXCJwYWRkaW5nLWxlZnQ6IDBweDsgd2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7IGJvcmRlcjo0cHggc29saWQgbGlnaHRHcmF5O1wiXG4gICAgICAgICAgICB9LCBcIkxvYWRpbmcuLi5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBpbnRlcm5hbE1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2VuZXJhdGVzIGFsbCB0aGUgSFRNTCBlZGl0IGZpZWxkcyBhbmQgcHV0cyB0aGVtIGludG8gdGhlIERPTSBtb2RlbCBvZiB0aGUgcHJvcGVydHkgZWRpdG9yIGRpYWxvZyBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBwb3B1bGF0ZUVkaXROb2RlUGcgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0Tm9kZVBhdGhEaXNwbGF5XCIpKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIC8qIGNsZWFyIHRoaXMgbWFwIHRvIGdldCByaWQgb2Ygb2xkIHByb3BlcnRpZXMgKi9cbiAgICAgICAgICAgIHRoaXMuZmllbGRJZFRvUHJvcE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5wcm9wRW50cmllcyA9IG5ldyBBcnJheTxQcm9wRW50cnk+KCk7XG5cbiAgICAgICAgICAgIC8qIGVkaXROb2RlIHdpbGwgYmUgbnVsbCBpZiB0aGlzIGlzIGEgbmV3IG5vZGUgYmVpbmcgY3JlYXRlZCAqL1xuICAgICAgICAgICAgaWYgKGVkaXQuZWRpdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgZXhpc3Rpbmcgbm9kZS5cIik7XG5cbiAgICAgICAgICAgICAgICAvKiBpdGVyYXRvciBmdW5jdGlvbiB3aWxsIGhhdmUgdGhlIHdyb25nICd0aGlzJyBzbyB3ZSBzYXZlIHRoZSByaWdodCBvbmUgKi9cbiAgICAgICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGVkaXRPcmRlcmVkUHJvcHMgPSBwcm9wcy5nZXRQcm9wZXJ0aWVzSW5FZGl0aW5nT3JkZXIoZWRpdC5lZGl0Tm9kZSwgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB2YXIgYWNlRmllbGRzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIFByb3BlcnR5SW5mby5qYXZhIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIFdhcm5pbmcgZWFjaCBpdGVyYXRvciBsb29wIGhhcyBpdHMgb3duICd0aGlzJ1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChlZGl0T3JkZXJlZFByb3BzLCBmdW5jdGlvbihpbmRleCwgcHJvcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIGlmIHByb3BlcnR5IG5vdCBhbGxvd2VkIHRvIGRpc3BsYXkgcmV0dXJuIHRvIGJ5cGFzcyB0aGlzIHByb3BlcnR5L2l0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW5kZXIuYWxsb3dQcm9wZXJ0eVRvRGlzcGxheShwcm9wLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhpZGluZyBwcm9wZXJ0eTogXCIgKyBwcm9wLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkSWQgPSB0aGl6LmlkKFwiZWRpdE5vZGVUZXh0Q29udGVudFwiICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGVkaXQgZmllbGQgXCIgKyBmaWVsZElkICsgXCIgZm9yIHByb3BlcnR5IFwiICsgcHJvcC5uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNNdWx0aSA9IHByb3AudmFsdWVzICYmIHByb3AudmFsdWVzLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1JlYWRPbmx5UHJvcCA9IHJlbmRlci5pc1JlYWRPbmx5UHJvcGVydHkocHJvcC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQmluYXJ5UHJvcCA9IHJlbmRlci5pc0JpbmFyeVByb3BlcnR5KHByb3AubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gbmV3IFByb3BFbnRyeShmaWVsZElkLCBwcm9wLCBpc011bHRpLCBpc1JlYWRPbmx5UHJvcCwgaXNCaW5hcnlQcm9wLCBudWxsKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGl6LmZpZWxkSWRUb1Byb3BNYXBbZmllbGRJZF0gPSBwcm9wRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXoucHJvcEVudHJpZXMucHVzaChwcm9wRW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc011bHRpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSB0aGl6Lm1ha2VNdWx0aVByb3BFZGl0b3IocHJvcEVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkICs9IHRoaXoubWFrZVNpbmdsZVByb3BFZGl0b3IocHJvcEVudHJ5LCBhY2VGaWVsZHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiAoKCFpc1JlYWRPbmx5UHJvcCAmJiAhaXNCaW5hcnlQcm9wKSB8fCBlZGl0LnNob3dSZWFkT25seVByb3BlcnRpZXMgPyBcInByb3BlcnR5RWRpdExpc3RJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvcGVydHlFZGl0TGlzdEl0ZW1IaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwic3R5bGVcIiA6IFwiZGlzcGxheTogXCIrICghcmRPbmx5IHx8IG1ldGE2NC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJpbmxpbmVcIiA6IFwibm9uZVwiKVxuICAgICAgICAgICAgICAgICAgICB9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBFZGl0aW5nIGEgbmV3IG5vZGUgKi9cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHRvZG8tMDogdGhpcyBlbnRpcmUgYmxvY2sgbmVlZHMgcmV2aWV3IG5vdyAocmVkZXNpZ24pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIG5ldyBub2RlLlwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChjbnN0LlVTRV9BQ0VfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY2VGaWVsZElkID0gdGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhY2VGaWVsZElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IHJlbmRlci50YWcoXCJwYXBlci10ZXh0YXJlYVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJuZXdOb2RlTmFtZUlkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIk5ldyBOb2RlIE5hbWVcIlxuICAgICAgICAgICAgICAgICAgICB9LCAnJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHJlbmRlci50YWcoXCJkaXZcIiwgeyBcImRpc3BsYXlcIjogXCJ0YWJsZS1yb3dcIiB9LCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0knbSBub3QgcXVpdGUgcmVhZHkgdG8gYWRkIHRoaXMgYnV0dG9uIHlldC5cbiAgICAgICAgICAgIC8vIHZhciB0b2dnbGVSZWFkb25seVZpc0J1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xuICAgICAgICAgICAgLy8gICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXG4gICAgICAgICAgICAvLyAgICAgXCJvbkNsaWNrXCI6IFwibWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS50b2dnbGVTaG93UmVhZE9ubHkoKTtcIiAvL1xuICAgICAgICAgICAgLy8gfSwgLy9cbiAgICAgICAgICAgIC8vICAgICAoZWRpdC5zaG93UmVhZE9ubHlQcm9wZXJ0aWVzID8gXCJIaWRlIFJlYWQtT25seSBQcm9wZXJ0aWVzXCIgOiBcIlNob3cgUmVhZC1Pbmx5IFByb3BlcnRpZXNcIikpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGZpZWxkcyArPSB0b2dnbGVSZWFkb25seVZpc0J1dHRvbjtcblxuICAgICAgICAgICAgLy9sZXQgcm93ID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7IFwiZGlzcGxheVwiOiBcInRhYmxlLXJvd1wiIH0sIGxlZnQgKyBjZW50ZXIgKyByaWdodCk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wVGFibGU6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiBcInRhYmxlXCIsXG4gICAgICAgICAgICAgICAgfSwgZmllbGRzKTtcblxuXG4gICAgICAgICAgICB1dGlsLnNldEh0bWwodGhpcy5pZChcInByb3BlcnR5RWRpdEZpZWxkQ29udGFpbmVyXCIpLCBwcm9wVGFibGUpO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChhY2VGaWVsZHNbaV0uaWQpO1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUodXRpbC51bmVuY29kZUh0bWwoYWNlRmllbGRzW2ldLnZhbCkpO1xuICAgICAgICAgICAgICAgICAgICBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbYWNlRmllbGRzW2ldLmlkXSA9IGVkaXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbnN0ciA9IGVkaXQuZWRpdGluZ1Vuc2F2ZWROb2RlID8gLy9cbiAgICAgICAgICAgICAgICBcIllvdSBtYXkgbGVhdmUgdGhpcyBmaWVsZCBibGFuayBhbmQgYSB1bmlxdWUgSUQgd2lsbCBiZSBhc3NpZ25lZC4gWW91IG9ubHkgbmVlZCB0byBwcm92aWRlIGEgbmFtZSBpZiB5b3Ugd2FudCB0aGlzIG5vZGUgdG8gaGF2ZSBhIG1vcmUgbWVhbmluZ2Z1bCBVUkwuXCJcbiAgICAgICAgICAgICAgICA6IC8vXG4gICAgICAgICAgICAgICAgXCJcIjtcblxuICAgICAgICAgICAgdGhpcy5lbChcImVkaXROb2RlSW5zdHJ1Y3Rpb25zXCIpLmh0bWwoaW5zdHIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogQWxsb3cgYWRkaW5nIG9mIG5ldyBwcm9wZXJ0aWVzIGFzIGxvbmcgYXMgdGhpcyBpcyBhIHNhdmVkIG5vZGUgd2UgYXJlIGVkaXRpbmcsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBzdGFydFxuICAgICAgICAgICAgICogbWFuYWdpbmcgbmV3IHByb3BlcnRpZXMgb24gdGhlIGNsaWVudCBzaWRlLiBXZSBuZWVkIGEgZ2VudWluZSBub2RlIGFscmVhZHkgc2F2ZWQgb24gdGhlIHNlcnZlciBiZWZvcmUgd2UgYWxsb3dcbiAgICAgICAgICAgICAqIGFueSBwcm9wZXJ0eSBlZGl0aW5nIHRvIGhhcHBlbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5zZXRWaXNpYmlsaXR5KFwiI1wiICsgdGhpcy5pZChcImFkZFByb3BlcnR5QnV0dG9uXCIpLCAhZWRpdC5lZGl0aW5nVW5zYXZlZE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgdGFnc1Byb3BFeGlzdHMgPSBwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoXCJ0YWdzXCIsIGVkaXQuZWRpdE5vZGUpICE9IG51bGw7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhhc1RhZ3NQcm9wOiBcIiArIHRhZ3NQcm9wKTtcbiAgICAgICAgICAgIHV0aWwuc2V0VmlzaWJpbGl0eShcIiNcIiArIHRoaXMuaWQoXCJhZGRUYWdzUHJvcGVydHlCdXR0b25cIiksICF0YWdzUHJvcEV4aXN0cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVTaG93UmVhZE9ubHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAvLyBhbGVydChcIm5vdCB5ZXQgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICAgICAgLy8gc2VlIHNhdmVFeGlzdGluZ05vZGUgZm9yIGhvdyB0byBpdGVyYXRlIGFsbCBwcm9wZXJ0aWVzLCBhbHRob3VnaCBJIHdvbmRlciB3aHkgSSBkaWRuJ3QganVzdCB1c2UgYSBtYXAvc2V0IG9mXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIGVsZW1lbnRzXG4gICAgICAgICAgICAvLyBpbnN0ZWFkIHNvIEkgZG9uJ3QgbmVlZCB0byBwYXJzZSBhbnkgRE9NIG9yIGRvbUlkcyBpbm9yZGVyIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBvZiB0aGVtPz8/P1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkUHJvcGVydHkgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcm9wZXJ0eURsZ0luc3QgPSBuZXcgRWRpdFByb3BlcnR5RGxnKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJvcGVydHlEbGdJbnN0Lm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5nZXROb2RlUHJvcGVydHlWYWwoZWRpdC5lZGl0Tm9kZSwgXCJ0YWdzXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJ0YWdzXCIsXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZTogXCJcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLmFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRhZ3NQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiQWRkIFRhZ3MgUHJvcGVydHlcIiwgcmVzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVByb3BlcnR5UmVzcG9uc2UocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICB1dGlsLmNoZWNrU3VjY2VzcyhcIlNhdmUgcHJvcGVydGllc1wiLCByZXMpO1xuXG4gICAgICAgICAgICBlZGl0LmVkaXROb2RlLnByb3BlcnRpZXMucHVzaChyZXMucHJvcGVydHlTYXZlZCk7XG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZG9tSWQgIT0gXCJFZGl0Tm9kZURsZ1wiKSB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJlcnJvcjogaW5jb3JyZWN0IG9iamVjdCBmb3IgRWRpdE5vZGVEbGdcIik7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkU3ViUHJvcGVydHkgPSAoZmllbGRJZDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZmllbGRJZFRvUHJvcE1hcFtmaWVsZElkXS5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgdmFyIGlzTXVsdGkgPSB1dGlsLmlzT2JqZWN0KHByb3AudmFsdWVzKTtcblxuICAgICAgICAgICAgLyogY29udmVydCB0byBtdWx0aS10eXBlIGlmIHdlIG5lZWQgdG8gKi9cbiAgICAgICAgICAgIGlmICghaXNNdWx0aSkge1xuICAgICAgICAgICAgICAgIHByb3AudmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgcHJvcC52YWx1ZXMucHVzaChwcm9wLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9wLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIG5vdyBhZGQgbmV3IGVtcHR5IHByb3BlcnR5IGFuZCBwb3B1bGF0ZSBpdCBvbnRvIHRoZSBzY3JlZW5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPLTM6IGZvciBwZXJmb3JtYW5jZSB3ZSBjb3VsZCBkbyBzb21ldGhpbmcgc2ltcGxlciB0aGFuICdwb3B1bGF0ZUVkaXROb2RlUGcnIGhlcmUsIGJ1dCBmb3Igbm93IHdlIGp1c3RcbiAgICAgICAgICAgICAqIHJlcmVuZGVyaW5nIHRoZSBlbnRpcmUgZWRpdCBwYWdlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBwcm9wLnZhbHVlcy5wdXNoKFwiXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogRGVsZXRlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHNwZWNpZmllZCBuYW1lIG9uIHRoZSBub2RlIGJlaW5nIGVkaXRlZCwgYnV0IGZpcnN0IGdldHMgY29uZmlybWF0aW9uIGZyb20gdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZGVsZXRlUHJvcGVydHkgPSAocHJvcE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgKG5ldyBDb25maXJtRGxnKFwiQ29uZmlybSBEZWxldGVcIiwgXCJEZWxldGUgdGhlIFByb3BlcnR5OiBcIiArIHByb3BOYW1lLCBcIlllcywgZGVsZXRlLlwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGl6LmRlbGV0ZVByb3BlcnR5SW1tZWRpYXRlKHByb3BOYW1lKTtcbiAgICAgICAgICAgIH0pKS5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eUltbWVkaWF0ZSA9IChwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLkRlbGV0ZVByb3BlcnR5UmVxdWVzdCwganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlPihcImRlbGV0ZVByb3BlcnR5XCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJvcE5hbWVcIjogcHJvcE5hbWVcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlczoganNvbi5EZWxldGVQcm9wZXJ0eVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5kZWxldGVQcm9wZXJ0eVJlc3BvbnNlKHJlcywgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczogYW55LCBwcm9wZXJ0eVRvRGVsZXRlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiRGVsZXRlIHByb3BlcnR5XCIsIHJlcykpIHtcblxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICogcmVtb3ZlIGRlbGV0ZWQgcHJvcGVydHkgZnJvbSBjbGllbnQgc2lkZSBkYXRhLCBzbyB3ZSBjYW4gcmUtcmVuZGVyIHNjcmVlbiB3aXRob3V0IG1ha2luZyBhbm90aGVyIGNhbGwgdG9cbiAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcm9wcy5kZWxldGVQcm9wZXJ0eUZyb21Mb2NhbERhdGEocHJvcGVydHlUb0RlbGV0ZSk7XG5cbiAgICAgICAgICAgICAgICAvKiBub3cganVzdCByZS1yZW5kZXIgc2NyZWVuIGZyb20gbG9jYWwgdmFyaWFibGVzICovXG4gICAgICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlRWRpdE5vZGVQZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJQcm9wZXJ0eSA9IChmaWVsZElkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHV0aWwuc2V0SW5wdXRWYWwodGhpcy5pZChmaWVsZElkKSwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbdGhpcy5pZChmaWVsZElkKV07XG4gICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBzY2FuIGZvciBhbGwgbXVsdGktdmFsdWUgcHJvcGVydHkgZmllbGRzIGFuZCBjbGVhciB0aGVtICovXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY291bnRlciA8IDEwMDApIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNuc3QuVVNFX0FDRV9FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1dGlsLnNldElucHV0VmFsKHRoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbWV0YTY0LmFjZUVkaXRvcnNCeUlkW3RoaXMuaWQoZmllbGRJZCArIFwiX3N1YlByb3BcIiArIGNvdW50ZXIpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogZm9yIG5vdyBqdXN0IGxldCBzZXJ2ZXIgc2lkZSBjaG9rZSBvbiBpbnZhbGlkIHRoaW5ncy4gSXQgaGFzIGVub3VnaCBzZWN1cml0eSBhbmQgdmFsaWRhdGlvbiB0byBhdCBsZWFzdCBwcm90ZWN0XG4gICAgICAgICAqIGl0c2VsZiBmcm9tIGFueSBraW5kIG9mIGRhbWFnZS5cbiAgICAgICAgICovXG4gICAgICAgIHNhdmVOb2RlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIElmIGVkaXRpbmcgYW4gdW5zYXZlZCBub2RlIGl0J3MgdGltZSB0byBydW4gdGhlIGluc2VydE5vZGUsIG9yIGNyZWF0ZVN1Yk5vZGUsIHdoaWNoIGFjdHVhbGx5IHNhdmVzIG9udG8gdGhlXG4gICAgICAgICAgICAgKiBzZXJ2ZXIsIGFuZCB3aWxsIGluaXRpYXRlIGZ1cnRoZXIgZWRpdGluZyBsaWtlIGZvciBwcm9wZXJ0aWVzLCBldGMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChlZGl0LmVkaXRpbmdVbnNhdmVkTm9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZU5ld05vZGUuXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdG9kby0wOiBuZWVkIHRvIG1ha2UgdGhpcyBjb21wYXRpYmxlIHdpdGggQWNlIEVkaXRvci5cbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVOZXdOb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogRWxzZSB3ZSBhcmUgZWRpdGluZyBhIHNhdmVkIG5vZGUsIHdoaWNoIGlzIGFscmVhZHkgc2F2ZWQgb24gc2VydmVyLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVFeGlzdGluZ05vZGUuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUV4aXN0aW5nTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZU5ld05vZGUgPSAobmV3Tm9kZU5hbWU/OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghbmV3Tm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBuZXdOb2RlTmFtZSA9IHV0aWwuZ2V0SW5wdXRWYWwodGhpcy5pZChcIm5ld05vZGVOYW1lSWRcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogSWYgd2UgZGlkbid0IGNyZWF0ZSB0aGUgbm9kZSB3ZSBhcmUgaW5zZXJ0aW5nIHVuZGVyLCBhbmQgbmVpdGhlciBkaWQgXCJhZG1pblwiLCB0aGVuIHdlIG5lZWQgdG8gc2VuZCBub3RpZmljYXRpb25cbiAgICAgICAgICAgICAqIGVtYWlsIHVwb24gc2F2aW5nIHRoaXMgbmV3IG5vZGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChtZXRhNjQudXNlck5hbWUgIT0gZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICYmIC8vXG4gICAgICAgICAgICAgICAgZWRpdC5wYXJlbnRPZk5ld05vZGUuY3JlYXRlZEJ5ICE9IFwiYWRtaW5cIikge1xuICAgICAgICAgICAgICAgIGVkaXQuc2VuZE5vdGlmaWNhdGlvblBlbmRpbmdTYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uSW5zZXJ0Tm9kZVJlcXVlc3QsIGpzb24uSW5zZXJ0Tm9kZVJlc3BvbnNlPihcImluc2VydE5vZGVcIiwge1xuICAgICAgICAgICAgICAgICAgICBcInBhcmVudElkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcInRhcmdldE5hbWVcIjogZWRpdC5ub2RlSW5zZXJ0VGFyZ2V0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwibmV3Tm9kZU5hbWVcIjogbmV3Tm9kZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZU5hbWVcIjogdGhpcy50eXBlTmFtZSA/IHRoaXMudHlwZU5hbWUgOiBcIm50OnVuc3RydWN0dXJlZFwiXG4gICAgICAgICAgICAgICAgfSwgZWRpdC5pbnNlcnROb2RlUmVzcG9uc2UsIGVkaXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5DcmVhdGVTdWJOb2RlUmVxdWVzdCwganNvbi5DcmVhdGVTdWJOb2RlUmVzcG9uc2U+KFwiY3JlYXRlU3ViTm9kZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQucGFyZW50T2ZOZXdOb2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBcIm5ld05vZGVOYW1lXCI6IG5ld05vZGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVOYW1lXCI6IHRoaXMudHlwZU5hbWUgPyB0aGlzLnR5cGVOYW1lIDogXCJudDp1bnN0cnVjdHVyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjcmVhdGVBdFRvcFwiOiB0aGlzLmNyZWF0ZUF0VG9wXG4gICAgICAgICAgICAgICAgfSwgZWRpdC5jcmVhdGVTdWJOb2RlUmVzcG9uc2UsIGVkaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZUV4aXN0aW5nTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZUV4aXN0aW5nTm9kZVwiKTtcblxuICAgICAgICAgICAgLyogaG9sZHMgbGlzdCBvZiBwcm9wZXJ0aWVzIHRvIHNlbmQgdG8gc2VydmVyLiBFYWNoIG9uZSBoYXZpbmcgbmFtZSt2YWx1ZSBwcm9wZXJ0aWVzICovXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllc0xpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcblxuICAgICAgICAgICAgJC5lYWNoKHRoaXMucHJvcEVudHJpZXMsIGZ1bmN0aW9uKGluZGV4OiBudW1iZXIsIHByb3A6IGFueSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0gR2V0dGluZyBwcm9wIGlkeDogXCIgKyBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAvKiBJZ25vcmUgdGhpcyBwcm9wZXJ0eSBpZiBpdCdzIG9uZSB0aGF0IGNhbm5vdCBiZSBlZGl0ZWQgYXMgdGV4dCAqL1xuICAgICAgICAgICAgICAgIGlmIChwcm9wLnJlYWRPbmx5IHx8IHByb3AuYmluYXJ5KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBpZiAoIXByb3AubXVsdGkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgbm9uLW11bHRpIHByb3BlcnR5IGZpZWxkOiBcIiArIEpTT04uc3RyaW5naWZ5KHByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkaXRvciA9IG1ldGE2NC5hY2VFZGl0b3JzQnlJZFtwcm9wLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgQWNlIEVkaXRvciBmb3IgSUQ6IFwiICsgcHJvcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSB1dGlsLmdldFRleHRBcmVhVmFsQnlJZChwcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wVmFsICE9PSBwcm9wLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3AgY2hhbmdlZDogcHJvcE5hbWU9XCIgKyBwcm9wLnByb3BlcnR5Lm5hbWUgKyBcIiBwcm9wVmFsPVwiICsgcHJvcFZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5wcm9wZXJ0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogcHJvcFZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3AgZGlkbid0IGNoYW5nZTogXCIgKyBwcm9wLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiBFbHNlIHRoaXMgaXMgYSBNVUxUSSBwcm9wZXJ0eSAqL1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBtdWx0aSBwcm9wZXJ0eSBmaWVsZDogXCIgKyBKU09OLnN0cmluZ2lmeShwcm9wKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BWYWxzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHByb3Auc3ViUHJvcHMsIGZ1bmN0aW9uKGluZGV4LCBzdWJQcm9wKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3ViUHJvcFtcIiArIGluZGV4ICsgXCJdOiBcIiArIEpTT04uc3RyaW5naWZ5KHN1YlByb3ApKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BWYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGl0b3IgPSBtZXRhNjQuYWNlRWRpdG9yc0J5SWRbc3ViUHJvcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGl0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5hYmxlIHRvIGZpbmQgQWNlIEVkaXRvciBmb3Igc3ViUHJvcCBJRDogXCIgKyBzdWJQcm9wLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWwgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIlNldHRpbmdbXCIgKyBwcm9wVmFsICsgXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsID0gdXRpbC5nZXRUZXh0QXJlYVZhbEJ5SWQoc3ViUHJvcC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIHN1YlByb3BbXCIgKyBpbmRleCArIFwiXSBvZiBcIiArIHByb3AubmFtZSArIFwiIHZhbD1cIiArIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHMucHVzaChwcm9wVmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogcHJvcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZXNcIjogcHJvcFZhbHNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTsvLyBlbmQgaXRlcmF0b3JcblxuICAgICAgICAgICAgLyogaWYgYW55dGhpbmcgY2hhbmdlZCwgc2F2ZSB0byBzZXJ2ZXIgKi9cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvc3REYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBub2RlSWQ6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXNMaXN0LFxuICAgICAgICAgICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uOiBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIHNhdmVOb2RlKCkuIFBvc3REYXRhPVwiICsgdXRpbC50b0pzb24ocG9zdERhdGEpKTtcbiAgICAgICAgICAgICAgICB1dGlsLmpzb248anNvbi5TYXZlTm9kZVJlcXVlc3QsIGpzb24uU2F2ZU5vZGVSZXNwb25zZT4oXCJzYXZlTm9kZVwiLCBwb3N0RGF0YSwgZWRpdC5zYXZlTm9kZVJlc3BvbnNlLCBudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVkSWQ6IGVkaXQuZWRpdE5vZGUuaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlZGl0LnNlbmROb3RpZmljYXRpb25QZW5kaW5nU2F2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdGhpbmcgY2hhbmdlZC4gTm90aGluZyB0byBzYXZlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VNdWx0aVByb3BFZGl0b3IgPSAocHJvcEVudHJ5OiBQcm9wRW50cnkpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgTXVsdGkgRWRpdG9yOiBQcm9wZXJ0eSBtdWx0aS10eXBlOiBuYW1lPVwiICsgcHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgKyBcIiBjb3VudD1cIlxuICAgICAgICAgICAgICAgICsgcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlcy5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcyA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgcHJvcExpc3QgPSBwcm9wRW50cnkucHJvcGVydHkudmFsdWVzO1xuICAgICAgICAgICAgaWYgKCFwcm9wTGlzdCB8fCBwcm9wTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHByb3BMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgcHJvcExpc3QucHVzaChcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJvcCBtdWx0aS12YWxbXCIgKyBpICsgXCJdPVwiICsgcHJvcExpc3RbaV0pO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuaWQocHJvcEVudHJ5LmlkICsgXCJfc3ViUHJvcFwiICsgaSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbCA9IHByb3BFbnRyeS5iaW5hcnkgPyBcIltiaW5hcnldXCIgOiBwcm9wTGlzdFtpXTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbFN0ciA9IHByb3BWYWwgfHwgJyc7XG4gICAgICAgICAgICAgICAgcHJvcFZhbFN0ciA9IHV0aWwuZXNjYXBlRm9yQXR0cmliKHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IChpID09IDAgPyBwcm9wRW50cnkucHJvcGVydHkubmFtZSA6IFwiKlwiKSArIFwiLlwiICsgaTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgdGV4dGFyZWEgd2l0aCBpZD1cIiArIGlkKTtcblxuICAgICAgICAgICAgICAgIGxldCBzdWJQcm9wOiBTdWJQcm9wID0gbmV3IFN1YlByb3AoaWQsIHByb3BWYWwpO1xuICAgICAgICAgICAgICAgIHByb3BFbnRyeS5zdWJQcm9wcy5wdXNoKHN1YlByb3ApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeS5iaW5hcnkgfHwgcHJvcEVudHJ5LnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVhZG9ubHlcIjogXCJyZWFkb25seVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiOiBcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb2wgPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcInN0eWxlXCI6IFwiZGlzcGxheTogdGFibGUtY2VsbDtcIlxuICAgICAgICAgICAgfSwgZmllbGRzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1ha2VTaW5nbGVQcm9wRWRpdG9yID0gKHByb3BFbnRyeTogUHJvcEVudHJ5LCBhY2VGaWVsZHM6IGFueSk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByb3BlcnR5IHNpbmdsZS10eXBlOiBcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcblxuICAgICAgICAgICAgdmFyIGZpZWxkID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIHByb3BWYWwgPSBwcm9wRW50cnkuYmluYXJ5ID8gXCJbYmluYXJ5XVwiIDogcHJvcEVudHJ5LnByb3BlcnR5LnZhbHVlO1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gcmVuZGVyLnNhbml0aXplUHJvcGVydHlOYW1lKHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgIHZhciBwcm9wVmFsU3RyID0gcHJvcFZhbCA/IHByb3BWYWwgOiAnJztcbiAgICAgICAgICAgIHByb3BWYWxTdHIgPSB1dGlsLmVzY2FwZUZvckF0dHJpYihwcm9wVmFsU3RyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibWFraW5nIHNpbmdsZSBwcm9wIGVkaXRvcjogcHJvcFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lICsgXCJdIHZhbFtcIiArIHByb3BFbnRyeS5wcm9wZXJ0eS52YWx1ZVxuICAgICAgICAgICAgICAgICsgXCJdIGZpZWxkSWQ9XCIgKyBwcm9wRW50cnkuaWQpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcFNlbENoZWNrYm94OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAocHJvcEVudHJ5LnJlYWRPbmx5IHx8IHByb3BFbnRyeS5iaW5hcnkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHByb3BFbnRyeS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFkb25seVwiOiBcInJlYWRvbmx5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIjogXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvcFNlbENoZWNrYm94ID0gdGhpcy5tYWtlQ2hlY2tCb3goXCJcIiwgXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcEVudHJ5LnByb3BlcnR5Lm5hbWUgPT0gamNyQ25zdC5DT05URU5UKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEZpZWxkRG9tSWQgPSBwcm9wRW50cnkuaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghY25zdC5VU0VfQUNFX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBwcm9wVmFsU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sICcnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogcHJvcEVudHJ5LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcImFjZS1lZGl0LXBhbmVsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgJycsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjZUZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wRW50cnkuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IHByb3BWYWxTdHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc2VsQ29sID0gcmVuZGVyLnRhZyhcImRpdlwiLCB7XG4gICAgICAgICAgICAgICAgXCJzdHlsZVwiOiBcIndpZHRoOiA0MHB4OyBkaXNwbGF5OiB0YWJsZS1jZWxsOyBwYWRkaW5nOiAxMHB4O1wiXG4gICAgICAgICAgICB9LCBwcm9wU2VsQ2hlY2tib3gpO1xuXG4gICAgICAgICAgICBsZXQgZWRpdENvbCA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgZGlzcGxheTogdGFibGUtY2VsbDsgcGFkZGluZzogMTBweDtcIlxuICAgICAgICAgICAgfSwgZmllbGQpO1xuXG4gICAgICAgICAgICByZXR1cm4gc2VsQ29sICsgZWRpdENvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5QnV0dG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgb3ZlciBhbGwgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5maWVsZElkVG9Qcm9wTWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRJZFRvUHJvcE1hcC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKiBnZXQgUHJvcEVudHJ5IGZvciB0aGlzIGl0ZW0gKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BFbnRyeTogUHJvcEVudHJ5ID0gdGhpcy5maWVsZElkVG9Qcm9wTWFwW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3A9XCIgKyBwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsUHJvcERvbUlkID0gXCJzZWxQcm9wX1wiICsgcHJvcEVudHJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IGNoZWNrYm94IGNvbnRyb2wgYW5kIGl0cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9kby0xOiBnZXR0aW5nIHZhbHVlIG9mIGNoZWNrYm94IHNob3VsZCBiZSBpbiBzb21lIHNoYXJlZCB1dGlsaXR5IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxDaGVja2JveCA9IHV0aWwucG9seUVsbSh0aGlzLmlkKHNlbFByb3BEb21JZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbENoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQ6IGJvb2xlYW4gPSBzZWxDaGVja2JveC5ub2RlLmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInByb3AgSVMgQ0hFQ0tFRD1cIiArIHByb3BFbnRyeS5wcm9wZXJ0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcm9wZXJ0eShwcm9wRW50cnkucHJvcGVydHkubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZm9yIG5vdyBsZXRzJyBqdXN0IHN1cHBvcnQgZGVsZXRpbmcgb25lIHByb3BlcnR5IGF0IGEgdGltZSwgYW5kIHNvIHdlIGNhbiByZXR1cm4gb25jZSB3ZSBmb3VuZCBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgb25lIHRvIGRlbGV0ZS4gV291bGQgYmUgZWFzeSB0byBleHRlbmQgdG8gYWxsb3cgbXVsdGlwbGUtc2VsZWN0cyBpbiB0aGUgZnV0dXJlICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInByb3BFbnRyeSBub3QgZm91bmQgZm9yIGlkOiBcIiArIGlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEZWxldGUgcHJvcGVydHk6IFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgc3BsaXRDb250ZW50ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGVCZWxvdzoganNvbi5Ob2RlSW5mbyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGVkaXQuZWRpdE5vZGUpO1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uU3BsaXROb2RlUmVxdWVzdCwganNvbi5TcGxpdE5vZGVSZXNwb25zZT4oXCJzcGxpdE5vZGVcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IGVkaXQuZWRpdE5vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJub2RlQmVsb3dJZFwiOiAobm9kZUJlbG93ID09IG51bGwgPyBudWxsIDogbm9kZUJlbG93LmlkKSxcbiAgICAgICAgICAgICAgICBcImRlbGltaXRlclwiOiBudWxsXG4gICAgICAgICAgICB9LCB0aGlzLnNwbGl0Q29udGVudFJlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwbGl0Q29udGVudFJlc3BvbnNlID0gKHJlczoganNvbi5TcGxpdE5vZGVSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU3BsaXQgY29udGVudFwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRhNjQuc2VsZWN0VGFiKFwibWFpblRhYk5hbWVcIik7XG4gICAgICAgICAgICAgICAgdmlldy5zY3JvbGxUb1NlbGVjdGVkTm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2FuY2VsRWRpdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgICAgICBpZiAobWV0YTY0LnRyZWVEaXJ0eSkge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5nb1RvTWFpblBhZ2UodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGE2NC5zZWxlY3RUYWIoXCJtYWluVGFiTmFtZVwiKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNjcm9sbFRvU2VsZWN0ZWROb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0Tm9kZURsZy5pbml0XCIpO1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRGaWVsZERvbUlkKSB7XG4gICAgICAgICAgICAgICAgdXRpbC5kZWxheWVkRm9jdXMoXCIjXCIgKyB0aGlzLmNvbnRlbnRGaWVsZERvbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEVkaXRQcm9wZXJ0eURsZy5qc1wiKTtcblxuLypcbiAqIFByb3BlcnR5IEVkaXRvciBEaWFsb2cgKEVkaXRzIE5vZGUgUHJvcGVydGllcylcbiAqL1xubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIEVkaXRQcm9wZXJ0eURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdE5vZGVEbGc6IGFueSkge1xuICAgICAgICAgICAgc3VwZXIoXCJFZGl0UHJvcGVydHlEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIkVkaXQgTm9kZSBQcm9wZXJ0eVwiKTtcblxuICAgICAgICAgICAgdmFyIHNhdmVQcm9wZXJ0eUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2F2ZVwiLCBcInNhdmVQcm9wZXJ0eUJ1dHRvblwiLCB0aGlzLnNhdmVQcm9wZXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgY2FuY2VsRWRpdEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiZWRpdFByb3BlcnR5UGdDbG9zZUJ1dHRvblwiKTtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihzYXZlUHJvcGVydHlCdXR0b24gKyBjYW5jZWxFZGl0QnV0dG9uKTtcblxuICAgICAgICAgICAgdmFyIGludGVybmFsTWFpbkNvbnRlbnQgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoY25zdC5TSE9XX1BBVEhfSU5fRExHUykge1xuICAgICAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiJyBjbGFzcz0ncGF0aC1kaXNwbGF5LWluLWVkaXRvcic+PC9kaXY+XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGludGVybmFsTWFpbkNvbnRlbnQgKz0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJhZGRQcm9wZXJ0eUZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVsYXRlUHJvcGVydHlFZGl0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gJyc7XG5cbiAgICAgICAgICAgIC8qIFByb3BlcnR5IE5hbWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wTmFtZUlkID0gXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiO1xuXG4gICAgICAgICAgICAgICAgZmllbGQgKz0gcmVuZGVyLnRhZyhcInBhcGVyLXRleHRhcmVhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGZpZWxkUHJvcE5hbWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcE5hbWVJZCksXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJFbnRlciBwcm9wZXJ0eSBuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJOYW1lXCJcbiAgICAgICAgICAgICAgICB9LCBcIlwiLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogUHJvcGVydHkgVmFsdWUgRmllbGQgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRQcm9wVmFsdWVJZCA9IFwiYWRkUHJvcGVydHlWYWx1ZVRleHRDb250ZW50XCI7XG5cbiAgICAgICAgICAgICAgICBmaWVsZCArPSByZW5kZXIudGFnKFwicGFwZXItdGV4dGFyZWFcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZmllbGRQcm9wVmFsdWVJZCxcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLmlkKGZpZWxkUHJvcFZhbHVlSWQpLFxuICAgICAgICAgICAgICAgICAgICBcInBsYWNlaG9sZGVyXCI6IFwiRW50ZXIgcHJvcGVydHkgdGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiVmFsdWVcIlxuICAgICAgICAgICAgICAgIH0sIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBkaXNwbGF5IHRoZSBub2RlIHBhdGggYXQgdGhlIHRvcCBvZiB0aGUgZWRpdCBwYWdlICovXG4gICAgICAgICAgICB2aWV3LmluaXRFZGl0UGF0aERpc3BsYXlCeUlkKHRoaXMuaWQoXCJlZGl0UHJvcGVydHlQYXRoRGlzcGxheVwiKSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwiYWRkUHJvcGVydHlGaWVsZENvbnRhaW5lclwiKSwgZmllbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVByb3BlcnR5ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eU5hbWVUZXh0Q29udGVudFwiKSk7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZURhdGEgPSB1dGlsLmdldElucHV0VmFsKHRoaXMuaWQoXCJhZGRQcm9wZXJ0eVZhbHVlVGV4dENvbnRlbnRcIikpO1xuXG4gICAgICAgICAgICB2YXIgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZUlkOiBlZGl0LmVkaXROb2RlLmlkLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlOiBwcm9wZXJ0eVZhbHVlRGF0YVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlNhdmVQcm9wZXJ0eVJlcXVlc3QsIGpzb24uU2F2ZVByb3BlcnR5UmVzcG9uc2U+KFwic2F2ZVByb3BlcnR5XCIsIHBvc3REYXRhLCB0aGlzLnNhdmVQcm9wZXJ0eVJlc3BvbnNlLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVQcm9wZXJ0eVJlc3BvbnNlID0gKHJlczoganNvbi5TYXZlUHJvcGVydHlSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdXRpbC5jaGVja1N1Y2Nlc3MoXCJTYXZlIHByb3BlcnRpZXNcIiwgcmVzKTtcblxuICAgICAgICAgICAgZWRpdC5lZGl0Tm9kZS5wcm9wZXJ0aWVzLnB1c2gocmVzLnByb3BlcnR5U2F2ZWQpO1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmVkaXROb2RlRGxnLmRvbUlkICE9IFwiRWRpdE5vZGVEbGdcIikge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IGluY29ycmVjdCBvYmplY3QgZm9yIEVkaXROb2RlRGxnXCIpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgdGhpcy5lZGl0Tm9kZURsZy5wb3B1bGF0ZUVkaXROb2RlUGcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvcGVydHlFZGl0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBTaGFyZVRvUGVyc29uRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgU2hhcmVUb1BlcnNvbkRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoXCJTaGFyZVRvUGVyc29uRGxnXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIGRpYWxvZ1xuICAgICAgICAgKi9cbiAgICAgICAgYnVpbGQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLm1ha2VIZWFkZXIoXCJTaGFyZSBOb2RlIHRvIFBlcnNvblwiKTtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIlVzZXIgdG8gU2hhcmUgV2l0aFwiLCBcInNoYXJlVG9Vc2VyTmFtZVwiKTtcbiAgICAgICAgICAgIHZhciBzaGFyZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiU2hhcmVcIiwgXCJzaGFyZU5vZGVUb1BlcnNvbkJ1dHRvblwiLCB0aGlzLnNoYXJlTm9kZVRvUGVyc29uLFxuICAgICAgICAgICAgICAgIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsU2hhcmVOb2RlVG9QZXJzb25CdXR0b25cIik7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNoYXJlQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBcIjxwPkVudGVyIHRoZSB1c2VybmFtZSBvZiB0aGUgcGVyc29uIHlvdSB3YW50IHRvIHNoYXJlIHRoaXMgbm9kZSB3aXRoOjwvcD5cIiArIGZvcm1Db250cm9sc1xuICAgICAgICAgICAgICAgICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QZXJzb24gPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VXNlciA9IHRoaXMuZ2V0SW5wdXRWYWwoXCJzaGFyZVRvVXNlck5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFVzZXIpIHtcbiAgICAgICAgICAgICAgICAobmV3IE1lc3NhZ2VEbGcoXCJQbGVhc2UgZW50ZXIgYSB1c2VybmFtZVwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFRyaWdnZXIgZ29pbmcgdG8gc2VydmVyIGF0IG5leHQgbWFpbiBwYWdlIHJlZnJlc2hcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWV0YTY0LnRyZWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5BZGRQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLkFkZFByaXZpbGVnZVJlc3BvbnNlPihcImFkZFByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogdGFyZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiLCBcIndyaXRlXCIsIFwiYWRkQ2hpbGRyZW5cIiwgXCJub2RlVHlwZU1hbmFnZW1lbnRcIl0sXG4gICAgICAgICAgICAgICAgXCJwdWJsaWNBcHBlbmRcIjogZmFsc2VcbiAgICAgICAgICAgIH0sIHRoaXoucmVsb2FkRnJvbVNoYXJlV2l0aFBlcnNvbiwgdGhpeik7XG4gICAgICAgIH1cblxuICAgICAgICByZWxvYWRGcm9tU2hhcmVXaXRoUGVyc29uID0gKHJlczoganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKHV0aWwuY2hlY2tTdWNjZXNzKFwiU2hhcmUgTm9kZSB3aXRoIFBlcnNvblwiLCByZXMpKSB7XG4gICAgICAgICAgICAgICAgKG5ldyBTaGFyaW5nRGxnKCkpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IFNoYXJpbmdEbGcuanNcIik7XG5cbm5hbWVzcGFjZSBtNjQge1xuICAgIGV4cG9ydCBjbGFzcyBTaGFyaW5nRGxnIGV4dGVuZHMgRGlhbG9nQmFzZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlNoYXJpbmdEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIk5vZGUgU2hhcmluZ1wiKTtcblxuICAgICAgICAgICAgdmFyIHNoYXJlV2l0aFBlcnNvbkJ1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHdpdGggUGVyc29uXCIsIFwic2hhcmVOb2RlVG9QZXJzb25QZ0J1dHRvblwiLFxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcmVOb2RlVG9QZXJzb25QZywgdGhpcyk7XG4gICAgICAgICAgICB2YXIgbWFrZVB1YmxpY0J1dHRvbiA9IHRoaXMubWFrZUJ1dHRvbihcIlNoYXJlIHRvIFB1YmxpY1wiLCBcInNoYXJlTm9kZVRvUHVibGljQnV0dG9uXCIsIHRoaXMuc2hhcmVOb2RlVG9QdWJsaWMsXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2xvc2VcIiwgXCJjbG9zZVNoYXJpbmdCdXR0b25cIik7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2hhcmVXaXRoUGVyc29uQnV0dG9uICsgbWFrZVB1YmxpY0J1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNjtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjQ7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcm5hbE1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdcIiArIHRoaXMuaWQoXCJzaGFyZU5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2Rpdj5cIiArIC8vXG4gICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSd2ZXJ0aWNhbC1sYXlvdXQtcm93JyBzdHlsZT1cXFwid2lkdGg6XCIgKyB3aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgaGVpZ2h0ICsgXCJweDtvdmVyZmxvdzpzY3JvbGw7Ym9yZGVyOjRweCBzb2xpZCBsaWdodEdyYXk7XFxcIiBpZD0nXCJcbiAgICAgICAgICAgICAgICArIHRoaXMuaWQoXCJzaGFyaW5nTGlzdEZpZWxkQ29udGFpbmVyXCIpICsgXCInPjwvZGl2PlwiO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgaW50ZXJuYWxNYWluQ29udGVudCArIGJ1dHRvbkJhcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogR2V0cyBwcml2aWxlZ2VzIGZyb20gc2VydmVyIGFuZCBkaXNwbGF5cyBpbiBHVUkgYWxzby4gQXNzdW1lcyBndWkgaXMgYWxyZWFkeSBhdCBjb3JyZWN0IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgbm9kZSBzaGFyaW5nIGluZm8uXCIpO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5HZXROb2RlUHJpdmlsZWdlc1JlcXVlc3QsIGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZT4oXCJnZXROb2RlUHJpdmlsZWdlc1wiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBIYW5kbGVzIGdldE5vZGVQcml2aWxlZ2VzIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiByZXM9anNvbiBvZiBHZXROb2RlUHJpdmlsZWdlc1Jlc3BvbnNlLmphdmFcbiAgICAgICAgICpcbiAgICAgICAgICogcmVzLmFjbEVudHJpZXMgPSBsaXN0IG9mIEFjY2Vzc0NvbnRyb2xFbnRyeUluZm8uamF2YSBqc29uIG9iamVjdHNcbiAgICAgICAgICovXG4gICAgICAgIGdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVTaGFyaW5nUGcocmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZ290dGVuIGJhY2sgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5pbmcgQUNMIGluZm8gc28gd2UgY2FuIHBvcHVsYXRlIHRoZSBzaGFyaW5nIHBhZ2UgaW4gdGhlIGd1aVxuICAgICAgICAgKi9cbiAgICAgICAgcG9wdWxhdGVTaGFyaW5nUGcgPSAocmVzOiBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2UpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBUaGlzID0gdGhpcztcblxuICAgICAgICAgICAgJC5lYWNoKHJlcy5hY2xFbnRyaWVzLCBmdW5jdGlvbihpbmRleCwgYWNsRW50cnkpIHtcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPGg0PlVzZXI6IFwiICsgYWNsRW50cnkucHJpbmNpcGFsTmFtZSArIFwiPC9oND5cIjtcbiAgICAgICAgICAgICAgICBodG1sICs9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwicHJpdmlsZWdlLWxpc3RcIlxuICAgICAgICAgICAgICAgIH0sIFRoaXMucmVuZGVyQWNsUHJpdmlsZWdlcyhhY2xFbnRyeS5wcmluY2lwYWxOYW1lLCBhY2xFbnRyeSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBwdWJsaWNBcHBlbmRBdHRycyA9IHtcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQubWV0YTY0LmdldE9iamVjdEJ5R3VpZChcIiArIHRoaXMuZ3VpZCArIFwiKS5wdWJsaWNDb21tZW50aW5nQ2hhbmdlZCgpO1wiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFsbG93UHVibGljQ29tbWVudGluZ1wiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5pZChcImFsbG93UHVibGljQ29tbWVudGluZ1wiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHJlcy5wdWJsaWNBcHBlbmQpIHtcbiAgICAgICAgICAgICAgICBwdWJsaWNBcHBlbmRBdHRyc1tcImNoZWNrZWRcIl0gPSBcImNoZWNrZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogdG9kbzogdXNlIGFjdHVhbCBwb2x5bWVyIHBhcGVyLWNoZWNrYm94IGhlcmUgKi9cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcInBhcGVyLWNoZWNrYm94XCIsIHB1YmxpY0FwcGVuZEF0dHJzLCBcIlwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gcmVuZGVyLnRhZyhcImxhYmVsXCIsIHtcbiAgICAgICAgICAgICAgICBcImZvclwiOiB0aGlzLmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpXG4gICAgICAgICAgICB9LCBcIkFsbG93IHB1YmxpYyBjb21tZW50aW5nIHVuZGVyIHRoaXMgbm9kZS5cIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHV0aWwuc2V0SHRtbCh0aGlzLmlkKFwic2hhcmluZ0xpc3RGaWVsZENvbnRhaW5lclwiKSwgaHRtbCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWNDb21tZW50aW5nQ2hhbmdlZCA9ICgpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIFVzaW5nIG9uQ2xpY2sgb24gdGhlIGVsZW1lbnQgQU5EIHRoaXMgdGltZW91dCBpcyB0aGUgb25seSBoYWNrIEkgY291bGQgZmluZCB0byBnZXQgZ2V0IHdoYXQgYW1vdW50cyB0byBhIHN0YXRlXG4gICAgICAgICAgICAgKiBjaGFuZ2UgbGlzdGVuZXIgb24gYSBwYXBlci1jaGVja2JveC4gVGhlIGRvY3VtZW50ZWQgb24tY2hhbmdlIGxpc3RlbmVyIHNpbXBseSBkb2Vzbid0IHdvcmsgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgICAqIHNpbXBseSBhIGJ1ZyBpbiBnb29nbGUgY29kZSBBRkFJSy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9seUVsbSA9IHV0aWwucG9seUVsbSh0aGl6LmlkKFwiYWxsb3dQdWJsaWNDb21tZW50aW5nXCIpKTtcblxuICAgICAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBzaGFyZS5zaGFyaW5nTm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcml2aWxlZ2VzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljQXBwZW5kXCI6IChwb2x5RWxtLm5vZGUuY2hlY2tlZCA/IHRydWUgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVByaXZpbGVnZSA9IChwcmluY2lwYWw6IHN0cmluZywgcHJpdmlsZWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGdvaW5nIHRvIHNlcnZlciBhdCBuZXh0IG1haW4gcGFnZSByZWZyZXNoXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1ldGE2NC50cmVlRGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICB1dGlsLmpzb248anNvbi5SZW1vdmVQcml2aWxlZ2VSZXF1ZXN0LCBqc29uLlJlbW92ZVByaXZpbGVnZVJlc3BvbnNlPihcInJlbW92ZVByaXZpbGVnZVwiLCB7XG4gICAgICAgICAgICAgICAgXCJub2RlSWRcIjogc2hhcmUuc2hhcmluZ05vZGUuaWQsXG4gICAgICAgICAgICAgICAgXCJwcmluY2lwYWxcIjogcHJpbmNpcGFsLFxuICAgICAgICAgICAgICAgIFwicHJpdmlsZWdlXCI6IHByaXZpbGVnZVxuICAgICAgICAgICAgfSwgdGhpcy5yZW1vdmVQcml2aWxlZ2VSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVQcml2aWxlZ2VSZXNwb25zZSA9IChyZXM6IGpzb24uUmVtb3ZlUHJpdmlsZWdlUmVzcG9uc2UpOiB2b2lkID0+IHtcblxuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uR2V0Tm9kZVByaXZpbGVnZXNSZXF1ZXN0LCBqc29uLkdldE5vZGVQcml2aWxlZ2VzUmVzcG9uc2U+KFwiZ2V0Tm9kZVByaXZpbGVnZXNcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLnBhdGgsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlQWNsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJpbmNsdWRlT3duZXJzXCI6IHRydWVcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0Tm9kZVByaXZpbGVnZXNSZXNwb25zZSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJBY2xQcml2aWxlZ2VzID0gKHByaW5jaXBhbDogYW55LCBhY2xFbnRyeTogYW55KTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHRoaXogPSB0aGlzO1xuICAgICAgICAgICAgJC5lYWNoKGFjbEVudHJ5LnByaXZpbGVnZXMsIGZ1bmN0aW9uKGluZGV4LCBwcml2aWxlZ2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciByZW1vdmVCdXR0b24gPSB0aGl6Lm1ha2VCdXR0b24oXCJSZW1vdmVcIiwgXCJyZW1vdmVQcml2QnV0dG9uXCIsIC8vXG4gICAgICAgICAgICAgICAgICAgIFwibTY0Lm1ldGE2NC5nZXRPYmplY3RCeUd1aWQoXCIgKyB0aGl6Lmd1aWQgKyBcIikucmVtb3ZlUHJpdmlsZWdlKCdcIiArIHByaW5jaXBhbCArIFwiJywgJ1wiICsgcHJpdmlsZWdlLnByaXZpbGVnZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyBcIicpO1wiKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3cgPSByZW5kZXIubWFrZUhvcml6b250YWxGaWVsZFNldChyZW1vdmVCdXR0b24pO1xuXG4gICAgICAgICAgICAgICAgcm93ICs9IFwiPGI+XCIgKyBwcmluY2lwYWwgKyBcIjwvYj4gaGFzIHByaXZpbGVnZSA8Yj5cIiArIHByaXZpbGVnZS5wcml2aWxlZ2VOYW1lICsgXCI8L2I+IG9uIHRoaXMgbm9kZS5cIjtcblxuICAgICAgICAgICAgICAgIHJldCArPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInByaXZpbGVnZS1lbnRyeVwiXG4gICAgICAgICAgICAgICAgfSwgcm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNoYXJlTm9kZVRvUGVyc29uUGcgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAobmV3IFNoYXJlVG9QZXJzb25EbGcoKSkub3BlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hhcmVOb2RlVG9QdWJsaWMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNoYXJpbmcgbm9kZSB0byBwdWJsaWMuXCIpO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICogVHJpZ2dlciBnb2luZyB0byBzZXJ2ZXIgYXQgbmV4dCBtYWluIHBhZ2UgcmVmcmVzaFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXRhNjQudHJlZURpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAqIEFkZCBwcml2aWxlZ2UgYW5kIHRoZW4gcmVsb2FkIHNoYXJlIG5vZGVzIGRpYWxvZyBmcm9tIHNjcmF0Y2ggZG9pbmcgYW5vdGhlciBjYWxsYmFjayB0byBzZXJ2ZXJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPOiB0aGlzIGFkZGl0aW9uYWwgY2FsbCBjYW4gYmUgYXZvaWRlZCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXRpbC5qc29uPGpzb24uQWRkUHJpdmlsZWdlUmVxdWVzdCwganNvbi5BZGRQcml2aWxlZ2VSZXNwb25zZT4oXCJhZGRQcml2aWxlZ2VcIiwge1xuICAgICAgICAgICAgICAgIFwibm9kZUlkXCI6IHNoYXJlLnNoYXJpbmdOb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwicHJpbmNpcGFsXCI6IFwiZXZlcnlvbmVcIixcbiAgICAgICAgICAgICAgICBcInByaXZpbGVnZXNcIjogW1wicmVhZFwiXSxcbiAgICAgICAgICAgICAgICBcInB1YmxpY0FwcGVuZFwiOiBmYWxzZVxuICAgICAgICAgICAgfSwgdGhpcy5yZWxvYWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogUmVuYW1lTm9kZURsZy5qc1wiKTtcblxubmFtZXNwYWNlIG02NCB7XG4gICAgZXhwb3J0IGNsYXNzIFJlbmFtZU5vZGVEbGcgZXh0ZW5kcyBEaWFsb2dCYXNlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcihcIlJlbmFtZU5vZGVEbGdcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgdGhlIEhUTUwgY29udGVudCBvZiB0aGUgZGlhbG9nXG4gICAgICAgICAqL1xuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMubWFrZUhlYWRlcihcIlJlbmFtZSBOb2RlXCIpO1xuXG4gICAgICAgICAgICB2YXIgY3VyTm9kZU5hbWVEaXNwbGF5ID0gXCI8aDMgaWQ9J1wiICsgdGhpcy5pZChcImN1ck5vZGVOYW1lRGlzcGxheVwiKSArIFwiJz48L2gzPlwiO1xuICAgICAgICAgICAgdmFyIGN1ck5vZGVQYXRoRGlzcGxheSA9IFwiPGg0IGNsYXNzPSdwYXRoLWRpc3BsYXknIGlkPSdcIiArIHRoaXMuaWQoXCJjdXJOb2RlUGF0aERpc3BsYXlcIikgKyBcIic+PC9oND5cIjtcblxuICAgICAgICAgICAgdmFyIGZvcm1Db250cm9scyA9IHRoaXMubWFrZUVkaXRGaWVsZChcIkVudGVyIG5ldyBuYW1lIGZvciB0aGUgbm9kZVwiLCBcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1lTm9kZUJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiUmVuYW1lXCIsIFwicmVuYW1lTm9kZUJ1dHRvblwiLCB0aGlzLnJlbmFtZU5vZGUsIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGJhY2tCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIkNsb3NlXCIsIFwiY2FuY2VsUmVuYW1lTm9kZUJ1dHRvblwiKTtcbiAgICAgICAgICAgIHZhciBidXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIocmVuYW1lTm9kZUJ1dHRvbiArIGJhY2tCdXR0b24pO1xuXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVyICsgY3VyTm9kZU5hbWVEaXNwbGF5ICsgY3VyTm9kZVBhdGhEaXNwbGF5ICsgZm9ybUNvbnRyb2xzICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdOYW1lID0gdGhpcy5nZXRJbnB1dFZhbChcIm5ld05vZGVOYW1lRWRpdEZpZWxkXCIpO1xuXG4gICAgICAgICAgICBpZiAodXRpbC5lbXB0eVN0cmluZyhuZXdOYW1lKSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlBsZWFzZSBlbnRlciBhIG5ldyBub2RlIG5hbWUuXCIpKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Tm9kZSA9IG1ldGE2NC5nZXRIaWdobGlnaHRlZE5vZGUoKTtcbiAgICAgICAgICAgIGlmICghaGlnaGxpZ2h0Tm9kZSkge1xuICAgICAgICAgICAgICAgIChuZXcgTWVzc2FnZURsZyhcIlNlbGVjdCBhIG5vZGUgdG8gcmVuYW1lLlwiKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogaWYgbm8gbm9kZSBiZWxvdyB0aGlzIG5vZGUsIHJldHVybnMgbnVsbCAqL1xuICAgICAgICAgICAgdmFyIG5vZGVCZWxvdyA9IGVkaXQuZ2V0Tm9kZUJlbG93KGhpZ2hsaWdodE5vZGUpO1xuXG4gICAgICAgICAgICB2YXIgcmVuYW1pbmdSb290Tm9kZSA9IChoaWdobGlnaHROb2RlLmlkID09PSBtZXRhNjQuY3VycmVudE5vZGVJZCk7XG5cbiAgICAgICAgICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICAgICAgICAgIHV0aWwuanNvbjxqc29uLlJlbmFtZU5vZGVSZXF1ZXN0LCBqc29uLlJlbmFtZU5vZGVSZXNwb25zZT4oXCJyZW5hbWVOb2RlXCIsIHtcbiAgICAgICAgICAgICAgICBcIm5vZGVJZFwiOiBoaWdobGlnaHROb2RlLmlkLFxuICAgICAgICAgICAgICAgIFwibmV3TmFtZVwiOiBuZXdOYW1lXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXM6IGpzb24uUmVuYW1lTm9kZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpei5yZW5hbWVOb2RlUmVzcG9uc2UocmVzLCByZW5hbWluZ1Jvb3ROb2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuYW1lTm9kZVJlc3BvbnNlID0gKHJlczoganNvbi5SZW5hbWVOb2RlUmVzcG9uc2UsIHJlbmFtaW5nUGFnZVJvb3Q6IGJvb2xlYW4pOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICh1dGlsLmNoZWNrU3VjY2VzcyhcIlJlbmFtZSBub2RlXCIsIHJlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVuYW1pbmdQYWdlUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB2aWV3LnJlZnJlc2hUcmVlKHJlcy5uZXdJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZWZyZXNoVHJlZShudWxsLCBmYWxzZSwgcmVzLm5ld0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbWV0YTY0LnNlbGVjdFRhYihcIm1haW5UYWJOYW1lXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHROb2RlID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKCFoaWdobGlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuaWQoXCJjdXJOb2RlTmFtZURpc3BsYXlcIikpLmh0bWwoXCJOYW1lOiBcIiArIGhpZ2hsaWdodE5vZGUubmFtZSk7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5pZChcImN1ck5vZGVQYXRoRGlzcGxheVwiKSkuaHRtbChcIlBhdGg6IFwiICsgaGlnaGxpZ2h0Tm9kZS5wYXRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnNvbGUubG9nKFwicnVubmluZyBtb2R1bGU6IEF1ZGlvUGxheWVyRGxnLmpzXCIpO1xyXG5cclxuLyogVGhpcyBpcyBhbiBhdWRpbyBwbGF5ZXIgZGlhbG9nIHRoYXQgaGFzIGFkLXNraXBwaW5nIHRlY2hub2xvZ3kgcHJvdmlkZWQgYnkgcG9kY2FzdC50cyAqL1xyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBdWRpb1BsYXllckRsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNvdXJjZVVybDogc3RyaW5nLCBwcml2YXRlIG5vZGVVaWQ6IHN0cmluZywgcHJpdmF0ZSBzdGFydFRpbWVQZW5kaW5nOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJBdWRpb1BsYXllckRsZ1wiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHN0YXJ0VGltZVBlbmRpbmcgaW4gY29uc3RydWN0b3I6ICR7c3RhcnRUaW1lUGVuZGluZ31gKTtcclxuICAgICAgICAgICAgcG9kY2FzdC5zdGFydFRpbWVQZW5kaW5nID0gc3RhcnRUaW1lUGVuZGluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIFdoZW4gdGhlIGRpYWxvZyBjbG9zZXMgd2UgbmVlZCB0byBzdG9wIGFuZCByZW1vdmUgdGhlIHBsYXllciAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gJChcIiNcIiArIHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIgJiYgcGxheWVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8qIGZvciBzb21lIHJlYXNvbiB0aGUgYXVkaW8gcGxheWVyIG5lZWRzIHRvIGJlIGFjY2Vzc2VkIGxpa2UgaXQncyBhbiBhcnJheSAqL1xyXG4gICAgICAgICAgICAgICAgKDxhbnk+cGxheWVyWzBdKS5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgICAgICAgKi9cclxuICAgICAgICBidWlsZCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQXVkaW8gUGxheWVyXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5vZGU6IGpzb24uTm9kZUluZm8gPSBtZXRhNjQudWlkVG9Ob2RlTWFwW3RoaXMubm9kZVVpZF07XHJcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgYHVua25vd24gbm9kZSB1aWQ6ICR7dGhpcy5ub2RlVWlkfWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByc3NUaXRsZToganNvbi5Qcm9wZXJ0eUluZm8gPSBwcm9wcy5nZXROb2RlUHJvcGVydHkoXCJtZXRhNjQ6cnNzSXRlbVRpdGxlXCIsIG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgLyogVGhpcyBpcyB3aGVyZSBJIG5lZWQgYSBzaG9ydCBuYW1lIG9mIHRoZSBtZWRpYSBiZWluZyBwbGF5ZWQgKi9cclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gcmVuZGVyLnRhZyhcInBcIiwge1xyXG4gICAgICAgICAgICB9LCByc3NUaXRsZS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL3JlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvcmVmX2F2X2RvbS5hc3BcclxuICAgICAgICAgICAgLy9odHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX0F1ZGlvX0FQSVxyXG4gICAgICAgICAgICBsZXQgcGxheWVyQXR0cmliczogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJzcmNcIjogdGhpcy5zb3VyY2VVcmwsXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMuaWQoXCJhdWRpb1BsYXllclwiKSxcclxuICAgICAgICAgICAgICAgIFwic3R5bGVcIjogXCJ3aWR0aDogMTAwJTsgcGFkZGluZzowcHg7IG1hcmdpbi10b3A6IDBweDsgbWFyZ2luLWxlZnQ6IDBweDsgbWFyZ2luLXJpZ2h0OiAwcHg7XCIsXHJcbiAgICAgICAgICAgICAgICBcIm9udGltZXVwZGF0ZVwiOiBgbTY0LnBvZGNhc3Qub25UaW1lVXBkYXRlKCcke3RoaXMubm9kZVVpZH0nLCB0aGlzKTtgLFxyXG4gICAgICAgICAgICAgICAgXCJvbmNhbnBsYXlcIjogYG02NC5wb2RjYXN0Lm9uQ2FuUGxheSgnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgICAgIFwiY29udHJvbHNcIjogXCJjb250cm9sc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmVsb2FkXCI6IFwiYXV0b1wiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gcmVuZGVyLnRhZyhcImF1ZGlvXCIsIHBsYXllckF0dHJpYnMpO1xyXG5cclxuICAgICAgICAgICAgLy9Ta2lwcGluZyBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBza2lwQmFjazMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBtNjQucG9kY2FzdC5za2lwKC0zMCwgJyR7dGhpcy5ub2RlVWlkfScsIHRoaXMpO2AsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCI8IDMwc1wiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBza2lwRm9yd2FyZDMwQnV0dG9uID0gcmVuZGVyLnRhZyhcInBhcGVyLWJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBcInJhaXNlZFwiOiBcInJhaXNlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJvbkNsaWNrXCI6IGBtNjQucG9kY2FzdC5za2lwKDMwLCAnJHt0aGlzLm5vZGVVaWR9JywgdGhpcyk7YCxcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjMwcyA+XCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNraXBCdXR0b25CYXIgPSByZW5kZXIuY2VudGVyZWRCdXR0b25CYXIoc2tpcEJhY2szMEJ1dHRvbiArIHNraXBGb3J3YXJkMzBCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9TcGVlZCBCdXR0b25zXHJcbiAgICAgICAgICAgIGxldCBzcGVlZE5vcm1hbEJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuMCk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCJOb3JtYWxcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3BlZWQxNUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnNwZWVkKDEuNSk7XCIsXHJcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwic3RhbmRhcmRCdXR0b25cIlxyXG4gICAgICAgICAgICB9LCAvL1xyXG4gICAgICAgICAgICAgICAgXCIxLjVYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkMnhCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5zcGVlZCgyKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJzdGFuZGFyZEJ1dHRvblwiXHJcbiAgICAgICAgICAgIH0sIC8vXHJcbiAgICAgICAgICAgICAgICBcIjJYXCIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNwZWVkQnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHNwZWVkTm9ybWFsQnV0dG9uICsgc3BlZWQxNUJ1dHRvbiArIHNwZWVkMnhCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgLy9EaWFsb2cgQnV0dG9uc1xyXG4gICAgICAgICAgICBsZXQgcGF1c2VCdXR0b24gPSByZW5kZXIudGFnKFwicGFwZXItYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgIFwicmFpc2VkXCI6IFwicmFpc2VkXCIsXHJcbiAgICAgICAgICAgICAgICBcIm9uQ2xpY2tcIjogXCJtNjQucG9kY2FzdC5wYXVzZSgpO1wiLFxyXG4gICAgICAgICAgICAgICAgXCJjbGFzc1wiOiBcInN0YW5kYXJkQnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGF1c2VcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheUJ1dHRvbiA9IHJlbmRlci50YWcoXCJwYXBlci1idXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgXCJyYWlzZWRcIjogXCJyYWlzZWRcIixcclxuICAgICAgICAgICAgICAgIFwib25DbGlja1wiOiBcIm02NC5wb2RjYXN0LnBsYXkoKTtcIixcclxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJwbGF5QnV0dG9uXCJcclxuICAgICAgICAgICAgfSwgLy9cclxuICAgICAgICAgICAgICAgIFwiUGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vdG9kby0wOiBldmVuIGlmIHRoaXMgYnV0dG9uIGFwcGVhcnMgdG8gd29yaywgSSBuZWVkIGl0IHRvIGV4cGxpY2l0bHkgZW5mb3JjZSB0aGUgc2F2aW5nIG9mIHRoZSB0aW1ldmFsdWUgQU5EIHRoZSByZW1vdmFsIG9mIHRoZSBBVURJTyBlbGVtZW50IGZyb20gdGhlIERPTSAqL1xyXG4gICAgICAgICAgICBsZXQgY2xvc2VCdXR0b24gPSB0aGlzLm1ha2VCdXR0b24oXCJDbG9zZVwiLCBcImNsb3NlQXVkaW9QbGF5ZXJEbGdCdXR0b25cIiwgdGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uQmFyID0gcmVuZGVyLmNlbnRlcmVkQnV0dG9uQmFyKHBsYXlCdXR0b24gKyBwYXVzZUJ1dHRvbiArIGNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBkZXNjcmlwdGlvbiArIHBsYXllciArIHNraXBCdXR0b25CYXIgKyBzcGVlZEJ1dHRvbkJhciArIGJ1dHRvbkJhcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlRXZlbnQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIHBvZGNhc3QuZGVzdHJveVBsYXllcihudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlQnRuID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBwb2RjYXN0LmRlc3Ryb3lQbGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb25zb2xlLmxvZyhcInJ1bm5pbmcgbW9kdWxlOiBDcmVhdGVOb2RlRGxnLmpzXCIpO1xuXG5uYW1lc3BhY2UgbTY0IHtcbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlTm9kZURsZyBleHRlbmRzIERpYWxvZ0Jhc2Uge1xuXG4gICAgICAgIGxhc3RTZWxEb21JZDogc3RyaW5nO1xuICAgICAgICBsYXN0U2VsVHlwZU5hbWU6IHN0cmluZztcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ3JlYXRlTm9kZURsZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyB0aGUgSFRNTCBjb250ZW50IG9mIHRoZSBkaWFsb2dcbiAgICAgICAgICovXG4gICAgICAgIGJ1aWxkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gdGhpcy5tYWtlSGVhZGVyKFwiQ3JlYXRlIE5ldyBOb2RlXCIpO1xuXG4gICAgICAgICAgICBsZXQgY3JlYXRlRmlyc3RDaGlsZEJ1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiRmlyc3RcIiwgXCJjcmVhdGVGaXJzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlRmlyc3RDaGlsZCwgdGhpcywgdHJ1ZSwgMTAwMCk7XG4gICAgICAgICAgICBsZXQgY3JlYXRlTGFzdENoaWxkQnV0dG9uID0gdGhpcy5tYWtlQ2xvc2VCdXR0b24oXCJMYXN0XCIsIFwiY3JlYXRlTGFzdENoaWxkQnV0dG9uXCIsIHRoaXMuY3JlYXRlTGFzdENoaWxkLCB0aGlzKTtcbiAgICAgICAgICAgIGxldCBjcmVhdGVJbmxpbmVCdXR0b24gPSB0aGlzLm1ha2VDbG9zZUJ1dHRvbihcIklubGluZVwiLCBcImNyZWF0ZUlubGluZUJ1dHRvblwiLCB0aGlzLmNyZWF0ZUlubGluZSwgdGhpcyk7XG4gICAgICAgICAgICBsZXQgYmFja0J1dHRvbiA9IHRoaXMubWFrZUNsb3NlQnV0dG9uKFwiQ2FuY2VsXCIsIFwiY2FuY2VsQnV0dG9uXCIpO1xuICAgICAgICAgICAgbGV0IGJ1dHRvbkJhciA9IHJlbmRlci5jZW50ZXJlZEJ1dHRvbkJhcihjcmVhdGVGaXJzdENoaWxkQnV0dG9uICsgY3JlYXRlTGFzdENoaWxkQnV0dG9uICsgY3JlYXRlSW5saW5lQnV0dG9uICsgYmFja0J1dHRvbik7XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gXCJcIjtcbiAgICAgICAgICAgIGxldCB0eXBlSWR4ID0gMDtcbiAgICAgICAgICAgIC8qIHRvZG8tMTogbmVlZCBhIGJldHRlciB3YXkgdG8gZW51bWVyYXRlIGFuZCBhZGQgdGhlIHR5cGVzIHdlIHdhbnQgdG8gYmUgYWJsZSB0byBzZWFyY2ggKi9cbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTdGFuZGFyZCBUeXBlXCIsIFwibnQ6dW5zdHJ1Y3R1cmVkXCIsIHR5cGVJZHgrKywgdHJ1ZSk7XG4gICAgICAgICAgICBjb250ZW50ICs9IHRoaXMubWFrZUxpc3RJdGVtKFwiUlNTIEZlZWRcIiwgXCJtZXRhNjQ6cnNzZmVlZFwiLCB0eXBlSWR4KyssIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5tYWtlTGlzdEl0ZW0oXCJTeXN0ZW0gRm9sZGVyXCIsIFwibWV0YTY0OnN5c3RlbWZvbGRlclwiLCB0eXBlSWR4KyssIGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIGxpc3RCb3ggPSByZW5kZXIudGFnKFwiZGl2XCIsIHtcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IFwibGlzdEJveFwiXG4gICAgICAgICAgICB9LCBjb250ZW50KTtcblxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50OiBzdHJpbmcgPSBsaXN0Qm94O1xuXG4gICAgICAgICAgICB2YXIgY2VudGVyZWRIZWFkZXI6IHN0cmluZyA9IHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJjZW50ZXJlZFRpdGxlXCJcbiAgICAgICAgICAgIH0sIGhlYWRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBjZW50ZXJlZEhlYWRlciArIG1haW5Db250ZW50ICsgYnV0dG9uQmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFrZUxpc3RJdGVtKHZhbDogc3RyaW5nLCB0eXBlTmFtZTogc3RyaW5nLCB0eXBlSWR4OiBudW1iZXIsIGluaXRpYWxseVNlbGVjdGVkOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGxldCBwYXlsb2FkOiBPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlTmFtZVwiOiB0eXBlTmFtZSxcbiAgICAgICAgICAgICAgICBcInR5cGVJZHhcIjogdHlwZUlkeFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IGRpdklkOiBzdHJpbmcgPSB0aGlzLmlkKFwidHlwZVJvd1wiICsgdHlwZUlkeCk7XG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsbHlTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlbFR5cGVOYW1lID0gdHlwZU5hbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VsRG9tSWQgPSBkaXZJZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlci50YWcoXCJkaXZcIiwge1xuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogXCJsaXN0SXRlbVwiICsgKGluaXRpYWxseVNlbGVjdGVkID8gXCIgc2VsZWN0ZWRMaXN0SXRlbVwiIDogXCJcIiksXG4gICAgICAgICAgICAgICAgXCJpZFwiOiBkaXZJZCxcbiAgICAgICAgICAgICAgICBcIm9uY2xpY2tcIjogbWV0YTY0LmVuY29kZU9uQ2xpY2sodGhpcy5vblJvd0NsaWNrLCB0aGlzLCBwYXlsb2FkKVxuICAgICAgICAgICAgfSwgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZUZpcnN0Q2hpbGQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0LmNyZWF0ZVN1Yk5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlTGFzdENoaWxkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3RTZWxUeXBlTmFtZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiY2hvb3NlIGEgdHlwZS5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWRpdC5jcmVhdGVTdWJOb2RlKG51bGwsIHRoaXMubGFzdFNlbFR5cGVOYW1lLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVJbmxpbmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGFzdFNlbFR5cGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJjaG9vc2UgYSB0eXBlLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0Lmluc2VydE5vZGUobnVsbCwgdGhpcy5sYXN0U2VsVHlwZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25Sb3dDbGljayA9IChwYXlsb2FkOiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCBkaXZJZCA9IHRoaXMuaWQoXCJ0eXBlUm93XCIgKyBwYXlsb2FkLnR5cGVJZHgpO1xuICAgICAgICAgICAgdGhpcy5sYXN0U2VsVHlwZU5hbWUgPSBwYXlsb2FkLnR5cGVOYW1lO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0U2VsRG9tSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsKHRoaXMubGFzdFNlbERvbUlkKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkTGlzdEl0ZW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxEb21JZCA9IGRpdklkO1xuICAgICAgICAgICAgdGhpcy5lbChkaXZJZCkuYWRkQ2xhc3MoXCJzZWxlY3RlZExpc3RJdGVtXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlOiBqc29uLk5vZGVJbmZvID0gbWV0YTY0LmdldEhpZ2hsaWdodGVkTm9kZSgpO1xuICAgICAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FuSW5zZXJ0SW5saW5lOiBib29sZWFuID0gbWV0YTY0LmhvbWVOb2RlSWQgIT0gbm9kZS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoY2FuSW5zZXJ0SW5saW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwoXCJjcmVhdGVJbmxpbmVCdXR0b25cIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbChcImNyZWF0ZUlubGluZUJ1dHRvblwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogc2VhcmNoUmVzdWx0c1BhbmVsLmpzXCIpO1xyXG5cclxubmFtZXNwYWNlIG02NCB7XHJcbiAgICBleHBvcnQgY2xhc3MgU2VhcmNoUmVzdWx0c1BhbmVsIHtcclxuXHJcbiAgICAgICAgZG9tSWQ6IHN0cmluZyA9IFwic2VhcmNoUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwic2VhcmNoVGFiTmFtZVwiO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYnVpbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXIgPSBcIjxoMiBpZD0nc2VhcmNoUGFnZVRpdGxlJyBjbGFzcz0ncGFnZS10aXRsZSc+PC9oMj5cIjtcclxuICAgICAgICAgICAgdmFyIG1haW5Db250ZW50ID0gXCI8ZGl2IGlkPSdzZWFyY2hSZXN1bHRzVmlldyc+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXIgKyBtYWluQ29udGVudDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3NlYXJjaFBhZ2VUaXRsZVwiKS5odG1sKHNyY2guc2VhcmNoUGFnZVRpdGxlKTtcclxuICAgICAgICAgICAgc3JjaC5wb3B1bGF0ZVNlYXJjaFJlc3VsdHNQYWdlKHNyY2guc2VhcmNoUmVzdWx0cywgXCJzZWFyY2hSZXN1bHRzVmlld1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuY29uc29sZS5sb2coXCJydW5uaW5nIG1vZHVsZTogdGltZWxpbmVSZXN1bHRzUGFuZWwuanNcIik7XHJcblxyXG5uYW1lc3BhY2UgbTY0IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUaW1lbGluZVJlc3VsdHNQYW5lbCB7XHJcblxyXG4gICAgICAgIGRvbUlkOiBzdHJpbmcgPSBcInRpbWVsaW5lUmVzdWx0c1BhbmVsXCI7XHJcbiAgICAgICAgdGFiSWQ6IHN0cmluZyA9IFwidGltZWxpbmVUYWJOYW1lXCI7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBidWlsZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlciA9IFwiPGgyIGlkPSd0aW1lbGluZVBhZ2VUaXRsZScgY2xhc3M9J3BhZ2UtdGl0bGUnPjwvaDI+XCI7XHJcbiAgICAgICAgICAgIHZhciBtYWluQ29udGVudCA9IFwiPGRpdiBpZD0ndGltZWxpbmVWaWV3Jz48L2Rpdj5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlciArIG1haW5Db250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgJChcIiN0aW1lbGluZVBhZ2VUaXRsZVwiKS5odG1sKHNyY2gudGltZWxpbmVQYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICBzcmNoLnBvcHVsYXRlU2VhcmNoUmVzdWx0c1BhZ2Uoc3JjaC50aW1lbGluZVJlc3VsdHMsIFwidGltZWxpbmVWaWV3XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=