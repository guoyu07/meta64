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
var util = function () {
    var logAjax = false;
    var timeoutMessageShown = false;
    var offline = false;
    var waitCounter = 0;
    var pgrsDlg = null;
    var assertNotNull = function (varName) {
        if (typeof eval(varName) === 'undefined') {
            (new MessageDlg("Variable not found: " + varName)).open();
        }
    };
    var _ajaxCounter = 0;
    var _ = {
        daylightSavingsTime: (new Date().dst()) ? true : false,
        toJson: function (obj) {
            return JSON.stringify(obj, null, 4);
        },
        getParameterByName: function (name, url) {
            if (!url)
                url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        inherit: function (parent, child) {
            child.prototype.constructor = child;
            child.prototype = Object.create(parent.prototype);
            return child.prototype;
        },
        initProgressMonitor: function () {
            setInterval(_.progressInterval, 1000);
        },
        progressInterval: function () {
            var isWaiting = _.isAjaxWaiting();
            if (isWaiting) {
                waitCounter++;
                if (waitCounter >= 3) {
                    if (!pgrsDlg) {
                        pgrsDlg = new ProgressDlg();
                        pgrsDlg.open();
                    }
                }
            }
            else {
                waitCounter = 0;
                if (pgrsDlg) {
                    pgrsDlg.cancel();
                    pgrsDlg = null;
                }
            }
        },
        json: function (postName, postData, callback, callbackThis, callbackPayload) {
            var ironAjax;
            var ironRequest;
            try {
                if (offline) {
                    console.log("offline: ignoring call for " + postName);
                    return;
                }
                if (logAjax) {
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
                _ajaxCounter++;
                ironRequest = ironAjax.generateRequest();
            }
            catch (ex) {
                throw "Failed starting request: " + postName;
            }
            ironRequest.completes.then(function () {
                try {
                    _ajaxCounter--;
                    _.progressInterval();
                    if (logAjax) {
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
                    _.progressInterval();
                    console.log("Error in util.json");
                    if (ironRequest.status == "403") {
                        console.log("Not logged in detected in util.");
                        offline = true;
                        if (!timeoutMessageShown) {
                            timeoutMessageShown = true;
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
        },
        ajaxReady: function (requestName) {
            if (_ajaxCounter > 0) {
                console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
                return false;
            }
            return true;
        },
        isAjaxWaiting: function () {
            return _ajaxCounter > 0;
        },
        delayedFocus: function (id) {
            setTimeout(function () {
                $(id).focus();
            }, 500);
            setTimeout(function () {
                $(id).focus();
            }, 1000);
        },
        checkSuccess: function (opFriendlyName, res) {
            if (!res.success) {
                (new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
            }
            return res.success;
        },
        addAll: function (obj, a) {
            for (var i = 0; i < a.length; i++) {
                if (!a[i]) {
                    console.error("null element in addAll at idx=" + i);
                }
                else {
                    obj[a[i]] = true;
                }
            }
        },
        nullOrUndef: function (obj) {
            return obj === null || obj === undefined;
        },
        getUidForId: function (map, id) {
            var uid = map[id];
            if (!uid) {
                uid = meta64.nextUid++;
                map[id] = uid;
            }
            return uid;
        },
        elementExists: function (id) {
            if (id.startsWith("#")) {
                id = id.substring(1);
            }
            if (id.contains("#")) {
                console.log("Invalid # in domElm");
                return null;
            }
            var e = document.getElementById(id);
            return e != null;
        },
        getTextAreaValById: function (id) {
            var domElm = _.domElm(id);
            return domElm.value;
        },
        domElm: function (id) {
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
        },
        poly: function (id) {
            return _.polyElm(id).node;
        },
        polyElm: function (id) {
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
        },
        getRequiredElement: function (id) {
            var e = $(id);
            if (e == null) {
                console.log("getRequiredElement. Required element id not found: " + id);
            }
            return e;
        },
        isObject: function (obj) {
            return obj && obj.length != 0;
        },
        currentTimeMillis: function () {
            return new Date().getMilliseconds();
        },
        emptyString: function (val) {
            return !val || val.length == 0;
        },
        getInputVal: function (id) {
            return _.polyElm(id).node.value;
        },
        setInputVal: function (id, val) {
            if (val == null) {
                val = "";
            }
            var elm = _.polyElm(id);
            if (elm) {
                elm.node.value = val;
            }
            return elm != null;
        },
        bindEnterKey: function (id, func) {
            _.bindKey(id, func, 13);
        },
        bindKey: function (id, func, keyCode) {
            $(id).keypress(function (e) {
                if (e.which == keyCode) {
                    func();
                    return false;
                }
            });
        },
        anyEmpty: function (p1, p2, p3, p4) {
            for (var i = 0; i < arguments.length; i++) {
                var val = arguments[i];
                if (!val || val.length == 0)
                    return true;
            }
            return false;
        },
        changeOrAddClass: function (elm, oldClass, newClass) {
            var elmement = $(elm);
            elmement.toggleClass(oldClass, false);
            elmement.toggleClass(newClass, true);
        },
        verifyType: function (obj, type, msg) {
            if (typeof obj !== type) {
                (new MessageDlg(msg)).open();
                return false;
            }
            return true;
        },
        setHtmlEnhanced: function (id, content) {
            if (content == null) {
                content = "";
            }
            var elm = _.domElm(id);
            var polyElm = Polymer.dom(elm);
            polyElm.node.innerHTML = content;
            Polymer.dom.flush();
            Polymer.updateStyles();
            return elm;
        },
        setHtml: function (id, content) {
            if (content == null) {
                content = "";
            }
            var elm = _.domElm(id);
            var polyElm = Polymer.dom(elm);
            polyElm.node.innerHTML = content;
        },
        getPropertyCount: function (obj) {
            var count = 0;
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    count++;
                }
            }
            return count;
        },
        printObject: function (obj) {
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
        },
        printKeys: function (obj) {
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
        },
        setEnablement: function (elmId, enable) {
            var domElm = null;
            if (typeof elmId == "string") {
                domElm = _.domElm(elmId);
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
        },
        setVisibility: function (elmId, vis) {
            var domElm = null;
            if (typeof elmId == "string") {
                domElm = _.domElm(elmId);
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
        }
    };
    console.log("Module ready: util.js");
    return _;
}();
//# sourceMappingURL=util.js.map