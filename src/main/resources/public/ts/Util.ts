console.log("Util.ts");

/// <reference types="polymer" />

declare var Polymer: polymer.PolymerStatic;

declare var Dropzone;
declare var ace;
declare var postTargetUrl;
declare var prettyPrint;

import { MessageDlg } from "./dlg/MessageDlg";
import { ProgressDlg } from "./dlg/ProgressDlg";
import { PasswordDlg } from "./dlg/PasswordDlg";
import * as I from "./Interfaces";

import { Factory } from "./Factory";

import { Meta64Intf as Meta64 } from "./intf/Meta64Intf";
import { DomBindIntf as DomBind } from "./intf/DomBindIntf";
import { EncryptionIntf as Encryption } from "./intf/EncryptionIntf";
import { UtilIntf } from "./intf/UtilIntf";
import { Singletons } from "./Singletons";
import { PubSub } from "./PubSub";
import { Constants } from "./Constants";


let meta64: Meta64;
let encryption: Encryption;
let domBind: DomBind;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    meta64 = s.meta64;
    domBind = s.domBind;
    encryption = s.encryption;
});

export class Util implements UtilIntf {

    logAjax: boolean = false;
    timeoutMessageShown: boolean = false;
    offline: boolean = false;

    waitCounter: number = 0;
    pgrsDlg: any = null;

    buf2hex = (arr: Uint8Array): string => {
        //return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');

        //Diferent Algorithm:
        var hexStr = '';
        for (var i = 0; i < arr.length; i++) {
            var hex = (arr[i] & 0xff).toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            hexStr += hex;
        }
        return hexStr;
    }

    hex2buf = (str): Uint8Array => {
        if (!str) {
            return new Uint8Array([]);
        }

        var a = [];
        for (var i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }

        return new Uint8Array(a);
    }

