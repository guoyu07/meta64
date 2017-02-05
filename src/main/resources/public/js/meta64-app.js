var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("Interfaces", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AdSegment, PropEntry, SubProp;
    return {
        setters:[],
        execute: function() {
            console.log("Interfaces.ts");
            AdSegment = (function () {
                function AdSegment(beginTime, endTime) {
                    this.beginTime = beginTime;
                    this.endTime = endTime;
                }
                return AdSegment;
            }());
            exports_1("AdSegment", AdSegment);
            PropEntry = (function () {
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
            exports_1("PropEntry", PropEntry);
            SubProp = (function () {
                function SubProp(id, val) {
                    this.id = id;
                    this.val = val;
                }
                return SubProp;
            }());
            exports_1("SubProp", SubProp);
        }
    }
});
System.register("Constants", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Constants, cnst, JCRConstants, jcrCnst;
    return {
        setters:[],
        execute: function() {
            console.log("Constants.ts");
            Constants = (function () {
                function Constants() {
                    this.ANON = "anonymous";
                    this.COOKIE_LOGIN_USR = cookiePrefix + "loginUsr";
                    this.COOKIE_LOGIN_PWD = cookiePrefix + "loginPwd";
                    this.COOKIE_LOGIN_STATE = cookiePrefix + "loginState";
                    this.INSERT_ATTACHMENT = "{{insert-attachment}}";
                    this.NEW_ON_TOOLBAR = false;
                    this.INS_ON_TOOLBAR = false;
                    this.MOVE_UPDOWN_ON_TOOLBAR = true;
                    this.USE_ACE_EDITOR = false;
                    this.SHOW_PATH_ON_ROWS = true;
                    this.SHOW_PATH_IN_DLGS = true;
                    this.SHOW_CLEAR_BUTTON_IN_EDITOR = false;
                }
                return Constants;
            }());
            exports_2("cnst", cnst = new Constants());
            window.cnst = cnst;
            JCRConstants = (function () {
                function JCRConstants() {
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
                    this.JSON_FILE_SEARCH_RESULT = "meta64:json";
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
                return JCRConstants;
            }());
            exports_2("jcrCnst", jcrCnst = new JCRConstants());
        }
    }
});
System.register("DialogBase", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters:[],
        execute: function() {
            console.log("DialogBase.ts");
        }
    }
});
System.register("MessageDlg", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters:[],
        execute: function() {
            console.log("MessageDlg.ts");
        }
    }
});
System.register("ProgressDlg", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters:[],
        execute: function() {
            console.log("MessageDlg.ts");
        }
    }
});
System.register("Factory", [], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Factory;
    return {
        setters:[],
        execute: function() {
            console.log("Factory.ts");
            Factory = (function () {
                function Factory() {
                }
                Factory.create = function (className, callback, args) {
                    System.import(className + "Impl").then(function (mod) {
                        var obj = new mod.default(args || {});
                        if (callback) {
                            callback(obj);
                        }
                    });
                };
                Factory.createPanel = function (className, callback, args) {
                    System.import(className).then(function (mod) {
                        var obj = new mod[className](args || {});
                        if (callback) {
                            callback(obj);
                        }
                    });
                };
                return Factory;
            }());
            exports_6("Factory", Factory);
        }
    }
});
System.register("Util", ["Meta64", "Factory"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Meta64_1, Factory_1;
    var Util, util;
    return {
        setters:[
            function (Meta64_1_1) {
                Meta64_1 = Meta64_1_1;
            },
            function (Factory_1_1) {
                Factory_1 = Factory_1_1;
            }],
        execute: function() {
            console.log("Util.ts");
            Util = (function () {
                function Util() {
                    this.logAjax = false;
                    this.timeoutMessageShown = false;
                    this.offline = false;
                    this.waitCounter = 0;
                    this.pgrsDlg = null;
                    this.escapeRegExp = function (_) {
                        return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                    };
                    this.escapeForAttrib = function (_) {
                        return util.replaceAll(_, "\"", "&quot;");
                    };
                    this.unencodeHtml = function (_) {
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
                    this.replaceAll = function (_, find, replace) {
                        return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
                    };
                    this.contains = function (_, str) {
                        return _.indexOf(str) != -1;
                    };
                    this.startsWith = function (_, str) {
                        return _.indexOf(str) === 0;
                    };
                    this.stripIfStartsWith = function (_, str) {
                        if (_.startsWith(str)) {
                            return _.substring(str.length);
                        }
                        return _;
                    };
                    this.arrayClone = function (_) {
                        return _.slice(0);
                    };
                    this.arrayIndexOfItemByProp = function (_, propName, propVal) {
                        var len = _.length;
                        for (var i = 0; i < len; i++) {
                            if (_[i][propName] === propVal) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    this.arrayMoveItem = function (_, fromIndex, toIndex) {
                        _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
                    };
                    this.indexOfObject = function (_, obj) {
                        for (var i = 0; i < _.length; i++) {
                            if (_[i] === obj) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    this.assertNotNull = function (varName) {
                        if (typeof eval(varName) === 'undefined') {
                            util.showMessage("Variable not found: " + varName);
                        }
                    };
                    this._ajaxCounter = 0;
                    this.daylightSavingsTime = (Util.dst(new Date())) ? true : false;
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
                    this.initProgressMonitor = function () {
                        setInterval(util.progressInterval, 1000);
                    };
                    this.progressInterval = function () {
                        var isWaiting = util.isAjaxWaiting();
                        if (isWaiting) {
                            util.waitCounter++;
                            if (util.waitCounter >= 3) {
                                if (!util.pgrsDlg) {
                                    Factory_1.Factory.create("ProgressDlg", function (dlg) {
                                        util.pgrsDlg = dlg;
                                        util.pgrsDlg.open();
                                    });
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
                    this.json = function (postName, postData, callback, callbackThis, callbackPayload) {
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
                            util._ajaxCounter++;
                            ironRequest = ironAjax.generateRequest();
                        }
                        catch (ex) {
                            util.logAndReThrow("Failed starting request: " + postName, ex);
                        }
                        ironRequest.completes.then(function () {
                            try {
                                util._ajaxCounter--;
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
                                util._ajaxCounter--;
                                util.progressInterval();
                                console.log("Error in util.json");
                                if (ironRequest.status == "403") {
                                    console.log("Not logged in detected in util.");
                                    util.offline = true;
                                    if (!util.timeoutMessageShown) {
                                        util.timeoutMessageShown = true;
                                        util.showMessage("Session timed out. Page will refresh.");
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
                                util.showMessage(msg);
                            }
                            catch (ex) {
                                util.logAndReThrow("Failed processing server-side fail of: " + postName, ex);
                            }
                        });
                        return ironRequest;
                    };
                    this.logAndThrow = function (message) {
                        var stack = "[stack, not supported]";
                        try {
                            stack = (new Error()).stack;
                        }
                        catch (e) { }
                        console.error(message + "STACK: " + stack);
                        throw message;
                    };
                    this.logAndReThrow = function (message, exception) {
                        var stack = "[stack, not supported]";
                        try {
                            stack = (new Error()).stack;
                        }
                        catch (e) { }
                        console.error(message + "STACK: " + stack);
                        throw exception;
                    };
                    this.ajaxReady = function (requestName) {
                        if (util._ajaxCounter > 0) {
                            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
                            return false;
                        }
                        return true;
                    };
                    this.isAjaxWaiting = function () {
                        return util._ajaxCounter > 0;
                    };
                    this.delayedFocus = function (id) {
                        setTimeout(function () {
                            $(id).focus();
                        }, 500);
                        setTimeout(function () {
                            $(id).focus();
                        }, 1300);
                    };
                    this.checkSuccess = function (opFriendlyName, res) {
                        if (!res.success) {
                            util.showMessage(opFriendlyName + " failed: " + res.message);
                        }
                        return res.success;
                    };
                    this.showMessage = function (message) {
                        Factory_1.Factory.create("MessageDlg", function (dlg) {
                            dlg.open();
                        }, { "message": message });
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
                            uid = "" + Meta64_1.meta64.nextUid++;
                            map[id] = uid;
                        }
                        return uid;
                    };
                    this.elementExists = function (id) {
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
                    this.getTextAreaValById = function (id) {
                        var de = util.domElm(id);
                        return de.value;
                    };
                    this.domElm = function (id) {
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
                    this.poly = function (id) {
                        return util.polyElm(id).node;
                    };
                    this.polyElm = function (id) {
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
                    this.polyElmNode = function (id) {
                        var e = util.polyElm(id);
                        return e.node;
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
                        return util.polyElm(id).node.value;
                    };
                    this.setInputVal = function (id, val) {
                        if (val == null) {
                            val = "";
                        }
                        var elm = util.polyElm(id);
                        if (elm) {
                            elm.node.value = val;
                        }
                        return elm != null;
                    };
                    this.bindEnterKey = function (id, func) {
                        util.bindKey(id, func, 13);
                    };
                    this.bindKey = function (id, func, keyCode) {
                        $(id).keypress(function (e) {
                            if (e.which == keyCode) {
                                func();
                                return false;
                            }
                        });
                        return false;
                    };
                    this.changeOrAddClass = function (elm, oldClass, newClass) {
                        var elmement = $(elm);
                        elmement.toggleClass(oldClass, false);
                        elmement.toggleClass(newClass, true);
                    };
                    this.verifyType = function (obj, type, msg) {
                        if (typeof obj !== type) {
                            util.showMessage(msg);
                            return false;
                        }
                        return true;
                    };
                    this.setHtml = function (id, content) {
                        if (content == null) {
                            content = "";
                        }
                        var elm = util.domElm(id);
                        var polyElm = Polymer.dom(elm);
                        polyElm.innerHTML = content;
                        Polymer.dom.flush();
                        Polymer.updateStyles();
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
                    this.printKeys = function (obj) {
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
                    this.setEnablement = function (elmId, enable) {
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
                    this.setVisibility = function (elmId, vis) {
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
                    this.getInstance = function (context, name) {
                        var args = [];
                        for (var _i = 2; _i < arguments.length; _i++) {
                            args[_i - 2] = arguments[_i];
                        }
                        var instance = Object.create(context[name].prototype);
                        instance.constructor.apply(instance, args);
                        return instance;
                    };
                }
                Util.stdTimezoneOffset = function (_) {
                    var jan = new Date(_.getFullYear(), 0, 1);
                    var jul = new Date(_.getFullYear(), 6, 1);
                    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
                };
                Util.dst = function (_) {
                    return _.getTimezoneOffset() < Util.stdTimezoneOffset(_);
                };
                return Util;
            }());
            exports_7("util", util = new Util());
            exports_7("default",util);
        }
    }
});
System.register("View", ["Meta64", "Util", "Nav", "Render", "Edit"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Meta64_2, Util_1, Nav_1, Render_1, Edit_1;
    var View, view;
    return {
        setters:[
            function (Meta64_2_1) {
                Meta64_2 = Meta64_2_1;
            },
            function (Util_1_1) {
                Util_1 = Util_1_1;
            },
            function (Nav_1_1) {
                Nav_1 = Nav_1_1;
            },
            function (Render_1_1) {
                Render_1 = Render_1_1;
            },
            function (Edit_1_1) {
                Edit_1 = Edit_1_1;
            }],
        execute: function() {
            console.log("View.ts");
            View = (function () {
                function View() {
                    this.scrollToSelNodePending = false;
                    this.updateStatusBar = function () {
                        if (!Meta64_2.meta64.currentNodeData)
                            return;
                        var statusLine = "";
                        if (Meta64_2.meta64.editModeOption === Meta64_2.meta64.MODE_ADVANCED) {
                            statusLine += "count: " + Meta64_2.meta64.currentNodeData.children.length;
                        }
                        if (Meta64_2.meta64.userPreferences.editMode) {
                            statusLine += " Selections: " + Util_1.util.getPropertyCount(Meta64_2.meta64.selectedNodes);
                        }
                    };
                    this.refreshTreeResponse = function (res, targetId, scrollToTop) {
                        Render_1.render.renderPageFromData(res, scrollToTop);
                        if (scrollToTop) {
                        }
                        else {
                            if (targetId) {
                                Meta64_2.meta64.highlightRowById(targetId, true);
                            }
                            else {
                                view.scrollToSelectedNode();
                            }
                        }
                        Meta64_2.meta64.refreshAllGuiEnablement();
                        Util_1.util.delayedFocus("#mainNodeContent");
                    };
                    this.refreshTree = function (nodeId, renderParentIfLeaf, highlightId, isInitialRender) {
                        if (!nodeId) {
                            nodeId = Meta64_2.meta64.currentNodeId;
                        }
                        console.log("Refreshing tree: nodeId=" + nodeId);
                        if (!highlightId) {
                            var currentSelNode = Meta64_2.meta64.getHighlightedNode();
                            highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
                        }
                        Util_1.util.json("renderNode", {
                            "nodeId": nodeId,
                            "upLevel": null,
                            "renderParentIfLeaf": renderParentIfLeaf ? true : false,
                            "offset": Nav_1.nav.mainOffset,
                            "goToLastPage": false
                        }, function (res) {
                            if (res.offsetOfNodeFound > -1) {
                                Nav_1.nav.mainOffset = res.offsetOfNodeFound;
                            }
                            view.refreshTreeResponse(res, highlightId);
                            if (isInitialRender && Meta64_2.meta64.urlCmd == "addNode" && Meta64_2.meta64.homeNodeOverride) {
                                Edit_1.edit.editMode(true);
                                Edit_1.edit.createSubNode(Meta64_2.meta64.currentNode.uid);
                            }
                        });
                    };
                    this.firstPage = function () {
                        console.log("Running firstPage Query");
                        Nav_1.nav.mainOffset = 0;
                        view.loadPage(false);
                    };
                    this.prevPage = function () {
                        console.log("Running prevPage Query");
                        Nav_1.nav.mainOffset -= Nav_1.nav.ROWS_PER_PAGE;
                        if (Nav_1.nav.mainOffset < 0) {
                            Nav_1.nav.mainOffset = 0;
                        }
                        view.loadPage(false);
                    };
                    this.nextPage = function () {
                        console.log("Running nextPage Query");
                        Nav_1.nav.mainOffset += Nav_1.nav.ROWS_PER_PAGE;
                        view.loadPage(false);
                    };
                    this.lastPage = function () {
                        console.log("Running lastPage Query");
                        view.loadPage(true);
                    };
                    this.loadPage = function (goToLastPage) {
                        Util_1.util.json("renderNode", {
                            "nodeId": Meta64_2.meta64.currentNodeId,
                            "upLevel": null,
                            "renderParentIfLeaf": true,
                            "offset": Nav_1.nav.mainOffset,
                            "goToLastPage": goToLastPage
                        }, function (res) {
                            if (goToLastPage) {
                                if (res.offsetOfNodeFound > -1) {
                                    Nav_1.nav.mainOffset = res.offsetOfNodeFound;
                                }
                            }
                            view.refreshTreeResponse(res, null, true);
                        });
                    };
                    this.scrollToSelectedNode = function () {
                        view.scrollToSelNodePending = true;
                        setTimeout(function () {
                            view.scrollToSelNodePending = false;
                            var elm = Nav_1.nav.getSelectedPolyElement();
                            if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                                elm.node.scrollIntoView();
                            }
                            else {
                                $("#mainContainer").scrollTop(0);
                            }
                        }, 1000);
                    };
                    this.scrollToTop = function () {
                        if (view.scrollToSelNodePending)
                            return;
                        $("#mainContainer").scrollTop(0);
                        setTimeout(function () {
                            if (view.scrollToSelNodePending)
                                return;
                            $("#mainContainer").scrollTop(0);
                        }, 1000);
                    };
                    this.initEditPathDisplayById = function (domId) {
                        var node = Edit_1.edit.editNode;
                        var e = $("#" + domId);
                        if (!e)
                            return;
                        if (Edit_1.edit.editingUnsavedNode) {
                            e.html("");
                            e.hide();
                        }
                        else {
                            var pathDisplay = "Path: " + Render_1.render.formatPath(node);
                            if (node.lastModified) {
                                pathDisplay += "<br>Mod: " + node.lastModified;
                            }
                            e.html(pathDisplay);
                            e.show();
                        }
                    };
                    this.showServerInfo = function () {
                        Util_1.util.json("getServerInfo", {}, function (res) {
                            Util_1.util.showMessage(res.serverInfo);
                        });
                    };
                }
                return View;
            }());
            exports_8("view", view = new View());
            exports_8("default",view);
        }
    }
});
System.register("Props", ["Meta64", "Util", "Constants", "Render", "View", "Edit"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Meta64_3, Util_2, Constants_1, Render_2, View_1, Edit_2;
    var Props, props;
    return {
        setters:[
            function (Meta64_3_1) {
                Meta64_3 = Meta64_3_1;
            },
            function (Util_2_1) {
                Util_2 = Util_2_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            },
            function (Render_2_1) {
                Render_2 = Render_2_1;
            },
            function (View_1_1) {
                View_1 = View_1_1;
            },
            function (Edit_2_1) {
                Edit_2 = Edit_2_1;
            }],
        execute: function() {
            console.log("Props.ts");
            Props = (function () {
                function Props() {
                    this.orderProps = function (propOrder, _props) {
                        var propsNew = Util_2.util.arrayClone(_props);
                        var targetIdx = 0;
                        for (var _i = 0, propOrder_1 = propOrder; _i < propOrder_1.length; _i++) {
                            var prop = propOrder_1[_i];
                            targetIdx = props.moveNodePosition(propsNew, targetIdx, prop);
                        }
                        return propsNew;
                    };
                    this.moveNodePosition = function (props, idx, typeName) {
                        var tagIdx = Util_2.util.arrayIndexOfItemByProp(props, "name", typeName);
                        if (tagIdx != -1) {
                            Util_2.util.arrayMoveItem(props, tagIdx, idx++);
                        }
                        return idx;
                    };
                    this.propsToggle = function () {
                        Meta64_3.meta64.showProperties = Meta64_3.meta64.showProperties ? false : true;
                        Render_2.render.renderPageFromData();
                        View_1.view.scrollToSelectedNode();
                        Meta64_3.meta64.selectTab("mainTabName");
                    };
                    this.deletePropertyFromLocalData = function (propertyName) {
                        for (var i = 0; i < Edit_2.edit.editNode.properties.length; i++) {
                            if (propertyName === Edit_2.edit.editNode.properties[i].name) {
                                Edit_2.edit.editNode.properties.splice(i, 1);
                                break;
                            }
                        }
                    };
                    this.getPropertiesInEditingOrder = function (node, _props) {
                        var func = Meta64_3.meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
                        if (func) {
                            return func(node, _props);
                        }
                        var propsNew = Util_2.util.arrayClone(_props);
                        props.movePropsToTop([Constants_1.jcrCnst.CONTENT, Constants_1.jcrCnst.TAGS], propsNew);
                        props.movePropsToEnd([Constants_1.jcrCnst.CREATED, Constants_1.jcrCnst.CREATED_BY, Constants_1.jcrCnst.LAST_MODIFIED, Constants_1.jcrCnst.LAST_MODIFIED_BY], propsNew);
                        return propsNew;
                    };
                    this.movePropsToTop = function (propsList, props) {
                        for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
                            var prop = propsList_1[_i];
                            var tagIdx = Util_2.util.arrayIndexOfItemByProp(props, "name", prop);
                            if (tagIdx != -1) {
                                Util_2.util.arrayMoveItem(props, tagIdx, 0);
                            }
                        }
                    };
                    this.movePropsToEnd = function (propsList, props) {
                        for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
                            var prop = propsList_2[_i];
                            var tagIdx = Util_2.util.arrayIndexOfItemByProp(props, "name", prop);
                            if (tagIdx != -1) {
                                Util_2.util.arrayMoveItem(props, tagIdx, props.length);
                            }
                        }
                    };
                    this.renderProperties = function (properties) {
                        if (properties) {
                            var table_1 = "";
                            var propCount_1 = 0;
                            $.each(properties, function (i, property) {
                                if (Render_2.render.allowPropertyToDisplay(property.name)) {
                                    var isBinaryProp = Render_2.render.isBinaryProperty(property.name);
                                    propCount_1++;
                                    var td = Render_2.render.tag("td", {
                                        "class": "prop-table-name-col"
                                    }, Render_2.render.sanitizePropertyName(property.name));
                                    var val = void 0;
                                    if (isBinaryProp) {
                                        val = "[binary]";
                                    }
                                    else if (!property.values) {
                                        val = Render_2.render.wrapHtml(property.value);
                                    }
                                    else {
                                        val = props.renderPropertyValues(property.values);
                                    }
                                    td += Render_2.render.tag("td", {
                                        "class": "prop-table-val-col"
                                    }, val);
                                    table_1 += Render_2.render.tag("tr", {
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
                            return Render_2.render.tag("table", {
                                "border": "1",
                                "class": "property-table"
                            }, table_1);
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
                        var prop = props.getNodeProperty(propertyName, node);
                        return prop ? prop.value : null;
                    };
                    this.isNonOwnedNode = function (node) {
                        var createdBy = props.getNodePropertyVal(Constants_1.jcrCnst.CREATED_BY, node);
                        if (!createdBy) {
                            createdBy = "admin";
                        }
                        return createdBy != Meta64_3.meta64.userName;
                    };
                    this.isNonOwnedCommentNode = function (node) {
                        var commentBy = props.getNodePropertyVal(Constants_1.jcrCnst.COMMENT_BY, node);
                        return commentBy != null && commentBy != Meta64_3.meta64.userName;
                    };
                    this.isOwnedCommentNode = function (node) {
                        var commentBy = props.getNodePropertyVal(Constants_1.jcrCnst.COMMENT_BY, node);
                        return commentBy != null && commentBy == Meta64_3.meta64.userName;
                    };
                    this.renderProperty = function (property) {
                        if (!property.values) {
                            if (!property.value || property.value.length == 0) {
                                return "";
                            }
                            return property.value;
                        }
                        else {
                            return props.renderPropertyValues(property.values);
                        }
                    };
                    this.renderPropertyValues = function (values) {
                        var ret = "<div>";
                        var count = 0;
                        $.each(values, function (i, value) {
                            if (count > 0) {
                                ret += Constants_1.cnst.BR;
                            }
                            ret += Render_2.render.wrapHtml(value);
                            count++;
                        });
                        ret += "</div>";
                        return ret;
                    };
                }
                return Props;
            }());
            exports_9("props", props = new Props());
            exports_9("default",props);
        }
    }
});
System.register("Render", ["Meta64", "Util", "Nav", "Edit", "View", "Constants", "Props"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var Meta64_4, Util_3, Nav_2, Edit_3, View_2, Constants_2, Props_1;
    var Render, render;
    return {
        setters:[
            function (Meta64_4_1) {
                Meta64_4 = Meta64_4_1;
            },
            function (Util_3_1) {
                Util_3 = Util_3_1;
            },
            function (Nav_2_1) {
                Nav_2 = Nav_2_1;
            },
            function (Edit_3_1) {
                Edit_3 = Edit_3_1;
            },
            function (View_2_1) {
                View_2 = View_2_1;
            },
            function (Constants_2_1) {
                Constants_2 = Constants_2_1;
            },
            function (Props_1_1) {
                Props_1 = Props_1_1;
            }],
        execute: function() {
            console.log("Render.ts");
            Render = (function () {
                function Render() {
                    this.debug = false;
                    this.getEmptyPagePrompt = function () {
                        return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
                    };
                    this.renderBinary = function (node) {
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
                        var commentBy = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.COMMENT_BY, node);
                        var headerText = "";
                        if (Constants_2.cnst.SHOW_PATH_ON_ROWS) {
                            headerText += "<div class='path-display'>Path: " + render.formatPath(node) + "</div>";
                        }
                        headerText += "<div>";
                        if (commentBy) {
                            var clazz = (commentBy === Meta64_4.meta64.userName) ? "created-by-me" : "created-by-other";
                            headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
                        }
                        else if (node.createdBy) {
                            var clazz = (node.createdBy === Meta64_4.meta64.userName) ? "created-by-me" : "created-by-other";
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
                    this.injectCodeFormatting = function (content) {
                        if (!content)
                            return content;
                        if (Util_3.util.contains(content, "<code")) {
                            Meta64_4.meta64.codeFormatDirty = true;
                            content = render.encodeLanguages(content);
                            content = Util_3.util.replaceAll(content, "</code>", "</pre>");
                        }
                        return content;
                    };
                    this.injectSubstitutions = function (content) {
                        return Util_3.util.replaceAll(content, "{{locationOrigin}}", window.location.origin);
                    };
                    this.encodeLanguages = function (content) {
                        var langs = ["js", "html", "htm", "css"];
                        for (var i = 0; i < langs.length; i++) {
                            content = Util_3.util.replaceAll(content, "<code class=\"" + langs[i] + "\">", "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
                        }
                        content = Util_3.util.replaceAll(content, "<code>", "<pre class='prettyprint'>");
                        return content;
                    };
                    this.refreshNodeOnPage = function (node) {
                        var uid = Meta64_4.meta64.identToUidMap[node.id];
                        if (!uid)
                            throw "Unable to find nodeId " + node.id + " in uid map";
                        Meta64_4.meta64.initNode(node, false);
                        if (uid != node.uid)
                            throw "uid changed unexpectly after initNode";
                        var rowContent = render.renderNodeContent(node, true, true, true, true, true);
                        $("#" + uid + "_content").html(rowContent);
                    };
                    this.renderNodeContent = function (node, showPath, showName, renderBin, rowStyling, showHeader) {
                        var ret = render.getTopRightImageTag(node);
                        if (Meta64_4.meta64.showMetaData) {
                            ret += showHeader ? render.buildRowHeader(node, showPath, showName) : "";
                        }
                        if (Meta64_4.meta64.showProperties) {
                            var properties = Props_1.props.renderProperties(node.properties);
                            if (properties) {
                                ret += properties;
                            }
                        }
                        else {
                            var renderComplete = false;
                            if (!renderComplete) {
                                var func = Meta64_4.meta64.renderFunctionsByJcrType[node.primaryTypeName];
                                if (func) {
                                    renderComplete = true;
                                    ret += func(node, rowStyling);
                                }
                            }
                            if (!renderComplete) {
                                var contentProp = Props_1.props.getNodeProperty(Constants_2.jcrCnst.CONTENT, node);
                                if (contentProp) {
                                    renderComplete = true;
                                    var jcrContent = Props_1.props.renderProperty(contentProp);
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
                                var properties_1 = Props_1.props.renderProperties(node.properties);
                                if (properties_1) {
                                    ret += properties_1;
                                }
                            }
                        }
                        if (renderBin && node.hasBinary) {
                            var binary = render.renderBinary(node);
                            if (Util_3.util.contains(ret, Constants_2.cnst.INSERT_ATTACHMENT)) {
                                ret = Util_3.util.replaceAll(ret, Constants_2.cnst.INSERT_ATTACHMENT, binary);
                            }
                            else {
                                ret += binary;
                            }
                        }
                        var tags = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.TAGS, node);
                        if (tags) {
                            ret += render.tag("div", {
                                "class": "tags-content"
                            }, "Tags: " + tags);
                        }
                        return ret;
                    };
                    this.renderJsonFileSearchResultProperty = function (jsonContent) {
                        var content = "";
                        try {
                            console.log("json: " + jsonContent);
                            var list = JSON.parse(jsonContent);
                            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                                var entry = list_1[_i];
                                content += render.tag("div", {
                                    "class": "systemFile",
                                    "onclick": "meta64.editSystemFile('" + entry.fileName + "')"
                                }, entry.fileName);
                            }
                        }
                        catch (e) {
                            Util_3.util.logAndReThrow("render failed", e);
                            content = "[render failed]";
                        }
                        return content;
                    };
                    this.renderNodeAsListItem = function (node, index, count, rowCount) {
                        var uid = node.uid;
                        var prevPageExists = Nav_2.nav.mainOffset > 0;
                        var nextPageExists = !Nav_2.nav.endReached;
                        var canMoveUp = (index > 0 && rowCount > 1) || prevPageExists;
                        var canMoveDown = (index < count - 1) || nextPageExists;
                        var isRep = Util_3.util.startsWith(node.name, "rep:") ||
                            Util_3.util.contains(node.path, "/rep:");
                        var editingAllowed = Props_1.props.isOwnedCommentNode(node);
                        if (!editingAllowed) {
                            editingAllowed = (Meta64_4.meta64.isAdminUser || !isRep) && !Props_1.props.isNonOwnedCommentNode(node)
                                && !Props_1.props.isNonOwnedNode(node);
                        }
                        var focusNode = Meta64_4.meta64.getHighlightedNode();
                        var selected = (focusNode && focusNode.uid === uid);
                        var buttonBarHtmlRet = render.makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
                        var bkgStyle = render.getNodeBkgImageStyle(node);
                        var cssId = uid + "_row";
                        return render.tag("div", {
                            "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                            "onClick": "meta64.clickOnNodeRow(this, '" + uid + "');",
                            "id": cssId,
                            "style": bkgStyle
                        }, buttonBarHtmlRet + render.tag("div", {
                            "id": uid + "_content"
                        }, render.renderNodeContent(node, true, true, true, true, true)));
                    };
                    this.showNodeUrl = function () {
                        var node = Meta64_4.meta64.getHighlightedNode();
                        if (!node) {
                            Util_3.util.showMessage("You must first click on a node.");
                            return;
                        }
                        var path = Util_3.util.stripIfStartsWith(node.path, "/root");
                        var url = window.location.origin + "?id=" + path;
                        Meta64_4.meta64.selectTab("mainTabName");
                        var message = "URL using path: <br>" + url;
                        var uuid = Props_1.props.getNodePropertyVal("jcr:uuid", node);
                        if (uuid) {
                            message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
                        }
                        Util_3.util.showMessage(message);
                    };
                    this.getTopRightImageTag = function (node) {
                        var topRightImg = Props_1.props.getNodePropertyVal('img.top.right', node);
                        var topRightImgTag = "";
                        if (topRightImg) {
                            topRightImgTag = render.tag("img", {
                                "src": topRightImg,
                                "class": "top-right-image"
                            }, "", false);
                        }
                        return topRightImgTag;
                    };
                    this.getNodeBkgImageStyle = function (node) {
                        var bkgImg = Props_1.props.getNodePropertyVal('img.node.bkg', node);
                        var bkgImgStyle = "";
                        if (bkgImg) {
                            bkgImgStyle = "background-image: url(" + bkgImg + ");";
                        }
                        return bkgImgStyle;
                    };
                    this.centeredButtonBar = function (buttons, classes) {
                        classes = classes || "";
                        return render.tag("div", {
                            "class": "horizontal center-justified layout vertical-layout-row " + classes
                        }, buttons);
                    };
                    this.centerContent = function (content, width) {
                        var div = render.tag("div", { "style": "width:" + width + "px;" }, content);
                        var attrs = {
                            "class": "horizontal center-justified layout vertical-layout-row"
                        };
                        return render.tag("div", attrs, div, true);
                    };
                    this.buttonBar = function (buttons, classes) {
                        classes = classes || "";
                        return render.tag("div", {
                            "class": "horizontal left-justified layout vertical-layout-row " + classes
                        }, buttons);
                    };
                    this.makeRowButtonBarHtml = function (node, canMoveUp, canMoveDown, editingAllowed) {
                        var createdBy = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.CREATED_BY, node);
                        var commentBy = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.COMMENT_BY, node);
                        var publicAppend = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.PUBLIC_APPEND, node);
                        var openButton = "";
                        var selButton = "";
                        var createSubNodeButton = "";
                        var editNodeButton = "";
                        var moveNodeUpButton = "";
                        var moveNodeDownButton = "";
                        var insertNodeButton = "";
                        var replyButton = "";
                        if (publicAppend && createdBy != Meta64_4.meta64.userName && commentBy != Meta64_4.meta64.userName) {
                            replyButton = render.tag("paper-button", {
                                "raised": "raised",
                                "onClick": "meta64.replyToComment('" + node.uid + "');"
                            }, "Reply");
                        }
                        var buttonCount = 0;
                        if (render.nodeHasChildren(node.uid)) {
                            buttonCount++;
                            openButton = render.tag("paper-button", {
                                "style": "background-color: #4caf50;color:white;",
                                "raised": "raised",
                                "onClick": "meta64.openNode('" + node.uid + "');"
                            }, "Open");
                        }
                        if (Meta64_4.meta64.userPreferences.editMode) {
                            var selected = Meta64_4.meta64.selectedNodes[node.uid] ? true : false;
                            buttonCount++;
                            var css = selected ? {
                                "id": node.uid + "_sel",
                                "onClick": "meta64.toggleNodeSel('" + node.uid + "');",
                                "checked": "checked",
                                "style": "margin-top: 11px;"
                            } :
                                {
                                    "id": node.uid + "_sel",
                                    "onClick": "meta64.toggleNodeSel('" + node.uid + "');",
                                    "style": "margin-top: 11px;"
                                };
                            selButton = render.tag("paper-checkbox", css, "");
                            if (Constants_2.cnst.NEW_ON_TOOLBAR && !commentBy) {
                                buttonCount++;
                                createSubNodeButton = render.tag("paper-icon-button", {
                                    "icon": "icons:picture-in-picture-alt",
                                    "id": "addNodeButtonId" + node.uid,
                                    "raised": "raised",
                                    "onClick": "meta64.createSubNode('" + node.uid + "');"
                                }, "Add");
                            }
                            if (Constants_2.cnst.INS_ON_TOOLBAR && !commentBy) {
                                buttonCount++;
                                insertNodeButton = render.tag("paper-icon-button", {
                                    "icon": "icons:picture-in-picture",
                                    "id": "insertNodeButtonId" + node.uid,
                                    "raised": "raised",
                                    "onClick": "meta64.insertNode('" + node.uid + "');"
                                }, "Ins");
                            }
                        }
                        if (Meta64_4.meta64.userPreferences.editMode && editingAllowed) {
                            buttonCount++;
                            editNodeButton = render.tag("paper-icon-button", {
                                "alt": "Edit node.",
                                "icon": "editor:mode-edit",
                                "raised": "raised",
                                "onClick": "meta64.runEditNode('" + node.uid + "');"
                            }, "Edit");
                            if (Constants_2.cnst.MOVE_UPDOWN_ON_TOOLBAR && Meta64_4.meta64.currentNode.childrenOrdered && !commentBy) {
                                if (canMoveUp) {
                                    buttonCount++;
                                    moveNodeUpButton = render.tag("paper-icon-button", {
                                        "icon": "icons:arrow-upward",
                                        "raised": "raised",
                                        "onClick": "meta64.moveNodeUp('" + node.uid + "');"
                                    }, "Up");
                                }
                                if (canMoveDown) {
                                    buttonCount++;
                                    moveNodeDownButton = render.tag("paper-icon-button", {
                                        "icon": "icons:arrow-downward",
                                        "raised": "raised",
                                        "onClick": "meta64.moveNodeDown('" + node.uid + "');"
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
                    this.makeHorizontalFieldSet = function (content, extraClasses) {
                        return render.tag("div", {
                            "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
                        }, content, true);
                    };
                    this.makeHorzControlGroup = function (content) {
                        return render.tag("div", {
                            "class": "horizontal layout"
                        }, content, true);
                    };
                    this.makeRadioButton = function (label, id) {
                        return render.tag("paper-radio-button", {
                            "id": id,
                            "name": id
                        }, label);
                    };
                    this.nodeHasChildren = function (uid) {
                        var node = Meta64_4.meta64.uidToNodeMap[uid];
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
                        path = Util_3.util.replaceAll(path, "/", " / ");
                        var shortPath = path.length < 50 ? path : path.substring(0, 40) + "...";
                        var noRootPath = shortPath;
                        if (Util_3.util.startsWith(noRootPath, "/root")) {
                            noRootPath = noRootPath.substring(0, 5);
                        }
                        var ret = Meta64_4.meta64.isAdminUser ? shortPath : noRootPath;
                        ret += " [" + node.primaryTypeName + "]";
                        return ret;
                    };
                    this.wrapHtml = function (text) {
                        return "<div>" + text + "</div>";
                    };
                    this.renderPageFromData = function (data, scrollToTop) {
                        Meta64_4.meta64.codeFormatDirty = false;
                        console.log("render.renderPageFromData()");
                        var newData = false;
                        if (!data) {
                            data = Meta64_4.meta64.currentNodeData;
                        }
                        else {
                            newData = true;
                        }
                        Nav_2.nav.endReached = data && data.endReached;
                        if (!data || !data.node) {
                            Util_3.util.setVisibility("#listView", false);
                            $("#mainNodeContent").html("No content is available here.");
                            return;
                        }
                        else {
                            Util_3.util.setVisibility("#listView", true);
                        }
                        Meta64_4.meta64.treeDirty = false;
                        if (newData) {
                            Meta64_4.meta64.uidToNodeMap = {};
                            Meta64_4.meta64.idToNodeMap = {};
                            Meta64_4.meta64.identToUidMap = {};
                            Meta64_4.meta64.selectedNodes = {};
                            Meta64_4.meta64.parentUidToFocusNodeMap = {};
                            Meta64_4.meta64.initNode(data.node, true);
                            Meta64_4.meta64.setCurrentNodeData(data);
                        }
                        var propCount = Meta64_4.meta64.currentNode.properties ? Meta64_4.meta64.currentNode.properties.length : 0;
                        if (render.debug) {
                            console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
                        }
                        var output = "";
                        var bkgStyle = render.getNodeBkgImageStyle(data.node);
                        var mainNodeContent = render.renderNodeContent(data.node, true, true, true, false, true);
                        if (mainNodeContent.length > 0) {
                            var uid = data.node.uid;
                            var cssId = uid + "_row";
                            var buttonBar = "";
                            var editNodeButton = "";
                            var createSubNodeButton = "";
                            var replyButton = "";
                            var createdBy = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.CREATED_BY, data.node);
                            var commentBy = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.COMMENT_BY, data.node);
                            var publicAppend = Props_1.props.getNodePropertyVal(Constants_2.jcrCnst.PUBLIC_APPEND, data.node);
                            if (publicAppend && createdBy != Meta64_4.meta64.userName && commentBy != Meta64_4.meta64.userName) {
                                replyButton = render.tag("paper-button", {
                                    "raised": "raised",
                                    "onClick": "meta64.replyToComment('" + data.node.uid + "');"
                                }, "Reply");
                            }
                            if (Meta64_4.meta64.userPreferences.editMode && Constants_2.cnst.NEW_ON_TOOLBAR && Edit_3.edit.isInsertAllowed(data.node)) {
                                createSubNodeButton = render.tag("paper-icon-button", {
                                    "icon": "icons:picture-in-picture-alt",
                                    "raised": "raised",
                                    "onClick": "meta64.createSubNode('" + uid + "');"
                                }, "Add");
                            }
                            if (Edit_3.edit.isEditAllowed(data.node)) {
                                editNodeButton = render.tag("paper-icon-button", {
                                    "icon": "editor:mode-edit",
                                    "raised": "raised",
                                    "onClick": "meta64.runEditNode('" + uid + "');"
                                }, "Edit");
                            }
                            var focusNode = Meta64_4.meta64.getHighlightedNode();
                            var selected = focusNode && focusNode.uid === uid;
                            if (createSubNodeButton || editNodeButton || replyButton) {
                                buttonBar = render.makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                            }
                            var content = render.tag("div", {
                                "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                                "onClick": "meta64.clickOnNodeRow(this, '" + uid + "');",
                                "id": cssId
                            }, buttonBar + mainNodeContent);
                            $("#mainNodeContent").show();
                            $("#mainNodeContent").html(content);
                        }
                        else {
                            $("#mainNodeContent").hide();
                        }
                        View_2.view.updateStatusBar();
                        if (Nav_2.nav.mainOffset > 0) {
                            var firstButton = render.makeButton("First Page", "firstPageButton", render.firstPage);
                            var prevButton = render.makeButton("Prev Page", "prevPageButton", render.prevPage);
                            output += render.centeredButtonBar(firstButton + prevButton, "paging-button-bar");
                        }
                        var rowCount = 0;
                        if (data.children) {
                            var childCount = data.children.length;
                            for (var i = 0; i < data.children.length; i++) {
                                var node = data.children[i];
                                if (!Edit_3.edit.nodesToMoveSet[node.id]) {
                                    var row = render.generateRow(i, node, newData, childCount, rowCount);
                                    if (row.length != 0) {
                                        output += row;
                                        rowCount++;
                                    }
                                }
                            }
                        }
                        if (Edit_3.edit.isInsertAllowed(data.node)) {
                            if (rowCount == 0 && !Meta64_4.meta64.isAnonUser) {
                                output = render.getEmptyPagePrompt();
                            }
                        }
                        if (!data.endReached) {
                            var nextButton = render.makeButton("Next Page", "nextPageButton", render.nextPage);
                            var lastButton = render.makeButton("Last Page", "lastPageButton", render.lastPage);
                            output += render.centeredButtonBar(nextButton + lastButton, "paging-button-bar");
                        }
                        Util_3.util.setHtml("listView", output);
                        if (Meta64_4.meta64.codeFormatDirty) {
                            prettyPrint();
                        }
                        $("a").attr("target", "_blank");
                        Meta64_4.meta64.screenSizeChange();
                        if (scrollToTop || !Meta64_4.meta64.getHighlightedNode()) {
                            View_2.view.scrollToTop();
                        }
                        else {
                            View_2.view.scrollToSelectedNode();
                        }
                    };
                    this.firstPage = function () {
                        console.log("First page button click.");
                        View_2.view.firstPage();
                    };
                    this.prevPage = function () {
                        console.log("Prev page button click.");
                        View_2.view.prevPage();
                    };
                    this.nextPage = function () {
                        console.log("Next page button click.");
                        View_2.view.nextPage();
                    };
                    this.lastPage = function () {
                        console.log("Last page button click.");
                        View_2.view.lastPage();
                    };
                    this.generateRow = function (i, node, newData, childCount, rowCount) {
                        if (Meta64_4.meta64.isNodeBlackListed(node))
                            return "";
                        if (newData) {
                            Meta64_4.meta64.initNode(node, true);
                            if (render.debug) {
                                console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                            }
                        }
                        rowCount++;
                        var row = render.renderNodeAsListItem(node, i, childCount, rowCount);
                        return row;
                    };
                    this.getUrlForNodeAttachment = function (node) {
                        return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
                    };
                    this.adjustImageSize = function (node) {
                        var elm = $("#" + node.imgId);
                        if (elm) {
                            if (node.width && node.height) {
                                if (node.width > Meta64_4.meta64.deviceWidth - 80) {
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
                        var src = render.getUrlForNodeAttachment(node);
                        node.imgId = "imgUid_" + node.uid;
                        if (node.width && node.height) {
                            if (node.width > Meta64_4.meta64.deviceWidth - 50) {
                                var width = Meta64_4.meta64.deviceWidth - 50;
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
                    this.tag = function (tag, attributes, content, closeTag) {
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
                                    if (Util_3.util.contains(v, "'")) {
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
                    this.makeTextArea = function (fieldName, fieldId) {
                        return render.tag("paper-textarea", {
                            "name": fieldId,
                            "label": fieldName,
                            "id": fieldId
                        }, "", true);
                    };
                    this.makeEditField = function (fieldName, fieldId) {
                        return render.tag("paper-input", {
                            "name": fieldId,
                            "label": fieldName,
                            "id": fieldId
                        }, "", true);
                    };
                    this.makePasswordField = function (fieldName, fieldId) {
                        return render.tag("paper-input", {
                            "type": "password",
                            "name": fieldId,
                            "label": fieldName,
                            "id": fieldId,
                            "class": "meta64-input"
                        }, "", true);
                    };
                    this.makeButton = function (text, id, callback, ctx) {
                        var attribs = {
                            "raised": "raised",
                            "id": id,
                            "class": "standardButton"
                        };
                        if (callback != undefined) {
                            attribs["onClick"] = Meta64_4.meta64.encodeOnClick(callback, ctx);
                        }
                        return render.tag("paper-button", attribs, text, true);
                    };
                    this.allowPropertyToDisplay = function (propName) {
                        if (!Meta64_4.meta64.inSimpleMode())
                            return true;
                        return Meta64_4.meta64.simpleModePropertyBlackList[propName] == null;
                    };
                    this.isReadOnlyProperty = function (propName) {
                        return Meta64_4.meta64.readOnlyPropertyList[propName];
                    };
                    this.isBinaryProperty = function (propName) {
                        return Meta64_4.meta64.binaryPropertyList[propName];
                    };
                    this.sanitizePropertyName = function (propName) {
                        if (Meta64_4.meta64.editModeOption === "simple") {
                            return propName === Constants_2.jcrCnst.CONTENT ? "Content" : propName;
                        }
                        else {
                            return propName;
                        }
                    };
                }
                return Render;
            }());
            exports_10("Render", Render);
            exports_10("render", render = new Render());
            exports_10("default",render);
        }
    }
});
System.register("SearchContentDlg", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("TimelineResultsPanel", ["Search"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Search_1;
    var TimelineResultsPanel;
    return {
        setters:[
            function (Search_1_1) {
                Search_1 = Search_1_1;
            }],
        execute: function() {
            console.log("TimelineResultsPanel.ts");
            TimelineResultsPanel = (function () {
                function TimelineResultsPanel(args) {
                    this.domId = "timelineResultsPanel";
                    this.tabId = "timelineTabName";
                    this.visible = false;
                    this.build = function () {
                        var header = "<h2 id='timelinePageTitle' class='page-title'></h2>";
                        var mainContent = "<div id='timelineView'></div>";
                        return header + mainContent;
                    };
                    this.init = function () {
                        $("#timelinePageTitle").html(Search_1.srch.timelinePageTitle);
                        Search_1.srch.populateSearchResultsPage(Search_1.srch.timelineResults, "timelineView");
                    };
                }
                return TimelineResultsPanel;
            }());
            exports_12("TimelineResultsPanel", TimelineResultsPanel);
        }
    }
});
System.register("SearchResultsPanel", ["Search"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Search_2;
    var SearchResultsPanel;
    return {
        setters:[
            function (Search_2_1) {
                Search_2 = Search_2_1;
            }],
        execute: function() {
            SearchResultsPanel = (function () {
                function SearchResultsPanel(args) {
                    this.domId = "searchResultsPanel";
                    this.tabId = "searchTabName";
                    this.visible = false;
                    this.build = function () {
                        var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
                        var mainContent = "<div id='searchResultsView'></div>";
                        return header + mainContent;
                    };
                    this.init = function () {
                        $("#searchPageTitle").html(Search_2.srch.searchPageTitle);
                        Search_2.srch.populateSearchResultsPage(Search_2.srch.searchResults, "searchResultsView");
                    };
                }
                return SearchResultsPanel;
            }());
            exports_13("SearchResultsPanel", SearchResultsPanel);
        }
    }
});
System.register("Search", ["Constants", "Meta64", "Util", "Render", "View", "Nav", "Factory"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Constants_3, Meta64_5, Util_4, Render_3, View_3, Nav_3, Factory_2;
    var Search, srch;
    return {
        setters:[
            function (Constants_3_1) {
                Constants_3 = Constants_3_1;
            },
            function (Meta64_5_1) {
                Meta64_5 = Meta64_5_1;
            },
            function (Util_4_1) {
                Util_4 = Util_4_1;
            },
            function (Render_3_1) {
                Render_3 = Render_3_1;
            },
            function (View_3_1) {
                View_3 = View_3_1;
            },
            function (Nav_3_1) {
                Nav_3 = Nav_3_1;
            },
            function (Factory_2_1) {
                Factory_2 = Factory_2_1;
            }],
        execute: function() {
            console.log("Search.ts");
            Search = (function () {
                function Search() {
                    this._UID_ROWID_SUFFIX = "_srch_row";
                    this.searchNodes = null;
                    this.searchPageTitle = "Search Results";
                    this.timelinePageTitle = "Timeline";
                    this.searchOffset = 0;
                    this.timelineOffset = 0;
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
                        if (srch.numSearchResults() == 0 && !Meta64_5.meta64.isAnonUser) {
                            Factory_2.Factory.create("SearchContentDlg", function (dlg) {
                                dlg.open();
                            });
                        }
                    };
                    this.searchNodesResponse = function (res) {
                        srch.searchResults = res;
                        Factory_2.Factory.createPanel("SearchResultsPanel", function (panel) {
                            var content = panel.build();
                            Util_4.util.setHtml("searchResultsPanel", content);
                            panel.init();
                            Meta64_5.meta64.changePage(panel);
                        });
                    };
                    this.timelineResponse = function (res) {
                        debugger;
                        srch.timelineResults = res;
                        Factory_2.Factory.createPanel("TimelineResultsPanel", function (panel) {
                            var content = panel.build();
                            Util_4.util.setHtml("timelineResultsPanel", content);
                            panel.init();
                            Meta64_5.meta64.changePage(panel);
                        });
                    };
                    this.searchFilesResponse = function (res) {
                        Nav_3.nav.mainOffset = 0;
                        Util_4.util.json("renderNode", {
                            "nodeId": res.searchResultNodeId,
                            "upLevel": null,
                            "renderParentIfLeaf": null,
                            "offset": 0,
                            "goToLastPage": false
                        }, Nav_3.nav.navPageNodeResponse);
                    };
                    this.timelineByModTime = function () {
                        debugger;
                        var node = Meta64_5.meta64.getHighlightedNode();
                        if (!node) {
                            Util_4.util.showMessage("No node is selected to 'timeline' under.");
                            return;
                        }
                        Util_4.util.json("nodeSearch", {
                            "nodeId": node.id,
                            "searchText": "",
                            "sortDir": "DESC",
                            "sortField": Constants_3.jcrCnst.LAST_MODIFIED,
                            "searchProp": null
                        }, srch.timelineResponse);
                    };
                    this.timelineByCreateTime = function () {
                        var node = Meta64_5.meta64.getHighlightedNode();
                        if (!node) {
                            Util_4.util.showMessage("No node is selected to 'timeline' under.");
                            return;
                        }
                        Util_4.util.json("nodeSearch", {
                            "nodeId": node.id,
                            "searchText": "",
                            "sortDir": "DESC",
                            "sortField": Constants_3.jcrCnst.CREATED,
                            "searchProp": null
                        }, srch.timelineResponse);
                    };
                    this.initSearchNode = function (node) {
                        node.uid = Util_4.util.getUidForId(srch.identToUidMap, node.id);
                        srch.uidToNodeMap[node.uid] = node;
                    };
                    this.populateSearchResultsPage = function (data, viewName) {
                        var output = '';
                        var childCount = data.searchResults.length;
                        var rowCount = 0;
                        $.each(data.searchResults, function (i, node) {
                            if (Meta64_5.meta64.isNodeBlackListed(node))
                                return;
                            srch.initSearchNode(node);
                            rowCount++;
                            output += srch.renderSearchResultAsListItem(node, i, childCount, rowCount);
                        });
                        Util_4.util.setHtml(viewName, output);
                    };
                    this.renderSearchResultAsListItem = function (node, index, count, rowCount) {
                        var uid = node.uid;
                        console.log("renderSearchResult: " + uid);
                        var cssId = uid + srch._UID_ROWID_SUFFIX;
                        var buttonBarHtml = srch.makeButtonBarHtml("" + uid);
                        console.log("buttonBarHtml=" + buttonBarHtml);
                        var content = Render_3.render.renderNodeContent(node, true, true, true, true, true);
                        return Render_3.render.tag("div", {
                            "class": "node-table-row inactive-row",
                            "onClick": "meta64.clickOnSearchResultRow(this, '" + uid + "');",
                            "id": cssId
                        }, buttonBarHtml
                            + Render_3.render.tag("div", {
                                "id": uid + "_srch_content"
                            }, content));
                    };
                    this.makeButtonBarHtml = function (uid) {
                        var gotoButton = Render_3.render.makeButton("Go to Node", uid, "meta64.clickSearchNode('" + uid + "');");
                        return Render_3.render.makeHorizontalFieldSet(gotoButton);
                    };
                    this.clickOnSearchResultRow = function (rowElm, uid) {
                        srch.unhighlightRow();
                        srch.highlightRowNode = srch.uidToNodeMap[uid];
                        Util_4.util.changeOrAddClass(rowElm, "inactive-row", "active-row");
                    };
                    this.clickSearchNode = function (uid) {
                        srch.highlightRowNode = srch.uidToNodeMap[uid];
                        if (!srch.highlightRowNode) {
                            throw "Unable to find uid in search results: " + uid;
                        }
                        View_3.view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
                        Meta64_5.meta64.selectTab("mainTabName");
                    };
                    this.unhighlightRow = function () {
                        if (!srch.highlightRowNode) {
                            return;
                        }
                        var nodeId = srch.highlightRowNode.uid + srch._UID_ROWID_SUFFIX;
                        var elm = Util_4.util.domElm(nodeId);
                        if (elm) {
                            Util_4.util.changeOrAddClass(elm, "active-row", "inactive-row");
                        }
                    };
                }
                return Search;
            }());
            exports_14("Search", Search);
            exports_14("srch", srch = new Search());
            exports_14("default",srch);
        }
    }
});
System.register("LoginDlg", [], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    return {
        setters:[],
        execute: function() {
            console.log("LoginDlg.ts");
        }
    }
});
System.register("SignupDlg", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("User", ["Constants", "Meta64", "Util", "Factory", "View"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var Constants_4, Meta64_6, Util_5, Factory_3, View_4;
    var User, user;
    return {
        setters:[
            function (Constants_4_1) {
                Constants_4 = Constants_4_1;
            },
            function (Meta64_6_1) {
                Meta64_6 = Meta64_6_1;
            },
            function (Util_5_1) {
                Util_5 = Util_5_1;
            },
            function (Factory_3_1) {
                Factory_3 = Factory_3_1;
            },
            function (View_4_1) {
                View_4 = View_4_1;
            }],
        execute: function() {
            console.log("User.ts");
            User = (function () {
                function User() {
                    this.logoutResponse = function (res) {
                        window.location.href = window.location.origin;
                    };
                    this.isTestUserAccount = function () {
                        return Meta64_6.meta64.userName.toLowerCase() === "adam" ||
                            Meta64_6.meta64.userName.toLowerCase() === "bob" ||
                            Meta64_6.meta64.userName.toLowerCase() === "cory" ||
                            Meta64_6.meta64.userName.toLowerCase() === "dan";
                    };
                    this.setTitleUsingLoginResponse = function (res) {
                        var title = BRANDING_TITLE_SHORT;
                        if (!Meta64_6.meta64.isAnonUser) {
                            title += ":" + res.userName;
                        }
                        $("#headerAppName").html(title);
                    };
                    this.setStateVarsUsingLoginResponse = function (res) {
                        if (res.rootNode) {
                            Meta64_6.meta64.homeNodeId = res.rootNode.id;
                            Meta64_6.meta64.homeNodePath = res.rootNode.path;
                        }
                        Meta64_6.meta64.userName = res.userName;
                        Meta64_6.meta64.isAdminUser = res.userName === "admin";
                        Meta64_6.meta64.isAnonUser = res.userName === "anonymous";
                        Meta64_6.meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;
                        Meta64_6.meta64.allowFileSystemSearch = res.allowFileSystemSearch;
                        Meta64_6.meta64.userPreferences = res.userPreferences;
                        Meta64_6.meta64.editModeOption = res.userPreferences.advancedMode ? Meta64_6.meta64.MODE_ADVANCED : Meta64_6.meta64.MODE_SIMPLE;
                        Meta64_6.meta64.showMetaData = res.userPreferences.showMetaData;
                        console.log("from server: meta64.editModeOption=" + Meta64_6.meta64.editModeOption);
                    };
                    this.openSignupPg = function () {
                        Factory_3.Factory.create("SignupDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.writeCookie = function (name, val) {
                        $.cookie(name, val, {
                            expires: 365,
                            path: '/'
                        });
                    };
                    this.openLoginPg = function () {
                        Factory_3.Factory.create("LoginDlg", function (dlg) {
                            dlg.populateFromCookies();
                            dlg.open();
                        });
                    };
                    this.refreshLogin = function () {
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
                            var loginState = $.cookie(Constants_4.cnst.COOKIE_LOGIN_STATE);
                            if (loginState === "0") {
                                Meta64_6.meta64.loadAnonPageHome(false);
                                return;
                            }
                            var usr = $.cookie(Constants_4.cnst.COOKIE_LOGIN_USR);
                            var pwd = $.cookie(Constants_4.cnst.COOKIE_LOGIN_PWD);
                            usingCookies = !Util_5.util.emptyString(usr) && !Util_5.util.emptyString(pwd);
                            console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);
                            callUsr = usr ? usr : "";
                            callPwd = pwd ? pwd : "";
                        }
                        console.log("refreshLogin with name: " + callUsr);
                        if (!callUsr) {
                            Meta64_6.meta64.loadAnonPageHome(false);
                        }
                        else {
                            Util_5.util.json("login", {
                                "userName": callUsr,
                                "password": callPwd,
                                "tzOffset": new Date().getTimezoneOffset(),
                                "dst": Util_5.util.daylightSavingsTime
                            }, function (res) {
                                if (usingCookies) {
                                    user.loginResponse(res, callUsr, callPwd, usingCookies);
                                }
                                else {
                                    user.refreshLoginResponse(res);
                                }
                            });
                        }
                    };
                    this.logout = function (updateLoginStateCookie) {
                        if (Meta64_6.meta64.isAnonUser) {
                            return;
                        }
                        $(window).off("beforeunload");
                        if (updateLoginStateCookie) {
                            user.writeCookie(Constants_4.cnst.COOKIE_LOGIN_STATE, "0");
                        }
                        Util_5.util.json("logout", {}, user.logoutResponse);
                    };
                    this.login = function (loginDlg, usr, pwd) {
                        Util_5.util.json("login", {
                            "userName": usr,
                            "password": pwd,
                            "tzOffset": new Date().getTimezoneOffset(),
                            "dst": Util_5.util.daylightSavingsTime
                        }, function (res) {
                            user.loginResponse(res, usr, pwd, null, loginDlg);
                        });
                    };
                    this.deleteAllUserCookies = function () {
                        $.removeCookie(Constants_4.cnst.COOKIE_LOGIN_USR);
                        $.removeCookie(Constants_4.cnst.COOKIE_LOGIN_PWD);
                        $.removeCookie(Constants_4.cnst.COOKIE_LOGIN_STATE);
                    };
                    this.loginResponse = function (res, usr, pwd, usingCookies, loginDlg) {
                        if (Util_5.util.checkSuccess("Login", res)) {
                            console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);
                            if (usr != "anonymous") {
                                user.writeCookie(Constants_4.cnst.COOKIE_LOGIN_USR, usr);
                                user.writeCookie(Constants_4.cnst.COOKIE_LOGIN_PWD, pwd);
                                user.writeCookie(Constants_4.cnst.COOKIE_LOGIN_STATE, "1");
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
                            if (!Util_5.util.emptyString(res.homeNodeOverride)) {
                                console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                                id = res.homeNodeOverride;
                                Meta64_6.meta64.homeNodeOverride = id;
                            }
                            else {
                                if (res.userPreferences.lastNode) {
                                    console.log("loading lastNode=" + res.userPreferences.lastNode);
                                    id = res.userPreferences.lastNode;
                                }
                                else {
                                    console.log("loading homeNodeId=" + Meta64_6.meta64.homeNodeId);
                                    id = Meta64_6.meta64.homeNodeId;
                                }
                            }
                            View_4.view.refreshTree(id, false, null, true);
                            user.setTitleUsingLoginResponse(res);
                        }
                        else {
                            if (usingCookies) {
                                Util_5.util.showMessage("Cookie login failed.");
                                $.removeCookie(Constants_4.cnst.COOKIE_LOGIN_USR);
                                $.removeCookie(Constants_4.cnst.COOKIE_LOGIN_PWD);
                                user.writeCookie(Constants_4.cnst.COOKIE_LOGIN_STATE, "0");
                                location.reload();
                            }
                        }
                    };
                    this.refreshLoginResponse = function (res) {
                        console.log("refreshLoginResponse");
                        if (res.success) {
                            user.setStateVarsUsingLoginResponse(res);
                            user.setTitleUsingLoginResponse(res);
                        }
                        Meta64_6.meta64.loadAnonPageHome(false);
                    };
                }
                return User;
            }());
            exports_17("user", user = new User());
            exports_17("default",user);
        }
    }
});
System.register("PrefsDlg", [], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("SearchTagsDlg", [], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("SearchFilesDlg", [], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Nav", ["Meta64", "Util", "Edit", "User", "Render", "View", "Factory"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var Meta64_7, Util_6, Edit_4, User_1, Render_4, View_5, Factory_4;
    var Nav, nav;
    return {
        setters:[
            function (Meta64_7_1) {
                Meta64_7 = Meta64_7_1;
            },
            function (Util_6_1) {
                Util_6 = Util_6_1;
            },
            function (Edit_4_1) {
                Edit_4 = Edit_4_1;
            },
            function (User_1_1) {
                User_1 = User_1_1;
            },
            function (Render_4_1) {
                Render_4 = Render_4_1;
            },
            function (View_5_1) {
                View_5 = View_5_1;
            },
            function (Factory_4_1) {
                Factory_4 = Factory_4_1;
            }],
        execute: function() {
            console.log("Nav.ts");
            Nav = (function () {
                function Nav() {
                    this._UID_ROWID_SUFFIX = "_row";
                    this.mainOffset = 0;
                    this.endReached = true;
                    this.ROWS_PER_PAGE = 25;
                    this.search = function () {
                        Factory_4.Factory.create("SearchContentDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.searchTags = function () {
                        Factory_4.Factory.create("SearchTagsDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.searchFiles = function () {
                        Factory_4.Factory.create("SearchFilesDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.editMode = function () {
                        Edit_4.edit.editMode();
                    };
                    this.login = function () {
                        Factory_4.Factory.create("LoginDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.logout = function () {
                        User_1.user.logout(true);
                    };
                    this.signup = function () {
                        User_1.user.openSignupPg();
                    };
                    this.preferences = function () {
                        Factory_4.Factory.create("PrefsDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openMainMenuHelp = function () {
                        nav.mainOffset = 0;
                        Util_6.util.json("renderNode", {
                            "nodeId": "/meta64/public/help",
                            "upLevel": null,
                            "renderParentIfLeaf": null,
                            "offset": nav.mainOffset,
                            "goToLastPage": false
                        }, nav.navPageNodeResponse);
                    };
                    this.openRssFeedsNode = function () {
                        nav.mainOffset = 0;
                        Util_6.util.json("renderNode", {
                            "nodeId": "/rss/feeds",
                            "upLevel": null,
                            "renderParentIfLeaf": null,
                            "offset": nav.mainOffset,
                            "goToLastPage": false
                        }, nav.navPageNodeResponse);
                    };
                    this.expandMore = function (nodeId) {
                        Meta64_7.meta64.expandedAbbrevNodeIds[nodeId] = true;
                        Util_6.util.json("expandAbbreviatedNode", {
                            "nodeId": nodeId
                        }, nav.expandAbbreviatedNodeResponse);
                    };
                    this.expandAbbreviatedNodeResponse = function (res) {
                        if (Util_6.util.checkSuccess("ExpandAbbreviatedNode", res)) {
                            Render_4.render.refreshNodeOnPage(res.nodeInfo);
                        }
                    };
                    this.displayingHome = function () {
                        if (Meta64_7.meta64.isAnonUser) {
                            return Meta64_7.meta64.currentNodeId === Meta64_7.meta64.anonUserLandingPageNode;
                        }
                        else {
                            return Meta64_7.meta64.currentNodeId === Meta64_7.meta64.homeNodeId;
                        }
                    };
                    this.parentVisibleToUser = function () {
                        return !nav.displayingHome();
                    };
                    this.upLevelResponse = function (res, id) {
                        if (!res || !res.node) {
                            Util_6.util.showMessage("No data is visible to you above this node.");
                        }
                        else {
                            Render_4.render.renderPageFromData(res);
                            Meta64_7.meta64.highlightRowById(id, true);
                            Meta64_7.meta64.refreshAllGuiEnablement();
                        }
                    };
                    this.navUpLevel = function () {
                        if (!nav.parentVisibleToUser()) {
                            return;
                        }
                        nav.mainOffset = 0;
                        var ironRes = Util_6.util.json("renderNode", {
                            "nodeId": Meta64_7.meta64.currentNodeId,
                            "upLevel": 1,
                            "renderParentIfLeaf": false,
                            "offset": nav.mainOffset,
                            "goToLastPage": false
                        }, function (res) {
                            nav.upLevelResponse(ironRes.response, Meta64_7.meta64.currentNodeId);
                        });
                    };
                    this.getSelectedDomElement = function () {
                        var currentSelNode = Meta64_7.meta64.getHighlightedNode();
                        if (currentSelNode) {
                            var node = Meta64_7.meta64.uidToNodeMap[currentSelNode.uid];
                            if (node) {
                                console.log("found highlighted node.id=" + node.id);
                                var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                                return Util_6.util.domElm(nodeId);
                            }
                        }
                        return null;
                    };
                    this.getSelectedPolyElement = function () {
                        try {
                            var currentSelNode = Meta64_7.meta64.getHighlightedNode();
                            if (currentSelNode) {
                                var node = Meta64_7.meta64.uidToNodeMap[currentSelNode.uid];
                                if (node) {
                                    console.log("found highlighted node.id=" + node.id);
                                    var nodeId = node.uid + nav._UID_ROWID_SUFFIX;
                                    console.log("looking up using element id: " + nodeId);
                                    return Util_6.util.polyElm(nodeId);
                                }
                            }
                            else {
                                console.log("no node highlighted");
                            }
                        }
                        catch (e) {
                            Util_6.util.logAndThrow("getSelectedPolyElement failed.");
                        }
                        return null;
                    };
                    this.clickOnNodeRow = function (rowElm, uid) {
                        var node = Meta64_7.meta64.uidToNodeMap[uid];
                        if (!node) {
                            console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                            return;
                        }
                        Meta64_7.meta64.highlightNode(node, false);
                        if (Meta64_7.meta64.userPreferences.editMode) {
                            if (!node.owner) {
                                console.log("calling updateNodeInfo");
                                Meta64_7.meta64.updateNodeInfo(node);
                            }
                        }
                        Meta64_7.meta64.refreshAllGuiEnablement();
                    };
                    this.openNode = function (uid) {
                        var node = Meta64_7.meta64.uidToNodeMap[uid];
                        Meta64_7.meta64.highlightNode(node, true);
                        if (!node) {
                            Util_6.util.showMessage("Unknown nodeId in openNode: " + uid);
                        }
                        else {
                            View_5.view.refreshTree(node.id, false);
                        }
                    };
                    this.toggleNodeSel = function (uid) {
                        var toggleButton = Util_6.util.polyElm(uid + "_sel");
                        setTimeout(function () {
                            if (toggleButton.node.checked) {
                                Meta64_7.meta64.selectedNodes[uid] = true;
                            }
                            else {
                                delete Meta64_7.meta64.selectedNodes[uid];
                            }
                            View_5.view.updateStatusBar();
                            Meta64_7.meta64.refreshAllGuiEnablement();
                        }, 500);
                    };
                    this.navPageNodeResponse = function (res) {
                        Meta64_7.meta64.clearSelectedNodes();
                        Render_4.render.renderPageFromData(res);
                        View_5.view.scrollToTop();
                        Meta64_7.meta64.refreshAllGuiEnablement();
                    };
                    this.navHome = function () {
                        if (Meta64_7.meta64.isAnonUser) {
                            Meta64_7.meta64.loadAnonPageHome(true);
                        }
                        else {
                            nav.mainOffset = 0;
                            Util_6.util.json("renderNode", {
                                "nodeId": Meta64_7.meta64.homeNodeId,
                                "upLevel": null,
                                "renderParentIfLeaf": null,
                                "offset": nav.mainOffset,
                                "goToLastPage": false
                            }, nav.navPageNodeResponse);
                        }
                    };
                    this.navPublicHome = function () {
                        Meta64_7.meta64.loadAnonPageHome(true);
                    };
                }
                return Nav;
            }());
            exports_21("nav", nav = new Nav());
            exports_21("default",nav);
        }
    }
});
System.register("EditNodeDlg", [], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    return {
        setters:[],
        execute: function() {
            console.log("EditNodeDlg.ts");
        }
    }
});
System.register("ConfirmDlg", [], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    return {
        setters:[],
        execute: function() {
            console.log("ConfirmDlg.ts");
        }
    }
});
System.register("CreateNodeDlg", [], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    return {
        setters:[],
        execute: function() {
            console.log("CreateNodeDlg.ts");
        }
    }
});
System.register("RenameNodeDlg", [], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("ImportDlg", [], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    return {
        setters:[],
        execute: function() {
            console.log("ImportDlg.ts");
        }
    }
});
System.register("ExportDlg", [], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    return {
        setters:[],
        execute: function() {
            console.log("ExportDlg.ts");
        }
    }
});
System.register("ChangePasswordDlg", [], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    return {
        setters:[],
        execute: function() {
            console.log("ChangePasswordDlg.ts");
        }
    }
});
System.register("ManageAccountDlg", [], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    return {
        setters:[],
        execute: function() {
            console.log("ManageAccountDlg.ts");
        }
    }
});
System.register("Edit", ["Meta64", "Util", "Render", "View", "Props", "Constants", "Factory", "User"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Meta64_8, Util_7, Render_5, View_6, Props_2, Constants_5, Factory_5, User_2;
    var Edit, edit;
    return {
        setters:[
            function (Meta64_8_1) {
                Meta64_8 = Meta64_8_1;
            },
            function (Util_7_1) {
                Util_7 = Util_7_1;
            },
            function (Render_5_1) {
                Render_5 = Render_5_1;
            },
            function (View_6_1) {
                View_6 = View_6_1;
            },
            function (Props_2_1) {
                Props_2 = Props_2_1;
            },
            function (Constants_5_1) {
                Constants_5 = Constants_5_1;
            },
            function (Factory_5_1) {
                Factory_5 = Factory_5_1;
            },
            function (User_2_1) {
                User_2 = User_2_1;
            }],
        execute: function() {
            console.log("Edit.ts");
            Edit = (function () {
                function Edit() {
                    this.createNode = function () {
                        Factory_5.Factory.create("CreateNodeDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openChangePasswordDlg = function () {
                        Factory_5.Factory.create("ChangePasswordDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openManageAccountDlg = function () {
                        Factory_5.Factory.create("ManageAccountDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.editPreferences = function () {
                        Factory_5.Factory.create("PrefsDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.renameNode = function () {
                        Factory_5.Factory.create("RenameNodeDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openImportDlg = function () {
                        Factory_5.Factory.create("ImportDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openExportDlg = function () {
                        Factory_5.Factory.create("ExportDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.insertBookResponse = function (res) {
                        console.log("insertBookResponse running.");
                        Util_7.util.checkSuccess("Insert Book", res);
                        View_6.view.refreshTree(null, false);
                        Meta64_8.meta64.selectTab("mainTabName");
                        View_6.view.scrollToSelectedNode();
                    };
                    this.deleteNodesResponse = function (res, payload) {
                        if (Util_7.util.checkSuccess("Delete node", res)) {
                            Meta64_8.meta64.clearSelectedNodes();
                            var highlightId = null;
                            if (payload) {
                                var selNode = payload["postDeleteSelNode"];
                                if (selNode) {
                                    highlightId = selNode.id;
                                }
                            }
                            View_6.view.refreshTree(null, false, highlightId);
                        }
                    };
                    this.initNodeEditResponse = function (res) {
                        if (Util_7.util.checkSuccess("Editing node", res)) {
                            var node = res.nodeInfo;
                            var isRep = Util_7.util.startsWith(node.name, "rep:") ||
                                Util_7.util.contains(node.path, "/rep:");
                            var editingAllowed = Props_2.props.isOwnedCommentNode(node);
                            if (!editingAllowed) {
                                editingAllowed = (Meta64_8.meta64.isAdminUser || !isRep) && !Props_2.props.isNonOwnedCommentNode(node)
                                    && !Props_2.props.isNonOwnedNode(node);
                            }
                            if (editingAllowed) {
                                edit.editNode = res.nodeInfo;
                                Factory_5.Factory.create("EditNodeDlg", function (dlg) {
                                    edit.editNodeDlgInst = dlg;
                                    dlg.open();
                                });
                            }
                            else {
                                Util_7.util.showMessage("You cannot edit nodes that you don't own.");
                            }
                        }
                    };
                    this.moveNodesResponse = function (res) {
                        if (Util_7.util.checkSuccess("Move nodes", res)) {
                            edit.nodesToMove = null;
                            edit.nodesToMoveSet = {};
                            View_6.view.refreshTree(null, false);
                        }
                    };
                    this.setNodePositionResponse = function (res) {
                        if (Util_7.util.checkSuccess("Change node position", res)) {
                            Meta64_8.meta64.refresh();
                        }
                    };
                    this.showReadOnlyProperties = true;
                    this.nodesToMove = null;
                    this.nodesToMoveSet = {};
                    this.parentOfNewNode = null;
                    this.editingUnsavedNode = false;
                    this.sendNotificationPendingSave = false;
                    this.editNode = null;
                    this.editNodeDlgInst = null;
                    this.nodeInsertTarget = null;
                    this.isEditAllowed = function (node) {
                        return Meta64_8.meta64.userPreferences.editMode && node.path != "/" &&
                            (!Props_2.props.isNonOwnedCommentNode(node) || Props_2.props.isOwnedCommentNode(node))
                            && !Props_2.props.isNonOwnedNode(node);
                    };
                    this.isInsertAllowed = function (node) {
                        return Props_2.props.getNodePropertyVal(Constants_5.jcrCnst.DISABLE_INSERT, node) == null;
                    };
                    this.startEditingNewNode = function (typeName, createAtTop) {
                        edit.editingUnsavedNode = false;
                        edit.editNode = null;
                        Factory_5.Factory.create("EditNodeDlg", function (dlg) {
                            edit.editNodeDlgInst = dlg;
                            dlg.saveNewNode("");
                        }, { "typeName": typeName, "createAtTop": createAtTop });
                    };
                    this.startEditingNewNodeWithName = function () {
                        edit.editingUnsavedNode = true;
                        edit.editNode = null;
                        Factory_5.Factory.create("EditNodeDlg", function (dlg) {
                            edit.editNodeDlgInst = dlg;
                            dlg.saveNewNode("");
                        });
                    };
                    this.insertNodeResponse = function (res) {
                        if (Util_7.util.checkSuccess("Insert node", res)) {
                            Meta64_8.meta64.initNode(res.newNode, true);
                            Meta64_8.meta64.highlightNode(res.newNode, true);
                            edit.runEditNode(res.newNode.uid);
                        }
                    };
                    this.createSubNodeResponse = function (res) {
                        if (Util_7.util.checkSuccess("Create subnode", res)) {
                            Meta64_8.meta64.initNode(res.newNode, true);
                            edit.runEditNode(res.newNode.uid);
                        }
                    };
                    this.saveNodeResponse = function (res, payload) {
                        if (Util_7.util.checkSuccess("Save node", res)) {
                            View_6.view.refreshTree(null, false, payload.savedId);
                            Meta64_8.meta64.selectTab("mainTabName");
                        }
                    };
                    this.editMode = function (modeVal) {
                        if (typeof modeVal != 'undefined') {
                            Meta64_8.meta64.userPreferences.editMode = modeVal;
                        }
                        else {
                            Meta64_8.meta64.userPreferences.editMode = Meta64_8.meta64.userPreferences.editMode ? false : true;
                        }
                        Render_5.render.renderPageFromData();
                        View_6.view.scrollToSelectedNode();
                        Meta64_8.meta64.saveUserPreferences();
                    };
                    this.moveNodeUp = function (uid) {
                        if (!uid) {
                            var selNode = Meta64_8.meta64.getHighlightedNode();
                            uid = selNode.uid;
                        }
                        var node = Meta64_8.meta64.uidToNodeMap[uid];
                        if (node) {
                            Util_7.util.json("setNodePosition", {
                                "parentNodeId": Meta64_8.meta64.currentNodeId,
                                "nodeId": node.name,
                                "siblingId": "[nodeAbove]"
                            }, edit.setNodePositionResponse);
                        }
                        else {
                            console.log("idToNodeMap does not contain " + uid);
                        }
                    };
                    this.moveNodeDown = function (uid) {
                        if (!uid) {
                            var selNode = Meta64_8.meta64.getHighlightedNode();
                            uid = selNode.uid;
                        }
                        var node = Meta64_8.meta64.uidToNodeMap[uid];
                        if (node) {
                            Util_7.util.json("setNodePosition", {
                                "parentNodeId": Meta64_8.meta64.currentNodeData.node.id,
                                "nodeId": "[nodeBelow]",
                                "siblingId": node.name
                            }, edit.setNodePositionResponse);
                        }
                        else {
                            console.log("idToNodeMap does not contain " + uid);
                        }
                    };
                    this.moveNodeToTop = function (uid) {
                        if (!uid) {
                            var selNode = Meta64_8.meta64.getHighlightedNode();
                            uid = selNode.uid;
                        }
                        var node = Meta64_8.meta64.uidToNodeMap[uid];
                        if (node) {
                            Util_7.util.json("setNodePosition", {
                                "parentNodeId": Meta64_8.meta64.currentNodeId,
                                "nodeId": node.name,
                                "siblingId": "[topNode]"
                            }, edit.setNodePositionResponse);
                        }
                        else {
                            console.log("idToNodeMap does not contain " + uid);
                        }
                    };
                    this.moveNodeToBottom = function (uid) {
                        if (!uid) {
                            var selNode = Meta64_8.meta64.getHighlightedNode();
                            uid = selNode.uid;
                        }
                        var node = Meta64_8.meta64.uidToNodeMap[uid];
                        if (node) {
                            Util_7.util.json("setNodePosition", {
                                "parentNodeId": Meta64_8.meta64.currentNodeData.node.id,
                                "nodeId": node.name,
                                "siblingId": null
                            }, edit.setNodePositionResponse);
                        }
                        else {
                            console.log("idToNodeMap does not contain " + uid);
                        }
                    };
                    this.getNodeAbove = function (node) {
                        var ordinal = Meta64_8.meta64.getOrdinalOfNode(node);
                        if (ordinal <= 0)
                            return null;
                        return Meta64_8.meta64.currentNodeData.children[ordinal - 1];
                    };
                    this.getNodeBelow = function (node) {
                        var ordinal = Meta64_8.meta64.getOrdinalOfNode(node);
                        console.log("ordinal = " + ordinal);
                        if (ordinal == -1 || ordinal >= Meta64_8.meta64.currentNodeData.children.length - 1)
                            return null;
                        return Meta64_8.meta64.currentNodeData.children[ordinal + 1];
                    };
                    this.getFirstChildNode = function () {
                        if (!Meta64_8.meta64.currentNodeData || !Meta64_8.meta64.currentNodeData.children)
                            return null;
                        return Meta64_8.meta64.currentNodeData.children[0];
                    };
                    this.runEditNode = function (uid) {
                        var node = Meta64_8.meta64.uidToNodeMap[uid];
                        if (!node) {
                            edit.editNode = null;
                            Util_7.util.showMessage("Unknown nodeId in editNodeClick: " + uid);
                            return;
                        }
                        edit.editingUnsavedNode = false;
                        Util_7.util.json("initNodeEdit", {
                            "nodeId": node.id
                        }, edit.initNodeEditResponse);
                    };
                    this.insertNode = function (uid, typeName) {
                        edit.parentOfNewNode = Meta64_8.meta64.currentNode;
                        if (!edit.parentOfNewNode) {
                            console.log("Unknown parent");
                            return;
                        }
                        var node = null;
                        if (!uid) {
                            node = Meta64_8.meta64.getHighlightedNode();
                        }
                        else {
                            node = Meta64_8.meta64.uidToNodeMap[uid];
                        }
                        if (node) {
                            edit.nodeInsertTarget = node;
                            edit.startEditingNewNode(typeName);
                        }
                    };
                    this.createSubNode = function (uid, typeName, createAtTop) {
                        if (!uid) {
                            var highlightNode = Meta64_8.meta64.getHighlightedNode();
                            if (highlightNode) {
                                edit.parentOfNewNode = highlightNode;
                            }
                            else {
                                edit.parentOfNewNode = Meta64_8.meta64.currentNode;
                            }
                        }
                        else {
                            edit.parentOfNewNode = Meta64_8.meta64.uidToNodeMap[uid];
                            if (!edit.parentOfNewNode) {
                                console.log("Unknown nodeId in createSubNode: " + uid);
                                return;
                            }
                        }
                        edit.nodeInsertTarget = null;
                        edit.startEditingNewNode(typeName, createAtTop);
                    };
                    this.replyToComment = function (uid) {
                        edit.createSubNode(uid);
                    };
                    this.clearSelections = function () {
                        Meta64_8.meta64.clearSelectedNodes();
                        Render_5.render.renderPageFromData();
                        Meta64_8.meta64.selectTab("mainTabName");
                    };
                    this.deleteSelNodes = function () {
                        var selNodesArray = Meta64_8.meta64.getSelectedNodeIdsArray();
                        if (!selNodesArray || selNodesArray.length == 0) {
                            Util_7.util.showMessage("You have not selected any nodes. Select nodes to delete first.");
                            return;
                        }
                        Factory_5.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm Delete", "message": "Delete " + selNodesArray.length + " node(s) ?", "buttonText": "Yes, delete.", "yesCallback": function () {
                                var postDeleteSelNode = edit.getBestPostDeleteSelNode();
                                Util_7.util.json("deleteNodes", {
                                    "nodeIds": selNodesArray
                                }, edit.deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
                            }
                        });
                    };
                    this.getBestPostDeleteSelNode = function () {
                        var nodesMap = Meta64_8.meta64.getSelectedNodesAsMapById();
                        var bestNode = null;
                        var takeNextNode = false;
                        for (var i = 0; i < Meta64_8.meta64.currentNodeData.children.length; i++) {
                            var node = Meta64_8.meta64.currentNodeData.children[i];
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
                    this.cutSelNodes = function () {
                        var selNodesArray = Meta64_8.meta64.getSelectedNodeIdsArray();
                        if (!selNodesArray || selNodesArray.length == 0) {
                            Util_7.util.showMessage("You have not selected any nodes. Select nodes first.");
                            return;
                        }
                        Factory_5.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm Cut", "message": "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?", "buttonText": "Yes", "yesCallback": function () {
                                edit.nodesToMove = selNodesArray;
                                edit.loadNodesToMoveSet(selNodesArray);
                                Meta64_8.meta64.selectedNodes = {};
                                Render_5.render.renderPageFromData();
                                Meta64_8.meta64.refreshAllGuiEnablement();
                            }
                        });
                    };
                    this.loadNodesToMoveSet = function (nodeIds) {
                        edit.nodesToMoveSet = {};
                        for (var _i = 0, nodeIds_1 = nodeIds; _i < nodeIds_1.length; _i++) {
                            var id = nodeIds_1[_i];
                            edit.nodesToMoveSet[id] = true;
                        }
                    };
                    this.pasteSelNodes = function () {
                        Factory_5.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm Paste", "message": "Paste " + edit.nodesToMove.length + " node(s) under selected parent node ?", "buttonText": "Yes, paste", "yesCallback": function () {
                                var highlightNode = Meta64_8.meta64.getHighlightedNode();
                                Util_7.util.json("moveNodes", {
                                    "targetNodeId": highlightNode.id,
                                    "targetChildId": highlightNode != null ? highlightNode.id : null,
                                    "nodeIds": edit.nodesToMove
                                }, edit.moveNodesResponse);
                            }
                        });
                    };
                    this.insertBookWarAndPeace = function () {
                        Factory_5.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm", "message": "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!",
                            "buttonText": "Yes, insert book.", "yesCallback": function () {
                                var node = Meta64_8.meta64.getHighlightedNode();
                                if (!node) {
                                    Util_7.util.showMessage("No node is selected.");
                                }
                                else {
                                    Util_7.util.json("insertBook", {
                                        "nodeId": node.id,
                                        "bookName": "War and Peace",
                                        "truncated": User_2.user.isTestUserAccount()
                                    }, edit.insertBookResponse);
                                }
                            }
                        });
                    };
                }
                return Edit;
            }());
            exports_30("edit", edit = new Edit());
            exports_30("default",edit);
        }
    }
});
System.register("Prefs", ["Factory", "User", "Util"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var Factory_6, User_3, Util_8;
    var Prefs, prefs;
    return {
        setters:[
            function (Factory_6_1) {
                Factory_6 = Factory_6_1;
            },
            function (User_3_1) {
                User_3 = User_3_1;
            },
            function (Util_8_1) {
                Util_8 = Util_8_1;
            }],
        execute: function() {
            Prefs = (function () {
                function Prefs() {
                    this.closeAccountResponse = function (res) {
                        $(window).off("beforeunload");
                        window.location.href = window.location.origin;
                    };
                    this.closeAccount = function () {
                        Factory_6.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Oh No!",
                            "message": "Close your Account?<p> Are you sure?",
                            "buttonText": "Yes, Close Account.",
                            "yesCallback": function () {
                                Factory_6.Factory.create("ConfirmDlg", function (dlg) {
                                    dlg.open();
                                }, {
                                    "title": "One more Click",
                                    "message": "Your data will be deleted and can never be recovered.<p> Are you sure?",
                                    "buttonText": "Yes, Close Account.",
                                    "yesCallback": function () {
                                        User_3.user.deleteAllUserCookies();
                                        Util_8.util.json("closeAccount", {}, prefs.closeAccountResponse);
                                    }
                                });
                            }
                        });
                    };
                }
                return Prefs;
            }());
            exports_31("prefs", prefs = new Prefs());
            exports_31("default",prefs);
        }
    }
});
System.register("SharingDlg", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Share", ["Search", "Util", "Meta64", "Factory"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var Search_3, Util_9, Meta64_9, Factory_7;
    var Share, share;
    return {
        setters:[
            function (Search_3_1) {
                Search_3 = Search_3_1;
            },
            function (Util_9_1) {
                Util_9 = Util_9_1;
            },
            function (Meta64_9_1) {
                Meta64_9 = Meta64_9_1;
            },
            function (Factory_7_1) {
                Factory_7 = Factory_7_1;
            }],
        execute: function() {
            Share = (function () {
                function Share() {
                    this.findSharedNodesResponse = function (res) {
                        Search_3.srch.searchNodesResponse(res);
                    };
                    this.sharingNode = null;
                    this.editNodeSharing = function () {
                        var node = Meta64_9.meta64.getHighlightedNode();
                        if (!node) {
                            Util_9.util.showMessage("No node is selected.");
                            return;
                        }
                        share.sharingNode = node;
                        Factory_7.Factory.create("SharingDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.findSharedNodes = function () {
                        var focusNode = Meta64_9.meta64.getHighlightedNode();
                        if (focusNode == null) {
                            return;
                        }
                        Search_3.srch.searchPageTitle = "Shared Nodes";
                        Util_9.util.json("getSharedNodes", {
                            "nodeId": focusNode.id
                        }, share.findSharedNodesResponse);
                    };
                }
                return Share;
            }());
            exports_33("share", share = new Share());
            exports_33("default",share);
        }
    }
});
System.register("AudioPlayerDlg", [], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    return {
        setters:[],
        execute: function() {
            console.log("AudioPlayerDlg.ts");
        }
    }
});
System.register("Podcast", ["Util", "Props", "Render", "Meta64", "Factory", "Interfaces"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var Util_10, Props_3, Render_6, Meta64_10, Factory_8, I;
    var Podcast, podcast;
    return {
        setters:[
            function (Util_10_1) {
                Util_10 = Util_10_1;
            },
            function (Props_3_1) {
                Props_3 = Props_3_1;
            },
            function (Render_6_1) {
                Render_6 = Render_6_1;
            },
            function (Meta64_10_1) {
                Meta64_10 = Meta64_10_1;
            },
            function (Factory_8_1) {
                Factory_8 = Factory_8_1;
            },
            function (I_1) {
                I = I_1;
            }],
        execute: function() {
            Podcast = (function () {
                function Podcast() {
                    this.player = null;
                    this.startTimePending = null;
                    this.uid = null;
                    this.node = null;
                    this.adSegments = null;
                    this.pushTimer = null;
                    this.generateRSS = function () {
                        Util_10.util.json("generateRSS", {}, podcast.generateRSSResponse);
                    };
                    this.generateRSSResponse = function () {
                        alert('rss complete.');
                    };
                    this.renderFeedNode = function (node, rowStyling) {
                        var ret = "";
                        var title = Props_3.props.getNodeProperty("meta64:rssFeedTitle", node);
                        var desc = Props_3.props.getNodeProperty("meta64:rssFeedDesc", node);
                        var imgUrl = Props_3.props.getNodeProperty("meta64:rssFeedImageUrl", node);
                        var feed = "";
                        if (title) {
                            feed += Render_6.render.tag("h2", {}, title.value);
                        }
                        if (desc) {
                            feed += Render_6.render.tag("p", {}, desc.value);
                        }
                        if (rowStyling) {
                            ret += Render_6.render.tag("div", {
                                "class": "jcr-content"
                            }, feed);
                        }
                        else {
                            ret += Render_6.render.tag("div", {
                                "class": "jcr-root-content"
                            }, feed);
                        }
                        if (imgUrl) {
                            ret += Render_6.render.tag("img", {
                                "style": "max-width: 200px;",
                                "src": imgUrl.value
                            }, null, false);
                        }
                        return ret;
                    };
                    this.getMediaPlayerUrlFromNode = function (node) {
                        var link = Props_3.props.getNodeProperty("meta64:rssItemLink", node);
                        if (link && link.value && Util_10.util.contains(link.value.toLowerCase(), ".mp3")) {
                            return link.value;
                        }
                        var uri = Props_3.props.getNodeProperty("meta64:rssItemUri", node);
                        if (uri && uri.value && Util_10.util.contains(uri.value.toLowerCase(), ".mp3")) {
                            return uri.value;
                        }
                        var encUrl = Props_3.props.getNodeProperty("meta64:rssItemEncUrl", node);
                        if (encUrl && encUrl.value) {
                            var encType = Props_3.props.getNodeProperty("meta64:rssItemEncType", node);
                            if (encType && encType.value && Util_10.util.startsWith(encType.value, "audio/")) {
                                return encUrl.value;
                            }
                        }
                        return null;
                    };
                    this.renderItemNode = function (node, rowStyling) {
                        var ret = "";
                        var rssTitle = Props_3.props.getNodeProperty("meta64:rssItemTitle", node);
                        var rssDesc = Props_3.props.getNodeProperty("meta64:rssItemDesc", node);
                        var rssAuthor = Props_3.props.getNodeProperty("meta64:rssItemAuthor", node);
                        var rssLink = Props_3.props.getNodeProperty("meta64:rssItemLink", node);
                        var rssUri = Props_3.props.getNodeProperty("meta64:rssItemUri", node);
                        var entry = "";
                        if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
                            entry += Render_6.render.tag("a", {
                                "href": rssLink.value
                            }, Render_6.render.tag("h3", {}, rssTitle.value));
                        }
                        var playerUrl = podcast.getMediaPlayerUrlFromNode(node);
                        if (rssDesc && rssDesc.value) {
                            entry += Render_6.render.tag("p", {}, rssDesc.value);
                        }
                        if (rssAuthor && rssAuthor.value) {
                            entry += Render_6.render.tag("div", {}, "By: " + rssAuthor.value);
                        }
                        if (rowStyling) {
                            ret += Render_6.render.tag("div", {
                                "class": "jcr-content"
                            }, entry);
                        }
                        else {
                            ret += Render_6.render.tag("div", {
                                "class": "jcr-root-content"
                            }, entry);
                        }
                        return ret;
                    };
                    this.propOrderingFeedNode = function (node, properties) {
                        var propOrder = [
                            "meta64:rssFeedTitle",
                            "meta64:rssFeedDesc",
                            "meta64:rssFeedLink",
                            "meta64:rssFeedUri",
                            "meta64:rssFeedSrc",
                            "meta64:rssFeedImageUrl"];
                        return Props_3.props.orderProps(propOrder, properties);
                    };
                    this.propOrderingItemNode = function (node, properties) {
                        var propOrder = [
                            "meta64:rssItemTitle",
                            "meta64:rssItemDesc",
                            "meta64:rssItemLink",
                            "meta64:rssItemUri",
                            "meta64:rssItemAuthor"];
                        return Props_3.props.orderProps(propOrder, properties);
                    };
                    this.openPlayerDialog = function (_uid) {
                        podcast.uid = _uid;
                        podcast.node = Meta64_10.meta64.uidToNodeMap[podcast.uid];
                        if (podcast.node) {
                            var mp3Url_1 = podcast.getMediaPlayerUrlFromNode(podcast.node);
                            if (mp3Url_1) {
                                Util_10.util.json("getPlayerInfo", {
                                    "url": mp3Url_1
                                }, function (res) {
                                    podcast.parseAdSegmentUid(podcast.uid);
                                    Factory_8.Factory.create("AudioPlayerDlg", function (dlg) {
                                        dlg.open();
                                    }, { "sourceUrl": mp3Url_1, "nodeUid": podcast.uid, "startTimePending": res.timeOffset });
                                });
                            }
                        }
                    };
                    this.parseAdSegmentUid = function (_uid) {
                        if (podcast.node) {
                            var adSegs = Props_3.props.getNodeProperty("ad-segments", podcast.node);
                            if (adSegs) {
                                podcast.parseAdSegmentText(adSegs.value);
                            }
                        }
                        else
                            throw "Unable to find node uid: " + podcast.uid;
                    };
                    this.parseAdSegmentText = function (adSegs) {
                        podcast.adSegments = [];
                        var segList = adSegs.split("\n");
                        for (var _i = 0, segList_1 = segList; _i < segList_1.length; _i++) {
                            var seg = segList_1[_i];
                            var segTimes = seg.split(",");
                            if (segTimes.length != 2) {
                                console.log("invalid time range: " + seg);
                                continue;
                            }
                            var beginSecs = podcast.convertToSeconds(segTimes[0]);
                            var endSecs = podcast.convertToSeconds(segTimes[1]);
                            podcast.adSegments.push(new I.AdSegment(beginSecs, endSecs));
                        }
                    };
                    this.convertToSeconds = function (timeVal) {
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
                    this.restoreStartTime = function () {
                        if (podcast.player && podcast.startTimePending) {
                            podcast.player.currentTime = podcast.startTimePending;
                            podcast.startTimePending = null;
                        }
                    };
                    this.onCanPlay = function (uid, elm) {
                        podcast.player = elm;
                        podcast.restoreStartTime();
                        podcast.player.play();
                    };
                    this.onTimeUpdate = function (uid, elm) {
                        if (!podcast.pushTimer) {
                            podcast.pushTimer = setInterval(podcast.pushTimerFunction, 5 * 60 * 1000);
                        }
                        podcast.player = elm;
                        podcast.restoreStartTime();
                        if (!podcast.adSegments)
                            return;
                        for (var _i = 0, _a = podcast.adSegments; _i < _a.length; _i++) {
                            var seg = _a[_i];
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
                    this.pushTimerFunction = function () {
                        if (podcast.player && !podcast.player.paused) {
                            if (!$(podcast.player).is(":visible")) {
                                console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                                podcast.player.pause();
                            }
                            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
                        }
                    };
                    this.pause = function () {
                        if (podcast.player) {
                            podcast.player.pause();
                            podcast.savePlayerInfo(podcast.player.src, podcast.player.currentTime);
                        }
                    };
                    this.destroyPlayer = function (dlg) {
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
                    this.play = function () {
                        if (podcast.player) {
                            podcast.player.play();
                        }
                    };
                    this.speed = function (rate) {
                        if (podcast.player) {
                            podcast.player.playbackRate = rate;
                        }
                    };
                    this.skip = function (delta) {
                        if (podcast.player) {
                            podcast.player.currentTime += delta;
                        }
                    };
                    this.savePlayerInfo = function (url, timeOffset) {
                        if (Meta64_10.meta64.isAnonUser)
                            return;
                        Util_10.util.json("setPlayerInfo", {
                            "url": url,
                            "timeOffset": timeOffset
                        }, podcast.setPlayerInfoResponse);
                    };
                    this.setPlayerInfoResponse = function () {
                    };
                }
                return Podcast;
            }());
            exports_35("podcast", podcast = new Podcast());
            exports_35("default",podcast);
        }
    }
});
System.register("BindClick", [], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var BindClick, bindClick;
    return {
        setters:[],
        execute: function() {
            console.log("BindClick.ts");
            BindClick = (function () {
                function BindClick() {
                    var _this = this;
                    this.idToOnClickMap = {};
                    this.interval = function () {
                        for (var id in _this.idToOnClickMap) {
                            if (_this.idToOnClickMap.hasOwnProperty(id)) {
                                var e = document.getElementById(id);
                                if (e) {
                                    e.onclick = _this.idToOnClickMap[id];
                                    delete _this.idToOnClickMap[id];
                                }
                            }
                        }
                    };
                    setInterval(function () {
                        if (bindClick) {
                            bindClick.interval();
                        }
                    }, 500);
                }
                BindClick.prototype.addOnClick = function (domId, callback) {
                    this.idToOnClickMap[domId] = callback;
                };
                return BindClick;
            }());
            exports_36("bindClick", bindClick = new BindClick());
            exports_36("default",bindClick);
        }
    }
});
System.register("MenuPanel", ["Util", "Render", "Edit", "Nav", "Share", "Attachment", "Search", "Props", "Meta64", "Podcast", "View", "BindClick"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var Util_11, Render_7, Edit_5, Nav_4, Share_1, Attachment_1, Search_4, Props_4, Meta64_11, Podcast_1, View_7, BindClick_1;
    var MenuPanel, menuPanel;
    return {
        setters:[
            function (Util_11_1) {
                Util_11 = Util_11_1;
            },
            function (Render_7_1) {
                Render_7 = Render_7_1;
            },
            function (Edit_5_1) {
                Edit_5 = Edit_5_1;
            },
            function (Nav_4_1) {
                Nav_4 = Nav_4_1;
            },
            function (Share_1_1) {
                Share_1 = Share_1_1;
            },
            function (Attachment_1_1) {
                Attachment_1 = Attachment_1_1;
            },
            function (Search_4_1) {
                Search_4 = Search_4_1;
            },
            function (Props_4_1) {
                Props_4 = Props_4_1;
            },
            function (Meta64_11_1) {
                Meta64_11 = Meta64_11_1;
            },
            function (Podcast_1_1) {
                Podcast_1 = Podcast_1_1;
            },
            function (View_7_1) {
                View_7 = View_7_1;
            },
            function (BindClick_1_1) {
                BindClick_1 = BindClick_1_1;
            }],
        execute: function() {
            console.log("MenuPanel.ts");
            MenuPanel = (function () {
                function MenuPanel() {
                    this.makeTopLevelMenu = function (title, content, id) {
                        var paperItemAttrs = {
                            class: "menu-trigger"
                        };
                        var paperItem = Render_7.render.tag("paper-item", paperItemAttrs, title);
                        var paperSubmenuAttrs = {
                            "label": title,
                            "selectable": ""
                        };
                        if (id) {
                            paperSubmenuAttrs.id = id;
                        }
                        return Render_7.render.tag("paper-submenu", paperSubmenuAttrs, paperItem +
                            menuPanel.makeSecondLevelList(content), true);
                    };
                    this.makeSecondLevelList = function (content) {
                        return Render_7.render.tag("paper-menu", {
                            "class": "menu-content sublist my-menu-section",
                            "selectable": ""
                        }, content, true);
                    };
                    this.menuItem = function (name, id, onClick) {
                        var html = Render_7.render.tag("paper-item", {
                            "id": id,
                            "selectable": ""
                        }, name, true);
                        BindClick_1.bindClick.addOnClick(id, onClick);
                        return html;
                    };
                    this.domId = "mainAppMenu";
                    this.build = function () {
                        var rssItems = menuPanel.menuItem("Feeds", "mainMenuRss", Nav_4.nav.openRssFeedsNode);
                        var mainMenuRss = menuPanel.makeTopLevelMenu("RSS", rssItems);
                        var editMenuItems = menuPanel.menuItem("Create", "createNodeButton", Edit_5.edit.createNode) +
                            menuPanel.menuItem("Rename", "renameNodePgButton", Edit_5.edit.renameNode) +
                            menuPanel.menuItem("Cut", "cutSelNodesButton", Edit_5.edit.cutSelNodes) +
                            menuPanel.menuItem("Paste", "pasteSelNodesButton", Edit_5.edit.pasteSelNodes) +
                            menuPanel.menuItem("Clear Selections", "clearSelectionsButton", Edit_5.edit.clearSelections) +
                            menuPanel.menuItem("Import", "openImportDlg", Edit_5.edit.openImportDlg) +
                            menuPanel.menuItem("Export", "openExportDlg", Edit_5.edit.openExportDlg) +
                            menuPanel.menuItem("Delete", "deleteSelNodesButton", Edit_5.edit.deleteSelNodes);
                        var editMenu = menuPanel.makeTopLevelMenu("Edit", editMenuItems);
                        var moveMenuItems = menuPanel.menuItem("Up", "moveNodeUpButton", Edit_5.edit.moveNodeUp) +
                            menuPanel.menuItem("Down", "moveNodeDownButton", Edit_5.edit.moveNodeDown) +
                            menuPanel.menuItem("to Top", "moveNodeToTopButton", Edit_5.edit.moveNodeToTop) +
                            menuPanel.menuItem("to Bottom", "moveNodeToBottomButton", Edit_5.edit.moveNodeToBottom);
                        var moveMenu = menuPanel.makeTopLevelMenu("Move", moveMenuItems);
                        var attachmentMenuItems = menuPanel.menuItem("Upload from File", "uploadFromFileButton", Attachment_1.attachment.openUploadFromFileDlg) +
                            menuPanel.menuItem("Upload from URL", "uploadFromUrlButton", Attachment_1.attachment.openUploadFromUrlDlg) +
                            menuPanel.menuItem("Delete Attachment", "deleteAttachmentsButton", Attachment_1.attachment.deleteAttachment);
                        var attachmentMenu = menuPanel.makeTopLevelMenu("Attach", attachmentMenuItems);
                        var sharingMenuItems = menuPanel.menuItem("Edit Node Sharing", "editNodeSharingButton", Share_1.share.editNodeSharing) +
                            menuPanel.menuItem("Find Shared Subnodes", "findSharedNodesButton", Share_1.share.findSharedNodes);
                        var sharingMenu = menuPanel.makeTopLevelMenu("Share", sharingMenuItems);
                        var searchMenuItems = menuPanel.menuItem("Content", "contentSearchDlgButton", Nav_4.nav.search) +
                            menuPanel.menuItem("Tags", "tagSearchDlgButton", Nav_4.nav.searchTags) +
                            menuPanel.menuItem("Files", "fileSearchDlgButton", Nav_4.nav.searchFiles);
                        var searchMenu = menuPanel.makeTopLevelMenu("Search", searchMenuItems);
                        var timelineMenuItems = menuPanel.menuItem("Created", "timelineCreatedButton", Search_4.srch.timelineByCreateTime) +
                            menuPanel.menuItem("Modified", "timelineModifiedButton", Search_4.srch.timelineByModTime);
                        var timelineMenu = menuPanel.makeTopLevelMenu("Timeline", timelineMenuItems);
                        var viewOptionsMenuItems = menuPanel.menuItem("Toggle Properties", "propsToggleButton", Props_4.props.propsToggle) +
                            menuPanel.menuItem("Refresh", "refreshPageButton", Meta64_11.meta64.refresh) +
                            menuPanel.menuItem("Show URL", "showFullNodeUrlButton", Render_7.render.showNodeUrl) +
                            menuPanel.menuItem("Preferences", "accountPreferencesButton", Edit_5.edit.editPreferences);
                        var viewOptionsMenu = menuPanel.makeTopLevelMenu("View", viewOptionsMenuItems);
                        var myAccountItems = menuPanel.menuItem("Change Password", "changePasswordPgButton", Edit_5.edit.openChangePasswordDlg) +
                            menuPanel.menuItem("Manage Account", "manageAccountButton", Edit_5.edit.openManageAccountDlg);
                        var myAccountMenu = menuPanel.makeTopLevelMenu("Account", myAccountItems);
                        var adminItems = menuPanel.menuItem("Generate RSS", "generateRSSButton", Podcast_1.podcast.generateRSS) +
                            menuPanel.menuItem("Server Info", "showServerInfoButton", View_7.view.showServerInfo) +
                            menuPanel.menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", Edit_5.edit.insertBookWarAndPeace);
                        var adminMenu = menuPanel.makeTopLevelMenu("Admin", adminItems, "adminMenu");
                        var helpItems = menuPanel.menuItem("Main Menu Help", "mainMenuHelp", Nav_4.nav.openMainMenuHelp);
                        var mainMenuHelp = menuPanel.makeTopLevelMenu("Help/Docs", helpItems);
                        var content = mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu + searchMenu + timelineMenu + myAccountMenu
                            + adminMenu + mainMenuHelp;
                        Util_11.util.setHtml(menuPanel.domId, content);
                    };
                }
                return MenuPanel;
            }());
            exports_37("menuPanel", menuPanel = new MenuPanel());
        }
    }
});
System.register("SystemFolder", [], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var SystemFolder, systemfolder;
    return {
        setters:[],
        execute: function() {
            SystemFolder = (function () {
                function SystemFolder() {
                }
                return SystemFolder;
            }());
            exports_38("systemfolder", systemfolder = new SystemFolder());
        }
    }
});
System.register("Meta64", ["Constants", "Util", "Edit", "Nav", "Props", "Render", "Search", "User", "View", "MenuPanel", "Podcast", "Factory", "BindClick"], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var Constants_6, Util_12, Edit_6, Nav_5, Props_5, Render_8, Search_5, User_4, View_8, MenuPanel_1, Podcast_2, Factory_9, BindClick_2;
    var Meta64, meta64;
    return {
        setters:[
            function (Constants_6_1) {
                Constants_6 = Constants_6_1;
            },
            function (Util_12_1) {
                Util_12 = Util_12_1;
            },
            function (Edit_6_1) {
                Edit_6 = Edit_6_1;
            },
            function (Nav_5_1) {
                Nav_5 = Nav_5_1;
            },
            function (Props_5_1) {
                Props_5 = Props_5_1;
            },
            function (Render_8_1) {
                Render_8 = Render_8_1;
            },
            function (Search_5_1) {
                Search_5 = Search_5_1;
            },
            function (User_4_1) {
                User_4 = User_4_1;
            },
            function (View_8_1) {
                View_8 = View_8_1;
            },
            function (MenuPanel_1_1) {
                MenuPanel_1 = MenuPanel_1_1;
            },
            function (Podcast_2_1) {
                Podcast_2 = Podcast_2_1;
            },
            function (Factory_9_1) {
                Factory_9 = Factory_9_1;
            },
            function (BindClick_2_1) {
                BindClick_2 = BindClick_2_1;
            }],
        execute: function() {
            console.log("Meta64.ts");
            Meta64 = (function () {
                function Meta64() {
                    this.appInitialized = false;
                    this.curUrlPath = window.location.pathname + window.location.search;
                    this.codeFormatDirty = false;
                    this.nextGuid = 0;
                    this.userName = "anonymous";
                    this.deviceWidth = 0;
                    this.deviceHeight = 0;
                    this.homeNodeId = "";
                    this.homeNodePath = "";
                    this.isAdminUser = false;
                    this.isAnonUser = true;
                    this.anonUserLandingPageNode = null;
                    this.allowFileSystemSearch = false;
                    this.treeDirty = false;
                    this.uidToNodeMap = {};
                    this.idToNodeMap = {};
                    this.aceEditorsById = {};
                    this.nextUid = 1;
                    this.identToUidMap = {};
                    this.parentUidToFocusNodeMap = {};
                    this.MODE_ADVANCED = "advanced";
                    this.MODE_SIMPLE = "simple";
                    this.editModeOption = "simple";
                    this.showProperties = false;
                    this.showMetaData = false;
                    this.simpleModeNodePrefixBlackList = {
                        "rep:": true
                    };
                    this.simpleModePropertyBlackList = {};
                    this.readOnlyPropertyList = {};
                    this.binaryPropertyList = {};
                    this.selectedNodes = {};
                    this.expandedAbbrevNodeIds = {};
                    this.currentNodeData = null;
                    this.currentNode = null;
                    this.currentNodeUid = null;
                    this.currentNodeId = null;
                    this.currentNodePath = null;
                    this.dataObjMap = {};
                    this.renderFunctionsByJcrType = {};
                    this.propOrderingFunctionsByJcrType = {};
                    this.userPreferences = {
                        "editMode": false,
                        "advancedMode": false,
                        "lastNode": "",
                        "importAllowed": false,
                        "exportAllowed": false,
                        "showMetaData": false
                    };
                    this.updateMainMenuPanel = function () {
                        console.log("building main menu panel");
                        MenuPanel_1.menuPanel.build();
                        meta64.refreshAllGuiEnablement();
                    };
                    this.registerDataObject = function (data) {
                        if (!data.guid) {
                            data.guid = ++meta64.nextGuid;
                            meta64.dataObjMap[data.guid] = data;
                        }
                    };
                    this.getObjectByGuid = function (guid) {
                        var ret = meta64.dataObjMap[guid];
                        if (!ret) {
                            console.log("data object not found: guid=" + guid);
                        }
                        return ret;
                    };
                    this.encodeOnClick = function (callback, ctx, payload, delayCallback) {
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
                                return "meta64.runCallback(" + callback.guid + "," + ctx.guid + "," + payloadStr + "," + delayCallback + ");";
                            }
                            else {
                                return "meta64.runCallback(" + callback.guid + ",null,null," + delayCallback + ");";
                            }
                        }
                        else {
                            throw "unexpected callback type in encodeOnClick";
                        }
                    };
                    this.runCallback = function (guid, ctx, payload, delayCallback) {
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
                    this.runCallbackImmediate = function (guid, ctx, payload) {
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
                    this.inSimpleMode = function () {
                        return meta64.editModeOption === meta64.MODE_SIMPLE;
                    };
                    this.refresh = function () {
                        meta64.goToMainPage(true, true);
                    };
                    this.goToMainPage = function (rerender, forceServerRefresh) {
                        if (forceServerRefresh) {
                            meta64.treeDirty = true;
                        }
                        if (rerender || meta64.treeDirty) {
                            if (meta64.treeDirty) {
                                View_8.view.refreshTree(null, true);
                            }
                            else {
                                Render_8.render.renderPageFromData();
                                meta64.refreshAllGuiEnablement();
                            }
                        }
                        else {
                            View_8.view.scrollToSelectedNode();
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
                        var paperTabs = document.querySelector("#mainIronPages");
                        paperTabs.select(pg.tabId);
                    };
                    this.isNodeBlackListed = function (node) {
                        if (!meta64.inSimpleMode())
                            return false;
                        var prop;
                        for (prop in meta64.simpleModeNodePrefixBlackList) {
                            if (meta64.simpleModeNodePrefixBlackList.hasOwnProperty(prop) && Util_12.util.startsWith(node.name, prop)) {
                                return true;
                            }
                        }
                        return false;
                    };
                    this.getSelectedNodeUidsArray = function () {
                        var selArray = [], uid;
                        for (uid in meta64.selectedNodes) {
                            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                                selArray.push(uid);
                            }
                        }
                        return selArray;
                    };
                    this.getSelectedNodeIdsArray = function () {
                        var selArray = [], uid;
                        if (!meta64.selectedNodes) {
                            console.log("no selected nodes.");
                        }
                        else {
                            console.log("selectedNode count: " + Util_12.util.getPropertyCount(meta64.selectedNodes));
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
                    this.getSelectedNodesAsMapById = function () {
                        var ret = {};
                        var selArray = this.getSelectedNodesArray();
                        for (var i = 0; i < selArray.length; i++) {
                            ret[selArray[i].id] = selArray[i];
                        }
                        return ret;
                    };
                    this.getSelectedNodesArray = function () {
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
                    this.clearSelectedNodes = function () {
                        meta64.selectedNodes = {};
                    };
                    this.updateNodeInfoResponse = function (res, node) {
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
                                Util_12.util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
                            }
                            else {
                                Util_12.util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
                            }
                        }
                    };
                    this.updateNodeInfo = function (node) {
                        Util_12.util.json("getNodePrivileges", {
                            "nodeId": node.id,
                            "includeAcl": false,
                            "includeOwners": true
                        }, function (res) {
                            meta64.updateNodeInfoResponse(res, node);
                        });
                    };
                    this.getNodeFromId = function (id) {
                        return meta64.idToNodeMap[id];
                    };
                    this.getPathOfUid = function (uid) {
                        var node = meta64.uidToNodeMap[uid];
                        if (!node) {
                            return "[path error. invalid uid: " + uid + "]";
                        }
                        else {
                            return node.path;
                        }
                    };
                    this.getHighlightedNode = function () {
                        var ret = meta64.parentUidToFocusNodeMap[meta64.currentNodeUid];
                        return ret;
                    };
                    this.highlightRowById = function (id, scroll) {
                        var node = meta64.getNodeFromId(id);
                        if (node) {
                            meta64.highlightNode(node, scroll);
                        }
                        else {
                            console.log("highlightRowById failed to find id: " + id);
                        }
                    };
                    this.highlightNode = function (node, scroll) {
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
                                Util_12.util.changeOrAddClass("#" + rowElmId, "active-row", "inactive-row");
                            }
                        }
                        if (!doneHighlighting) {
                            meta64.parentUidToFocusNodeMap[meta64.currentNodeUid] = node;
                            var rowElmId = node.uid + "_row";
                            var rowElm = $("#" + rowElmId);
                            if (!rowElm || rowElm.length == 0) {
                                console.log("Unable to find rowElement to highlight: " + rowElmId);
                            }
                            Util_12.util.changeOrAddClass("#" + rowElmId, "inactive-row", "active-row");
                        }
                        if (scroll) {
                            View_8.view.scrollToSelectedNode();
                        }
                    };
                    this.refreshAllGuiEnablement = function () {
                        var prevPageExists = Nav_5.nav.mainOffset > 0;
                        var nextPageExists = !Nav_5.nav.endReached;
                        var selNodeCount = Util_12.util.getPropertyCount(meta64.selectedNodes);
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
                        Util_12.util.setEnablement("navLogoutButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("openSignupPgButton", meta64.isAnonUser);
                        var propsToggle = meta64.currentNode && !meta64.isAnonUser;
                        Util_12.util.setEnablement("propsToggleButton", propsToggle);
                        var allowEditMode = meta64.currentNode && !meta64.isAnonUser;
                        Util_12.util.setEnablement("editModeButton", allowEditMode);
                        Util_12.util.setEnablement("upLevelButton", meta64.currentNode && Nav_5.nav.parentVisibleToUser());
                        Util_12.util.setEnablement("cutSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
                        Util_12.util.setEnablement("deleteSelNodesButton", !meta64.isAnonUser && selNodeCount > 0 && selNodeIsMine);
                        Util_12.util.setEnablement("clearSelectionsButton", !meta64.isAnonUser && selNodeCount > 0);
                        Util_12.util.setEnablement("pasteSelNodesButton", !meta64.isAnonUser && Edit_6.edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));
                        Util_12.util.setEnablement("moveNodeUpButton", canMoveUp);
                        Util_12.util.setEnablement("moveNodeDownButton", canMoveDown);
                        Util_12.util.setEnablement("moveNodeToTopButton", canMoveUp);
                        Util_12.util.setEnablement("moveNodeToBottomButton", canMoveDown);
                        Util_12.util.setEnablement("changePasswordPgButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("accountPreferencesButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("manageAccountButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("insertBookWarAndPeaceButton", meta64.isAdminUser || (User_4.user.isTestUserAccount() && selNodeIsMine));
                        Util_12.util.setEnablement("generateRSSButton", meta64.isAdminUser);
                        Util_12.util.setEnablement("uploadFromFileButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
                        Util_12.util.setEnablement("uploadFromUrlButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
                        Util_12.util.setEnablement("deleteAttachmentsButton", !meta64.isAnonUser && highlightNode != null
                            && highlightNode.hasBinary && selNodeIsMine);
                        Util_12.util.setEnablement("editNodeSharingButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
                        Util_12.util.setEnablement("renameNodePgButton", !meta64.isAnonUser && highlightNode != null && selNodeIsMine);
                        Util_12.util.setEnablement("contentSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("tagSearchDlgButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);
                        Util_12.util.setEnablement("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("timelineCreatedButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("timelineModifiedButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("showServerInfoButton", meta64.isAdminUser);
                        Util_12.util.setEnablement("showFullNodeUrlButton", highlightNode != null);
                        Util_12.util.setEnablement("refreshPageButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("findSharedNodesButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setEnablement("userPreferencesMainAppButton", !meta64.isAnonUser);
                        Util_12.util.setEnablement("createNodeButton", canCreateNode);
                        Util_12.util.setEnablement("openImportDlg", importFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
                        Util_12.util.setEnablement("openExportDlg", exportFeatureEnabled && (selNodeIsMine || (highlightNode != null && meta64.homeNodeId == highlightNode.id)));
                        Util_12.util.setEnablement("adminMenu", meta64.isAdminUser);
                        Util_12.util.setVisibility("openImportDlg", importFeatureEnabled);
                        Util_12.util.setVisibility("openExportDlg", exportFeatureEnabled);
                        Util_12.util.setVisibility("editModeButton", allowEditMode);
                        Util_12.util.setVisibility("upLevelButton", meta64.currentNode && Nav_5.nav.parentVisibleToUser());
                        Util_12.util.setVisibility("insertBookWarAndPeaceButton", meta64.isAdminUser || (User_4.user.isTestUserAccount() && selNodeIsMine));
                        Util_12.util.setVisibility("generateRSSButton", meta64.isAdminUser);
                        Util_12.util.setVisibility("propsToggleButton", !meta64.isAnonUser);
                        Util_12.util.setVisibility("openLoginDlgButton", meta64.isAnonUser);
                        Util_12.util.setVisibility("navLogoutButton", !meta64.isAnonUser);
                        Util_12.util.setVisibility("openSignupPgButton", meta64.isAnonUser);
                        Util_12.util.setVisibility("searchMainAppButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setVisibility("timelineMainAppButton", !meta64.isAnonUser && highlightNode != null);
                        Util_12.util.setVisibility("userPreferencesMainAppButton", !meta64.isAnonUser);
                        Util_12.util.setVisibility("fileSearchDlgButton", !meta64.isAnonUser && meta64.allowFileSystemSearch);
                        Util_12.util.setVisibility("adminMenu", meta64.isAdminUser);
                        Polymer.dom.flush();
                        Polymer.updateStyles();
                    };
                    this.getSingleSelectedNode = function () {
                        var uid;
                        for (uid in meta64.selectedNodes) {
                            if (meta64.selectedNodes.hasOwnProperty(uid)) {
                                return meta64.uidToNodeMap[uid];
                            }
                        }
                        return null;
                    };
                    this.getOrdinalOfNode = function (node) {
                        if (!node || !meta64.currentNodeData || !meta64.currentNodeData.children)
                            return -1;
                        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                            if (node.id === meta64.currentNodeData.children[i].id) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    this.getNumChildNodes = function () {
                        if (!meta64.currentNodeData || !meta64.currentNodeData.children)
                            return 0;
                        return meta64.currentNodeData.children.length;
                    };
                    this.setCurrentNodeData = function (data) {
                        meta64.currentNodeData = data;
                        meta64.currentNode = data.node;
                        meta64.currentNodeUid = data.node.uid;
                        meta64.currentNodeId = data.node.id;
                        meta64.currentNodePath = data.node.path;
                    };
                    this.anonPageLoadResponse = function (res) {
                        if (res.renderNodeResponse) {
                            Util_12.util.setVisibility("mainNodeContent", true);
                            Render_8.render.renderPageFromData(res.renderNodeResponse);
                            meta64.refreshAllGuiEnablement();
                        }
                        else {
                            Util_12.util.setVisibility("mainNodeContent", false);
                            console.log("setting listview to: " + res.content);
                            Util_12.util.setHtml("listView", res.content);
                        }
                    };
                    this.removeBinaryByUid = function (uid) {
                        for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                            var node = meta64.currentNodeData.children[i];
                            if (node.uid === uid) {
                                node.hasBinary = false;
                                break;
                            }
                        }
                    };
                    this.initNode = function (node, updateMaps) {
                        if (!node) {
                            console.log("initNode has null node");
                            return;
                        }
                        node.uid = updateMaps ? Util_12.util.getUidForId(meta64.identToUidMap, node.id) : meta64.identToUidMap[node.id];
                        node.properties = Props_5.props.getPropertiesInEditingOrder(node, node.properties);
                        node.createdBy = Props_5.props.getNodePropertyVal(Constants_6.jcrCnst.CREATED_BY, node);
                        node.lastModified = new Date(Props_5.props.getNodePropertyVal(Constants_6.jcrCnst.LAST_MODIFIED, node));
                        if (updateMaps) {
                            meta64.uidToNodeMap[node.uid] = node;
                            meta64.idToNodeMap[node.id] = node;
                        }
                    };
                    this.initConstants = function () {
                        Util_12.util.addAll(meta64.simpleModePropertyBlackList, [
                            Constants_6.jcrCnst.MIXIN_TYPES,
                            Constants_6.jcrCnst.PRIMARY_TYPE,
                            Constants_6.jcrCnst.POLICY,
                            Constants_6.jcrCnst.IMG_WIDTH,
                            Constants_6.jcrCnst.IMG_HEIGHT,
                            Constants_6.jcrCnst.BIN_VER,
                            Constants_6.jcrCnst.BIN_DATA,
                            Constants_6.jcrCnst.BIN_MIME,
                            Constants_6.jcrCnst.COMMENT_BY,
                            Constants_6.jcrCnst.PUBLIC_APPEND]);
                        Util_12.util.addAll(meta64.readOnlyPropertyList, [
                            Constants_6.jcrCnst.PRIMARY_TYPE,
                            Constants_6.jcrCnst.UUID,
                            Constants_6.jcrCnst.MIXIN_TYPES,
                            Constants_6.jcrCnst.CREATED,
                            Constants_6.jcrCnst.CREATED_BY,
                            Constants_6.jcrCnst.LAST_MODIFIED,
                            Constants_6.jcrCnst.LAST_MODIFIED_BY,
                            Constants_6.jcrCnst.IMG_WIDTH,
                            Constants_6.jcrCnst.IMG_HEIGHT,
                            Constants_6.jcrCnst.BIN_VER,
                            Constants_6.jcrCnst.BIN_DATA,
                            Constants_6.jcrCnst.BIN_MIME,
                            Constants_6.jcrCnst.COMMENT_BY,
                            Constants_6.jcrCnst.PUBLIC_APPEND]);
                        Util_12.util.addAll(meta64.binaryPropertyList, [Constants_6.jcrCnst.BIN_DATA]);
                    };
                    this.initApp = function () {
                        console.log("initApp running.");
                        meta64.renderFunctionsByJcrType["meta64:rssfeed"] = Podcast_2.podcast.renderFeedNode;
                        meta64.renderFunctionsByJcrType["meta64:rssitem"] = Podcast_2.podcast.renderItemNode;
                        meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = Podcast_2.podcast.propOrderingFeedNode;
                        meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = Podcast_2.podcast.propOrderingItemNode;
                        window.addEvent = function (object, type, callback) {
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
                        window.addEventListener('polymer-ready', function (e) {
                            console.log('polymer-ready event!');
                        });
                        console.log("running module: cnst.js");
                        if (meta64.appInitialized)
                            return;
                        meta64.appInitialized = true;
                        var tabs = Util_12.util.poly("mainIronPages");
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
                        User_4.user.refreshLogin();
                        meta64.updateMainMenuPanel();
                        meta64.refreshAllGuiEnablement();
                        Util_12.util.initProgressMonitor();
                        meta64.processUrlParams();
                        this.initStaticHtmlOnClicks();
                        console.log("initApp complete.");
                    };
                    this.initStaticHtmlOnClicks = function () {
                        BindClick_2.bindClick.addOnClick("headerAppName", Nav_5.nav.navPublicHome);
                        BindClick_2.bindClick.addOnClick("navHomeButton", Nav_5.nav.navHome);
                        BindClick_2.bindClick.addOnClick("upLevelButton", Nav_5.nav.navUpLevel);
                        BindClick_2.bindClick.addOnClick("editModeButton", Nav_5.nav.editMode);
                        BindClick_2.bindClick.addOnClick("searchMainAppButton", Nav_5.nav.search);
                        BindClick_2.bindClick.addOnClick("timelineMainAppButton", Search_5.srch.timelineByModTime);
                        BindClick_2.bindClick.addOnClick("userPreferencesMainAppButton", Nav_5.nav.preferences);
                        BindClick_2.bindClick.addOnClick("openLoginDlgButton", Nav_5.nav.login);
                        BindClick_2.bindClick.addOnClick("navLogoutButton", Nav_5.nav.logout);
                        BindClick_2.bindClick.addOnClick("openSignupPgButton", Nav_5.nav.signup);
                    };
                    this.processUrlParams = function () {
                        var passCode = Util_12.util.getParameterByName("passCode");
                        if (passCode) {
                            setTimeout(function () {
                                Factory_9.Factory.create("ChangePasswordDlg", function (dlg) {
                                    dlg.open();
                                }, { "passCode": passCode });
                            }, 100);
                        }
                        meta64.urlCmd = Util_12.util.getParameterByName("cmd");
                    };
                    this.tabChangeEvent = function (tabName) {
                        if (tabName == "searchTabName") {
                            Search_5.srch.searchTabActivated();
                        }
                    };
                    this.displaySignupMessage = function () {
                        var signupResponse = $("#signupCodeResponse").text();
                        if (signupResponse === "ok") {
                            Util_12.util.showMessage("Signup complete. You may now login.");
                        }
                    };
                    this.screenSizeChange = function () {
                        if (meta64.currentNodeData) {
                            if (meta64.currentNode.imgId) {
                                Render_8.render.adjustImageSize(meta64.currentNode);
                            }
                            $.each(meta64.currentNodeData.children, function (i, node) {
                                if (node.imgId) {
                                    Render_8.render.adjustImageSize(node);
                                }
                            });
                        }
                    };
                    this.loadAnonPageHome = function (ignoreUrl) {
                        Util_12.util.json("anonPageLoad", {
                            "ignoreUrl": ignoreUrl
                        }, meta64.anonPageLoadResponse);
                    };
                    this.saveUserPreferences = function () {
                        Util_12.util.json("saveUserPreferences", {
                            "userPreferences": meta64.userPreferences
                        });
                    };
                    this.openSystemFile = function (fileName) {
                        Util_12.util.json("openSystemFile", {
                            "fileName": fileName
                        });
                    };
                    this.modRun = function (modName, callback) {
                        System.import("/js/" + modName).then(function (mod) {
                            callback(mod);
                        });
                    };
                    this.clickOnNodeRow = function (rowElm, uid) {
                        Nav_5.nav.clickOnNodeRow(rowElm, uid);
                    };
                    this.replyToComment = function (uid) {
                        Edit_6.edit.replyToComment(uid);
                    };
                    this.openNode = function (uid) {
                        Nav_5.nav.openNode(uid);
                    };
                    this.toggleNodeSel = function (uid) {
                        Nav_5.nav.toggleNodeSel(uid);
                    };
                    this.createSubNode = function (uid, typeName, createAtTop) {
                        Edit_6.edit.createSubNode(uid, typeName, createAtTop);
                    };
                    this.insertNode = function (uid, typeName) {
                        Edit_6.edit.insertNode(uid, typeName);
                    };
                    this.runEditNode = function (uid) {
                        Edit_6.edit.runEditNode(uid);
                    };
                    this.moveNodeUp = function (uid) {
                        Edit_6.edit.moveNodeUp();
                    };
                    this.moveNodeDown = function (uid) {
                        Edit_6.edit.moveNodeDown();
                    };
                    this.clickOnSearchResultRow = function (rowElm, uid) {
                        Search_5.srch.clickOnSearchResultRow(rowElm, uid);
                    };
                    this.clickSearchNode = function (uid) {
                        Search_5.srch.clickSearchNode(uid);
                    };
                }
                return Meta64;
            }());
            exports_39("meta64", meta64 = new Meta64());
            window.meta64 = meta64;
        }
    }
});
System.register("UploadFromFileDropzoneDlg", [], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("UploadFromUrlDlg", [], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("Attachment", ["Meta64", "Util", "Factory"], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var Meta64_12, Util_13, Factory_10;
    var Attachment, attachment;
    return {
        setters:[
            function (Meta64_12_1) {
                Meta64_12 = Meta64_12_1;
            },
            function (Util_13_1) {
                Util_13 = Util_13_1;
            },
            function (Factory_10_1) {
                Factory_10 = Factory_10_1;
            }],
        execute: function() {
            console.log("Attachment.ts");
            Attachment = (function () {
                function Attachment() {
                    this.uploadNode = null;
                    this.openUploadFromFileDlg = function () {
                        var node = Meta64_12.meta64.getHighlightedNode();
                        if (!node) {
                            attachment.uploadNode = null;
                            Util_13.util.showMessage("No node is selected.");
                            return;
                        }
                        attachment.uploadNode = node;
                        Factory_10.Factory.create("UploadFromFileDropzoneDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.openUploadFromUrlDlg = function () {
                        var node = Meta64_12.meta64.getHighlightedNode();
                        if (!node) {
                            attachment.uploadNode = null;
                            Util_13.util.showMessage("No node is selected.");
                            return;
                        }
                        attachment.uploadNode = node;
                        Factory_10.Factory.create("UploadFromUrlDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.deleteAttachment = function () {
                        var node = Meta64_12.meta64.getHighlightedNode();
                        if (node) {
                            Factory_10.Factory.create("ConfirmDlg", function (dlg) {
                                dlg.open();
                            }, {
                                "title": "Confirm Delete Attachment", "message": "Delete the Attachment on the Node?", "buttonText": "Yes, delete.", "yesCallback": function () {
                                    Util_13.util.json("deleteAttachment", {
                                        "nodeId": node.id
                                    }, attachment.deleteAttachmentResponse, null, node.uid);
                                }
                            });
                        }
                    };
                    this.deleteAttachmentResponse = function (res, uid) {
                        if (Util_13.util.checkSuccess("Delete attachment", res)) {
                            Meta64_12.meta64.removeBinaryByUid(uid);
                            Meta64_12.meta64.goToMainPage(true);
                        }
                    };
                }
                return Attachment;
            }());
            exports_42("attachment", attachment = new Attachment());
            exports_42("default",attachment);
        }
    }
});
System.register("DialogBaseImpl", ["Meta64", "Util", "Render"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var Meta64_13, Util_14, Render_9;
    var DialogBaseImpl;
    return {
        setters:[
            function (Meta64_13_1) {
                Meta64_13 = Meta64_13_1;
            },
            function (Util_14_1) {
                Util_14 = Util_14_1;
            },
            function (Render_9_1) {
                Render_9 = Render_9_1;
            }],
        execute: function() {
            console.log("DialogBaseImpl.ts");
            DialogBaseImpl = (function () {
                function DialogBaseImpl(domId) {
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
                        var modalsContainer = Util_14.util.polyElm("modalsContainer");
                        var id = _this.id(_this.domId);
                        var node = document.createElement("paper-dialog");
                        node.setAttribute("id", id);
                        modalsContainer.node.appendChild(node);
                        node.style.border = "3px solid gray";
                        Polymer.dom.flush();
                        Polymer.updateStyles();
                        if (_this.horizCenterDlgContent) {
                            var content = Render_9.render.tag("div", {
                                "style": "margin: 0 auto; max-width: 800px;"
                            }, _this.build());
                            Util_14.util.setHtml(id, content);
                        }
                        else {
                            var content = _this.build();
                            Util_14.util.setHtml(id, content);
                        }
                        _this.built = true;
                        _this.init();
                        console.log("Showing dialog: " + id);
                        var polyElm = Util_14.util.polyElm(id);
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
                        if (Util_14.util.contains(id, "_dlgId")) {
                            return id;
                        }
                        return id + "_dlgId" + _this.data.guid;
                    };
                    this.el = function (id) {
                        if (!Util_14.util.startsWith(id, "#")) {
                            return $("#" + _this.id(id));
                        }
                        else {
                            return $(_this.id(id));
                        }
                    };
                    this.makePasswordField = function (text, id) {
                        return Render_9.render.makePasswordField(text, _this.id(id));
                    };
                    this.makeEditField = function (fieldName, id) {
                        id = _this.id(id);
                        return Render_9.render.tag("paper-input", {
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
                        return Render_9.render.tag("p", attrs, message);
                    };
                    this.makeButton = function (text, id, callback, ctx) {
                        var attribs = {
                            "raised": "raised",
                            "id": _this.id(id),
                            "class": "standardButton"
                        };
                        if (callback != undefined) {
                            attribs["onClick"] = Meta64_13.meta64.encodeOnClick(callback, ctx);
                        }
                        return Render_9.render.tag("paper-button", attribs, text, true);
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
                            onClick = Meta64_13.meta64.encodeOnClick(callback, ctx);
                        }
                        onClick += Meta64_13.meta64.encodeOnClick(_this.cancel, _this, null, delayCloseCallback);
                        if (onClick) {
                            attribs["onClick"] = onClick;
                        }
                        if (!initiallyVisible) {
                            attribs["style"] = "display:none;";
                        }
                        return Render_9.render.tag("paper-button", attribs, text, true);
                    };
                    this.bindEnterKey = function (id, callback) {
                        Util_14.util.bindEnterKey(_this.id(id), callback);
                    };
                    this.setInputVal = function (id, val) {
                        if (!val) {
                            val = "";
                        }
                        Util_14.util.setInputVal(_this.id(id), val);
                    };
                    this.getInputVal = function (id) {
                        return Util_14.util.getInputVal(_this.id(id)).trim();
                    };
                    this.setHtml = function (text, id) {
                        Util_14.util.setHtml(_this.id(id), text);
                    };
                    this.makeRadioButton = function (label, id) {
                        id = _this.id(id);
                        return Render_9.render.tag("paper-radio-button", {
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
                        var checkbox = Render_9.render.tag("paper-checkbox", attrs, "", false);
                        checkbox += Render_9.render.tag("label", {
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
                        return Render_9.render.tag("div", attrs, text);
                    };
                    this.focus = function (id) {
                        if (!Util_14.util.startsWith(id, "#")) {
                            id = "#" + id;
                        }
                        id = _this.id(id);
                        Util_14.util.delayedFocus(id);
                    };
                    this.data = {};
                    Meta64_13.meta64.registerDataObject(this);
                    Meta64_13.meta64.registerDataObject(this.data);
                }
                DialogBaseImpl.prototype.cancel = function () {
                    debugger;
                    var polyElm = Util_14.util.polyElm(this.id(this.domId));
                    polyElm.node.cancel();
                };
                return DialogBaseImpl;
            }());
            exports_43("DialogBaseImpl", DialogBaseImpl);
        }
    }
});
System.register("AudioPlayerDlgImpl", ["DialogBaseImpl", "Podcast"], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var DialogBaseImpl_1, Podcast_3;
    var AudioPlayerDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_1_1) {
                DialogBaseImpl_1 = DialogBaseImpl_1_1;
            },
            function (Podcast_3_1) {
                Podcast_3 = Podcast_3_1;
            }],
        execute: function() {
            console.log("AudioPlayerDlgImpl.ts");
            AudioPlayerDlgImpl = (function (_super) {
                __extends(AudioPlayerDlgImpl, _super);
                function AudioPlayerDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "AudioPlayerDlg");
                    this.build = function () {
                        throw "onclicks, not defined";
                    };
                    this.closeEvent = function () {
                        Podcast_3.podcast.destroyPlayer(null);
                    };
                    this.closeBtn = function () {
                        Podcast_3.podcast.destroyPlayer(_this);
                    };
                    this.init = function () {
                    };
                    this.sourceUrl = args.sourceUrl;
                    this.nodeUid = args.nodeUid;
                    this.startTimePending = args.startTimePending;
                    console.log("startTimePending in constructor: " + this.startTimePending);
                    Podcast_3.podcast.startTimePending = this.startTimePending;
                }
                AudioPlayerDlgImpl.prototype.cancel = function () {
                    _super.prototype.cancel.call(this);
                    var player = $("#" + this.id("audioPlayer"));
                    if (player && player.length > 0) {
                        player[0].pause();
                        player.remove();
                    }
                };
                return AudioPlayerDlgImpl;
            }(DialogBaseImpl_1.DialogBaseImpl));
            exports_44("default", AudioPlayerDlgImpl);
        }
    }
});
System.register("ChangePasswordDlgImpl", ["DialogBaseImpl", "Render", "Factory", "Util"], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var DialogBaseImpl_2, Render_10, Factory_11, Util_15;
    var ChangePasswordDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_2_1) {
                DialogBaseImpl_2 = DialogBaseImpl_2_1;
            },
            function (Render_10_1) {
                Render_10 = Render_10_1;
            },
            function (Factory_11_1) {
                Factory_11 = Factory_11_1;
            },
            function (Util_15_1) {
                Util_15 = Util_15_1;
            }],
        execute: function() {
            console.log("ChangePasswordDlgImpl.ts");
            ChangePasswordDlgImpl = (function (_super) {
                __extends(ChangePasswordDlgImpl, _super);
                function ChangePasswordDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "ChangePasswordDlg");
                    this.build = function () {
                        var header = _this.makeHeader(_this.passCode ? "Password Reset" : "Change Password");
                        var message = Render_10.render.tag("p", {}, "Enter your new password below...");
                        var formControls = _this.makePasswordField("New Password", "changePassword1");
                        var changePasswordButton = _this.makeCloseButton("Change Password", "changePasswordActionButton", _this.changePassword, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelChangePasswordButton");
                        var buttonBar = Render_10.render.centeredButtonBar(changePasswordButton + backButton);
                        return header + message + formControls + buttonBar;
                    };
                    this.changePassword = function () {
                        _this.pwd = _this.getInputVal("changePassword1").trim();
                        if (_this.pwd && _this.pwd.length >= 4) {
                            Util_15.util.json("changePassword", {
                                "newPassword": _this.pwd,
                                "passCode": _this.passCode
                            }, _this.changePasswordResponse, _this);
                        }
                        else {
                            Util_15.util.showMessage("Invalid password(s).");
                        }
                    };
                    this.changePasswordResponse = function (res) {
                        if (Util_15.util.checkSuccess("Change password", res)) {
                            var msg = "Password changed successfully.";
                            if (_this.passCode) {
                                msg += "<p>You may now login as <b>" + res.user
                                    + "</b> with your new password.";
                            }
                            var thiz_1 = _this;
                            Factory_11.Factory.create("MessageDlg", function (dlg) {
                                dlg.open();
                            }, {
                                "title": "Password Change", callback: function () {
                                    if (thiz_1.passCode) {
                                        window.location.href = window.location.origin;
                                    }
                                }
                            });
                        }
                    };
                    this.init = function () {
                        _this.focus("changePassword1");
                    };
                    this.passCode = args.passCode;
                }
                return ChangePasswordDlgImpl;
            }(DialogBaseImpl_2.DialogBaseImpl));
            exports_45("default", ChangePasswordDlgImpl);
        }
    }
});
System.register("ConfirmDlgImpl", ["DialogBaseImpl", "Render"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var DialogBaseImpl_3, Render_11;
    var ConfirmDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_3_1) {
                DialogBaseImpl_3 = DialogBaseImpl_3_1;
            },
            function (Render_11_1) {
                Render_11 = Render_11_1;
            }],
        execute: function() {
            console.log("ConfirmDlgImpl.ts");
            ConfirmDlgImpl = (function (_super) {
                __extends(ConfirmDlgImpl, _super);
                function ConfirmDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "ConfirmDlg");
                    this.build = function () {
                        var content = _this.makeHeader("", "ConfirmDlgTitle") + _this.makeMessageArea("", "ConfirmDlgMessage");
                        content = Render_11.render.centerContent(content, 300);
                        var buttons = _this.makeCloseButton("Yes", "ConfirmDlgYesButton", _this.yesCallback)
                            + _this.makeCloseButton("No", "ConfirmDlgNoButton", _this.noCallback);
                        content += Render_11.render.centeredButtonBar(buttons);
                        return content;
                    };
                    this.init = function () {
                        _this.setHtml(_this.title, "ConfirmDlgTitle");
                        _this.setHtml(_this.message, "ConfirmDlgMessage");
                        _this.setHtml(_this.buttonText, "ConfirmDlgYesButton");
                    };
                    this.title = args.title;
                    this.message = args.message;
                    this.buttonText = args.buttonText;
                    this.yesCallback = args.yesCallback;
                    this.noCallback = args.noCallback;
                }
                return ConfirmDlgImpl;
            }(DialogBaseImpl_3.DialogBaseImpl));
            exports_46("default", ConfirmDlgImpl);
        }
    }
});
System.register("CreateNodeDlgImpl", ["DialogBaseImpl", "Render", "Meta64", "Edit"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var DialogBaseImpl_4, Render_12, Meta64_14, Edit_7;
    var CreateNodeDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_4_1) {
                DialogBaseImpl_4 = DialogBaseImpl_4_1;
            },
            function (Render_12_1) {
                Render_12 = Render_12_1;
            },
            function (Meta64_14_1) {
                Meta64_14 = Meta64_14_1;
            },
            function (Edit_7_1) {
                Edit_7 = Edit_7_1;
            }],
        execute: function() {
            console.log("CreateNodeDlgImpl.ts");
            CreateNodeDlgImpl = (function (_super) {
                __extends(CreateNodeDlgImpl, _super);
                function CreateNodeDlgImpl() {
                    var _this = this;
                    _super.call(this, "CreateNodeDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Create New Node");
                        var createFirstChildButton = _this.makeCloseButton("First", "createFirstChildButton", _this.createFirstChild, _this, true, 1000);
                        var createLastChildButton = _this.makeCloseButton("Last", "createLastChildButton", _this.createLastChild, _this);
                        var createInlineButton = _this.makeCloseButton("Inline", "createInlineButton", _this.createInline, _this);
                        var backButton = _this.makeCloseButton("Cancel", "cancelButton");
                        var buttonBar = Render_12.render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);
                        var content = "";
                        var typeIdx = 0;
                        content += _this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
                        content += _this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
                        content += _this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);
                        var listBox = Render_12.render.tag("div", {
                            "class": "listBox"
                        }, content);
                        var mainContent = listBox;
                        var centeredHeader = Render_12.render.tag("div", {
                            "class": "centeredTitle"
                        }, header);
                        return centeredHeader + mainContent + buttonBar;
                    };
                    this.createFirstChild = function () {
                        if (!_this.lastSelTypeName) {
                            alert("choose a type.");
                            return;
                        }
                        Edit_7.edit.createSubNode(null, _this.lastSelTypeName, true);
                    };
                    this.createLastChild = function () {
                        if (!_this.lastSelTypeName) {
                            alert("choose a type.");
                            return;
                        }
                        Edit_7.edit.createSubNode(null, _this.lastSelTypeName, false);
                    };
                    this.createInline = function () {
                        if (!_this.lastSelTypeName) {
                            alert("choose a type.");
                            return;
                        }
                        Edit_7.edit.insertNode(null, _this.lastSelTypeName);
                    };
                    this.onRowClick = function (payload) {
                        var divId = _this.id("typeRow" + payload.typeIdx);
                        _this.lastSelTypeName = payload.typeName;
                        if (_this.lastSelDomId) {
                            _this.el(_this.lastSelDomId).removeClass("selectedListItem");
                        }
                        _this.lastSelDomId = divId;
                        _this.el(divId).addClass("selectedListItem");
                    };
                    this.init = function () {
                        var node = Meta64_14.meta64.getHighlightedNode();
                        if (node) {
                            var canInsertInline = Meta64_14.meta64.homeNodeId != node.id;
                            if (canInsertInline) {
                                _this.el("createInlineButton").show();
                            }
                            else {
                                _this.el("createInlineButton").hide();
                            }
                        }
                    };
                }
                CreateNodeDlgImpl.prototype.makeListItem = function (val, typeName, typeIdx, initiallySelected) {
                    var payload = {
                        "typeName": typeName,
                        "typeIdx": typeIdx
                    };
                    var divId = this.id("typeRow" + typeIdx);
                    if (initiallySelected) {
                        this.lastSelTypeName = typeName;
                        this.lastSelDomId = divId;
                    }
                    return Render_12.render.tag("div", {
                        "class": "listItem" + (initiallySelected ? " selectedListItem" : ""),
                        "id": divId,
                        "onclick": Meta64_14.meta64.encodeOnClick(this.onRowClick, this, payload)
                    }, val);
                };
                return CreateNodeDlgImpl;
            }(DialogBaseImpl_4.DialogBaseImpl));
            exports_47("default", CreateNodeDlgImpl);
        }
    }
});
System.register("EditPropertyDlg", [], function(exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    return {
        setters:[],
        execute: function() {
            console.log("EditPropertyDlg.ts");
        }
    }
});
System.register("EditNodeDlgImpl", ["Interfaces", "DialogBaseImpl", "Render", "Factory", "Constants", "Edit", "View", "Props", "Util", "Meta64"], function(exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var I, DialogBaseImpl_5, Render_13, Factory_12, Constants_7, Edit_8, View_9, Props_6, Util_16, Meta64_15;
    var EditNodeDlgImpl;
    return {
        setters:[
            function (I_2) {
                I = I_2;
            },
            function (DialogBaseImpl_5_1) {
                DialogBaseImpl_5 = DialogBaseImpl_5_1;
            },
            function (Render_13_1) {
                Render_13 = Render_13_1;
            },
            function (Factory_12_1) {
                Factory_12 = Factory_12_1;
            },
            function (Constants_7_1) {
                Constants_7 = Constants_7_1;
            },
            function (Edit_8_1) {
                Edit_8 = Edit_8_1;
            },
            function (View_9_1) {
                View_9 = View_9_1;
            },
            function (Props_6_1) {
                Props_6 = Props_6_1;
            },
            function (Util_16_1) {
                Util_16 = Util_16_1;
            },
            function (Meta64_15_1) {
                Meta64_15 = Meta64_15_1;
            }],
        execute: function() {
            console.log("EditNodeDlgImpl.ts");
            EditNodeDlgImpl = (function (_super) {
                __extends(EditNodeDlgImpl, _super);
                function EditNodeDlgImpl(args) {
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
                        var deletePropButton = _this.makeButton("Delete", "deletePropButton", _this.deletePropertyButtonClick, _this);
                        var cancelEditButton = _this.makeCloseButton("Close", "cancelEditButton", _this.cancelEdit, _this);
                        var buttonBar = Render_13.render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton + deletePropButton
                            + splitContentButton + cancelEditButton, "buttons");
                        var width = 800;
                        var height = 600;
                        var internalMainContent = "";
                        if (Constants_7.cnst.SHOW_PATH_IN_DLGS) {
                            internalMainContent += Render_13.render.tag("div", {
                                id: _this.id("editNodePathDisplay"),
                                "class": "path-display-in-editor"
                            });
                        }
                        internalMainContent += Render_13.render.tag("div", {
                            id: _this.id("editNodeInstructions")
                        }) + Render_13.render.tag("div", {
                            id: _this.id("propertyEditFieldContainer"),
                            style: "padding-left: 0px; max-width:" + width + "px;height:" + height + "px;width:100%; overflow:scroll; border:4px solid lightGray;",
                            class: "vertical-layout-row"
                        }, "Loading...");
                        return header + internalMainContent + buttonBar;
                    };
                    this.populateEditNodePg = function () {
                        View_9.view.initEditPathDisplayById(_this.id("editNodePathDisplay"));
                        var fields = "";
                        var counter = 0;
                        _this.fieldIdToPropMap = {};
                        _this.propEntries = new Array();
                        if (Edit_8.edit.editNode) {
                            console.log("Editing existing node.");
                            var thiz = _this;
                            var editOrderedProps = Props_6.props.getPropertiesInEditingOrder(Edit_8.edit.editNode, Edit_8.edit.editNode.properties);
                            var aceFields = [];
                            $.each(editOrderedProps, function (index, prop) {
                                if (!Render_13.render.allowPropertyToDisplay(prop.name)) {
                                    console.log("Hiding property: " + prop.name);
                                    return;
                                }
                                var fieldId = thiz.id("editNodeTextContent" + index);
                                console.log("Creating edit field " + fieldId + " for property " + prop.name);
                                var isMulti = prop.values && prop.values.length > 0;
                                var isReadOnlyProp = Render_13.render.isReadOnlyProperty(prop.name);
                                var isBinaryProp = Render_13.render.isBinaryProperty(prop.name);
                                var propEntry = new I.PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);
                                thiz.fieldIdToPropMap[fieldId] = propEntry;
                                thiz.propEntries.push(propEntry);
                                var field = "";
                                if (isMulti) {
                                    field += thiz.makeMultiPropEditor(propEntry);
                                }
                                else {
                                    field += thiz.makeSinglePropEditor(propEntry, aceFields);
                                }
                                fields += Render_13.render.tag("div", {
                                    "class": ((!isReadOnlyProp && !isBinaryProp) || Edit_8.edit.showReadOnlyProperties ? "propertyEditListItem"
                                        : "propertyEditListItemHidden")
                                }, field);
                            });
                        }
                        else {
                            console.log("Editing new node.");
                            if (Constants_7.cnst.USE_ACE_EDITOR) {
                                var aceFieldId = _this.id("newNodeNameId");
                                fields += Render_13.render.tag("div", {
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
                                var field = Render_13.render.tag("paper-textarea", {
                                    "id": _this.id("newNodeNameId"),
                                    "label": "New Node Name"
                                }, '', true);
                                fields += Render_13.render.tag("div", { "display": "table-row" }, field);
                            }
                        }
                        var propTable = Render_13.render.tag("div", {
                            "display": "table",
                        }, fields);
                        Util_16.util.setHtml(_this.id("propertyEditFieldContainer"), propTable);
                        if (Constants_7.cnst.USE_ACE_EDITOR) {
                            for (var i = 0; i < aceFields.length; i++) {
                                var editor = ace.edit(aceFields[i].id);
                                editor.setValue(Util_16.util.unencodeHtml(aceFields[i].val));
                                Meta64_15.meta64.aceEditorsById[aceFields[i].id] = editor;
                            }
                        }
                        var instr = Edit_8.edit.editingUnsavedNode ?
                            "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                            :
                                "";
                        _this.el("editNodeInstructions").html(instr);
                        Util_16.util.setVisibility("#" + _this.id("addPropertyButton"), !Edit_8.edit.editingUnsavedNode);
                        var tagsPropExists = Props_6.props.getNodePropertyVal("tags", Edit_8.edit.editNode) != null;
                        Util_16.util.setVisibility("#" + _this.id("addTagsPropertyButton"), !tagsPropExists);
                    };
                    this.toggleShowReadOnly = function () {
                    };
                    this.addProperty = function () {
                        Factory_12.Factory.create("EditPropertyDlg", function (dlg) {
                            _this.editPropertyDlgInst = dlg;
                            _this.editPropertyDlgInst.open();
                        }, { "EditNodeDlgInstance": _this });
                    };
                    this.addTagsProperty = function () {
                        if (Props_6.props.getNodePropertyVal(Edit_8.edit.editNode, "tags")) {
                            return;
                        }
                        var postData = {
                            nodeId: Edit_8.edit.editNode.id,
                            propertyName: "tags",
                            propertyValue: ""
                        };
                        Util_16.util.json("saveProperty", postData, _this.addTagsPropertyResponse, _this);
                    };
                    this.addTagsPropertyResponse = function (res) {
                        if (Util_16.util.checkSuccess("Add Tags Property", res)) {
                            _this.savePropertyResponse(res);
                        }
                    };
                    this.savePropertyResponse = function (res) {
                        Util_16.util.checkSuccess("Save properties", res);
                        Edit_8.edit.editNode.properties.push(res.propertySaved);
                        Meta64_15.meta64.treeDirty = true;
                        _this.populateEditNodePg();
                    };
                    this.addSubProperty = function (fieldId) {
                        var prop = _this.fieldIdToPropMap[fieldId].property;
                        var isMulti = Util_16.util.isObject(prop.values);
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
                        Factory_12.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm Delete", "message": "Delete the Property: " + propName,
                            "buttonText": "Yes, delete.", "yesCallback": function () {
                                thiz.deletePropertyImmediate(propName);
                            }
                        });
                    };
                    this.deletePropertyImmediate = function (propName) {
                        var thiz = _this;
                        Util_16.util.json("deleteProperty", {
                            "nodeId": Edit_8.edit.editNode.id,
                            "propName": propName
                        }, function (res) {
                            thiz.deletePropertyResponse(res, propName);
                        });
                    };
                    this.deletePropertyResponse = function (res, propertyToDelete) {
                        if (Util_16.util.checkSuccess("Delete property", res)) {
                            Props_6.props.deletePropertyFromLocalData(propertyToDelete);
                            Meta64_15.meta64.treeDirty = true;
                            _this.populateEditNodePg();
                        }
                    };
                    this.clearProperty = function (fieldId) {
                        if (!Constants_7.cnst.USE_ACE_EDITOR) {
                            Util_16.util.setInputVal(_this.id(fieldId), "");
                        }
                        else {
                            var editor = Meta64_15.meta64.aceEditorsById[_this.id(fieldId)];
                            if (editor) {
                                editor.setValue("");
                            }
                        }
                        var counter = 0;
                        while (counter < 1000) {
                            if (!Constants_7.cnst.USE_ACE_EDITOR) {
                                if (!Util_16.util.setInputVal(_this.id(fieldId + "_subProp" + counter), "")) {
                                    break;
                                }
                            }
                            else {
                                var editor = Meta64_15.meta64.aceEditorsById[_this.id(fieldId + "_subProp" + counter)];
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
                        if (Edit_8.edit.editingUnsavedNode) {
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
                            newNodeName = Util_16.util.getInputVal(_this.id("newNodeNameId"));
                        }
                        if (Meta64_15.meta64.userName != Edit_8.edit.parentOfNewNode.createdBy &&
                            Edit_8.edit.parentOfNewNode.createdBy != "admin") {
                            Edit_8.edit.sendNotificationPendingSave = true;
                        }
                        Meta64_15.meta64.treeDirty = true;
                        if (Edit_8.edit.nodeInsertTarget) {
                            Util_16.util.json("insertNode", {
                                "parentId": Edit_8.edit.parentOfNewNode.id,
                                "targetName": Edit_8.edit.nodeInsertTarget.name,
                                "newNodeName": newNodeName,
                                "typeName": _this.typeName ? _this.typeName : "nt:unstructured"
                            }, Edit_8.edit.insertNodeResponse, Edit_8.edit);
                        }
                        else {
                            Util_16.util.json("createSubNode", {
                                "nodeId": Edit_8.edit.parentOfNewNode.id,
                                "newNodeName": newNodeName,
                                "typeName": _this.typeName ? _this.typeName : "nt:unstructured",
                                "createAtTop": _this.createAtTop
                            }, Edit_8.edit.createSubNodeResponse, Edit_8.edit);
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
                                if (Constants_7.cnst.USE_ACE_EDITOR) {
                                    var editor = Meta64_15.meta64.aceEditorsById[prop.id];
                                    if (!editor)
                                        throw "Unable to find Ace Editor for ID: " + prop.id;
                                    propVal = editor.getValue();
                                }
                                else {
                                    propVal = Util_16.util.getTextAreaValById(prop.id);
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
                                    if (Constants_7.cnst.USE_ACE_EDITOR) {
                                        var editor = Meta64_15.meta64.aceEditorsById[subProp.id];
                                        if (!editor)
                                            throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                                        propVal = editor.getValue();
                                    }
                                    else {
                                        propVal = Util_16.util.getTextAreaValById(subProp.id);
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
                                nodeId: Edit_8.edit.editNode.id,
                                properties: propertiesList,
                                sendNotification: Edit_8.edit.sendNotificationPendingSave
                            };
                            console.log("calling saveNode(). PostData=" + Util_16.util.toJson(postData));
                            Util_16.util.json("saveNode", postData, Edit_8.edit.saveNodeResponse, null, {
                                savedId: Edit_8.edit.editNode.id
                            });
                            Edit_8.edit.sendNotificationPendingSave = false;
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
                            propValStr = Util_16.util.escapeForAttrib(propVal);
                            var label = (i == 0 ? propEntry.property.name : "*") + "." + i;
                            console.log("Creating textarea with id=" + id);
                            var subProp = new I.SubProp(id, propVal);
                            propEntry.subProps.push(subProp);
                            if (propEntry.binary || propEntry.readOnly) {
                                fields += Render_13.render.tag("paper-textarea", {
                                    "id": id,
                                    "readonly": "readonly",
                                    "disabled": "disabled",
                                    "label": label,
                                    "value": propValStr
                                }, '', true);
                            }
                            else {
                                fields += Render_13.render.tag("paper-textarea", {
                                    "id": id,
                                    "label": label,
                                    "value": propValStr
                                }, '', true);
                            }
                        }
                        var col = Render_13.render.tag("div", {
                            "style": "display: table-cell;"
                        }, fields);
                        return col;
                    };
                    this.makeSinglePropEditor = function (propEntry, aceFields) {
                        console.log("Property single-type: " + propEntry.property.name);
                        var field = "";
                        var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
                        var label = Render_13.render.sanitizePropertyName(propEntry.property.name);
                        var propValStr = propVal ? propVal : '';
                        propValStr = Util_16.util.escapeForAttrib(propValStr);
                        console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
                            + "] fieldId=" + propEntry.id);
                        var propSelCheckbox = "";
                        if (propEntry.readOnly || propEntry.binary) {
                            field += Render_13.render.tag("paper-textarea", {
                                "id": propEntry.id,
                                "readonly": "readonly",
                                "disabled": "disabled",
                                "label": label,
                                "value": propValStr
                            }, "", true);
                        }
                        else {
                            propSelCheckbox = _this.makeCheckBox("", "selProp_" + propEntry.id, false);
                            if (propEntry.property.name == Constants_7.jcrCnst.CONTENT) {
                                _this.contentFieldDomId = propEntry.id;
                            }
                            if (!Constants_7.cnst.USE_ACE_EDITOR) {
                                field += Render_13.render.tag("paper-textarea", {
                                    "id": propEntry.id,
                                    "label": label,
                                    "value": propValStr
                                }, '', true);
                            }
                            else {
                                field += Render_13.render.tag("div", {
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
                        var selCol = Render_13.render.tag("div", {
                            "style": "width: 40px; display: table-cell; padding: 10px;"
                        }, propSelCheckbox);
                        var editCol = Render_13.render.tag("div", {
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
                                    var selCheckbox = Util_16.util.polyElm(_this.id(selPropDomId));
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
                        var nodeBelow = Edit_8.edit.getNodeBelow(Edit_8.edit.editNode);
                        Util_16.util.json("splitNode", {
                            "nodeId": Edit_8.edit.editNode.id,
                            "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
                            "delimiter": null
                        }, _this.splitContentResponse);
                    };
                    this.splitContentResponse = function (res) {
                        if (Util_16.util.checkSuccess("Split content", res)) {
                            _this.cancel();
                            View_9.view.refreshTree(null, false);
                            Meta64_15.meta64.selectTab("mainTabName");
                            View_9.view.scrollToSelectedNode();
                        }
                    };
                    this.cancelEdit = function () {
                        _this.cancel();
                        if (Meta64_15.meta64.treeDirty) {
                            Meta64_15.meta64.goToMainPage(true);
                        }
                        else {
                            Meta64_15.meta64.selectTab("mainTabName");
                            View_9.view.scrollToSelectedNode();
                        }
                    };
                    this.init = function () {
                        console.log("EditNodeDlg.init");
                        _this.populateEditNodePg();
                        if (_this.contentFieldDomId) {
                            Util_16.util.delayedFocus("#" + _this.contentFieldDomId);
                        }
                    };
                    this.typeName = args.typeName;
                    this.createAtTop = args.createAtTop;
                    this.fieldIdToPropMap = {};
                    this.propEntries = new Array();
                }
                return EditNodeDlgImpl;
            }(DialogBaseImpl_5.DialogBaseImpl));
            exports_49("default", EditNodeDlgImpl);
        }
    }
});
System.register("EditPropertyDlgImpl", ["DialogBaseImpl", "Constants", "Render", "View", "Util", "Edit", "Meta64"], function(exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var DialogBaseImpl_6, Constants_8, Render_14, View_10, Util_17, Edit_9, Meta64_16;
    var EditPropertyDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_6_1) {
                DialogBaseImpl_6 = DialogBaseImpl_6_1;
            },
            function (Constants_8_1) {
                Constants_8 = Constants_8_1;
            },
            function (Render_14_1) {
                Render_14 = Render_14_1;
            },
            function (View_10_1) {
                View_10 = View_10_1;
            },
            function (Util_17_1) {
                Util_17 = Util_17_1;
            },
            function (Edit_9_1) {
                Edit_9 = Edit_9_1;
            },
            function (Meta64_16_1) {
                Meta64_16 = Meta64_16_1;
            }],
        execute: function() {
            console.log("EditPropertyDlgImpl.ts");
            EditPropertyDlgImpl = (function (_super) {
                __extends(EditPropertyDlgImpl, _super);
                function EditPropertyDlgImpl(editNodeDlg) {
                    var _this = this;
                    _super.call(this, "EditPropertyDlg");
                    this.editNodeDlg = editNodeDlg;
                    this.build = function () {
                        var header = _this.makeHeader("Edit Node Property");
                        var savePropertyButton = _this.makeCloseButton("Save", "savePropertyButton", _this.saveProperty, _this);
                        var cancelEditButton = _this.makeCloseButton("Cancel", "editPropertyPgCloseButton");
                        var buttonBar = Render_14.render.centeredButtonBar(savePropertyButton + cancelEditButton);
                        var internalMainContent = "";
                        if (Constants_8.cnst.SHOW_PATH_IN_DLGS) {
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
                            field += Render_14.render.tag("paper-textarea", {
                                "name": fieldPropNameId,
                                "id": _this.id(fieldPropNameId),
                                "placeholder": "Enter property name",
                                "label": "Name"
                            }, "", true);
                        }
                        {
                            var fieldPropValueId = "addPropertyValueTextContent";
                            field += Render_14.render.tag("paper-textarea", {
                                "name": fieldPropValueId,
                                "id": _this.id(fieldPropValueId),
                                "placeholder": "Enter property text",
                                "label": "Value"
                            }, "", true);
                        }
                        View_10.view.initEditPathDisplayById(_this.id("editPropertyPathDisplay"));
                        Util_17.util.setHtml(_this.id("addPropertyFieldContainer"), field);
                    };
                    this.saveProperty = function () {
                        var propertyNameData = Util_17.util.getInputVal(_this.id("addPropertyNameTextContent"));
                        var propertyValueData = Util_17.util.getInputVal(_this.id("addPropertyValueTextContent"));
                        var postData = {
                            nodeId: Edit_9.edit.editNode.id,
                            propertyName: propertyNameData,
                            propertyValue: propertyValueData
                        };
                        Util_17.util.json("saveProperty", postData, _this.savePropertyResponse, _this);
                    };
                    this.savePropertyResponse = function (res) {
                        Util_17.util.checkSuccess("Save properties", res);
                        Edit_9.edit.editNode.properties.push(res.propertySaved);
                        Meta64_16.meta64.treeDirty = true;
                        _this.editNodeDlg.populateEditNodePg();
                    };
                    this.init = function () {
                        _this.populatePropertyEdit();
                    };
                }
                return EditPropertyDlgImpl;
            }(DialogBaseImpl_6.DialogBaseImpl));
            exports_50("default", EditPropertyDlgImpl);
        }
    }
});
System.register("EditSystemFileDlg", [], function(exports_51, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    return {
        setters:[],
        execute: function() {
            console.log("EditSystemFileDlg.ts");
        }
    }
});
System.register("EditSystemFileDlgImpl", ["DialogBaseImpl"], function(exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    var DialogBaseImpl_7;
    var EditSystemFileDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_7_1) {
                DialogBaseImpl_7 = DialogBaseImpl_7_1;
            }],
        execute: function() {
            console.log("EditSystemFileDlgImpl.ts");
            EditSystemFileDlgImpl = (function (_super) {
                __extends(EditSystemFileDlgImpl, _super);
                function EditSystemFileDlgImpl() {
                    _super.apply(this, arguments);
                }
                return EditSystemFileDlgImpl;
            }(DialogBaseImpl_7.DialogBaseImpl));
            exports_52("default", EditSystemFileDlgImpl);
        }
    }
});
System.register("ExportDlgImpl", ["DialogBaseImpl"], function(exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    var DialogBaseImpl_8;
    var ExportDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_8_1) {
                DialogBaseImpl_8 = DialogBaseImpl_8_1;
            }],
        execute: function() {
            console.log("ExportDlgImpl.ts");
            ExportDlgImpl = (function (_super) {
                __extends(ExportDlgImpl, _super);
                function ExportDlgImpl() {
                    _super.apply(this, arguments);
                }
                return ExportDlgImpl;
            }(DialogBaseImpl_8.DialogBaseImpl));
            exports_53("default", ExportDlgImpl);
        }
    }
});
System.register("ImportDlgImpl", ["DialogBaseImpl"], function(exports_54, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var DialogBaseImpl_9;
    var ImportDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_9_1) {
                DialogBaseImpl_9 = DialogBaseImpl_9_1;
            }],
        execute: function() {
            console.log("ImportDlgImpl.ts");
            ImportDlgImpl = (function (_super) {
                __extends(ImportDlgImpl, _super);
                function ImportDlgImpl() {
                    _super.apply(this, arguments);
                }
                return ImportDlgImpl;
            }(DialogBaseImpl_9.DialogBaseImpl));
            exports_54("default", ImportDlgImpl);
        }
    }
});
System.register("ResetPasswordDlg", [], function(exports_55, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("LoginDlgImpl", ["DialogBaseImpl", "Render", "User", "Constants", "Factory"], function(exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    var DialogBaseImpl_10, Render_15, User_5, Constants_9, Factory_13;
    var LoginDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_10_1) {
                DialogBaseImpl_10 = DialogBaseImpl_10_1;
            },
            function (Render_15_1) {
                Render_15 = Render_15_1;
            },
            function (User_5_1) {
                User_5 = User_5_1;
            },
            function (Constants_9_1) {
                Constants_9 = Constants_9_1;
            },
            function (Factory_13_1) {
                Factory_13 = Factory_13_1;
            }],
        execute: function() {
            console.log("LoginDlg.ts");
            LoginDlgImpl = (function (_super) {
                __extends(LoginDlgImpl, _super);
                function LoginDlgImpl(paramsTest) {
                    var _this = this;
                    _super.call(this, "LoginDlgImpl");
                    this.build = function () {
                        var header = _this.makeHeader("Login");
                        var formControls = _this.makeEditField("User", "userName") +
                            _this.makePasswordField("Password", "password");
                        var loginButton = _this.makeButton("Login", "loginButton", _this.login, _this);
                        var resetPasswordButton = _this.makeButton("Forgot Password", "resetPasswordButton", _this.resetPassword, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelLoginButton");
                        var buttonBar = Render_15.render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
                        var divider = "<div><h3>Or Login With...</h3></div>";
                        var form = formControls + buttonBar;
                        var mainContent = form;
                        var content = header + mainContent;
                        _this.bindEnterKey("userName", User_5.user.login);
                        _this.bindEnterKey("password", User_5.user.login);
                        return content;
                    };
                    this.init = function () {
                        _this.populateFromCookies();
                    };
                    this.populateFromCookies = function () {
                        var usr = $.cookie(Constants_9.cnst.COOKIE_LOGIN_USR);
                        var pwd = $.cookie(Constants_9.cnst.COOKIE_LOGIN_PWD);
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
                        User_5.user.login(_this, usr, pwd);
                    };
                    this.resetPassword = function () {
                        var thiz = _this;
                        var usr = _this.getInputVal("userName");
                        Factory_13.Factory.create("ConfirmDlg", function (dlg) {
                            dlg.open();
                        }, {
                            "title": "Confirm Reset Password",
                            "message": "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
                            "buttonText": "Yes, reset.", "yesCallback": function () {
                                thiz.cancel();
                                Factory_13.Factory.create("ResetPasswordDlg", function (dlg) {
                                    dlg.open();
                                }, { "user": usr });
                            }
                        });
                    };
                }
                return LoginDlgImpl;
            }(DialogBaseImpl_10.DialogBaseImpl));
            exports_56("default", LoginDlgImpl);
        }
    }
});
System.register("ManageAccountDlgImpl", ["DialogBaseImpl", "Render", "Meta64"], function(exports_57, context_57) {
    "use strict";
    var __moduleName = context_57 && context_57.id;
    var DialogBaseImpl_11, Render_16, Meta64_17;
    var ManageAccountDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_11_1) {
                DialogBaseImpl_11 = DialogBaseImpl_11_1;
            },
            function (Render_16_1) {
                Render_16 = Render_16_1;
            },
            function (Meta64_17_1) {
                Meta64_17 = Meta64_17_1;
            }],
        execute: function() {
            console.log("ManageAccountDlgImpl.ts");
            ManageAccountDlgImpl = (function (_super) {
                __extends(ManageAccountDlgImpl, _super);
                function ManageAccountDlgImpl() {
                    var _this = this;
                    _super.call(this, "ManageAccountDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Manage Account");
                        var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
                        var closeAccountButton = Meta64_17.meta64.isAdminUser ? "Admin Cannot Close Acount" : _this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");
                        var buttonBar = Render_16.render.centeredButtonBar(closeAccountButton);
                        var bottomButtonBar = Render_16.render.centeredButtonBar(backButton);
                        var bottomButtonBarDiv = Render_16.render.tag("div", {
                            "class": "close-account-bar"
                        }, bottomButtonBar);
                        return header + buttonBar + bottomButtonBarDiv;
                    };
                }
                return ManageAccountDlgImpl;
            }(DialogBaseImpl_11.DialogBaseImpl));
            exports_57("default", ManageAccountDlgImpl);
        }
    }
});
System.register("MessageDlgImpl", ["DialogBaseImpl", "Render"], function(exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    var DialogBaseImpl_12, Render_17;
    var MessageDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_12_1) {
                DialogBaseImpl_12 = DialogBaseImpl_12_1;
            },
            function (Render_17_1) {
                Render_17 = Render_17_1;
            }],
        execute: function() {
            console.log("MessageDlgImpl.ts");
            MessageDlgImpl = (function (_super) {
                __extends(MessageDlgImpl, _super);
                function MessageDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "MessageDlg");
                    this.build = function () {
                        var content = _this.makeHeader(_this.title) + "<p>" + _this.message + "</p>";
                        content += Render_17.render.centeredButtonBar(_this.makeCloseButton("Ok", "messageDlgOkButton", _this.callback));
                        return content;
                    };
                    if (!args.title) {
                        this.title = "Message";
                    }
                    this.title = args.title;
                    this.message = args.message;
                    this.callback = args.callback;
                }
                return MessageDlgImpl;
            }(DialogBaseImpl_12.DialogBaseImpl));
            exports_58("default", MessageDlgImpl);
        }
    }
});
System.register("PrefsDlgImpl", ["DialogBaseImpl", "Render", "Meta64", "Util"], function(exports_59, context_59) {
    "use strict";
    var __moduleName = context_59 && context_59.id;
    var DialogBaseImpl_13, Render_18, Meta64_18, Util_18;
    var PrefsDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_13_1) {
                DialogBaseImpl_13 = DialogBaseImpl_13_1;
            },
            function (Render_18_1) {
                Render_18 = Render_18_1;
            },
            function (Meta64_18_1) {
                Meta64_18 = Meta64_18_1;
            },
            function (Util_18_1) {
                Util_18 = Util_18_1;
            }],
        execute: function() {
            PrefsDlgImpl = (function (_super) {
                __extends(PrefsDlgImpl, _super);
                function PrefsDlgImpl() {
                    var _this = this;
                    _super.call(this, "PrefsDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Peferences");
                        var radioButtons = _this.makeRadioButton("Simple", "editModeSimple") +
                            _this.makeRadioButton("Advanced", "editModeAdvanced");
                        var radioButtonGroup = Render_18.render.tag("paper-radio-group", {
                            "id": _this.id("simpleModeRadioGroup"),
                            "selected": _this.id("editModeSimple")
                        }, radioButtons);
                        var showMetaDataCheckBox = _this.makeCheckBox("Show Row Metadata", "showMetaData", Meta64_18.meta64.showMetaData);
                        var checkboxBar = Render_18.render.makeHorzControlGroup(showMetaDataCheckBox);
                        var formControls = radioButtonGroup;
                        var legend = "<legend>Edit Mode:</legend>";
                        var radioBar = Render_18.render.makeHorzControlGroup(legend + formControls);
                        var saveButton = _this.makeCloseButton("Save", "savePreferencesButton", _this.savePreferences, _this);
                        var backButton = _this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
                        var buttonBar = Render_18.render.centeredButtonBar(saveButton + backButton);
                        return header + radioBar + checkboxBar + buttonBar;
                    };
                    this.savePreferences = function () {
                        var polyElm = Util_18.util.polyElm(_this.id("simpleModeRadioGroup"));
                        Meta64_18.meta64.editModeOption = polyElm.node.selected == _this.id("editModeSimple") ? Meta64_18.meta64.MODE_SIMPLE
                            : Meta64_18.meta64.MODE_ADVANCED;
                        var showMetaDataCheckbox = Util_18.util.polyElm(_this.id("showMetaData"));
                        Meta64_18.meta64.showMetaData = showMetaDataCheckbox.node.checked;
                        Util_18.util.json("saveUserPreferences", {
                            "userPreferences": {
                                "advancedMode": Meta64_18.meta64.editModeOption === Meta64_18.meta64.MODE_ADVANCED,
                                "editMode": Meta64_18.meta64.userPreferences.editMode,
                                "lastNode": null,
                                "importAllowed": false,
                                "exportAllowed": false,
                                "showMetaData": Meta64_18.meta64.showMetaData
                            }
                        }, _this.savePreferencesResponse, _this);
                    };
                    this.savePreferencesResponse = function (res) {
                        if (Util_18.util.checkSuccess("Saving Preferences", res)) {
                            Meta64_18.meta64.selectTab("mainTabName");
                            Meta64_18.meta64.refresh();
                        }
                    };
                    this.init = function () {
                        var polyElm = Util_18.util.polyElm(_this.id("simpleModeRadioGroup"));
                        polyElm.node.select(Meta64_18.meta64.editModeOption == Meta64_18.meta64.MODE_SIMPLE ? _this.id("editModeSimple") : _this
                            .id("editModeAdvanced"));
                        polyElm = Util_18.util.polyElm(_this.id("showMetaData"));
                        polyElm.node.checked = Meta64_18.meta64.showMetaData;
                        Polymer.dom.flush();
                    };
                }
                return PrefsDlgImpl;
            }(DialogBaseImpl_13.DialogBaseImpl));
            exports_59("default", PrefsDlgImpl);
        }
    }
});
System.register("ProgressDlgImpl", ["DialogBaseImpl", "Render"], function(exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    var DialogBaseImpl_14, Render_19;
    var ProgressDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_14_1) {
                DialogBaseImpl_14 = DialogBaseImpl_14_1;
            },
            function (Render_19_1) {
                Render_19 = Render_19_1;
            }],
        execute: function() {
            console.log("ProgressDlgImpl.ts");
            ProgressDlgImpl = (function (_super) {
                __extends(ProgressDlgImpl, _super);
                function ProgressDlgImpl() {
                    var _this = this;
                    _super.call(this, "ProgressDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Processing Request", "", true);
                        var progressBar = Render_19.render.tag("paper-progress", {
                            "indeterminate": "indeterminate",
                            "value": "800",
                            "min": "100",
                            "max": "1000"
                        });
                        var barContainer = Render_19.render.tag("div", {
                            "style": "width:280px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
                            "class": "horizontal center-justified layout"
                        }, progressBar);
                        return header + barContainer;
                    };
                }
                return ProgressDlgImpl;
            }(DialogBaseImpl_14.DialogBaseImpl));
            exports_60("default", ProgressDlgImpl);
        }
    }
});
System.register("RenameNodeDlgImpl", ["DialogBaseImpl", "Render", "Util", "Meta64", "Edit", "View"], function(exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    var DialogBaseImpl_15, Render_20, Util_19, Meta64_19, Edit_10, View_11;
    var RenameNodeDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_15_1) {
                DialogBaseImpl_15 = DialogBaseImpl_15_1;
            },
            function (Render_20_1) {
                Render_20 = Render_20_1;
            },
            function (Util_19_1) {
                Util_19 = Util_19_1;
            },
            function (Meta64_19_1) {
                Meta64_19 = Meta64_19_1;
            },
            function (Edit_10_1) {
                Edit_10 = Edit_10_1;
            },
            function (View_11_1) {
                View_11 = View_11_1;
            }],
        execute: function() {
            RenameNodeDlgImpl = (function (_super) {
                __extends(RenameNodeDlgImpl, _super);
                function RenameNodeDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "RenameNodeDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Rename Node");
                        var curNodeNameDisplay = "<h3 id='" + _this.id("curNodeNameDisplay") + "'></h3>";
                        var curNodePathDisplay = "<h4 class='path-display' id='" + _this.id("curNodePathDisplay") + "'></h4>";
                        var formControls = _this.makeEditField("Enter new name for the node", "newNodeNameEditField");
                        var renameNodeButton = _this.makeCloseButton("Rename", "renameNodeButton", _this.renameNode, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelRenameNodeButton");
                        var buttonBar = Render_20.render.centeredButtonBar(renameNodeButton + backButton);
                        return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
                    };
                    this.renameNode = function () {
                        var newName = _this.getInputVal("newNodeNameEditField");
                        if (Util_19.util.emptyString(newName)) {
                            Util_19.util.showMessage("Please enter a new node name.");
                            return;
                        }
                        var highlightNode = Meta64_19.meta64.getHighlightedNode();
                        if (!highlightNode) {
                            Util_19.util.showMessage("Select a node to rename.");
                            return;
                        }
                        var nodeBelow = Edit_10.edit.getNodeBelow(highlightNode);
                        var renamingRootNode = (highlightNode.id === Meta64_19.meta64.currentNodeId);
                        var thiz = _this;
                        Util_19.util.json("renameNode", {
                            "nodeId": highlightNode.id,
                            "newName": newName
                        }, function (res) {
                            thiz.renameNodeResponse(res, renamingRootNode);
                        });
                    };
                    this.renameNodeResponse = function (res, renamingPageRoot) {
                        if (Util_19.util.checkSuccess("Rename node", res)) {
                            if (renamingPageRoot) {
                                View_11.view.refreshTree(res.newId, true);
                            }
                            else {
                                View_11.view.refreshTree(null, false, res.newId);
                            }
                        }
                    };
                    this.init = function () {
                        var highlightNode = Meta64_19.meta64.getHighlightedNode();
                        if (!highlightNode) {
                            return;
                        }
                        $("#" + _this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
                        $("#" + _this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
                    };
                }
                return RenameNodeDlgImpl;
            }(DialogBaseImpl_15.DialogBaseImpl));
            exports_61("default", RenameNodeDlgImpl);
        }
    }
});
System.register("ResetPasswordDlgImpl", ["DialogBaseImpl", "Render", "Util"], function(exports_62, context_62) {
    "use strict";
    var __moduleName = context_62 && context_62.id;
    var DialogBaseImpl_16, Render_21, Util_20;
    var ResetPasswordDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_16_1) {
                DialogBaseImpl_16 = DialogBaseImpl_16_1;
            },
            function (Render_21_1) {
                Render_21 = Render_21_1;
            },
            function (Util_20_1) {
                Util_20 = Util_20_1;
            }],
        execute: function() {
            ResetPasswordDlgImpl = (function (_super) {
                __extends(ResetPasswordDlgImpl, _super);
                function ResetPasswordDlgImpl(args) {
                    var _this = this;
                    _super.call(this, "ResetPasswordDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Reset Password");
                        var message = _this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");
                        var formControls = _this.makeEditField("User", "userName") +
                            _this.makeEditField("Email Address", "emailAddress");
                        var resetPasswordButton = _this.makeCloseButton("Reset my Password", "resetPasswordButton", _this.resetPassword, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelResetPasswordButton");
                        var buttonBar = Render_21.render.centeredButtonBar(resetPasswordButton + backButton);
                        return header + message + formControls + buttonBar;
                    };
                    this.resetPassword = function () {
                        var userName = _this.getInputVal("userName").trim();
                        var emailAddress = _this.getInputVal("emailAddress").trim();
                        if (userName && emailAddress) {
                            Util_20.util.json("resetPassword", {
                                "user": userName,
                                "email": emailAddress
                            }, _this.resetPasswordResponse, _this);
                        }
                        else {
                            Util_20.util.showMessage("Oops. Try that again.");
                        }
                    };
                    this.resetPasswordResponse = function (res) {
                        if (Util_20.util.checkSuccess("Reset password", res)) {
                            Util_20.util.showMessage("Password reset email was sent. Check your inbox.");
                        }
                    };
                    this.init = function () {
                        if (_this.user) {
                            _this.setInputVal("userName", _this.user);
                        }
                    };
                    this.user = args.user;
                }
                return ResetPasswordDlgImpl;
            }(DialogBaseImpl_16.DialogBaseImpl));
            exports_62("default", ResetPasswordDlgImpl);
        }
    }
});
System.register("SearchContentDlgImpl", ["DialogBaseImpl", "Render", "Util", "Search", "Constants", "Meta64"], function(exports_63, context_63) {
    "use strict";
    var __moduleName = context_63 && context_63.id;
    var DialogBaseImpl_17, Render_22, Util_21, Search_6, Constants_10, Meta64_20;
    var SearchContentDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_17_1) {
                DialogBaseImpl_17 = DialogBaseImpl_17_1;
            },
            function (Render_22_1) {
                Render_22 = Render_22_1;
            },
            function (Util_21_1) {
                Util_21 = Util_21_1;
            },
            function (Search_6_1) {
                Search_6 = Search_6_1;
            },
            function (Constants_10_1) {
                Constants_10 = Constants_10_1;
            },
            function (Meta64_20_1) {
                Meta64_20 = Meta64_20_1;
            }],
        execute: function() {
            SearchContentDlgImpl = (function (_super) {
                __extends(SearchContentDlgImpl, _super);
                function SearchContentDlgImpl() {
                    var _this = this;
                    _super.call(this, "SearchContentDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Search Content");
                        var instructions = _this.makeMessageArea("Enter some text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
                        var formControls = _this.makeEditField("Search", "searchText");
                        var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchNodes, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
                        var buttonBar = Render_22.render.centeredButtonBar(searchButton + backButton);
                        var content = header + instructions + formControls + buttonBar;
                        _this.bindEnterKey("searchText", Search_6.srch.searchNodes);
                        return content;
                    };
                    this.searchNodes = function () {
                        return _this.searchProperty(Constants_10.jcrCnst.CONTENT);
                    };
                    this.searchProperty = function (searchProp) {
                        if (!Util_21.util.ajaxReady("searchNodes")) {
                            return;
                        }
                        var node = Meta64_20.meta64.getHighlightedNode();
                        if (!node) {
                            Util_21.util.showMessage("No node is selected to search under.");
                            return;
                        }
                        var searchText = _this.getInputVal("searchText");
                        if (Util_21.util.emptyString(searchText)) {
                            Util_21.util.showMessage("Enter search text.");
                            return;
                        }
                        Util_21.util.json("nodeSearch", {
                            "nodeId": node.id,
                            "searchText": searchText,
                            "sortDir": "",
                            "sortField": "",
                            "searchProp": searchProp
                        }, Search_6.srch.searchNodesResponse, Search_6.srch);
                    };
                    this.init = function () {
                        _this.focus("searchText");
                    };
                }
                return SearchContentDlgImpl;
            }(DialogBaseImpl_17.DialogBaseImpl));
            exports_63("default", SearchContentDlgImpl);
        }
    }
});
System.register("SearchFilesDlgImpl", ["DialogBaseImpl"], function(exports_64, context_64) {
    "use strict";
    var __moduleName = context_64 && context_64.id;
    var DialogBaseImpl_18;
    var SearchFilesDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_18_1) {
                DialogBaseImpl_18 = DialogBaseImpl_18_1;
            }],
        execute: function() {
            SearchFilesDlgImpl = (function (_super) {
                __extends(SearchFilesDlgImpl, _super);
                function SearchFilesDlgImpl() {
                    _super.apply(this, arguments);
                }
                return SearchFilesDlgImpl;
            }(DialogBaseImpl_18.DialogBaseImpl));
            exports_64("default", SearchFilesDlgImpl);
        }
    }
});
System.register("SearchTagsDlgImpl", ["DialogBaseImpl", "Search", "Render", "Constants", "Util", "Meta64"], function(exports_65, context_65) {
    "use strict";
    var __moduleName = context_65 && context_65.id;
    var DialogBaseImpl_19, Search_7, Render_23, Constants_11, Util_22, Meta64_21;
    var SearchTagsDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_19_1) {
                DialogBaseImpl_19 = DialogBaseImpl_19_1;
            },
            function (Search_7_1) {
                Search_7 = Search_7_1;
            },
            function (Render_23_1) {
                Render_23 = Render_23_1;
            },
            function (Constants_11_1) {
                Constants_11 = Constants_11_1;
            },
            function (Util_22_1) {
                Util_22 = Util_22_1;
            },
            function (Meta64_21_1) {
                Meta64_21 = Meta64_21_1;
            }],
        execute: function() {
            SearchTagsDlgImpl = (function (_super) {
                __extends(SearchTagsDlgImpl, _super);
                function SearchTagsDlgImpl() {
                    var _this = this;
                    _super.call(this, "SearchTagsDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Search Tags");
                        var instructions = _this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
                        var formControls = _this.makeEditField("Search", "searchText");
                        var searchButton = _this.makeCloseButton("Search", "searchNodesButton", _this.searchTags, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelSearchButton");
                        var buttonBar = Render_23.render.centeredButtonBar(searchButton + backButton);
                        var content = header + instructions + formControls + buttonBar;
                        _this.bindEnterKey("searchText", Search_7.srch.searchNodes);
                        return content;
                    };
                    this.searchTags = function () {
                        return _this.searchProperty(Constants_11.jcrCnst.TAGS);
                    };
                    this.searchProperty = function (searchProp) {
                        if (!Util_22.util.ajaxReady("searchNodes")) {
                            return;
                        }
                        var node = Meta64_21.meta64.getHighlightedNode();
                        if (!node) {
                            Util_22.util.showMessage("No node is selected to search under.");
                            return;
                        }
                        var searchText = _this.getInputVal("searchText");
                        if (Util_22.util.emptyString(searchText)) {
                            Util_22.util.showMessage("Enter search text.");
                            return;
                        }
                        Util_22.util.json("nodeSearch", {
                            "nodeId": node.id,
                            "searchText": searchText,
                            "sortDir": "",
                            "sortField": "",
                            "searchProp": searchProp
                        }, Search_7.srch.searchNodesResponse, Search_7.srch);
                    };
                    this.init = function () {
                        Util_22.util.delayedFocus(_this.id("searchText"));
                    };
                }
                return SearchTagsDlgImpl;
            }(DialogBaseImpl_19.DialogBaseImpl));
            exports_65("default", SearchTagsDlgImpl);
        }
    }
});
System.register("ShareToPersonDlg", [], function(exports_66, context_66) {
    "use strict";
    var __moduleName = context_66 && context_66.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("ShareToPersonDlgImpl", ["DialogBaseImpl", "Share", "Util", "Render", "Meta64", "Factory"], function(exports_67, context_67) {
    "use strict";
    var __moduleName = context_67 && context_67.id;
    var DialogBaseImpl_20, Share_2, Util_23, Render_24, Meta64_22, Factory_14;
    var ShareToPersonDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_20_1) {
                DialogBaseImpl_20 = DialogBaseImpl_20_1;
            },
            function (Share_2_1) {
                Share_2 = Share_2_1;
            },
            function (Util_23_1) {
                Util_23 = Util_23_1;
            },
            function (Render_24_1) {
                Render_24 = Render_24_1;
            },
            function (Meta64_22_1) {
                Meta64_22 = Meta64_22_1;
            },
            function (Factory_14_1) {
                Factory_14 = Factory_14_1;
            }],
        execute: function() {
            ShareToPersonDlgImpl = (function (_super) {
                __extends(ShareToPersonDlgImpl, _super);
                function ShareToPersonDlgImpl() {
                    var _this = this;
                    _super.call(this, "ShareToPersonDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Share Node to Person");
                        var formControls = _this.makeEditField("User to Share With", "shareToUserName");
                        var shareButton = _this.makeCloseButton("Share", "shareNodeToPersonButton", _this.shareNodeToPerson, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
                        var buttonBar = Render_24.render.centeredButtonBar(shareButton + backButton);
                        return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                            + buttonBar;
                    };
                    this.shareNodeToPerson = function () {
                        var targetUser = _this.getInputVal("shareToUserName");
                        if (!targetUser) {
                            Util_23.util.showMessage("Please enter a username");
                            return;
                        }
                        Meta64_22.meta64.treeDirty = true;
                        var thiz = _this;
                        Util_23.util.json("addPrivilege", {
                            "nodeId": Share_2.share.sharingNode.id,
                            "principal": targetUser,
                            "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
                            "publicAppend": false
                        }, thiz.reloadFromShareWithPerson, thiz);
                    };
                    this.reloadFromShareWithPerson = function (res) {
                        if (Util_23.util.checkSuccess("Share Node with Person", res)) {
                            Factory_14.Factory.create("SharingDlg", function (dlg) {
                                dlg.open();
                            });
                        }
                    };
                }
                return ShareToPersonDlgImpl;
            }(DialogBaseImpl_20.DialogBaseImpl));
            exports_67("default", ShareToPersonDlgImpl);
        }
    }
});
System.register("SharingDlgImpl", ["DialogBaseImpl", "Share", "Util", "Render", "Meta64", "Factory"], function(exports_68, context_68) {
    "use strict";
    var __moduleName = context_68 && context_68.id;
    var DialogBaseImpl_21, Share_3, Util_24, Render_25, Meta64_23, Factory_15;
    var SharingDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_21_1) {
                DialogBaseImpl_21 = DialogBaseImpl_21_1;
            },
            function (Share_3_1) {
                Share_3 = Share_3_1;
            },
            function (Util_24_1) {
                Util_24 = Util_24_1;
            },
            function (Render_25_1) {
                Render_25 = Render_25_1;
            },
            function (Meta64_23_1) {
                Meta64_23 = Meta64_23_1;
            },
            function (Factory_15_1) {
                Factory_15 = Factory_15_1;
            }],
        execute: function() {
            SharingDlgImpl = (function (_super) {
                __extends(SharingDlgImpl, _super);
                function SharingDlgImpl() {
                    var _this = this;
                    _super.call(this, "SharingDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Node Sharing");
                        var shareWithPersonButton = _this.makeButton("Share with Person", "shareNodeToPersonPgButton", _this.shareNodeToPersonPg, _this);
                        var makePublicButton = _this.makeButton("Share to Public", "shareNodeToPublicButton", _this.shareNodeToPublic, _this);
                        var backButton = _this.makeCloseButton("Close", "closeSharingButton");
                        var buttonBar = Render_25.render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);
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
                        Util_24.util.json("getNodePrivileges", {
                            "nodeId": Share_3.share.sharingNode.id,
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
                            html += Render_25.render.tag("div", {
                                "class": "privilege-list"
                            }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
                        });
                        var publicAppendAttrs = {
                            "onClick": "meta64.getObjectByGuid(" + _this.guid + ").publicCommentingChanged();",
                            "name": "allowPublicCommenting",
                            "id": _this.id("allowPublicCommenting")
                        };
                        if (res.publicAppend) {
                            publicAppendAttrs["checked"] = "checked";
                        }
                        html += Render_25.render.tag("paper-checkbox", publicAppendAttrs, "", false);
                        html += Render_25.render.tag("label", {
                            "for": _this.id("allowPublicCommenting")
                        }, "Allow public commenting under this node.", true);
                        Util_24.util.setHtml(_this.id("sharingListFieldContainer"), html);
                    };
                    this.publicCommentingChanged = function () {
                        var thiz = _this;
                        setTimeout(function () {
                            var polyElm = Util_24.util.polyElm(thiz.id("allowPublicCommenting"));
                            Meta64_23.meta64.treeDirty = true;
                            Util_24.util.json("addPrivilege", {
                                "nodeId": Share_3.share.sharingNode.id,
                                "privileges": null,
                                "principal": null,
                                "publicAppend": (polyElm.node.checked ? true : false)
                            });
                        }, 250);
                    };
                    this.removePrivilege = function (principal, privilege) {
                        Meta64_23.meta64.treeDirty = true;
                        Util_24.util.json("removePrivilege", {
                            "nodeId": Share_3.share.sharingNode.id,
                            "principal": principal,
                            "privilege": privilege
                        }, _this.removePrivilegeResponse, _this);
                    };
                    this.removePrivilegeResponse = function (res) {
                        Util_24.util.json("getNodePrivileges", {
                            "nodeId": Share_3.share.sharingNode.path,
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
                            var row = Render_25.render.makeHorizontalFieldSet(removeButton);
                            row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";
                            ret += Render_25.render.tag("div", {
                                "class": "privilege-entry"
                            }, row);
                        });
                        return ret;
                    };
                    this.shareNodeToPersonPg = function () {
                        Factory_15.Factory.create("ShareToPersonDlg", function (dlg) {
                            dlg.open();
                        });
                    };
                    this.shareNodeToPublic = function () {
                        console.log("Sharing node to public.");
                        Meta64_23.meta64.treeDirty = true;
                        Util_24.util.json("addPrivilege", {
                            "nodeId": Share_3.share.sharingNode.id,
                            "principal": "everyone",
                            "privileges": ["read"],
                            "publicAppend": false
                        }, _this.reload, _this);
                    };
                }
                return SharingDlgImpl;
            }(DialogBaseImpl_21.DialogBaseImpl));
            exports_68("default", SharingDlgImpl);
        }
    }
});
System.register("SignupDlgImpl", ["DialogBaseImpl", "Render", "Util"], function(exports_69, context_69) {
    "use strict";
    var __moduleName = context_69 && context_69.id;
    var DialogBaseImpl_22, Render_26, Util_25;
    var SignupDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_22_1) {
                DialogBaseImpl_22 = DialogBaseImpl_22_1;
            },
            function (Render_26_1) {
                Render_26 = Render_26_1;
            },
            function (Util_25_1) {
                Util_25 = Util_25_1;
            }],
        execute: function() {
            SignupDlgImpl = (function (_super) {
                __extends(SignupDlgImpl, _super);
                function SignupDlgImpl() {
                    var _this = this;
                    _super.call(this, "SignupDlg");
                    this.build = function () {
                        var header = _this.makeHeader(BRANDING_TITLE + " Signup");
                        var formControls = _this.makeEditField("User", "signupUserName") +
                            _this.makePasswordField("Password", "signupPassword") +
                            _this.makeEditField("Email", "signupEmail") +
                            _this.makeEditField("Captcha", "signupCaptcha");
                        var captchaImage = Render_26.render.tag("div", {
                            "class": "captcha-image"
                        }, Render_26.render.tag("img", {
                            "id": _this.id("captchaImage"),
                            "class": "captcha",
                            "src": ""
                        }, "", false));
                        var signupButton = _this.makeButton("Signup", "signupButton", _this.signup, _this);
                        var newCaptchaButton = _this.makeButton("Try Different Image", "tryAnotherCaptchaButton", _this.tryAnotherCaptcha, _this);
                        var backButton = _this.makeCloseButton("Close", "cancelSignupButton");
                        var buttonBar = Render_26.render.centeredButtonBar(signupButton + newCaptchaButton + backButton);
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
                            Util_25.util.showMessage("You cannot leave any fields blank.");
                            return;
                        }
                        Util_25.util.json("signup", {
                            "userName": userName,
                            "password": password,
                            "email": email,
                            "captcha": captcha
                        }, _this.signupResponse, _this);
                    };
                    this.signupResponse = function (res) {
                        if (Util_25.util.checkSuccess("Signup new user", res)) {
                            _this.cancel();
                            Util_25.util.showMessage("User Information Accepted.<p/>Check your email for signup confirmation.");
                        }
                    };
                    this.tryAnotherCaptcha = function () {
                        var n = Util_25.util.currentTimeMillis();
                        var src = postTargetUrl + "captcha?t=" + n;
                        $("#" + _this.id("captchaImage")).attr("src", src);
                    };
                    this.pageInitSignupPg = function () {
                        _this.tryAnotherCaptcha();
                    };
                    this.init = function () {
                        _this.pageInitSignupPg();
                        Util_25.util.delayedFocus("#" + _this.id("signupUserName"));
                    };
                }
                return SignupDlgImpl;
            }(DialogBaseImpl_22.DialogBaseImpl));
            exports_69("default", SignupDlgImpl);
        }
    }
});
System.register("UploadFromFileDlg", [], function(exports_70, context_70) {
    "use strict";
    var __moduleName = context_70 && context_70.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("UploadFromFileDlgImpl", ["DialogBaseImpl", "Factory", "Render", "Constants", "Attachment", "Meta64", "Util"], function(exports_71, context_71) {
    "use strict";
    var __moduleName = context_71 && context_71.id;
    var DialogBaseImpl_23, Factory_16, Render_27, Constants_12, Attachment_2, Meta64_24, Util_26;
    var UploadFromFileDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_23_1) {
                DialogBaseImpl_23 = DialogBaseImpl_23_1;
            },
            function (Factory_16_1) {
                Factory_16 = Factory_16_1;
            },
            function (Render_27_1) {
                Render_27 = Render_27_1;
            },
            function (Constants_12_1) {
                Constants_12 = Constants_12_1;
            },
            function (Attachment_2_1) {
                Attachment_2 = Attachment_2_1;
            },
            function (Meta64_24_1) {
                Meta64_24 = Meta64_24_1;
            },
            function (Util_26_1) {
                Util_26 = Util_26_1;
            }],
        execute: function() {
            UploadFromFileDlgImpl = (function (_super) {
                __extends(UploadFromFileDlgImpl, _super);
                function UploadFromFileDlgImpl() {
                    var _this = this;
                    _super.call(this, "UploadFromFileDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Upload File Attachment");
                        var uploadPathDisplay = "";
                        if (Constants_12.cnst.SHOW_PATH_IN_DLGS) {
                            uploadPathDisplay += Render_27.render.tag("div", {
                                "id": _this.id("uploadPathDisplay"),
                                "class": "path-display-in-editor"
                            }, "");
                        }
                        var uploadFieldContainer = "";
                        var formFields = "";
                        for (var i = 0; i < 7; i++) {
                            var input = Render_27.render.tag("input", {
                                "id": _this.id("upload" + i + "FormInputId"),
                                "type": "file",
                                "name": "files"
                            }, "", true);
                            formFields += Render_27.render.tag("div", {
                                "style": "margin-bottom: 10px;"
                            }, input);
                        }
                        formFields += Render_27.render.tag("input", {
                            "id": _this.id("uploadFormNodeId"),
                            "type": "hidden",
                            "name": "nodeId"
                        }, "", true);
                        formFields += Render_27.render.tag("input", {
                            "id": _this.id("explodeZips"),
                            "type": "hidden",
                            "name": "explodeZips"
                        }, "", true);
                        var form = Render_27.render.tag("form", {
                            "id": _this.id("uploadForm"),
                            "method": "POST",
                            "enctype": "multipart/form-data",
                            "data-ajax": "false"
                        }, formFields);
                        uploadFieldContainer = Render_27.render.tag("div", {
                            "id": _this.id("uploadFieldContainer")
                        }, "<p>Upload from your computer</p>" + form);
                        var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
                        var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                        var buttonBar = Render_27.render.centeredButtonBar(uploadButton + backButton);
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
                            $("#" + _this.id("uploadFormNodeId")).attr("value", Attachment_2.attachment.uploadNode.id);
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
                                Meta64_24.meta64.refresh();
                            });
                            prms.fail(function () {
                                Util_26.util.showMessage("Upload failed.");
                            });
                        };
                        if (_this.hasAnyZipFiles()) {
                            Factory_16.Factory.create("ConfirmDlg", function (dlg) {
                                dlg.open();
                            }, {
                                "title": "Explode Zips?",
                                "message": "Do you want Zip files exploded onto the tree when uploaded?",
                                "buttonText": "Yes, explode zips",
                                "yesCallback": function () {
                                    uploadFunc(true);
                                },
                                "noCallback": function () {
                                    uploadFunc(true);
                                }
                            });
                        }
                        else {
                            uploadFunc(false);
                        }
                    };
                    this.init = function () {
                        $("#" + _this.id("uploadPathDisplay")).html("Path: " + Render_27.render.formatPath(Attachment_2.attachment.uploadNode));
                    };
                }
                return UploadFromFileDlgImpl;
            }(DialogBaseImpl_23.DialogBaseImpl));
            exports_71("default", UploadFromFileDlgImpl);
        }
    }
});
System.register("UploadFromFileDropzoneDlgImpl", ["DialogBaseImpl", "Factory", "Constants", "Render", "Attachment", "Meta64"], function(exports_72, context_72) {
    "use strict";
    var __moduleName = context_72 && context_72.id;
    var DialogBaseImpl_24, Factory_17, Constants_13, Render_28, Attachment_3, Meta64_25;
    var UploadFromFileDropzoneDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_24_1) {
                DialogBaseImpl_24 = DialogBaseImpl_24_1;
            },
            function (Factory_17_1) {
                Factory_17 = Factory_17_1;
            },
            function (Constants_13_1) {
                Constants_13 = Constants_13_1;
            },
            function (Render_28_1) {
                Render_28 = Render_28_1;
            },
            function (Attachment_3_1) {
                Attachment_3 = Attachment_3_1;
            },
            function (Meta64_25_1) {
                Meta64_25 = Meta64_25_1;
            }],
        execute: function() {
            UploadFromFileDropzoneDlgImpl = (function (_super) {
                __extends(UploadFromFileDropzoneDlgImpl, _super);
                function UploadFromFileDropzoneDlgImpl() {
                    var _this = this;
                    _super.call(this, "UploadFromFileDropzoneDlg");
                    this.fileList = null;
                    this.zipQuestionAnswered = false;
                    this.explodeZips = false;
                    this.build = function () {
                        var header = _this.makeHeader("Upload File Attachment");
                        var uploadPathDisplay = "";
                        if (Constants_13.cnst.SHOW_PATH_IN_DLGS) {
                            uploadPathDisplay += Render_28.render.tag("div", {
                                "id": _this.id("uploadPathDisplay"),
                                "class": "path-display-in-editor"
                            }, "");
                        }
                        var formFields = "";
                        console.log("Upload Action URL: " + postTargetUrl + "upload");
                        var hiddenInputContainer = Render_28.render.tag("div", {
                            "id": _this.id("hiddenInputContainer"),
                            "style": "display: none;"
                        }, "");
                        var form = Render_28.render.tag("form", {
                            "action": postTargetUrl + "upload",
                            "autoProcessQueue": false,
                            "class": "dropzone",
                            "id": _this.id("dropzone-form-id")
                        }, "");
                        var uploadButton = _this.makeCloseButton("Upload", "uploadButton", null, null, false);
                        var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                        var buttonBar = Render_28.render.centeredButtonBar(uploadButton + backButton);
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
                                    formData.append("nodeId", Attachment_3.attachment.uploadNode.id);
                                    formData.append("explodeZips", this.explodeZips ? "true" : "false");
                                    this.zipQuestionAnswered = false;
                                });
                                this.on("queuecomplete", function (file) {
                                    Meta64_25.meta64.refresh();
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
                            Factory_17.Factory.create("ConfirmDlg", function (dlg) {
                                dlg.open();
                            }, {
                                "title": "Explode Zips?",
                                "message": "Do you want Zip files exploded onto the tree when uploaded?",
                                "buttonText": "Yes, explode zips",
                                "yesCallback": function () {
                                    thiz.explodeZips = true;
                                },
                                "noCallback": function () {
                                    thiz.explodeZips = false;
                                }
                            });
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
                        $("#" + _this.id("uploadPathDisplay")).html("Path: " + Render_28.render.formatPath(Attachment_3.attachment.uploadNode));
                        _this.configureDropZone();
                    };
                }
                return UploadFromFileDropzoneDlgImpl;
            }(DialogBaseImpl_24.DialogBaseImpl));
            exports_72("default", UploadFromFileDropzoneDlgImpl);
        }
    }
});
System.register("UploadFromUrlDlgImpl", ["DialogBaseImpl", "Constants", "Render", "Util", "Attachment", "Meta64"], function(exports_73, context_73) {
    "use strict";
    var __moduleName = context_73 && context_73.id;
    var DialogBaseImpl_25, Constants_14, Render_29, Util_27, Attachment_4, Meta64_26;
    var UploadFromUrlDlgImpl;
    return {
        setters:[
            function (DialogBaseImpl_25_1) {
                DialogBaseImpl_25 = DialogBaseImpl_25_1;
            },
            function (Constants_14_1) {
                Constants_14 = Constants_14_1;
            },
            function (Render_29_1) {
                Render_29 = Render_29_1;
            },
            function (Util_27_1) {
                Util_27 = Util_27_1;
            },
            function (Attachment_4_1) {
                Attachment_4 = Attachment_4_1;
            },
            function (Meta64_26_1) {
                Meta64_26 = Meta64_26_1;
            }],
        execute: function() {
            UploadFromUrlDlgImpl = (function (_super) {
                __extends(UploadFromUrlDlgImpl, _super);
                function UploadFromUrlDlgImpl() {
                    var _this = this;
                    _super.call(this, "UploadFromUrlDlg");
                    this.build = function () {
                        var header = _this.makeHeader("Upload File Attachment");
                        var uploadPathDisplay = "";
                        if (Constants_14.cnst.SHOW_PATH_IN_DLGS) {
                            uploadPathDisplay += Render_29.render.tag("div", {
                                "id": _this.id("uploadPathDisplay"),
                                "class": "path-display-in-editor"
                            }, "");
                        }
                        var uploadFieldContainer = "";
                        var uploadFromUrlDiv = "";
                        var uploadFromUrlField = _this.makeEditField("Upload From URL", "uploadFromUrl");
                        uploadFromUrlDiv = Render_29.render.tag("div", {}, uploadFromUrlField);
                        var uploadButton = _this.makeCloseButton("Upload", "uploadButton", _this.uploadFileNow, _this);
                        var backButton = _this.makeCloseButton("Close", "closeUploadButton");
                        var buttonBar = Render_29.render.centeredButtonBar(uploadButton + backButton);
                        return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
                    };
                    this.uploadFileNow = function () {
                        var sourceUrl = _this.getInputVal("uploadFromUrl");
                        if (sourceUrl) {
                            Util_27.util.json("uploadFromUrl", {
                                "nodeId": Attachment_4.attachment.uploadNode.id,
                                "sourceUrl": sourceUrl
                            }, _this.uploadFromUrlResponse, _this);
                        }
                    };
                    this.uploadFromUrlResponse = function (res) {
                        if (Util_27.util.checkSuccess("Upload from URL", res)) {
                            Meta64_26.meta64.refresh();
                        }
                    };
                    this.init = function () {
                        Util_27.util.setInputVal(_this.id("uploadFromUrl"), "");
                        $("#" + _this.id("uploadPathDisplay")).html("Path: " + Render_29.render.formatPath(Attachment_4.attachment.uploadNode));
                    };
                }
                return UploadFromUrlDlgImpl;
            }(DialogBaseImpl_25.DialogBaseImpl));
            exports_73("default", UploadFromUrlDlgImpl);
        }
    }
});
//# sourceMappingURL=meta64-app.js.map