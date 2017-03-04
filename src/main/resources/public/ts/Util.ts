console.log("Util.ts");

declare var Polymer;
declare var Dropzone;
declare var ace;
declare var postTargetUrl;
declare var prettyPrint;

import { meta64 } from "./Meta64";
import { MessageDlg } from "./MessageDlg";
import { ProgressDlg } from "./ProgressDlg";
import { Factory } from "./Factory";
import { domBind } from "./DomBind";
import * as I from "./Interfaces";

class Util {

    logAjax: boolean = false;
    timeoutMessageShown: boolean = false;
    offline: boolean = false;

    waitCounter: number = 0;
    pgrsDlg: any = null;

    escapeRegExp(_) {
        return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    escapeForAttrib(_) {
        return util.replaceAll(_, "\"", "&quot;");
    }

    unencodeHtml(_) {
        if (!util.contains(_, "&"))
            return _;

        let ret = _;
        ret = util.replaceAll(ret, '&amp;', '&');
        ret = util.replaceAll(ret, '&gt;', '>');
        ret = util.replaceAll(ret, '&lt;', '<');
        ret = util.replaceAll(ret, '&quot;', '"');
        ret = util.replaceAll(ret, '&#39;', "'");

        return ret;
    }

    replaceAll(_, find, replace) {
        return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
    }

    contains(_, str) {
        return _.indexOf(str) != -1;
    }

    startsWith(_, str) {
        return _.indexOf(str) === 0;
    }

    endsWith(_, str) {
        return _.indexOf(str, _.length - str.length) !== -1;
    }

    chopAtLastChar(str: string, char: string) {
        let idx = str.lastIndexOf(char);
        if (idx != -1) {
            return str.substring(0, idx);
        }
        else {
            return str;
        }
    }

    stripIfStartsWith(_, str) {
        if (_.startsWith(str)) {
            return _.substring(str.length);
        }
        return _;
    }

    arrayClone(_: any[]) {
        return _.slice(0);
    };

    arrayIndexOfItemByProp(_: any[], propName, propVal) {
        let len = _.length;
        for (let i = 0; i < len; i++) {
            if (_[i][propName] === propVal) {
                return i;
            }
        }
        return -1;
    };

    arrayMoveItem(_: any[], fromIndex, toIndex) {
        _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
    };

    static stdTimezoneOffset(_: Date) {
        let jan = new Date(_.getFullYear(), 0, 1);
        let jul = new Date(_.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    static dst(_: Date) {
        return _.getTimezoneOffset() < Util.stdTimezoneOffset(_);
    }

    indexOfObject(_: any[], obj) {
        for (let i = 0; i < _.length; i++) {
            if (_[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    assertNotNull(varName) {
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

    getCheckBoxStateById(id: string): boolean {
        let checkbox = util.domElm(id);
        if (checkbox) {
            return "true" == checkbox.getAttribute("checkedstate");
        }
        else {
            throw "checkbox not found: " + id;
        }
    }

    toJson(obj) {
        return JSON.stringify(obj, null, 4);
    }

    /*
     * This came from here:
     * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     */
    getParameterByName(name?: any, url?: any): string {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    initProgressMonitor(): void {
        setInterval(util.progressInterval, 1000);
    }

    progressInterval(): void {
        let isWaiting = util.isAjaxWaiting();
        if (isWaiting) {
            util.waitCounter++;
            if (util.waitCounter >= 3) {
                if (!util.pgrsDlg) {
                    Factory.createDefault("ProgressDlgImpl", (dlg: ProgressDlg) => {
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

    ajax<RequestType, ResponseType>(postName: string, postData: RequestType, //
        callback?: (response: ResponseType) => void) {

        let ironAjax;
        let ironRequest;

        try {
            if (util.offline) {
                console.log("offline: ignoring call for " + postName);
                return;
            }

            if (util.logAjax) {
                console.log("JSON-POST[gen]: [" + postName + "]" + JSON.stringify(postData));
            }

            /* Do not delete, research this way... */
            // let ironAjax = this.$$ ("#myIronAjax");
            //ironAjax = Polymer.dom((<_HasRoot>)window.document.root).querySelector("#ironAjax");

            ironAjax = util.polyElmNode("ironAjax");

            ironAjax.url = postTargetUrl + postName;
            ironAjax.verbose = true;
            ironAjax.body = JSON.stringify(postData);
            ironAjax.method = "POST";
            ironAjax.contentType = "application/json";

            // specify any url params this way:
            // ironAjax.params='{"alt":"json", "q":"chrome"}';

            ironAjax.handleAs = "json"; // handle-as (is prop)

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
            () => {
                try {
                    util._ajaxCounter--;
                    util.progressInterval();

                    if (util.logAjax) {
                        console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
                            + JSON.stringify(ironRequest.response));
                    }

                    if (typeof callback == "function") {
                        callback(<ResponseType>ironRequest.response);
                    }
                } catch (ex) {
                    util.logAndReThrow("Failed handling result of: " + postName, ex);
                }

            },
            // Handle Fail
            () => {
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

                        window.onbeforeunload = null;
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

    logAndThrow(message: string) {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw message;
    }

    logAndReThrow(message: string, exception: any) {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw exception;
    }

    ajaxReady(requestName): boolean {
        if (util._ajaxCounter > 0) {
            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
            return false;
        }
        return true;
    }

    isAjaxWaiting(): boolean {
        return util._ajaxCounter > 0;
    }

    focusElmById(id: string) {
        let elm = util.domElm(id);
        if (elm) {
            elm.focus();
        }
    }

    //todo-1: Haven't yet verified this is correct, but i'm not using it anywhere important yet.
    isElmVisible(elm: HTMLElement) {
        return elm && elm.offsetHeight > 0;
    }

    /* set focus to element by id (id must be actual jquery selector) */
    delayedFocus(id): void {
        /* so user sees the focus fast we try at .5 seconds */
        setTimeout(() => {
            util.focusElmById(id);
        }, 500);

        /* we try again a full second later. Normally not required, but never undesirable */
        setTimeout(() => {
            //console.log("Focusing ID: "+id);
            util.focusElmById(id);
        }, 1300);
    }

    /*
     * We could have put this logic inside the json method itself, but I can forsee cases where we don't want a
     * message to appear when the json response returns success==false, so we will have to call checkSuccess inside
     * every response method instead, if we want that response to print a message to the user when fail happens.
     *
     * requires: res.success res.message
     */
    checkSuccess(opFriendlyName, res): boolean {
        if (!res.success) {
            util.showMessage(opFriendlyName + " failed: " + res.message);
        }
        return res.success;
    }

    showMessage(message: string): void {
        Factory.createDefault("MessageDlgImpl", (dlg: MessageDlg) => {
            dlg.open();
        }, { "message": message });
    }

    /* adds all array objects to obj as a set */
    addAll(obj, a): void {
        for (let i = 0; i < a.length; i++) {
            if (!a[i]) {
                console.error("null element in addAll at idx=" + i);
            } else {
                obj[a[i]] = true;
            }
        }
    }

    nullOrUndef(obj): boolean {
        return obj === null || obj === undefined;
    }

    /*
     * We have to be able to map any identifier to a uid, that will be repeatable, so we have to use a local
     * 'hashset-type' implementation
     */
    getUidForId(map: { [key: string]: string }, id): string {
        /* look for uid in map */
        let uid: string = map[id];

        /* if not found, get next number, and add to map */
        if (!uid) {
            uid = "" + meta64.nextUid++;
            map[id] = uid;
        }
        return uid;
    }

    elementExists(id): boolean {
        if (util.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (util.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }

        let e = document.getElementById(id);
        return e != null;
    }

    /* Takes textarea dom Id (# optional) and returns its value */
    getTextAreaValById(id): string {
        let de: HTMLInputElement = <HTMLInputElement>util.domElm(id);
        return de.value;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    domElm(id): HTMLElement {

        /* why did i do this? I thought "#id" was valid for getDomElmementById right? */
        if (util.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (util.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }

        let e: HTMLElement = document.getElementById(id);
        if (!e) {
            console.log("domElm Error. Required element id not found: " + id);
        }
        return e;
    }

    setInnerHTMLById(id: string, val: string): void {
        let domElm: HTMLElement = util.domElm(id);
        util.setInnerHTML(domElm, val);
    }

    setInnerHTML(elm: HTMLElement, val: string): void {
        if (elm) {
            elm.innerHTML = val;
        }
    }

    poly(id): any {
        return util.polyElm(id).node;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    polyElm(id: string): any {

        if (util.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (util.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }
        let e = document.getElementById(id);
        if (!e) {
            console.log("domElm Error. Required element id not found: " + id);
        }

        return Polymer.dom(e);
    }

    polyElmNode(id: string): any {
        let e = util.polyElm(id);
        return e.node;
    }

    isObject(obj: any): boolean {
        return obj && obj.length != 0;
    }

    currentTimeMillis(): number {
        return new Date().getMilliseconds();
    }

    emptyString(val: string): boolean {
        return !val || val.length == 0;
    }

    getInputVal(id: string): any {
        return util.polyElm(id).node.value;
    }

    /* returns true if element was found, or false if element not found */
    setInputVal(id: string, val: string): boolean {
        if (val == null) {
            val = "";
        }
        let elm = util.polyElm(id);
        if (elm) {
            elm.node.value = val;
        }
        return elm != null;
    }

    bindEnterKey(id: string, func: Function) {
        if (typeof func !== 'function') throw "bindEnterKey requires function";
        domBind.addKeyPress(id, (e) => {
            if (e.which == 13) { // 13==enter key code
                func();
                return false;
            }
        });
    }

    /*
     * displays message (msg) of object is not of specified type
     */
    verifyType(obj: any, type: any, msg: string) {
        if (typeof obj !== type) {
            util.showMessage(msg);
            return false;
        }
        return true;
    }

    setHtml(id: string, content: string): void {
        if (content == null) {
            content = "";
        }

        let elm: HTMLElement = util.domElm(id);
        let polyElm = Polymer.dom(elm);

        //For Polymer 1.0.0, you need this...
        //polyElm.node.innerHTML = content;

        polyElm.innerHTML = content;

        Polymer.dom.flush();
        Polymer.updateStyles();
    }

    setElmDisplayById(id: string, showing: boolean) {
        let elm: HTMLElement = util.domElm(id);
        if (elm) {
            util.setElmDisplay(elm, showing);
        }
    }

    setElmDisplay(elm: any, showing: boolean) {
        elm.style.display = showing ? "" : "none";
    }


    getPropertyCount(obj: Object): number {
        let count = 0;
        let prop;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }

    forEachElmBySel(sel: string, callback: Function): void {
        let elements = document.querySelectorAll(sel);
        Array.prototype.forEach.call(elements, callback);
    }

    /* Iterates by callling callback with property key/value pairs for each property in the object */
    forEachProp(obj: Object, callback: I.PropertyIterator): void {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                /* we use the unusual '== false' here so that returning a value is optional, but if you return false it terminates looping */
                if (callback(prop, obj[prop]) == false) return;
            }
        }
    }

    forEachArrElm(elements: any[], callback: Function): void {
        Array.prototype.forEach.call(elements, callback);
    }

    /*
     * iterates over an object creating a string containing it's keys and values
     */
    printObject(obj: Object): string {
        if (!obj) {
            return "null";
        }

        let val: string = ""
        try {
            let count: number = 0;
            util.forEachProp(obj, (prop, v): boolean => {
                console.log("Property[" + count + "]");
                count++;
                return true;
            });

            util.forEachProp(obj, (k, v): boolean => {
                val += k + " , " + v + "\n";
                return true;
            });
        } catch (err) {
            return "err";
        }
        return val;
    }

    /* iterates over an object creating a string containing it's keys */
    printKeys(obj: Object): string {
        if (!obj)
            return "null";

        let val: string = "";
        util.forEachProp(obj, (k, v): boolean => {
            if (!k) {
                k = "null";
            }

            if (val.length > 0) {
                val += ',';
            }
            val += k;
            return true;
        });
        return val;
    }

    /*
     * Makes eleId enabled based on vis flag
     *
     * eleId can be a DOM element or the ID of a dom element, with or without leading #
     */
    setEnablement(elmId: string, enable: boolean): void {

        let elm: HTMLElement = null;
        if (typeof elmId == "string") {
            elm = util.domElm(elmId);
        } else {
            elm = elmId;
        }

        if (elm == null) {
            console.log("setVisibility couldn't find item: " + elmId);
            return;
        }

        (<any>elm).disabled = !enable;
    }

    /* Programatically creates objects by name, similar to what Java reflection does

    * ex: let example = InstanceLoader.getInstance<NamedThing>(window, 'ExampleClass', args...);
    */
    getInstance<T>(context: Object, name: string, ...args: any[]): T {
        let instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T>instance;
    }

    setCookie(name: string, val: string): void {
        let d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + val + ";" + expires + ";path=/";
    }

    deleteCookie(name: string): void {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }

    getCookie(name: string): string {
        name += "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /*
     * Removed oldClass from element and replaces with newClass, and if oldClass is not present it simply adds
     * newClass. If old class existed, in the list of classes, then the new class will now be at that position. If
     * old class didn't exist, then new Class is added at end of class list.
     */
    changeOrAddClass(elmSel: string, oldClass: string, newClass: string) {
        let elm: HTMLElement = util.domElm(elmSel);
        util.removeClassFromElm(elm, oldClass);
        util.addClassToElm(elm, newClass);
    }

    changeOrAddClassToElm(elm: HTMLElement, oldClass: string, newClass: string) {
        util.removeClassFromElm(elm, oldClass);
        util.addClassToElm(elm, newClass);
    }

    removeClassFromElm(el: any, clazz: string): void {
        if (el.classList)
            el.classList.remove(clazz);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + clazz.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    addClassToElmById(id: any, clazz: string): void {
        let elm = util.domElm(id);
        util.addClassToElm(elm, clazz);
    }

    addClassToElm(el: any, clazz: string): void {
        if (el.classList)
            el.classList.add(clazz);
        else
            el.className += ' ' + clazz;
    }

    toggleClassFromElm(el: any, clazz: string): void {
        if (el.classList) {
            el.classList.toggle(clazz);
        } else {
            let classes = el.className.split(' ');
            let existingIndex = classes.indexOf(clazz);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(clazz);

            el.className = classes.join(' ');
        }
    }
}

export let util: Util = new Util();
export default util;