    escapeRegExp = (s: string): string => {
        return s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    escapeForAttrib = (s: string): string => {
        return this.replaceAll(s, "\"", "&quot;");
    }

    unencodeHtml = (s: string): string => {
        if (!this.contains(s, "&"))
            return s;

        let ret = s;
        ret = this.replaceAll(ret, '&amp;', '&');
        ret = this.replaceAll(ret, '&gt;', '>');
        ret = this.replaceAll(ret, '&lt;', '<');
        ret = this.replaceAll(ret, '&quot;', '"');
        ret = this.replaceAll(ret, '&#39;', "'");

        return ret;
    }

    replaceAll = (s: string, find: string, replace: string): string => {
        if (!s) return s;
        return s.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }

    contains = (s: string, str: string): boolean => {
        if (!s) return false;
        return s.indexOf(str) != -1;
    }

    startsWith = (s: string, str: string): boolean => {
        if (!s) return false;
        return s.indexOf(str) === 0;
    }

    endsWith = (s: string, str: string): boolean => {
        return s.indexOf(str, s.length - str.length) !== -1;
    }

    chopAtLastChar = (str: string, char: string): string => {
        let idx = str.lastIndexOf(char);
        if (idx != -1) {
            return str.substring(0, idx);
        }
        else {
            return str;
        }
    }

    stripIfStartsWith = (s: string, str: string): string => {
        if (this.startsWith(s, str)) {
            return s.substring(str.length);
        }
        return s;
    }

    arrayClone(a: any[]): any[] {
        return a.slice(0);
    };

    arrayIndexOfItemByProp = (a: any[], propName: string, propVal: string): number => {
        let len = a.length;
        for (let i = 0; i < len; i++) {
            if (a[i][propName] === propVal) {
                return i;
            }
        }
        return -1;
    };

    arrayMoveItem = (a: any[], fromIndex: number, toIndex: number) => {
        a.splice(toIndex, 0, a.splice(fromIndex, 1)[0]);
    };

    stdTimezoneOffset = (date: Date) => {
        let jan = new Date(date.getFullYear(), 0, 1);
        let jul = new Date(date.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    dst = (date: Date) => {
        return date.getTimezoneOffset() < this.stdTimezoneOffset(date);
    }

    indexOfObject = (arr: any[], obj) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    assertNotNull = (varName) => {
        if (typeof eval(varName) === 'undefined') {
            this.showMessage("Variable not found: " + varName);
        }
    }

    /*
     * We use this variable to determine if we are waiting for an ajax call, but the server also enforces that each
     * session is only allowed one concurrent call and simultaneous calls would just "queue up".
     */
    private _ajaxCounter: number = 0;

    daylightSavingsTime: boolean = (this.dst(new Date())) ? true : false;

    getCheckBoxStateById = (id: string): boolean => {
        let checkbox = this.domElm(id);
        if (checkbox) {
            return (<any>checkbox).checked;
        }
        else {
            throw "checkbox not found: " + id;
        }
    }

    toJson = (obj: Object) => {
        return JSON.stringify(obj, null, 4);
    }

    /*
     * This came from here:
     * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     */
    getParameterByName = (name?: any, url?: any): string => {
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

    initProgressMonitor = (): void => {
        setInterval(this.progressInterval, 1000);
    }

    progressInterval = (): void => {
        let isWaiting = this.isAjaxWaiting();
        if (isWaiting) {
            this.waitCounter++;
            if (this.waitCounter >= 3) {
                if (!this.pgrsDlg) {
                    let dlg = new ProgressDlg();
                    this.pgrsDlg = dlg;
                    this.pgrsDlg.open();
                }
            }
        } else {
            this.waitCounter = 0;
            if (this.pgrsDlg) {
                this.pgrsDlg.cancel();
                this.pgrsDlg = null;
            }
        }
    }

    getHostAndPort = (): string => {
        return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    }

    ajax = <RequestType, ResponseType>(postName: string, postData: RequestType, //
        callback?: (response: ResponseType) => void) => {

        let ironAjax;
        let ironRequest;

        try {
            if (this.offline) {
                console.log("offline: ignoring call for " + postName);
                return;
            }

            if (this.logAjax) {
                console.log("JSON-POST[gen]: [" + postName + "]" + JSON.stringify(postData));
            }

            /* Do not delete, research this way... */
            // let ironAjax = this.$$ ("#myIronAjax");
            //ironAjax = Polymer.dom((<_HasRoot>)window.document.root).querySelector("#ironAjax");

            ironAjax = this.polyElmNode("ironAjax");
            ironAjax.url = postTargetUrl + postName;
            ironAjax.verbose = true;
            ironAjax.body = JSON.stringify(postData);
            ironAjax.method = "POST";
            ironAjax.contentType = "application/json";

            // specify any url params this way:
            // ironAjax.params='{"alt":"json", "q":"chrome"}';

            ironAjax.handleAs = "json"; // handle-as (is prop)

            /* This not a required property */
            // ironAjax.onResponse = "this.ironAjaxResponse";
            ironAjax.debounceDuration = "300"; // debounce-duration

            this._ajaxCounter++;
            ironRequest = ironAjax.generateRequest();
        } catch (ex) {
            this.logAndReThrow("Failed starting request: " + postName, ex);
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
                    this._ajaxCounter--;
                    this.progressInterval();

                    if (this.logAjax) {
                        console.log("    JSON-RESULT: " + postName + "\n    JSON-RESULT-DATA: "
                            + JSON.stringify(ironRequest.response));
                    }

                    if (typeof callback == "function") {
                        callback(<ResponseType>ironRequest.response);
                    }
                } catch (ex) {
                    this.logAndReThrow("Failed handling result of: " + postName, ex);
                }
            },
            // Handle Fail
            () => {
                try {
                    this._ajaxCounter--;
                    this.progressInterval();
                    console.log("Error in this.json");

                    if (ironRequest.status == "403") {
                        console.log("Not logged in detected in this.");
                        this.offline = true;

                        if (!this.timeoutMessageShown) {
                            this.timeoutMessageShown = true;
                            this.showMessage("Session timed out. Page will refresh.");
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
                    this.showMessage(msg);
                } catch (ex) {
                    this.logAndReThrow("Failed processing server-side fail of: " + postName, ex);
                }
            });
        return ironRequest;
    }

    logAndThrow = (message: string) => {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw message;
    }

    logAndReThrow = (message: string, exception: any) => {
        let stack = "[stack, not supported]";
        try {
            stack = (<any>new Error()).stack;
        }
        catch (e) { }
        console.error(message + "STACK: " + stack);
        throw exception;
    }

    ajaxReady = (requestName): boolean => {
        if (this._ajaxCounter > 0) {
            console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
            return false;
        }
        return true;
    }

    isAjaxWaiting = (): boolean => {
        return this._ajaxCounter > 0;
    }

    focusElmById = (id: string) => {
        let elm = this.domElm(id);
        if (elm) {
            elm.focus();
        }
    }

    //todo-1: Haven't yet verified this is correct, but i'm not using it anywhere important yet.
    isElmVisible = (elm: HTMLElement) => {
        return elm && elm.offsetHeight > 0;
    }

    /* set focus to element by id (id must be actual jquery selector) */
    delayedFocus = (id: string): void => {
        /* so user sees the focus fast we try at .5 seconds */
        setTimeout(() => {
            this.focusElmById(id);
        }, 500);

        /* we try again a full second later. Normally not required, but never undesirable */
        setTimeout(() => {
            //console.log("Focusing ID: "+id);
            this.focusElmById(id);
        }, 1300);
    }

    /*
     * We could have put this logic inside the json method itself, but I can forsee cases where we don't want a
     * message to appear when the json response returns success==false, so we will have to call checkSuccess inside
     * every response method instead, if we want that response to print a message to the user when fail happens.
     *
     * requires: res.success res.message
     */
    checkSuccess = (opFriendlyName, res): boolean => {
        if (!res.success) {
            this.showMessage(opFriendlyName + " failed: " + res.message);
        }
        return res.success;
    }

    showMessage = (message: string): void => {
        new MessageDlg({ "message": message }).open();
    }

    /* adds all array objects to obj as a set */
    addAll = (obj, a): void => {
        for (let i = 0; i < a.length; i++) {
            if (!a[i]) {
                console.error("null element in addAll at idx=" + i);
            } else {
                obj[a[i]] = true;
            }
        }
    }

    nullOrUndef = (obj): boolean => {
        return obj === null || obj === undefined;
    }

    /*
     * We have to be able to map any identifier to a uid, that will be repeatable, so we have to use a local
     * 'hashset-type' implementation
     */
    getUidForId = (map: { [key: string]: string }, id): string => {
        /* look for uid in map */
        let uid: string = map[id];

        /* if not found, get next number, and add to map */
        if (!uid) {
            uid = "" + meta64.nextUid++;
            map[id] = uid;
        }
        return uid;
    }

    elementExists = (id): boolean => {
        if (this.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (this.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }

        let e = document.getElementById(id);
        return e != null;
    }

    /* Takes textarea dom Id (# optional) and returns its value */
    getTextAreaValById = (id): string => {
        let de: HTMLInputElement = <HTMLInputElement>this.domElm(id);
        return de.value;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    domElm = (id): HTMLElement => {

        /* why did i do this? I thought "#id" was valid for getDomElmementById right? */
        if (this.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (this.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }

        let e: HTMLElement = document.getElementById(id);
        //if (!e) {
        //todo-1: periorically uncomment to see if anything is showing up here
        //console.log("domElm Error. Required element id not found: " + id);
        //}
        return e;
    }

    setInnerHTMLById = (id: string, val: string): void => {
        let domElm: HTMLElement = this.domElm(id);
        this.setInnerHTML(domElm, val);
    }

    setInnerHTML = (elm: HTMLElement, val: string): void => {
        if (elm) {
            elm.innerHTML = val;
        }
    }

    poly = (id): any => {
        return this.polyElm(id).node;
    }

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    polyElm = (id: string): any => {

        if (this.startsWith(id, "#")) {
            id = id.substring(1);
        }

        if (this.contains(id, "#")) {
            console.log("Invalid # in domElm");
            return null;
        }
        let e = document.getElementById(id);
        if (!e) {
            console.log("domElm Error. Required element id not found: " + id);
        }

        let elm = Polymer.dom(e);
        return elm;
    }

    polyElmNode = (id: string): any => {
        let e = this.polyElm(id);
        return e.node;
    }

    isObject = (obj: any): boolean => {
        return obj && obj.length != 0;
    }

    currentTimeMillis = (): number => {
        return new Date().getMilliseconds();
    }

    emptyString = (val: string): boolean => {
        return !val || val.length == 0;
    }

    getInputVal = (id: string): any => {
        return this.polyElm(id).node.value;
    }

    /* returns true if element was found, or false if element not found */
    setInputVal = (id: string, val: string): boolean => {
        if (val == null) {
            val = "";
        }
        let elm = this.polyElm(id);
        if (elm) {
            elm.node.value = val;
        }
        return elm != null;
    }

    bindEnterKey = (id: string, func: Function) => {
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
    verifyType = (obj: any, type: any, msg: string) => {
        if (typeof obj !== type) {
            this.showMessage(msg);
            return false;
        }
        return true;
    }

    setHtml = (id: string, content: string): void => {
        if (content == null) {
            content = "";
        }

        let elm: HTMLElement = this.domElm(id);
        let polyElm = Polymer.dom(elm);
        polyElm.innerHTML = content;

        /* the 'flush' call is actually only needed before interrogating the DOM
        for things like height of components, etc */
        Polymer.dom.flush();
        Polymer.Base.updateStyles();
    }

    setElmDisplayById = (id: string, showing: boolean) => {
        let elm: HTMLElement = this.domElm(id);
        if (elm) {
            this.setElmDisplay(elm, showing);
        }
    }

    setElmDisplay = (elm: any, showing: boolean) => {
        elm.style.display = showing ? "" : "none";
    }

    getPropertyCount = (obj: Object): number => {
        let count = 0;
        let prop;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                count++;
            }
        }
        return count;
    }

    forEachElmBySel = (sel: string, callback: Function): void => {
        let elements = document.querySelectorAll(sel);
        Array.prototype.forEach.call(elements, callback);
    }

    /* Equivalent of ES6 Object.assign(). Takes all properties from src and merges them onto dst */
    mergeProps = (dst: Object, src: Object): void => {
        if (!src) return;
        this.forEachProp(src, (k, v): boolean => {
            dst[k] = v;
            return true;
        });
    }

    /* Iterates by callling callback with property key/value pairs for each property in the object */
    forEachProp = (obj: Object, callback: I.PropertyIterator): void => {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                /* we use the unusual '== false' here so that returning a value is optional, but if you return false it terminates looping */
                if (callback(prop, obj[prop]) === false) return;
            }
        }
    }

    forEachArrElm = (elements: any[], callback: Function): void => {
        if (!elements) return;
        Array.prototype.forEach.call(elements, callback);
    }

    /*
     * iterates over an object creating a string containing it's keys and values
     */
    printObject = (obj: Object): string => {
        if (!obj) {
            return "null";
        }

        let val: string = ""
        try {
            let count: number = 0;
            this.forEachProp(obj, (prop, v): boolean => {
                console.log("Property[" + count + "]");
                count++;
                return true;
            });

            this.forEachProp(obj, (k, v): boolean => {
                val += k + " , " + v + "\n";
                return true;
            });
        } catch (err) {
            return "err";
        }
        return val;
    }

    /* iterates over an object creating a string containing it's keys */
    printKeys = (obj: Object): string => {
        if (!obj)
            return "null";

        let val: string = "";
        this.forEachProp(obj, (k, v): boolean => {
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
    setEnablement = (elmId: string, enable: boolean): void => {

        let elm: HTMLElement = null;
        if (typeof elmId == "string") {
            elm = this.domElm(elmId);
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
    getInstance = <T>(context: Object, name: string, ...args: any[]): T => {
        let instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T>instance;
    }

    setCookie = (name: string, val: string): void => {
        let d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + val + ";" + expires + ";path=/";
    }

    deleteCookie = (name: string): void => {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }

    getCookie = (name: string): string => {
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

    changeOrAddClassToElm = (elm: HTMLElement, oldClass: string, newClass: string) => {
        this.removeClassFromElmById((<any>elm.attributes).id, oldClass);
        this.addClassToElmById((<any>elm.attributes).id, newClass);
    }

    /*
     * Removed oldClass from element and replaces with newClass, and if oldClass is not present it simply adds
     * newClass. If old class existed, in the list of classes, then the new class will now be at that position. If
     * old class didn't exist, then new Class is added at end of class list.
     */
    changeOrAddClass = (id: string, oldClass: string, newClass: string) => {
        this.removeClassFromElmById(id, oldClass);
        this.addClassToElmById(id, newClass);
    }

    removeClassFromElmById = (id: string, clazz: string) => {
        domBind.whenElm(id, (elm) => {
            this.removeClassFromElm(elm, clazz);
        });
    }

    removeClassFromElm = (el: any, clazz: string): void => {
        if (el.classList)
            el.classList.remove(clazz);
        else if (el.className) {
            el.className = el.className.replace(new RegExp('(^|\\b)' + clazz.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    addClassToElmById = (id: any, clazz: string): void => {
        //console.log("Adding class "+clazz+" to dom id "+id);
        domBind.whenElm(id, (elm) => {
            //console.log("found dom id, adding class now.");
            this.addClassToElm(elm, clazz);
        });
    }

    addClassToElm = (el: any, clazz: string): void => {
        if (el.classList) {
            //console.log("add to classList " + clazz);
            el.classList.add(clazz);
        }
        else {
            if (el.className) {
                //console.log("appending to className " + clazz);
                el.className += " " + clazz;
            }
            else {
                //console.log("setting className " + clazz);
                el.className = clazz;
            }
        }
    }

    toggleClassFromElm = (el: any, clazz: string): void => {
        if (el.classList) {
            el.classList.toggle(clazz);
        } else {
            if (el.className) {
                let classes = el.className.split(" ");
                let existingIndex = classes.indexOf(clazz);

                if (existingIndex >= 0)
                    classes.splice(existingIndex, 1);
                else
                    classes.push(clazz);

                el.className = classes.join(" ");
            }
            else {
                el.className = clazz;
            }
        }
    }

    /* Returns password promise by depending on a dialog to prompt the user if not yet prompted */
    getPassword = (): Promise<string> => {
        if (encryption.masterPassword != null) {
            return Promise.resolve(encryption.masterPassword);
        }
        else {
            return new Promise<string>((resolve, reject) => {
                let dlg = new PasswordDlg(null);
                let completedDialogPromise = dlg.open();
                completedDialogPromise.then((dlg2) => {
                    encryption.masterPassword = (dlg2 as any).getPasswordVal();
                    resolve(encryption.masterPassword);
                });
            });
        }
    }

    /* Source: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript */
    copyToClipboard = (text) => {
        var copyText: HTMLInputElement = document.createElement("input");
        copyText.type = "text";
        document.body.appendChild(copyText);
        copyText.style.display = "inline";
        copyText.style.width = "1px";
        copyText.value = text;
        copyText.focus();
        document.execCommand("SelectAll");
        document.execCommand("Copy");
        copyText.remove();
    }
}
