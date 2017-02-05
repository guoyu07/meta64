console.log("Util.ts");

declare var $;

/// <reference path="./tyepdefs/jquery/jquery.d.ts" />
/// <reference path="./tyepdefs/jquery.cookie/jquery.cookie.d.ts" />

declare var Polymer;
declare var Dropzone;
declare var ace;
declare var cookiePrefix;
declare var postTargetUrl;
declare var prettyPrint;
declare var BRANDING_TITLE;
declare var BRANDING_TITLE_SHORT;

import { meta64 } from "./Meta64";
import { MessageDlg } from "./MessageDlg";
import { ProgressDlg } from "./ProgressDlg";
import { Factory } from "./Factory";
import * as I from "./Interfaces";

class Util {

    logAjax: boolean = false;
    timeoutMessageShown: boolean = false;
    offline: boolean = false;

    waitCounter: number = 0;
    pgrsDlg: any = null;

    escapeRegExp = function(_) {
        return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    escapeForAttrib = function(_) {
        return util.replaceAll(_, "\"", "&quot;");
    }

    unencodeHtml = function(_) {
        if (!util.contains(_, "&"))
            return _;

        var ret = _;
        ret = util.replaceAll(ret, '&amp;', '&');
        ret = util.replaceAll(ret, '&gt;', '>');
        ret = util.replaceAll(ret, '&lt;', '<');
        ret = util.replaceAll(ret, '&quot;', '"');
        ret = util.replaceAll(ret, '&#39;', "'");

        return ret;
    }

    replaceAll = function(_, find, replace) {
        return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
    }

    contains = function(_, str) {
        return _.indexOf(str) != -1;
    }

    startsWith = function(_, str) {
        return _.indexOf(str) === 0;
    }

    stripIfStartsWith = function(_, str) {
        if (_.startsWith(str)) {
            return _.substring(str.length);
        }
        return _;
    }

    arrayClone = function(_: any[]) {
        return _.slice(0);
    };

    arrayIndexOfItemByProp = function(_: any[], propName, propVal) {
        var len = _.length;
        for (var i = 0; i < len; i++) {
            if (_[i][propName] === propVal) {
                return i;
            }
        }
        return -1;
    };

    /* need to test all calls to this method because i noticed during TypeScript conversion i wasn't even returning
    a value from this function! todo-0
    */
    arrayMoveItem = function(_: any[], fromIndex, toIndex) {
        _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
    };

    static stdTimezoneOffset = function(_: Date) {
        var jan = new Date(_.getFullYear(), 0, 1);
        var jul = new Date(_.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    static dst = function(_: Date) {
        return _.getTimezoneOffset() < Util.stdTimezoneOffset(_);
    }

    indexOfObject = function(_: any[], obj) {
        for (var i = 0; i < _.length; i++) {
            if (_[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    assertNotNull = function(varName) {
        if (typeof eval(varName) === 'undefined') {
            util.showMessage("Variable not found: " + varName);
        }
    }

    /*
     * We use this variable to determine if we are waiting for an ajax call, but the server also enforces that each
     * session is only allowed one concurrent call and simultaneous calls would just "queue up".
     */
    private _ajaxCounter: number = 0;

    daylightSavingsTime: boolean = (Util.dst(new Date())) ? true : false;

    toJson = function(obj) {
        return JSON.stringify(obj, null, 4);
    }

    /*
     * This came from here:
     * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     */
    getParameterByName = function(name?: any, url?: any): string {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    //
    // /*
    //  * Sets up an inheritance relationship so that child inherits from parent, and then returns the prototype of the
    //  * child so that methods can be added to it, which will behave like member functions in classic OOP with
    //  * inheritance hierarchies.
    //  */
    // inherit = function(parent, child): any {
    //     child.prototype.constructor = child;
    //     child.prototype = Object.create(parent.prototype);
    //     return child.prototype;
    // }
    //
    initProgressMonitor = function(): void {
        setInterval(util.progressInterval, 1000);
    }

    progressInterval = function(): void {
        var isWaiting = util.isAjaxWaiting();
        if (isWaiting) {
            util.waitCounter++;
            if (util.waitCounter >= 3) {
                if (!util.pgrsDlg) {
                    Factory.create("ProgressDlg", (dlg: ProgressDlg) => {
                        util.pgrsDlg = dlg;
                        util.pgrsDlg.open();
                    })
                }
            }
        } else {
            util.waitCounter = 0;
            if (util.pgrsDlg) {
                util.pgrsDlg.cancel();
                util.pgrsDlg = null;
            }
        }
    }

    json = function <RequestType, ResponseType>(postName: any, postData: RequestType, //
        callback?: (response: ResponseType, payload?: any) => any, callbackThis?: any, callbackPayload?: any) {

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

            //not w-pack
            /* Do not delete, research this way... */
            // var ironAjax = this.$$("#myIronAjax");
            //ironAjax = Polymer.dom((<_HasRoot>)window.document.root).querySelector("#ironAjax");

            ironAjax = util.polyElmNode("ironAjax");

            ironAjax.url = postTargetUrl + postName;
            ironAjax.verbose = true;
            ironAjax.body = JSON.stringify(postData);
            ironAjax.method = "POST";
            ironAjax.contentType = "application/json";

            //not w-pack
            // specify any url params this way:
            // ironAjax.params='{"alt":"json", "q":"chrome"}';

            ironAjax.handleAs = "json"; // handle-as (is prop)

            //not w-pack
            /* This not a required property */
            // ironAjax.onResponse = "util.ironAjaxResponse"; // on-response
            // (is
            // prop)
            ironAjax.debounceDuration = "300"; // debounce-duration (is
            // prop)

            util._ajaxCounter++;
            ironRequest = ironAjax.generateRequest();
        } catch (ex) {
            util.logAndReThrow("Failed starting request: " + postName, ex);
        }

        /**
         * Notes
         * <p>
         * If using then function: promise.then(successFunction, failFunction);
         * <p>
         * I think the way these parameters get passed into done/fail functions, is because there are resolve/reject
         * methods getting called with the parameters. Basically the parameters passed to 'resolve' get distributed
         * to all the waiting methods just like as if they were subscribing in a pub/sub model. So the 'promise'
         * pattern is sort of a pub/sub model in a way
         * <p>
         * The reason to return a 'promise.promise()' method is so no other code can call resolve/reject but can
         * only react to a done/fail/complete.
         * <p>
         * deferred.when(promise1, promise2) creates a new promise that becomes 'resolved' only when all promises
         * are resolved. It's a big "and condition" of resolvement, and if any of the promises passed to it end up
         * failing, it fails this "ANDed" one also.
         */
        ironRequest.completes.then(//

            // Handle Success
            function() {
                try {
                    util._ajaxCounter--;
                    util.progressInterval();

                    if (util.logAjax) {
                        console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
                            + JSON.stringify(ironRequest.response));
                    }

                    if (typeof callback == "function") {
                        /*
                         * This is ugly because it covers all four cases based on two booleans, but it's still the
                         * simplest way to do this. We have a callback function that may or may not specify a 'this'
                         * and always calls with the 'reponse' param and optionally a callbackPayload param.
                         */
                        if (callbackPayload) {
                            if (callbackThis) {
                                callback.call(callbackThis, <ResponseType>ironRequest.response, callbackPayload);
                            } else {
                                callback(<ResponseType>ironRequest.response, callbackPayload);
                            }
                        }
                        /* Can't we just let callbackPayload be undefined, and call the above callback methods
                        and not even have this else block here at all (i.e. not even check if callbackPayload is
                        null/undefined, but just use it, and not have this if block?)
                        */
                        else {
                            if (callbackThis) {
                                callback.call(callbackThis, <ResponseType>ironRequest.response);
                            } else {
                                callback(<ResponseType>ironRequest.response);
                            }
                        }
                    }
                } catch (ex) {
                    util.logAndReThrow("Failed handling result of: " + postName, ex);
                }

            },
            // Handle Fail
            function() {
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

                    let msg: string = "Server request failed.\n\n";

                    /* catch block should fail silently */
                    try {
                        msg += "Status: " + ironRequest.statusText + "\n";
                        msg += "Code: " + ironRequest.status + "\n";
                    } catch (ex) {
                    }

                    //NOT webpack
                    /*
                     * this catch block should also fail silently
                     *
                     * This was showing "classCastException" when I threw a regular "Exception" from server so for now
                     * I'm just turning this off since its' not displaying the correct message.
                     */
                    // try {
                    // msg += "Response: " +
                    // JSON.parse(xhr.responseText).exception;
                    // } catch (ex) {
                    // }
                    util.showMessage(msg);
                } catch (ex) {
                    util.logAndReThrow("Failed processing server-side fail of: " + postName, ex);
                }
            });

        return ironRequest;
    }

    logAndThrow = function(message: string) {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw message;
    }

    logAndReThrow = function(message: string, exception: any) {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw exception;
    }

    ajaxReady = function(requestName): boolean {
        if (util._ajaxCounter > 0) {
            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
            return false;
        }
        return true;
    }

    isAjaxWaiting = function(): boolean {
        return util._ajaxCounter > 0;
    }

    /* set focus to element by id (id must be actual jquery selector) */
    delayedFocus = function(id): void {
        /* so user sees the focus fast we try at .5 seconds */
        setTimeout(function() {
            $(id).focus();
        }, 500);

        /* we try again a full second later. Normally not required, but never undesirable */
        setTimeout(function() {
            //console.log("Focusing ID: "+id);
            $(id).focus();
        }, 1300);
    }

    /*
     * We could have put this logic inside the json method itself, but I can forsee cases where we don't want a
     * message to appear when the json response returns success==false, so we will have to call checkSuccess inside
     * every response method instead, if we want that response to print a message to the user when fail happens.
     *
     * requires: res.success res.message
     */
    checkSuccess = function(opFriendlyName, res): boolean {
        if (!res.success) {
            util.showMessage(opFriendlyName + " failed: " + res.message);
        }
        return res.success;
    }

    showMessage = function(message: string): void {
        Factory.create("MessageDlg", (dlg: MessageDlg) => {
            dlg.open();
        }, { "message": message });
    }

    /* adds all array objects to obj as a set */
    addAll = function(obj, a): void {
        for (var i = 0; i < a.length; i++) {
            if (!a[i]) {
                console.error("null element in addAll at idx=" + i);
            } else {
                obj[a[i]] = true;
            }
        }
    }

    nullOrUndef = function(obj): boolean {
        return obj === null || obj === undefined;
    }

    /*
     * We have to be able to map any identifier to a uid, that will be repeatable, so we have to use a local
     * 'hashset-type' implementation
     */
    getUidForId = function(map: { [key: string]: string }, id): string {
        /* look for uid in map */
        let uid: string = map[id];

        /* if not found, get next number, and add to map */
        if (!uid) {
            uid = "" + meta64.nextUid++;
            map[id] = uid;
        }
        return uid;
    }

    elementExists = function(id): boolean {
        if (util.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (util.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }

        var e = document.getElementById(id);
        return e != null;
    }

    /* Takes textarea dom Id (# optional) and returns its value */
    getTextAreaValById = function(id): string {
        var de: HTMLElement = util.domElm(id);
        return (<HTMLInputElement>de).value;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    domElm = function(id): any {
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
    }

    poly = function(id): any {
        return util.polyElm(id).node;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    polyElm = function(id: string): any {

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
    }

    polyElmNode = function(id: string): any {
        var e = util.polyElm(id);
        return e.node;
    }

    /*
     * Gets the element and displays an error message if it's not found
     */
    getRequiredElement = function(id: string): any {
        var e = $(id);
        if (e == null) {
            console.log("getRequiredElement. Required element id not found: " + id);
        }
        return e;
    }

    isObject = function(obj: any): boolean {
        return obj && obj.length != 0;
    }

    currentTimeMillis = function(): number {
        return new Date().getMilliseconds();
    }

    emptyString = function(val: string): boolean {
        return !val || val.length == 0;
    }

    getInputVal = function(id: string): any {
        return util.polyElm(id).node.value;
    }

    /* returns true if element was found, or false if element not found */
    setInputVal = function(id: string, val: string): boolean {
        if (val == null) {
            val = "";
        }
        var elm = util.polyElm(id);
        if (elm) {
            elm.node.value = val;
        }
        return elm != null;
    }

    bindEnterKey = function(id: string, func: any) {
        util.bindKey(id, func, 13);
    }

    bindKey = function(id: string, func: any, keyCode: any): boolean {
        $(id).keypress(function(e) {
            if (e.which == keyCode) { // 13==enter key code
                func();
                return false;
            }
        });
        return false;
    }

    /*
     * Removed oldClass from element and replaces with newClass, and if oldClass is not present it simply adds
     * newClass. If old class existed, in the list of classes, then the new class will now be at that position. If
     * old class didn't exist, then new Class is added at end of class list.
     */
    changeOrAddClass = function(elm: string, oldClass: string, newClass: string) {
        var elmement = $(elm);
        elmement.toggleClass(oldClass, false);
        elmement.toggleClass(newClass, true);
    }

    /*
     * displays message (msg) of object is not of specified type
     */
    verifyType = function(obj: any, type: any, msg: string) {
        if (typeof obj !== type) {
            util.showMessage(msg);
            return false;
        }
        return true;
    }

    setHtml = function(id: string, content: string): void {
        if (content == null) {
            content = "";
        }

        var elm = util.domElm(id);
        var polyElm = Polymer.dom(elm);

        //For Polymer 1.0.0, you need this...
        //polyElm.node.innerHTML = content;

        polyElm.innerHTML = content;

        Polymer.dom.flush();
        Polymer.updateStyles();
    }

    getPropertyCount = function(obj: Object): number {
        var count = 0;
        var prop;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }

    /*
     * iterates over an object creating a string containing it's keys and values
     */
    printObject = function(obj: Object): string {
        if (!obj) {
            return "null";
        }

        let val: string = ""
        try {
            let count: number = 0;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    console.log("Property[" + count + "]");
                    count++;
                }
            }

            $.each(obj, function(k, v) {
                val += k + " , " + v + "\n";
            });
        } catch (err) {
            return "err";
        }
        return val;
    }

    /* iterates over an object creating a string containing it's keys */
    printKeys = function(obj: Object): string {
        if (!obj)
            return "null";

        let val: string = "";
        $.each(obj, function(k, v) {
            if (!k) {
                k = "null";
            }

            if (val.length > 0) {
                val += ',';
            }
            val += k;
        });
        return val;
    }

    /*
     * Makes eleId enabled based on vis flag
     *
     * eleId can be a DOM element or the ID of a dom element, with or without leading #
     */
    setEnablement = function(elmId: string, enable: boolean): void {

        var elm = null;
        if (typeof elmId == "string") {
            elm = util.domElm(elmId);
        } else {
            elm = elmId;
        }

        if (elm == null) {
            console.log("setVisibility couldn't find item: " + elmId);
            return;
        }

        if (!enable) {
            // console.log("Enabling element: " + elmId);
            elm.disabled = true;
        } else {
            // console.log("Disabling element: " + elmId);
            elm.disabled = false;
        }
    }

    /*
     * Makes eleId visible based on vis flag
     *
     * eleId can be a DOM element or the ID of a dom element, with or without leading #
     */
    setVisibility = function(elmId: string, vis: boolean): void {

        var elm = null;
        if (typeof elmId == "string") {
            elm = util.domElm(elmId);
        } else {
            elm = elmId;
        }

        if (elm == null) {
            console.log("setVisibility couldn't find item: " + elmId);
            return;
        }

        if (vis) {
            // console.log("Showing element: " + elmId);
            //elm.style.display = 'block';
            $(elm).show();
        } else {
            // console.log("hiding element: " + elmId);
            //elm.style.display = 'none';
            $(elm).hide();
        }
    }

    /* Programatically creates objects by name, similar to what Java reflection does

    * ex: var example = InstanceLoader.getInstance<NamedThing>(window, 'ExampleClass', args...);
    */
    getInstance = function <T>(context: Object, name: string, ...args: any[]): T {
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T>instance;
    }
}
export let util: Util = new Util();
export default util;
