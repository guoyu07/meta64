// "use strict";

//todo-0: need to find the DefinitelyTyped file for Polymer.
declare var Polymer;
declare var Dropzone;
declare var ace;
declare var cookiePrefix;
declare var postTargetUrl;
declare var prettyPrint;
declare var BRANDING_TITLE;
declare var BRANDING_TITLE_SHORT;

interface _HasSelect {
    select?: any;
}

/// <reference path="./tyepdefs/jquery/jquery.d.ts" />
/// <reference path="./tyepdefs/jquery.cookie/jquery.cookie.d.ts" />

namespace m64 {
    export namespace json {

        export interface AccessControlEntryInfo {
            principalName: string;
            privileges: PrivilegeInfo[];
        }

        export interface NodeInfo {
            id: string;
            path: string;
            name: string;
            primaryTypeName: string;
            properties: PropertyInfo[];
            hasChildren: boolean;
            hasBinary: boolean;
            binaryIsImage: boolean;
            binVer: number;
            width: number;
            height: number;
            childrenOrdered: boolean;
            uid: string;
            createdBy: string;
            lastModified: Date;
            imgId: string;
            owner: string;
        }

        export interface PrivilegeInfo {
            privilegeName: string;
        }

        export interface PropertyInfo {
            type: number;
            name: string;
            value: string;
            values: string[];
            abbreviated: boolean;
        }

        export interface RefInfo {
            id: string;
            path: string;
        }

        export interface UserPreferences {
            editMode: boolean;
            advancedMode: boolean;
            lastNode: string;
            importAllowed: boolean;
            exportAllowed: boolean;
            showMetaData: boolean;
        }

        export interface AddPrivilegeRequest {
            nodeId: string;
            privileges: string[];
            principal: string;
            publicAppend: boolean;
        }

        export interface AnonPageLoadRequest {
            ignoreUrl: boolean;
        }

        export interface ChangePasswordRequest {
            newPassword: string;
            passCode: string;
        }

        export interface CloseAccountRequest {
        }

        export interface GenerateRSSRequest {
        }

        export interface SetPlayerInfoRequest {
            url: string;
            timeOffset: number;
            //nodePath: string;
        }

        export interface GetPlayerInfoRequest {
            url: string;
        }

        export interface CreateSubNodeRequest {
            nodeId: string;
            newNodeName: string;
            typeName: string;
            createAtTop: boolean;
        }

        export interface DeleteAttachmentRequest {
            nodeId: string;
        }

        export interface DeleteNodesRequest {
            nodeIds: string[];
        }

        export interface DeletePropertyRequest {
            nodeId: string;
            propName: string;
        }

        export interface ExpandAbbreviatedNodeRequest {
            nodeId: string;
        }

        export interface ExportRequest {
            nodeId: string;
            targetFileName: string;
        }

        export interface GetNodePrivilegesRequest {
            nodeId: string;
            includeAcl: boolean;
            includeOwners: boolean;
        }

        export interface GetServerInfoRequest {
        }

        export interface GetSharedNodesRequest {
            nodeId: string;
        }

        export interface ImportRequest {
            nodeId: string;
            sourceFileName: string;
        }

        export interface InitNodeEditRequest {
            nodeId: string;
        }

        export interface InsertBookRequest {
            nodeId: string;
            bookName: string;
            truncated: boolean;
        }

        export interface InsertNodeRequest {
            parentId: string;
            targetName: string;
            newNodeName: string;
            typeName: string;
        }

        export interface LoginRequest {
            userName: string;
            password: string;
            tzOffset: number;
            dst: boolean;
        }

        export interface LogoutRequest {
        }

        export interface MoveNodesRequest {
            targetNodeId: string;
            targetChildId: string;
            nodeIds: string[];
        }

        export interface NodeSearchRequest {
            sortDir: string;
            sortField: string;
            nodeId: string;
            searchText: string;
            searchProp: string;
        }

        export interface FileSearchRequest {
            nodeId: string;
            searchText: string;
            reindex: boolean
        }

        export interface RemovePrivilegeRequest {
            nodeId: string;
            principal: string;
            privilege: string;
        }

        export interface RenameNodeRequest {
            nodeId: string;
            newName: string;
        }

        export interface RenderNodeRequest {
            nodeId: string;
            upLevel: number;
            offset: number;
            renderParentIfLeaf: boolean;
            goToLastPage: boolean;
        }

        export interface ResetPasswordRequest {
            user: string;
            email: string;
        }

        export interface SaveNodeRequest {
            nodeId: string;
            properties: PropertyInfo[];
            sendNotification: boolean;
        }

        export interface SavePropertyRequest {
            nodeId: string;
            propertyName: string;
            propertyValue: string;
        }

        export interface SaveUserPreferencesRequest {
            userPreferences: UserPreferences;
        }

        export interface OpenSystemFileRequest {
            fileName: string;
        }

        export interface SetNodePositionRequest {
            parentNodeId: string;
            nodeId: string;
            siblingId: string;
        }

        export interface SignupRequest {
            userName: string;
            password: string;
            email: string;
            captcha: string;
        }

        export interface SplitNodeRequest {
            nodeId: string;
            nodeBelowId: string;
            delimiter: string;
        }

        export interface UploadFromUrlRequest {
            nodeId: string;
            sourceUrl: string;
        }

        export interface BrowseFolderRequest {
            nodeId: string;
        }

        export interface AddPrivilegeResponse extends OakResponseBase {
        }

        export interface AnonPageLoadResponse extends OakResponseBase {
            content: string;
            renderNodeResponse: RenderNodeResponse;
        }

        export interface ChangePasswordResponse extends OakResponseBase {
            user: string;
        }

        export interface CloseAccountResponse extends OakResponseBase {
        }

        export interface GenerateRSSResponse extends OakResponseBase {
        }

        export interface SetPlayerInfoResponse extends OakResponseBase {
        }

        export interface GetPlayerInfoResponse extends OakResponseBase {
            timeOffset: number;
        }

        export interface CreateSubNodeResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface DeleteAttachmentResponse extends OakResponseBase {
        }

        export interface DeleteNodesResponse extends OakResponseBase {
        }

        export interface DeletePropertyResponse extends OakResponseBase {
        }

        export interface ExpandAbbreviatedNodeResponse extends OakResponseBase {
            nodeInfo: NodeInfo;
        }

        export interface ExportResponse extends OakResponseBase {
        }

        export interface GetNodePrivilegesResponse extends OakResponseBase {
            aclEntries: AccessControlEntryInfo[];
            owners: string[];
            publicAppend: boolean;
        }

        export interface GetServerInfoResponse extends OakResponseBase {
            serverInfo: string;
        }

        export interface GetSharedNodesResponse extends OakResponseBase {
            searchResults: NodeInfo[];
        }

        export interface ImportResponse extends OakResponseBase {
        }

        export interface InitNodeEditResponse extends OakResponseBase {
            nodeInfo: NodeInfo;
        }

        export interface InsertBookResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface InsertNodeResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface LoginResponse extends OakResponseBase {
            rootNode: RefInfo;
            userName: string;
            anonUserLandingPageNode: string;
            homeNodeOverride: string;
            userPreferences: UserPreferences;
            allowFileSystemSearch: boolean;
        }

        export interface LogoutResponse extends OakResponseBase {
        }

        export interface MoveNodesResponse extends OakResponseBase {
        }

        export interface NodeSearchResponse extends OakResponseBase {
            searchResults: NodeInfo[];
        }

        export interface FileSearchResponse extends OakResponseBase {
            searchResultNodeId: string;
        }

        export interface RemovePrivilegeResponse extends OakResponseBase {
        }

        export interface RenameNodeResponse extends OakResponseBase {
            newId: string;
        }

        export interface RenderNodeResponse extends OakResponseBase {
            node: NodeInfo;
            children: NodeInfo[];
            offsetOfNodeFound: number;

            /* holds true if we hit the end of the list of child nodes */
            endReached: boolean;

            displayedParent: boolean;
        }

        export interface ResetPasswordResponse extends OakResponseBase {
        }

        export interface SaveNodeResponse extends OakResponseBase {
            node: NodeInfo;
        }

        export interface SavePropertyResponse extends OakResponseBase {
            propertySaved: PropertyInfo;
        }

        export interface SaveUserPreferencesResponse extends OakResponseBase {
        }

        export interface OpenSystemFileResponse extends OakResponseBase {
        }

        export interface SetNodePositionResponse extends OakResponseBase {
        }

        export interface SignupResponse extends OakResponseBase {
        }

        export interface SplitNodeResponse extends OakResponseBase {
        }

        export interface UploadFromUrlResponse extends OakResponseBase {
        }

        export interface BrowseFolderResponse extends OakResponseBase {
            listingJson: string;
        }

        export interface OakResponseBase {
            success: boolean;
            message: string;
        }

    }

    export namespace cnst {

        export let ANON: string = "anonymous";
        export let COOKIE_LOGIN_USR: string = cookiePrefix + "loginUsr";
        export let COOKIE_LOGIN_PWD: string = cookiePrefix + "loginPwd";
        /*
         * loginState="0" if user logged out intentionally. loginState="1" if last known state of user was 'logged in'
         */
        export let COOKIE_LOGIN_STATE: string = cookiePrefix + "loginState";
        export let BR: "<div class='vert-space'></div>";
        export let INSERT_ATTACHMENT: string = "{{insert-attachment}}";
        export let NEW_ON_TOOLBAR: boolean = false;
        export let INS_ON_TOOLBAR: boolean = false;
        export let MOVE_UPDOWN_ON_TOOLBAR: boolean = true;

        /*
         * This works, but I'm not sure I want it for ALL editing. Still thinking about design here, before I turn this
         * on.
         */
        export let USE_ACE_EDITOR: boolean = false;

        /* showing path on rows just wastes space for ordinary users. Not really needed */
        export let SHOW_PATH_ON_ROWS: boolean = true;
        export let SHOW_PATH_IN_DLGS: boolean = true;

        export let SHOW_CLEAR_BUTTON_IN_EDITOR: boolean = false;
    }

    /* These are Client-side only models, and are not seen on the server side ever */

    /* Models a time-range in some media where an AD starts and stops */
    export class AdSegment {
        constructor(public beginTime: number,//
            public endTime: number) {
        }
    }

    export class PropEntry {
        constructor(public id: string, //
            public property: json.PropertyInfo, //
            public multi: boolean, //
            public readOnly: boolean, //
            public binary: boolean, //
            public subProps: SubProp[]) {
        }
    }

    export class SubProp {
        constructor(public id: string, //
            public val: string) {
        }
    }

    export namespace util {

        export let logAjax: boolean = false;
        export let timeoutMessageShown: boolean = false;
        export let offline: boolean = false;

        export let waitCounter: number = 0;
        export let pgrsDlg: any = null;

        export let escapeRegExp = function(_) {
            return _.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        export let escapeForAttrib = function(_) {
            return util.replaceAll(_, "\"", "&quot;");
        }

        export let unencodeHtml = function(_) {
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

        export let replaceAll = function(_, find, replace) {
            return _.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
        }

        export let contains = function(_, str) {
            return _.indexOf(str) != -1;
        }

        export let startsWith = function(_, str) {
            return _.indexOf(str) === 0;
        }

        export let stripIfStartsWith = function(_, str) {
            if (_.startsWith(str)) {
                return _.substring(str.length);
            }
            return _;
        }

        export let arrayClone = function(_: any[]) {
            return _.slice(0);
        };

        export let arrayIndexOfItemByProp = function(_: any[], propName, propVal) {
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
        export let arrayMoveItem = function(_: any[], fromIndex, toIndex) {
            _.splice(toIndex, 0, _.splice(fromIndex, 1)[0]);
        };

        export let stdTimezoneOffset = function(_: Date) {
            var jan = new Date(_.getFullYear(), 0, 1);
            var jul = new Date(_.getFullYear(), 6, 1);
            return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        }

        export let dst = function(_: Date) {
            return _.getTimezoneOffset() < stdTimezoneOffset(_);
        }

        export let indexOfObject = function(_: any[], obj) {
            for (var i = 0; i < _.length; i++) {
                if (_[i] === obj) {
                    return i;
                }
            }
            return -1;
        }

        //this blows the hell up, not sure why.
        //	Object.prototype.toJson = function() {
        //		return JSON.stringify(this, null, 4);
        //	};

        export let assertNotNull = function(varName) {
            if (typeof eval(varName) === 'undefined') {
                (new MessageDlg("Variable not found: " + varName)).open()
            }
        }

        /*
         * We use this variable to determine if we are waiting for an ajax call, but the server also enforces that each
         * session is only allowed one concurrent call and simultaneous calls would just "queue up".
         */
        let _ajaxCounter: number = 0;

        export let daylightSavingsTime: boolean = (util.dst(new Date())) ? true : false;

        export let toJson = function(obj) {
            return JSON.stringify(obj, null, 4);
        }

		/*
		 * This came from here:
		 * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
		 */
        export let getParameterByName = function(name?: any, url?: any): string {
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

		/*
		 * Sets up an inheritance relationship so that child inherits from parent, and then returns the prototype of the
		 * child so that methods can be added to it, which will behave like member functions in classic OOP with
		 * inheritance hierarchies.
		 */
        export let inherit = function(parent, child): any {
            child.prototype.constructor = child;
            child.prototype = Object.create(parent.prototype);
            return child.prototype;
        }

        export let initProgressMonitor = function(): void {
            setInterval(progressInterval, 1000);
        }

        export let progressInterval = function(): void {
            var isWaiting = isAjaxWaiting();
            if (isWaiting) {
                waitCounter++;
                if (waitCounter >= 3) {
                    if (!pgrsDlg) {
                        pgrsDlg = new ProgressDlg();
                        pgrsDlg.open();
                    }
                }
            } else {
                waitCounter = 0;
                if (pgrsDlg) {
                    pgrsDlg.cancel();
                    pgrsDlg = null;
                }
            }
        }

        export let json = function <RequestType, ResponseType>(postName: any, postData: RequestType, //
            callback?: (response: ResponseType, payload?: any) => any, callbackThis?: any, callbackPayload?: any) {

            if (callbackThis === window) {
                console.log("PROBABLE BUG: json call for " + postName + " used global 'window' as 'this', which is almost never going to be correct.");
            }

            var ironAjax;
            var ironRequest;

            try {
                if (offline) {
                    console.log("offline: ignoring call for " + postName);
                    return;
                }

                if (logAjax) {
                    console.log("JSON-POST[gen]: [" + postName + "]" + JSON.stringify(postData));
                }

                /* Do not delete, research this way... */
                // var ironAjax = this.$$("#myIronAjax");
                //ironAjax = Polymer.dom((<_HasRoot>)window.document.root).querySelector("#ironAjax");

                ironAjax = polyElmNode("ironAjax");

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

                _ajaxCounter++;
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
                        _ajaxCounter--;
                        progressInterval();

                        if (logAjax) {
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
                        logAndReThrow("Failed handling result of: " + postName, ex);
                    }

                },
                // Handle Fail
                function() {
                    try {
                        _ajaxCounter--;
                        progressInterval();
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

                        let msg: string = "Server request failed.\n\n";

                        /* catch block should fail silently */
                        try {
                            msg += "Status: " + ironRequest.statusText + "\n";
                            msg += "Code: " + ironRequest.status + "\n";
                        } catch (ex) {
                        }

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
                        (new MessageDlg(msg)).open();
                    } catch (ex) {
                        logAndReThrow("Failed processing server-side fail of: " + postName, ex);
                    }
                });

            return ironRequest;
        }

        export let logAndThrow = function(message: string) {
            let stack = "[stack, not supported]";
            try {
                stack = (<any>new Error()).stack;
            }
            catch (e) { }
            console.error(message + "STACK: " + stack);
            throw message;
        }

        export let logAndReThrow = function(message: string, exception: any) {
            let stack = "[stack, not supported]";
            try {
                stack = (<any>new Error()).stack;
            }
            catch (e) { }
            console.error(message + "STACK: " + stack);
            throw exception;
        }

        export let ajaxReady = function(requestName): boolean {
            if (_ajaxCounter > 0) {
                console.log("Ignoring requests: " + requestName + ". Ajax currently in progress.");
                return false;
            }
            return true;
        }

        export let isAjaxWaiting = function(): boolean {
            return _ajaxCounter > 0;
        }

        /* set focus to element by id (id must be actual jquery selector) */
        export let delayedFocus = function(id): void {
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
        export let checkSuccess = function(opFriendlyName, res): boolean {
            if (!res.success) {
                (new MessageDlg(opFriendlyName + " failed: " + res.message)).open();
            }
            return res.success;
        }

        /* adds all array objects to obj as a set */
        export let addAll = function(obj, a): void {
            for (var i = 0; i < a.length; i++) {
                if (!a[i]) {
                    console.error("null element in addAll at idx=" + i);
                } else {
                    obj[a[i]] = true;
                }
            }
        }

        export let nullOrUndef = function(obj): boolean {
            return obj === null || obj === undefined;
        }

		/*
		 * We have to be able to map any identifier to a uid, that will be repeatable, so we have to use a local
		 * 'hashset-type' implementation
		 */
        export let getUidForId = function(map: { [key: string]: string }, id): string {
            /* look for uid in map */
            let uid: string = map[id];

            /* if not found, get next number, and add to map */
            if (!uid) {
                uid = "" + meta64.nextUid++;
                map[id] = uid;
            }
            return uid;
        }

        export let elementExists = function(id): boolean {
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
        export let getTextAreaValById = function(id): string {
            var de: HTMLElement = domElm(id);
            return (<HTMLInputElement>de).value;
        }

		/*
		 * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
		 */
        export let domElm = function(id): any {
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

        export let poly = function(id): any {
            return polyElm(id).node;
        }

		/*
		 * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
		 */
        export let polyElm = function(id: string): any {

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

        export let polyElmNode = function(id: string): any {
            var e = polyElm(id);
            return e.node;
        }

		/*
		 * Gets the element and displays an error message if it's not found
		 */
        export let getRequiredElement = function(id: string): any {
            var e = $(id);
            if (e == null) {
                console.log("getRequiredElement. Required element id not found: " + id);
            }
            return e;
        }

        export let isObject = function(obj: any): boolean {
            return obj && obj.length != 0;
        }

        export let currentTimeMillis = function(): number {
            return new Date().getMilliseconds();
        }

        export let emptyString = function(val: string): boolean {
            return !val || val.length == 0;
        }

        export let getInputVal = function(id: string): any {
            return polyElm(id).node.value;
        }

        /* returns true if element was found, or false if element not found */
        export let setInputVal = function(id: string, val: string): boolean {
            if (val == null) {
                val = "";
            }
            var elm = polyElm(id);
            if (elm) {
                elm.node.value = val;
            }
            return elm != null;
        }

        export let bindEnterKey = function(id: string, func: any) {
            bindKey(id, func, 13);
        }

        export let bindKey = function(id: string, func: any, keyCode: any): boolean {
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
        export let changeOrAddClass = function(elm: string, oldClass: string, newClass: string) {
            var elmement = $(elm);
            elmement.toggleClass(oldClass, false);
            elmement.toggleClass(newClass, true);
        }

		/*
		 * displays message (msg) of object is not of specified type
		 */
        export let verifyType = function(obj: any, type: any, msg: string) {
            if (typeof obj !== type) {
                (new MessageDlg(msg)).open();
                return false;
            }
            return true;
        }

        export let setHtml = function(id: string, content: string): void {
            if (content == null) {
                content = "";
            }

            var elm = domElm(id);
            var polyElm = Polymer.dom(elm);

            //For Polymer 1.0.0, you need this...
            //polyElm.node.innerHTML = content;

            polyElm.innerHTML = content;

            Polymer.dom.flush();
            Polymer.updateStyles();
        }

        export let getPropertyCount = function(obj: Object): number {
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
        export let printObject = function(obj: Object): string {
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
        export let printKeys = function(obj: Object): string {
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
        export let setEnablement = function(elmId: string, enable: boolean): void {

            var elm = null;
            if (typeof elmId == "string") {
                elm = domElm(elmId);
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
        export let setVisibility = function(elmId: string, vis: boolean): void {

            var elm = null;
            if (typeof elmId == "string") {
                elm = domElm(elmId);
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
        export let getInstance = function <T>(context: Object, name: string, ...args: any[]): T {
            var instance = Object.create(context[name].prototype);
            instance.constructor.apply(instance, args);
            return <T>instance;
        }
    }

    export namespace jcrCnst {

        export let COMMENT_BY: string = "commentBy";
        export let PUBLIC_APPEND: string = "publicAppend";
        export let PRIMARY_TYPE: string = "jcr:primaryType";
        export let POLICY: string = "rep:policy";

        export let MIXIN_TYPES: string = "jcr:mixinTypes";

        export let EMAIL_CONTENT: string = "jcr:content";
        export let EMAIL_RECIP: string = "recip";
        export let EMAIL_SUBJECT: string = "subject";

        export let CREATED: string = "jcr:created";
        export let CREATED_BY: string = "jcr:createdBy";
        export let CONTENT: string = "jcr:content";
        export let TAGS: string = "tags";
        export let UUID: string = "jcr:uuid";
        export let LAST_MODIFIED: string = "jcr:lastModified";
        export let LAST_MODIFIED_BY: string = "jcr:lastModifiedBy";
        export let JSON_FILE_SEARCH_RESULT: string = "meta64:json";

        export let DISABLE_INSERT: string = "disableInsert";

        export let USER: string = "user";
        export let PWD: string = "pwd";
        export let EMAIL: string = "email";
        export let CODE: string = "code";

        export let BIN_VER: string = "binVer";
        export let BIN_DATA: string = "jcrData";
        export let BIN_MIME: string = "jcr:mimeType";

        export let IMG_WIDTH: string = "imgWidth";
        export let IMG_HEIGHT: string = "imgHeight";
    }

    export namespace attachment {
        /* Node being uploaded to */
        export let uploadNode: any = null;

        export let openUploadFromFileDlg = function(): void {
            let node: json.NodeInfo = meta64.getHighlightedNode();
            if (!node) {
                uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }

            uploadNode = node;
            (new UploadFromFileDropzoneDlg()).open();

            /* Note: To run legacy uploader just put this version of the dialog here, and
            nothing else is required. Server side processing is still in place for it

            (new UploadFromFileDlg()).open();
            */
        }

        export let openUploadFromUrlDlg = function(): void {
            let node: json.NodeInfo = meta64.getHighlightedNode();

            if (!node) {
                uploadNode = null;
                (new MessageDlg("No node is selected.")).open();
                return;
            }

            uploadNode = node;
            (new UploadFromUrlDlg()).open();
        }

        export let deleteAttachment = function(): void {
            let node: json.NodeInfo = meta64.getHighlightedNode();

            if (node) {
                (new ConfirmDlg("Confirm Delete Attachment", "Delete the Attachment on the Node?", "Yes, delete.",
                    function() {
                        util.json<json.DeleteAttachmentRequest, json.DeleteAttachmentResponse>("deleteAttachment", {
                            "nodeId": node.id
                        }, deleteAttachmentResponse, null, node.uid);
                    })).open();
            }
        }

        export let deleteAttachmentResponse = function(res: json.DeleteAttachmentResponse, uid: any): void {
            if (util.checkSuccess("Delete attachment", res)) {
                meta64.removeBinaryByUid(uid);
                // force re-render from local data.
                meta64.goToMainPage(true);
            }
        }
    }

    export namespace edit {

        export let createNode = function(): void {
            (new m64.CreateNodeDlg()).open();
        }

        let insertBookResponse = function(res: json.InsertBookResponse): void {
            console.log("insertBookResponse running.");

            util.checkSuccess("Insert Book", res);
            view.refreshTree(null, false);
            meta64.selectTab("mainTabName");
            view.scrollToSelectedNode();
        }

        let deleteNodesResponse = function(res: json.DeleteNodesResponse, payload: Object): void {
            if (util.checkSuccess("Delete node", res)) {
                meta64.clearSelectedNodes();
                let highlightId: string = null;
                if (payload) {
                    let selNode = payload["postDeleteSelNode"];
                    if (selNode) {
                        highlightId = selNode.id;
                    }
                }

                view.refreshTree(null, false, highlightId);
            }
        }

        let initNodeEditResponse = function(res: json.InitNodeEditResponse): void {
            if (util.checkSuccess("Editing node", res)) {
                let node: json.NodeInfo = res.nodeInfo;
                let isRep: boolean = util.startsWith(node.name, "rep:") || /* meta64.currentNodeData. bug? */
                    util.contains(node.path, "/rep:");

                /* if this is a comment node and we are the commenter */
                let editingAllowed: boolean = props.isOwnedCommentNode(node);

                if (!editingAllowed) {
                    editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                        && !props.isNonOwnedNode(node);
                }

                if (editingAllowed) {
                    /*
                     * Server will have sent us back the raw text content, that should be markdown instead of any HTML, so
                     * that we can display this and save.
                     */
                    editNode = res.nodeInfo;
                    editNodeDlgInst = new EditNodeDlg();
                    editNodeDlgInst.open();
                } else {
                    (new MessageDlg("You cannot edit nodes that you don't own.")).open();
                }
            }
        }

        let moveNodesResponse = function(res: json.MoveNodesResponse): void {
            if (util.checkSuccess("Move nodes", res)) {
                nodesToMove = null; // reset
                nodesToMoveSet = {};
                view.refreshTree(null, false);
            }
        }

        let setNodePositionResponse = function(res: json.SetNodePositionResponse): void {
            if (util.checkSuccess("Change node position", res)) {
                meta64.refresh();
            }
        }

        export let showReadOnlyProperties: boolean = true;
        /*
         * Node ID array of nodes that are ready to be moved when user clicks 'Finish Moving'
         */
        export let nodesToMove: any = null;

        /* todo-1: need to find out if there's a better way to do an ordered set in javascript so I don't need
        both nodesToMove and nodesToMoveSet
        */
        export let nodesToMoveSet: Object = {};

        export let parentOfNewNode: json.NodeInfo = null;

        /*
         * indicates editor is displaying a node that is not yet saved on the server
         */
        export let editingUnsavedNode: boolean = false;

        /*
         * node (NodeInfo.java) that is being created under when new node is created
         */
        export let sendNotificationPendingSave: boolean = false;

        /*
         * Node being edited
         *
         * todo-2: this and several other variables can now be moved into the dialog class? Is that good or bad
         * coupling/responsibility?
         */
        export let editNode: json.NodeInfo = null;

        /* Instance of EditNodeDialog: For now creating new one each time */
        export let editNodeDlgInst: EditNodeDlg = null;

        /*
         * type=NodeInfo.java
         *
         * When inserting a new node, this holds the node that was clicked on at the time the insert was requested, and
         * is sent to server for ordinal position assignment of new node. Also if this var is null, it indicates we are
         * creating in a 'create under parent' mode, versus non-null meaning 'insert inline' type of insert.
         *
         */
        export let nodeInsertTarget: any = null;

        /* returns true if we can 'try to' insert under 'node' or false if not */
        export let isEditAllowed = function(node: any): boolean {
            return meta64.userPreferences.editMode && node.path != "/" &&
                /*
                 * Check that if we have a commentBy property we are the commenter, before allowing edit button also.
                 */
                (!props.isNonOwnedCommentNode(node) || props.isOwnedCommentNode(node)) //
                && !props.isNonOwnedNode(node);
        }

        /* best we can do here is allow the disableInsert prop to be able to turn things off, node by node */
        export let isInsertAllowed = function(node: any): boolean {
            return props.getNodePropertyVal(jcrCnst.DISABLE_INSERT, node) == null;
        }

        export let startEditingNewNode = function(typeName?: string, createAtTop?: boolean): void {
            editingUnsavedNode = false;
            editNode = null;
            editNodeDlgInst = new EditNodeDlg(typeName, createAtTop);
            editNodeDlgInst.saveNewNode("");
        }

        /*
         * called to display editor that will come up BEFORE any node is saved onto the server, so that the first time
         * any save is performed we will have the correct node name, at least.
         *
         * This version is no longer being used, and currently this means 'editingUnsavedNode' is not currently ever
         * triggered. The new approach now that we have the ability to 'rename' nodes is to just create one with a
         * random name an let user start editing right away and then rename the node IF a custom node name is needed.
         *
         * This means if we call this function (startEditingNewNodeWithName) instead of 'startEditingNewNode()'
         * that will cause the GUI to always prompt for the node name before creating the node. This was the original
         * functionality and still works.
         */
        export let startEditingNewNodeWithName = function(): void {
            editingUnsavedNode = true;
            editNode = null;
            editNodeDlgInst = new EditNodeDlg();
            editNodeDlgInst.open();
        }

        export let insertNodeResponse = function(res: json.InsertNodeResponse): void {
            if (util.checkSuccess("Insert node", res)) {
                meta64.initNode(res.newNode, true);
                meta64.highlightNode(res.newNode, true);
                runEditNode(res.newNode.uid);
            }
        }

        export let createSubNodeResponse = function(res: json.CreateSubNodeResponse): void {
            if (util.checkSuccess("Create subnode", res)) {
                meta64.initNode(res.newNode, true);
                runEditNode(res.newNode.uid);
            }
        }

        export let saveNodeResponse = function(res: json.SaveNodeResponse, payload: any): void {
            if (util.checkSuccess("Save node", res)) {
                /* becasuse I don't understand 'editingUnsavedNode' variable any longer until i refresh my memory, i will use
                the old approach of refreshing entire tree rather than more efficient refresnNodeOnPage, becuase it requires
                the node to already be on the page, and this requires in depth analys i'm not going to do right this minute.
                */
                //render.refreshNodeOnPage(res.node);
                view.refreshTree(null, false, payload.savedId);
                meta64.selectTab("mainTabName");
            }
        }

        export let editMode = function(modeVal?: boolean): void {
            if (typeof modeVal != 'undefined') {
                meta64.userPreferences.editMode = modeVal;
            }
            else {
                meta64.userPreferences.editMode = meta64.userPreferences.editMode ? false : true;
            }
            // todo-3: really edit mode button needs to be some kind of button
            // that can show an on/off state.
            render.renderPageFromData();

            /*
             * Since edit mode turns on lots of buttons, the location of the node we are viewing can change so much it
             * goes completely offscreen out of view, so we scroll it back into view every time
             */
            view.scrollToSelectedNode();

            meta64.saveUserPreferences();
        }

        export let moveNodeUp = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": "[nodeAbove]"
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeDown = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": "[nodeBelow]",
                    "siblingId": node.name
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeToTop = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeId,
                    "nodeId": node.name,
                    "siblingId": "[topNode]"
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        export let moveNodeToBottom = function(uid?: string): void {
            /* if no uid was passed, use the highlighted node */
            if (!uid) {
                let selNode: json.NodeInfo = meta64.getHighlightedNode();
                uid = selNode.uid;
            }

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (node) {
                util.json<json.SetNodePositionRequest, json.SetNodePositionResponse>("setNodePosition", {
                    "parentNodeId": meta64.currentNodeData.node.id,
                    "nodeId": node.name,
                    "siblingId": null
                }, setNodePositionResponse);
            } else {
                console.log("idToNodeMap does not contain " + uid);
            }
        }

        /*
         * Returns the node above the specified node or null if node is itself the top node
         */
        export let getNodeAbove = function(node): any {
            let ordinal: number = meta64.getOrdinalOfNode(node);
            if (ordinal <= 0)
                return null;
            return meta64.currentNodeData.children[ordinal - 1];
        }

        /*
         * Returns the node below the specified node or null if node is itself the bottom node
         */
        export let getNodeBelow = function(node: any): json.NodeInfo {
            let ordinal: number = meta64.getOrdinalOfNode(node);
            console.log("ordinal = " + ordinal);
            if (ordinal == -1 || ordinal >= meta64.currentNodeData.children.length - 1)
                return null;

            return meta64.currentNodeData.children[ordinal + 1];
        }

        export let getFirstChildNode = function(): any {
            if (!meta64.currentNodeData || !meta64.currentNodeData.children) return null;
            return meta64.currentNodeData.children[0];
        }

        export let runEditNode = function(uid: any): void {
            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                editNode = null;
                (new MessageDlg("Unknown nodeId in editNodeClick: " + uid)).open();
                return;
            }
            editingUnsavedNode = false;

            util.json<json.InitNodeEditRequest, json.InitNodeEditResponse>("initNodeEdit", {
                "nodeId": node.id
            }, initNodeEditResponse);
        }

        export let insertNode = function(uid?: any, typeName?: string): void {

            parentOfNewNode = meta64.currentNode;
            if (!parentOfNewNode) {
                console.log("Unknown parent");
                return;
            }

            /*
             * We get the node selected for the insert position by using the uid if one was passed in or using the
             * currently highlighted node if no uid was passed.
             */
            let node: json.NodeInfo = null;
            if (!uid) {
                node = meta64.getHighlightedNode();
            } else {
                node = meta64.uidToNodeMap[uid];
            }

            if (node) {
                nodeInsertTarget = node;
                startEditingNewNode(typeName);
            }
        }

        export let createSubNode = function(uid?: any, typeName?: string, createAtTop?: boolean): void {

            /*
             * If no uid provided we deafult to creating a node under the currently viewed node (parent of current page), or any selected
             * node if there is a selected node.
             */
            if (!uid) {
                let highlightNode: json.NodeInfo = meta64.getHighlightedNode();
                if (highlightNode) {
                    parentOfNewNode = highlightNode;
                }
                else {
                    parentOfNewNode = meta64.currentNode;
                }
            } else {
                parentOfNewNode = meta64.uidToNodeMap[uid];
                if (!parentOfNewNode) {
                    console.log("Unknown nodeId in createSubNode: " + uid);
                    return;
                }
            }

            /*
             * this indicates we are NOT inserting inline. An inline insert would always have a target.
             */
            nodeInsertTarget = null;
            startEditingNewNode(typeName, createAtTop);
        }

        export let replyToComment = function(uid: any): void {
            createSubNode(uid);
        }

        export let clearSelections = function(): void {
            meta64.clearSelectedNodes();

            /*
             * We could write code that only scans for all the "SEL" buttons and updates the state of them, but for now
             * we take the simple approach and just re-render the page. There is no call to the server, so this is
             * actually very efficient.
             */
            render.renderPageFromData();
            meta64.selectTab("mainTabName");
        }

        /*
         * Delete the single node identified by 'uid' parameter if uid parameter is passed, and if uid parameter is not
         * passed then use the node selections for multiple selections on the page.
         */
        export let deleteSelNodes = function(): void {
            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes to delete first.")).open();
                return;
            }

            (new ConfirmDlg("Confirm Delete", "Delete " + selNodesArray.length + " node(s) ?", "Yes, delete.",
                function() {
                    let postDeleteSelNode: json.NodeInfo = getBestPostDeleteSelNode();

                    util.json<json.DeleteNodesRequest, json.DeleteNodesResponse>("deleteNodes", {
                        "nodeIds": selNodesArray
                    }, deleteNodesResponse, null, { "postDeleteSelNode": postDeleteSelNode });
                })).open();
        }

        /* Gets the node we want to scroll to after a delete */
        export let getBestPostDeleteSelNode = function(): json.NodeInfo {
            /* Use a hashmap-type approach to saving all selected nodes into a looup map */
            let nodesMap: Object = meta64.getSelectedNodesAsMapById();
            let bestNode: json.NodeInfo = null;
            let takeNextNode: boolean = false;

            /* now we scan the children, and the last child we encounterd up until we find the rist onen in nodesMap will be the
            node we will want to select and scroll the user to AFTER the deleting is done */
            for (var i = 0; i < meta64.currentNodeData.children.length; i++) {
                let node: json.NodeInfo = meta64.currentNodeData.children[i];

                if (takeNextNode) {
                    return node;
                }

                /* is this node one to be deleted */
                if (nodesMap[node.id]) {
                    takeNextNode = true;
                }
                else {
                    bestNode = node;
                }
            }
            return bestNode;
        }

        export let cutSelNodes = function(): void {

            var selNodesArray = meta64.getSelectedNodeIdsArray();
            if (!selNodesArray || selNodesArray.length == 0) {
                (new MessageDlg("You have not selected any nodes. Select nodes first.")).open();
                return;
            }

            (new ConfirmDlg(
                "Confirm Cut",
                "Cut " + selNodesArray.length + " node(s), to paste/move to new location ?",
                "Yes",
                function() {
                    nodesToMove = selNodesArray;
                    loadNodesToMoveSet(selNodesArray);
                    /* todo-0: need to have a way to find all selected checkboxes in the gui and reset them all to unchecked */
                    meta64.selectedNodes = {}; // clear selections.

                    /* now we render again and the nodes that were cut will disappear from view */
                    render.renderPageFromData();
                    meta64.refreshAllGuiEnablement();
                })).open();
        }

        let loadNodesToMoveSet = function(nodeIds: string[]) {
            nodesToMoveSet = {};
            for (let id of nodeIds) {
                nodesToMoveSet[id] = true;
            }
        }

        export let pasteSelNodes = function(): void {
            (new ConfirmDlg("Confirm Paste", "Paste " + nodesToMove.length + " node(s) under selected parent node ?",
                "Yes, paste.", function() {

                    var highlightNode = meta64.getHighlightedNode();

                    /*
                     * For now, we will just cram the nodes onto the end of the children of the currently selected
                     * page. Later on we can get more specific about allowing precise destination location for moved
                     * nodes.
                     */
                    util.json<json.MoveNodesRequest, json.MoveNodesResponse>("moveNodes", {
                        "targetNodeId": highlightNode.id,
                        "targetChildId": highlightNode != null ? highlightNode.id : null,
                        "nodeIds": nodesToMove
                    }, moveNodesResponse);
                })).open();
        }

        export let insertBookWarAndPeace = function(): void {
            (new ConfirmDlg("Confirm", "Insert book War and Peace?<p/>Warning: You should have an EMPTY node selected now, to serve as the root node of the book!", "Yes, insert book.", function() {

                /* inserting under whatever node user has focused */
                var node = meta64.getHighlightedNode();

                if (!node) {
                    (new MessageDlg("No node is selected.")).open();
                } else {
                    util.json<json.InsertBookRequest, json.InsertBookResponse>("insertBook", {
                        "nodeId": node.id,
                        "bookName": "War and Peace",
                        "truncated": user.isTestUserAccount()
                    }, insertBookResponse);
                }
            })).open();
        }
    }

    export namespace meta64 {

        export let appInitialized: boolean = false;

        export let curUrlPath: string = window.location.pathname + window.location.search;
        export let urlCmd: string;
        export let homeNodeOverride: string;

        export let codeFormatDirty: boolean = false;

        /* used as a kind of 'sequence' in the app, when unique vals a needed */
        export let nextGuid: number = 0;

        /* name of currently logged in user */
        export let userName: string = "anonymous";

        /* screen capabilities */
        export let deviceWidth: number = 0;
        export let deviceHeight: number = 0;

        /*
         * User's root node. Top level of what logged in user is allowed to see.
         */
        export let homeNodeId: string = "";
        export let homeNodePath: string = "";

        /*
         * specifies if this is admin user.
         */
        export let isAdminUser: boolean = false;

        /* always start out as anon user until login */
        export let isAnonUser: boolean = true;
        export let anonUserLandingPageNode: any = null;
        export let allowFileSystemSearch: boolean = false;

        /*
         * signals that data has changed and the next time we go to the main tree view window we need to refresh data
         * from the server
         */
        export let treeDirty: boolean = false;

        /*
         * maps node.uid values to NodeInfo.java objects
         *
         * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
         * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
         * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
         */
        export let uidToNodeMap: { [key: string]: json.NodeInfo } = {};

        /*
         * maps node.id values to NodeInfo.java objects
         */
        export let idToNodeMap: { [key: string]: json.NodeInfo } = {};

        /* Maps from the DOM ID to the editor javascript instance (Ace Editor instance) */
        export let aceEditorsById: any = {};

        /* counter for local uids */
        export let nextUid: number = 1;

        /*
         * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
         * nextUid as the counter.
         */
        export let identToUidMap: { [key: string]: string } = {};

        /*
         * Under any given node, there can be one active 'selected' node that has the highlighting, and will be scrolled
         * to whenever the page with that child is visited, and parentUidToFocusNodeMap holds the map of "parent uid to
         * selected node (NodeInfo object)", where the key is the parent node uid, and the value is the currently
         * selected node within that parent. Note this 'selection state' is only significant on the client, and only for
         * being able to scroll to the node during navigating around on the tree.
         */
        export let parentUidToFocusNodeMap: { [key: string]: json.NodeInfo } = {};

        /* User-selectable user-account options each user can set on his account */
        export let MODE_ADVANCED: string = "advanced";
        export let MODE_SIMPLE: string = "simple";

        /* can be 'simple' or 'advanced' */
        export let editModeOption: string = "simple";

        /*
         * toggled by button, and holds if we are going to show properties or not on each node in the main view
         */
        export let showProperties: boolean = false;

        /* Flag that indicates if we are rendering path, owner, modTime, etc. on each row */
        export let showMetaData: boolean = false;

        /*
         * List of node prefixes to flag nodes to not allow to be shown in the page in simple mode
         */
        export let simpleModeNodePrefixBlackList: any = {
            "rep:": true
        };

        export let simpleModePropertyBlackList: any = {};

        export let readOnlyPropertyList: any = {};

        export let binaryPropertyList: any = {};

        /*
         * maps all node uids to true if selected, otherwise the property should be deleted (not existing)
         */
        export let selectedNodes: any = {};

        /* Set of all nodes that have been expanded (from the abbreviated form) */
        export let expandedAbbrevNodeIds: any = {};

        /* RenderNodeResponse.java object */
        export let currentNodeData: any = null;

        /*
         * all variables derivable from currentNodeData, but stored directly for simpler code/access
         */
        export let currentNode: json.NodeInfo = null;
        export let currentNodeUid: any = null;
        export let currentNodeId: any = null;
        export let currentNodePath: any = null;

        /* Maps from guid to Data Object */
        export let dataObjMap: any = {};

        export let renderFunctionsByJcrType: { [key: string]: Function } = {};
        export let propOrderingFunctionsByJcrType: { [key: string]: Function } = {};

        export let userPreferences: json.UserPreferences = {
            "editMode": false,
            "advancedMode": false,
            "lastNode": "",
            "importAllowed": false,
            "exportAllowed": false,
            "showMetaData": false
        };

        export let updateMainMenuPanel = function() {
            console.log("building main menu panel");
            menuPanel.build();
            menuPanel.init();
        }

        /*
         * Creates a 'guid' on this object, and makes dataObjMap able to look up the object using that guid in the
         * future.
         */
        export let registerDataObject = function(data) {
            if (!data.guid) {
                data.guid = ++nextGuid;
                dataObjMap[data.guid] = data;
            }
        }

        export let getObjectByGuid = function(guid) {
            var ret = dataObjMap[guid];
            if (!ret) {
                console.log("data object not found: guid=" + guid);
            }
            return ret;
        }

        /*
         * If callback is a string, it will be interpreted as a script to run, or if it's a function object that will be
         * the function to run.
         *
         * Whenever we are building an onClick string, and we have the actual function, rather than the name of the
         * function (i.e. we have the function object and not a string representation we hande that by assigning a guid
         * to the function object, and then encode a call to run that guid by calling runCallback. There is a level of
         * indirection here, but this is the simplest approach when we need to be able to map from a string to a
         * function.
         *
         * ctx=context, which is the 'this' to call with if we have a function, and have a 'this' context to bind to it.
         *
         * payload is any data object that needs to be passed at runtime
         *
         * note: doesn't currently support havingn a null ctx and non-null payload.
         */
        export let encodeOnClick = function(callback: any, ctx?: any, payload?: any, delayCallback?: number) {
            if (typeof callback == "string") {
                return callback;
            } //
            else if (typeof callback == "function") {
                registerDataObject(callback);

                if (ctx) {
                    registerDataObject(ctx);

                    if (payload) {
                        registerDataObject(payload);
                    }
                    let payloadStr = payload ? payload.guid : "null";

                    //todo-0: why isn't payloadStr in quotes? It was like this even before switching to backtick string
                    return `m64.meta64.runCallback(${callback.guid},${ctx.guid},${payloadStr},${delayCallback});`;
                } else {
                    return `m64.meta64.runCallback(${callback.guid},null,null,${delayCallback});`;
                }
            }
            else {
                throw "unexpected callback type in encodeOnClick";
            }
        }

        export let runCallback = function(guid, ctx, payload, delayCallback?: number) {
            console.log("callback run: " + delayCallback);
            /* depending on delayCallback, run the callback either immediately or with a delay */
            if (delayCallback > 0) {
                setTimeout(function() {
                    runCallbackImmediate(guid, ctx, payload);
                }, delayCallback);
            }
            else {
                return runCallbackImmediate(guid, ctx, payload);
            }
        }

        export let runCallbackImmediate = function(guid, ctx, payload) {
            var dataObj = getObjectByGuid(guid);

            // if this is an object, we expect it to have a 'callback' property
            // that is a function
            if (dataObj.callback) {
                dataObj.callback();
            }
            // or else sometimes the registered object itself is the function,
            // which is ok too
            else if (typeof dataObj == 'function') {
                if (ctx) {
                    var thiz = getObjectByGuid(ctx);
                    var payloadObj = payload ? getObjectByGuid(payload) : null;
                    dataObj.call(thiz, payloadObj);
                } else {
                    dataObj();
                }
            } else {
                throw "unable to find callback on registered guid: " + guid;
            }
        }

        export let inSimpleMode = function(): boolean {
            return editModeOption === MODE_SIMPLE;
        }

        export let refresh = function(): void {
            goToMainPage(true, true);
        }

        export let goToMainPage = function(rerender?: boolean, forceServerRefresh?: boolean): void {

            if (forceServerRefresh) {
                treeDirty = true;
            }

            if (rerender || treeDirty) {
                if (treeDirty) {
                    view.refreshTree(null, true);
                } else {
                    render.renderPageFromData();
                    refreshAllGuiEnablement();
                }
            }
            /*
             * If not re-rendering page (either from server, or from local data, then we just need to litterally switch
             * page into visible, and scroll to node)
             */
            else {
                view.scrollToSelectedNode();
            }
        }

        export let selectTab = function(pageName): void {
            var ironPages = document.querySelector("#mainIronPages");
            (<_HasSelect>ironPages).select(pageName);

            /* this code can be made more DRY, but i'm just trying it out for now, so i'm not bothering to perfect it yet. */
            // $("#mainPageButton").css("border-left", "");
            // $("#searchPageButton").css("border-left", "");
            // $("#timelinePageButton").css("border-left", "");
            //
            // if (pageName == 'mainTabName') {
            //     $("#mainPageButton").css("border-left", "8px solid red");
            // }
            // else if (pageName == 'searchTabName') {
            //     $("#searchPageButton").css("border-left", "8px solid red");
            // }
            // else if (pageName == 'timelineTabName') {
            //     $("#timelinePageButton").css("border-left", "8px solid red");
            // }
        }

        /*
         * If data (if provided) must be the instance data for the current instance of the dialog, and all the dialog
         * methods are of course singletons that accept this data parameter for any opterations. (oldschool way of doing
         * OOP with 'this' being first parameter always).
         *
         * Note: each data instance is required to have a guid numberic property, unique to it.
         *
         */
        export let changePage = function(pg?: any, data?: any) {
            if (typeof pg.tabId === 'undefined') {
                console.log("oops, wrong object type passed to changePage function.");
                return null;
            }

            /* this is the same as setting using mainIronPages?? */
            var paperTabs = document.querySelector("#mainIronPages"); //"#mainPaperTabs");
            (<_HasSelect>paperTabs).select(pg.tabId);
        }

        export let isNodeBlackListed = function(node): boolean {
            if (!inSimpleMode())
                return false;

            let prop;
            for (prop in simpleModeNodePrefixBlackList) {
                if (simpleModeNodePrefixBlackList.hasOwnProperty(prop) && util.startsWith(node.name, prop)) {
                    return true;
                }
            }

            return false;
        }

        export let getSelectedNodeUidsArray = function(): string[] {
            let selArray: string[] = [], uid;

            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    selArray.push(uid);
                }
            }
            return selArray;
        }

        /**
        Returns a newly cloned array of all the selected nodes each time it's called.
        */
        export let getSelectedNodeIdsArray = function(): string[] {
            let selArray: string[] = [], uid;

            if (!selectedNodes) {
                console.log("no selected nodes.");
            } else {
                console.log("selectedNode count: " + util.getPropertyCount(selectedNodes));
            }

            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    let node: json.NodeInfo = uidToNodeMap[uid];
                    if (!node) {
                        console.log("unable to find uidToNodeMap for uid=" + uid);
                    } else {
                        selArray.push(node.id);
                    }
                }
            }
            return selArray;
        }

        /* return an object with properties for each NodeInfo where the key is the id */
        export let getSelectedNodesAsMapById = function(): Object {
            let ret: Object = {};
            let selArray: json.NodeInfo[] = this.getSelectedNodesArray();
            for (var i = 0; i < selArray.length; i++) {
                ret[selArray[i].id] = selArray[i];
            }
            return ret;
        }

        /* Gets selected nodes as NodeInfo.java objects array */
        export let getSelectedNodesArray = function(): json.NodeInfo[] {
            let selArray: json.NodeInfo[] = [];
            let idx: number = 0;
            let uid: string = "";
            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    selArray[idx++] = uidToNodeMap[uid];
                }
            }
            return selArray;
        }

        export let clearSelectedNodes = function() {
            selectedNodes = {};
        }

        export let updateNodeInfoResponse = function(res, node) {
            let ownerBuf: string = "";
            let mine: boolean = false;

            if (res.owners) {
                $.each(res.owners, function(index, owner) {
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
                let elmId = "#ownerDisplay" + node.uid;
                var elm = $(elmId);
                elm.html(" (Manager: " + ownerBuf + ")");
                if (mine) {
                    util.changeOrAddClass(elmId, "created-by-other", "created-by-me");
                } else {
                    util.changeOrAddClass(elmId, "created-by-me", "created-by-other");
                }
            }
        }

        export let updateNodeInfo = function(node: json.NodeInfo) {
            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": node.id,
                "includeAcl": false,
                "includeOwners": true
            }, function(res: json.GetNodePrivilegesResponse) {
                updateNodeInfoResponse(res, node);
            });
        }

        /* Returns the node with the given node.id value */
        export let getNodeFromId = function(id: string): json.NodeInfo {
            return idToNodeMap[id];
        }

        export let getPathOfUid = function(uid: string): string {
            let node: json.NodeInfo = uidToNodeMap[uid];
            if (!node) {
                return "[path error. invalid uid: " + uid + "]";
            } else {
                return node.path;
            }
        }

        export let getHighlightedNode = function(): json.NodeInfo {
            let ret: json.NodeInfo = parentUidToFocusNodeMap[currentNodeUid];
            return ret;
        }

        export let highlightRowById = function(id, scroll): void {
            var node: json.NodeInfo = getNodeFromId(id);
            if (node) {
                highlightNode(node, scroll);
            } else {
                console.log("highlightRowById failed to find id: " + id);
            }
        }

        /*
         * Important: We want this to be the only method that can set values on 'parentUidToFocusNodeMap', and always
         * setting that value should go thru this function.
         */
        export let highlightNode = function(node: json.NodeInfo, scroll: boolean): void {
            if (!node)
                return;

            let doneHighlighting: boolean = false;

            /* Unhighlight currently highlighted node if any */
            let curHighlightedNode: json.NodeInfo = parentUidToFocusNodeMap[currentNodeUid];
            if (curHighlightedNode) {
                if (curHighlightedNode.uid === node.uid) {
                    // console.log("already highlighted.");
                    doneHighlighting = true;
                } else {
                    let rowElmId = curHighlightedNode.uid + "_row";
                    let rowElm = $("#" + rowElmId);
                    util.changeOrAddClass("#" + rowElmId, "active-row", "inactive-row");
                }
            }

            if (!doneHighlighting) {
                parentUidToFocusNodeMap[currentNodeUid] = node;

                let rowElmId: string = node.uid + "_row";
                let rowElm = $("#" + rowElmId);
                if (!rowElm || rowElm.length == 0) {
                    console.log("Unable to find rowElement to highlight: " + rowElmId);
                }
                util.changeOrAddClass("#" + rowElmId, "inactive-row", "active-row");
            }

            if (scroll) {
                view.scrollToSelectedNode();
            }
        }

        /*
         * Really need to use pub/sub event to broadcast enablement, and let each component do this independently and
         * decouple
         */
        export let refreshAllGuiEnablement = function() {
            /* multiple select nodes */
            let prevPageExists: boolean = nav.mainOffset > 0;
            let nextPageExists: boolean = !nav.endReached;
            let selNodeCount: number = util.getPropertyCount(selectedNodes);
            let highlightNode: json.NodeInfo = getHighlightedNode();
            let selNodeIsMine: boolean = highlightNode != null && (highlightNode.createdBy === userName || "admin" === userName);
            //console.log("homeNodeId="+meta64.homeNodeId+" highlightNode.id="+highlightNode.id);
            let homeNodeSelected: boolean = highlightNode != null && homeNodeId == highlightNode.id;
            let importFeatureEnabled = isAdminUser || userPreferences.importAllowed;
            let exportFeatureEnabled = isAdminUser || userPreferences.exportAllowed;
            let highlightOrdinal: number = getOrdinalOfNode(highlightNode);
            let numChildNodes: number = getNumChildNodes();
            let canMoveUp: boolean = (highlightOrdinal > 0 && numChildNodes > 1) || prevPageExists;
            let canMoveDown: boolean = (highlightOrdinal < numChildNodes - 1 && numChildNodes > 1) || nextPageExists;

            //todo-0: need to add to this selNodeIsMine || selParentIsMine;
            let canCreateNode = userPreferences.editMode && (isAdminUser || (!isAnonUser /* && selNodeIsMine */));

            console.log("enablement: isAnonUser=" + isAnonUser + " selNodeCount=" + selNodeCount + " selNodeIsMine=" + selNodeIsMine);

            util.setEnablement("navLogoutButton", !isAnonUser);
            util.setEnablement("openSignupPgButton", isAnonUser);

            let propsToggle: boolean = currentNode && !isAnonUser;
            util.setEnablement("propsToggleButton", propsToggle);

            let allowEditMode: boolean = currentNode && !isAnonUser;

            util.setEnablement("editModeButton", allowEditMode);
            util.setEnablement("upLevelButton", currentNode && nav.parentVisibleToUser());
            util.setEnablement("cutSelNodesButton", !isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("deleteSelNodesButton", !isAnonUser && selNodeCount > 0 && selNodeIsMine);
            util.setEnablement("clearSelectionsButton", !isAnonUser && selNodeCount > 0);
            util.setEnablement("pasteSelNodesButton", !isAnonUser && edit.nodesToMove != null && (selNodeIsMine || homeNodeSelected));

            util.setEnablement("moveNodeUpButton", canMoveUp);
            util.setEnablement("moveNodeDownButton", canMoveDown);
            util.setEnablement("moveNodeToTopButton", canMoveUp);
            util.setEnablement("moveNodeToBottomButton", canMoveDown);

            util.setEnablement("changePasswordPgButton", !isAnonUser);
            util.setEnablement("accountPreferencesButton", !isAnonUser);
            util.setEnablement("manageAccountButton", !isAnonUser);
            util.setEnablement("insertBookWarAndPeaceButton", isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
            util.setEnablement("generateRSSButton", isAdminUser);
            util.setEnablement("uploadFromFileButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("uploadFromUrlButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("deleteAttachmentsButton", !isAnonUser && highlightNode != null
                && highlightNode.hasBinary && selNodeIsMine);
            util.setEnablement("editNodeSharingButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("renameNodePgButton", !isAnonUser && highlightNode != null && selNodeIsMine);
            util.setEnablement("contentSearchDlgButton", !isAnonUser && highlightNode != null);
            util.setEnablement("tagSearchDlgButton", !isAnonUser && highlightNode != null);
            util.setEnablement("fileSearchDlgButton", !isAnonUser && allowFileSystemSearch);
            util.setEnablement("searchMainAppButton", !isAnonUser && highlightNode != null);
            util.setEnablement("timelineMainAppButton", !isAnonUser && highlightNode != null);
            util.setEnablement("timelineCreatedButton", !isAnonUser && highlightNode != null);
            util.setEnablement("timelineModifiedButton", !isAnonUser && highlightNode != null);
            util.setEnablement("showServerInfoButton", isAdminUser);
            util.setEnablement("showFullNodeUrlButton", highlightNode != null);
            util.setEnablement("refreshPageButton", !isAnonUser);
            util.setEnablement("findSharedNodesButton", !isAnonUser && highlightNode != null);
            util.setEnablement("userPreferencesMainAppButton", !isAnonUser);
            util.setEnablement("createNodeButton", canCreateNode);
            util.setEnablement("openImportDlg", importFeatureEnabled && (selNodeIsMine || (highlightNode != null && homeNodeId == highlightNode.id)));
            util.setEnablement("openExportDlg", exportFeatureEnabled && (selNodeIsMine || (highlightNode != null && homeNodeId == highlightNode.id)));
            util.setEnablement("adminMenu", isAdminUser);

            //VISIBILITY

            util.setVisibility("openImportDlg", importFeatureEnabled);
            util.setVisibility("openExportDlg", exportFeatureEnabled);
            util.setVisibility("editModeButton", allowEditMode);
            util.setVisibility("upLevelButton", currentNode && nav.parentVisibleToUser());
            util.setVisibility("insertBookWarAndPeaceButton", isAdminUser || (user.isTestUserAccount() && selNodeIsMine));
            util.setVisibility("generateRSSButton", isAdminUser);
            util.setVisibility("propsToggleButton", !isAnonUser);
            util.setVisibility("openLoginDlgButton", isAnonUser);
            util.setVisibility("navLogoutButton", !isAnonUser);
            util.setVisibility("openSignupPgButton", isAnonUser);
            util.setVisibility("searchMainAppButton", !isAnonUser && highlightNode != null);
            util.setVisibility("timelineMainAppButton", !isAnonUser && highlightNode != null);
            util.setVisibility("userPreferencesMainAppButton", !isAnonUser);
            util.setVisibility("fileSearchDlgButton", !isAnonUser && allowFileSystemSearch);

            //Top Level Menu Visibility
            util.setVisibility("adminMenu", isAdminUser);

            Polymer.dom.flush(); // <---- is this needed ? todo-3
            Polymer.updateStyles();
        }

        export let getSingleSelectedNode = function(): json.NodeInfo {
            let uid: string;
            for (uid in selectedNodes) {
                if (selectedNodes.hasOwnProperty(uid)) {
                    // console.log("found a single Sel NodeID: " + nodeId);
                    return uidToNodeMap[uid];
                }
            }
            return null;
        }

        export let getOrdinalOfNode = function(node: json.NodeInfo): number {
            if (!node || !currentNodeData || !currentNodeData.children)
                return -1;

            for (var i = 0; i < currentNodeData.children.length; i++) {
                if (node.id === currentNodeData.children[i].id) {
                    return i;
                }
            }
            return -1;
        }

        export let getNumChildNodes = function(): number {
            if (!currentNodeData || !currentNodeData.children)
                return 0;

            return currentNodeData.children.length;
        }

        export let setCurrentNodeData = function(data): void {
            currentNodeData = data;
            currentNode = data.node;
            currentNodeUid = data.node.uid;
            currentNodeId = data.node.id;
            currentNodePath = data.node.path;
        }

        export let anonPageLoadResponse = function(res: json.AnonPageLoadResponse): void {

            if (res.renderNodeResponse) {

                util.setVisibility("mainNodeContent", true);

                render.renderPageFromData(res.renderNodeResponse);

                refreshAllGuiEnablement();
            } else {
                util.setVisibility("mainNodeContent", false);

                console.log("setting listview to: " + res.content);
                util.setHtml("listView", res.content);
            }
        }

        export let removeBinaryByUid = function(uid): void {
            for (var i = 0; i < currentNodeData.children.length; i++) {
                let node: json.NodeInfo = currentNodeData.children[i];
                if (node.uid === uid) {
                    node.hasBinary = false;
                    break;
                }
            }
        }

        /*
         * updates client side maps and client-side identifier for new node, so that this node is 'recognized' by client
         * side code
         */
        export let initNode = function(node: json.NodeInfo, updateMaps?: boolean): void {
            if (!node) {
                console.log("initNode has null node");
                return;
            }
            /*
             * assign a property for detecting this node type, I'll do this instead of using some kind of custom JS
             * prototype-related approach
             */
            node.uid = updateMaps ? util.getUidForId(identToUidMap, node.id) : identToUidMap[node.id];
            node.properties = props.getPropertiesInEditingOrder(node, node.properties);

            /*
             * For these two properties that are accessed frequently we go ahead and lookup the properties in the
             * property array, and assign them directly as node object properties so to improve performance, and also
             * simplify code.
             */
            node.createdBy = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            node.lastModified = new Date(props.getNodePropertyVal(jcrCnst.LAST_MODIFIED, node));

            if (updateMaps) {
                uidToNodeMap[node.uid] = node;
                idToNodeMap[node.id] = node;
            }
        }

        export let initConstants = function() {
            util.addAll(simpleModePropertyBlackList, [ //
                jcrCnst.MIXIN_TYPES, //
                jcrCnst.PRIMARY_TYPE, //
                jcrCnst.POLICY, //
                jcrCnst.IMG_WIDTH,//
                jcrCnst.IMG_HEIGHT, //
                jcrCnst.BIN_VER, //
                jcrCnst.BIN_DATA, //
                jcrCnst.BIN_MIME, //
                jcrCnst.COMMENT_BY, //
                jcrCnst.PUBLIC_APPEND]);

            util.addAll(readOnlyPropertyList, [ //
                jcrCnst.PRIMARY_TYPE, //
                jcrCnst.UUID, //
                jcrCnst.MIXIN_TYPES, //
                jcrCnst.CREATED, //
                jcrCnst.CREATED_BY, //
                jcrCnst.LAST_MODIFIED, //
                jcrCnst.LAST_MODIFIED_BY,//
                jcrCnst.IMG_WIDTH, //
                jcrCnst.IMG_HEIGHT, //
                jcrCnst.BIN_VER, //
                jcrCnst.BIN_DATA, //
                jcrCnst.BIN_MIME, //
                jcrCnst.COMMENT_BY, //
                jcrCnst.PUBLIC_APPEND]);

            util.addAll(binaryPropertyList, [jcrCnst.BIN_DATA]);
        }

        /* todo-0: this and every other method that's called by a litstener or a timer needs to have the 'fat arrow' syntax for this */
        export let initApp = function(): void {
            console.log("initApp running.");


            meta64.renderFunctionsByJcrType["meta64:rssfeed"] = podcast.renderFeedNode;
            meta64.renderFunctionsByJcrType["meta64:rssitem"] = podcast.renderItemNode;
            meta64.propOrderingFunctionsByJcrType["meta64:rssfeed"] = podcast.propOrderingFeedNode;
            meta64.propOrderingFunctionsByJcrType["meta64:rssitem"] = podcast.propOrderingItemNode;

            meta64.renderFunctionsByJcrType["meta64:systemfolder"] = systemfolder.renderNode;
            meta64.propOrderingFunctionsByJcrType["meta64:systemfolder"] = systemfolder.propOrdering;

            meta64.renderFunctionsByJcrType["meta64:filelist"] = systemfolder.renderFileListNode;
            meta64.propOrderingFunctionsByJcrType["meta64:filelist"] = systemfolder.fileListPropOrdering;


            /////////////////////////////////////
            // var onresize = window.onresize;
            // window.onresize = function(event) { if (typeof onresize === 'function') onresize(); /** ... */ }

            (<any>window).addEvent = function(object, type, callback) {
                if (object == null || typeof (object) == 'undefined')
                    return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                } else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                } else {
                    object["on" + type] = callback;
                }
            };

            /*
             * WARNING: This is called in realtime while user is resizing so always throttle back any processing so that you don't
             * do any actual processing in here unless you want it VERY live, because it is.
             */
            // (<any>window).windowResize = function() {
            //     // console.log("WindowResize: w=" + window.innerWidth + " h=" + window.innerHeight);
            // }
            //
            // (<any>window).addEvent(window, "resize", (<any>window).windowResize);

            // this commented section is not working in my new x-app code, but it's ok to comment it out for now.
            //
            // This is our template element in index.html
            // var app = document.querySelector('#x-app');
            // // Listen for template bound event to know when bindings
            // // have resolved and content has been stamped to the page
            // app.addEventListener('dom-change', function() {
            //     console.log('app ready event!');
            // });

            (<any>window).addEventListener('polymer-ready', function(e) {
                console.log('polymer-ready event!');
            });
            console.log("running module: cnst.js");

            //todo-1: typescript will now let us just do this: const var='value';


            ////////////////////////////////////

            if (appInitialized)
                return;

            appInitialized = true;

            var tabs = util.poly("mainIronPages");
            tabs.addEventListener("iron-select", function() {
                tabChangeEvent(tabs.selected);
            });

            initConstants();
            displaySignupMessage();

            /*
             * todo-3: how does orientationchange need to work for polymer? Polymer disabled
             * $(window).on("orientationchange", _.orientationHandler);
             */

            $(window).bind("beforeunload", function() {
                return "Leave Meta64 ?";
            });

            /*
             * I thought this was a good idea, but actually it destroys the session, when the user is entering an
             * "id=\my\path" type of url to open a specific node. Need to rethink  Basically for now I'm thinking
             * going to a different url shouldn't blow up the session, which is what 'logout' does.
             *
             * $(window).on("unload", function() { user.logout(false); });
             */

            deviceWidth = $(window).width();
            deviceHeight = $(window).height();

            /*
             * This call checks the server to see if we have a session already, and gets back the login information from
             * the session, and then renders page content, after that.
             */
            user.refreshLogin();

            /*
             * Check for screen size in a timer. We don't want to monitor actual screen resize events because if a user
             * is expanding a window we basically want to limit the CPU and chaos that would ensue if we tried to adjust
             * things every time it changes. So we throttle back to only reorganizing the screen once per second. This
             * timer is a throttle sort of. Yes I know how to listen for events. No I'm not doing it wrong here. This
             * timer is correct in this case and behaves superior to events.
             */
            /*
             * Polymer->disable
             *
             * setInterval(function() { var width = $(window).width();
             *
             * if (width != _.deviceWidth) { // console.log("Screen width changed: " + width);
             *
             * _.deviceWidth = width; _.deviceHeight = $(window).height();
             *
             * _.screenSizeChange(); } }, 1500);
             */

            updateMainMenuPanel();
            refreshAllGuiEnablement();

            util.initProgressMonitor();

            processUrlParams();
        }

        export let processUrlParams = function(): void {
            var passCode = util.getParameterByName("passCode");
            if (passCode) {
                setTimeout(function() {
                    (new ChangePasswordDlg(passCode)).open();
                }, 100);
            }

            urlCmd = util.getParameterByName("cmd");
        }

        export let tabChangeEvent = function(tabName): void {
            if (tabName == "searchTabName") {
                srch.searchTabActivated();
            }
        }

        export let displaySignupMessage = function(): void {
            var signupResponse = $("#signupCodeResponse").text();
            if (signupResponse === "ok") {
                (new MessageDlg("Signup complete. You may now login.")).open();
            }
        }

        export let screenSizeChange = function(): void {
            if (currentNodeData) {

                if (currentNode.imgId) {
                    render.adjustImageSize(currentNode);
                }

                $.each(currentNodeData.children, function(i, node) {
                    if (node.imgId) {
                        render.adjustImageSize(node);
                    }
                });
            }
        }

        /* Don't need this method yet, and haven't tested to see if works */
        export let orientationHandler = function(event): void {
            // if (event.orientation) {
            // if (event.orientation === 'portrait') {
            // } else if (event.orientation === 'landscape') {
            // }
            // }
        }

        export let loadAnonPageHome = function(ignoreUrl): void {
            util.json<json.AnonPageLoadRequest, json.AnonPageLoadResponse>("anonPageLoad", {
                "ignoreUrl": ignoreUrl
            }, anonPageLoadResponse);
        }

        export let saveUserPreferences = function(): void {
            util.json<json.SaveUserPreferencesRequest, json.SaveUserPreferencesResponse>("saveUserPreferences", {
                //todo-0: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
                "userPreferences": userPreferences
            });
        }

        export let openSystemFile = function(fileName: string) {
            util.json<json.OpenSystemFileRequest, json.OpenSystemFileResponse>("openSystemFile", {
                "fileName": fileName
            });
        }

        export let editSystemFile = function(fileName: string) {
            new EditSystemFileDlg(fileName).open();
        }
    }

    export namespace nav {
        export let _UID_ROWID_SUFFIX: string = "_row";

        /* todo-0: eventually when we do paging for other lists, we will need a set of these variables for each list display (i.e. search, timeline, etc) */
        export let mainOffset: number = 0;
        export let endReached: boolean = true;

        /* todo-0: need to have this value passed from server rather than coded in TypeScript */
        export let ROWS_PER_PAGE: number = 25;

        export let openMainMenuHelp = function(): void {
            nav.mainOffset = 0;
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": "/meta64/public/help",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": mainOffset,
                "goToLastPage": false
            }, navPageNodeResponse);
        }

        export let openRssFeedsNode = function(): void {
            nav.mainOffset = 0;
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": "/rss/feeds",
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": mainOffset,
                "goToLastPage": false
            }, navPageNodeResponse);
        }

        export let expandMore = function(nodeId: string): void {

            /* I'm setting this here so that we can come up with a way to make the abbrev expand state be remembered, button
            this is lower priority for now, so i'm not using it yet */
            meta64.expandedAbbrevNodeIds[nodeId] = true;

            util.json<json.ExpandAbbreviatedNodeRequest, json.ExpandAbbreviatedNodeResponse>("expandAbbreviatedNode", {
                "nodeId": nodeId
            }, expandAbbreviatedNodeResponse);
        }

        let expandAbbreviatedNodeResponse = function(res: json.ExpandAbbreviatedNodeResponse): void {
            if (util.checkSuccess("ExpandAbbreviatedNode", res)) {
                //console.log("VAL: "+JSON.stringify(res.nodeInfo));
                render.refreshNodeOnPage(res.nodeInfo);
            }
        }

        export let displayingHome = function(): boolean {
            if (meta64.isAnonUser) {
                return meta64.currentNodeId === meta64.anonUserLandingPageNode;
            } else {
                return meta64.currentNodeId === meta64.homeNodeId;
            }
        }

        export let parentVisibleToUser = function(): boolean {
            return !displayingHome();
        }

        export let upLevelResponse = function(res: json.RenderNodeResponse, id): void {
            if (!res || !res.node) {
                (new MessageDlg("No data is visible to you above this node.")).open();
            } else {
                render.renderPageFromData(res);
                meta64.highlightRowById(id, true);
                meta64.refreshAllGuiEnablement();
            }
        }

        export let navUpLevel = function(): void {

            if (!parentVisibleToUser()) {
                // Already at root. Can't go up.
                return;
            }

            /* todo-0: for now an uplevel will reset to zero offset, but eventually I want to have each level of the tree, be able to
            remember which offset it was at so when user drills down, and then comes back out, they page back out from the same pages they
            drilled down from */
            mainOffset = 0;
            var ironRes = util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": 1,
                "renderParentIfLeaf": false,
                "offset": mainOffset,
                "goToLastPage": false
            }, function(res: json.RenderNodeResponse) {
                upLevelResponse(ironRes.response, meta64.currentNodeId);
            });
        }

        /*
         * turn of row selection DOM element of whatever row is currently selected
         */
        export let getSelectedDomElement = function(): any {

            var currentSelNode = meta64.getHighlightedNode();
            if (currentSelNode) {

                /* get node by node identifier */
                let node: json.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                if (node) {
                    console.log("found highlighted node.id=" + node.id);

                    /* now make CSS id from node */
                    let nodeId: string = node.uid + _UID_ROWID_SUFFIX;
                    // console.log("looking up using element id: "+nodeId);

                    return util.domElm(nodeId);
                }
            }

            return null;
        }

        /*
         * turn of row selection DOM element of whatever row is currently selected
         */
        export let getSelectedPolyElement = function(): any {
            try {
                let currentSelNode: json.NodeInfo = meta64.getHighlightedNode();
                if (currentSelNode) {

                    /* get node by node identifier */
                    let node: json.NodeInfo = meta64.uidToNodeMap[currentSelNode.uid];

                    if (node) {
                        console.log("found highlighted node.id=" + node.id);

                        /* now make CSS id from node */
                        let nodeId: string = node.uid + _UID_ROWID_SUFFIX;
                        console.log("looking up using element id: " + nodeId);

                        return util.polyElm(nodeId);
                    }
                } else {
                    console.log("no node highlighted");
                }
            } catch (e) {
                util.logAndThrow("getSelectedPolyElement failed.");
            }
            return null;
        }

        export let clickOnNodeRow = function(rowElm, uid): void {

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("clickOnNodeRow recieved uid that doesn't map to any node. uid=" + uid);
                return;
            }

            /*
             * sets which node is selected on this page (i.e. parent node of this page being the 'key')
             */
            meta64.highlightNode(node, false);

            if (meta64.userPreferences.editMode) {
                /*
                 * if node.owner is currently null, that means we have not retrieved the owner from the server yet, but
                 * if non-null it's already displaying and we do nothing.
                 */
                if (!node.owner) {
                    console.log("calling updateNodeInfo");
                    meta64.updateNodeInfo(node);
                }
            }
            meta64.refreshAllGuiEnablement();
        }

        export let openNode = function(uid): void {

            let node: json.NodeInfo = meta64.uidToNodeMap[uid];
            meta64.highlightNode(node, true);

            if (!node) {
                (new MessageDlg("Unknown nodeId in openNode: " + uid)).open();
            } else {
                view.refreshTree(node.id, false);
            }
        }

        /*
         * unfortunately we have to rely on onClick, because of the fact that events to checkboxes don't appear to work
         * in Polmer at all, and since onClick runs BEFORE the state change is completed, that is the reason for the
         * silly looking async timer here.
         */
        export let toggleNodeSel = function(uid): void {
            let toggleButton: any = util.polyElm(uid + "_sel");
            setTimeout(function() {
                if (toggleButton.node.checked) {
                    meta64.selectedNodes[uid] = true;
                } else {
                    delete meta64.selectedNodes[uid];
                }

                view.updateStatusBar();
                meta64.refreshAllGuiEnablement();
            }, 500);
        }

        export let navPageNodeResponse = function(res: json.RenderNodeResponse): void {
            meta64.clearSelectedNodes();
            render.renderPageFromData(res);
            view.scrollToTop();
            meta64.refreshAllGuiEnablement();
        }

        export let navHome = function(): void {
            if (meta64.isAnonUser) {
                meta64.loadAnonPageHome(true);
                // window.location.href = window.location.origin;
            } else {
                mainOffset = 0;
                util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                    "nodeId": meta64.homeNodeId,
                    "upLevel": null,
                    "renderParentIfLeaf": null,
                    "offset": mainOffset,
                    "goToLastPage": false
                }, navPageNodeResponse);
            }
        }

        export let navPublicHome = function(): void {
            meta64.loadAnonPageHome(true);
        }
    }

    export namespace prefs {

        export let closeAccountResponse = function(res: json.CloseAccountResponse): void {
            /* Remove warning dialog to ask user about leaving the page */
            $(window).off("beforeunload");

            /* reloads browser with the query parameters stripped off the path */
            window.location.href = window.location.origin;
        }

        export let closeAccount = function(): void {
            (new ConfirmDlg("Oh No!", "Close your Account?<p> Are you sure?", "Yes, Close Account.", function() {
                (new ConfirmDlg("One more Click", "Your data will be deleted and can never be recovered.<p> Are you sure?", "Yes, Close Account.", function() {
                    user.deleteAllUserCookies();
                    util.json<json.CloseAccountRequest, json.CloseAccountResponse>("closeAccount", {}, closeAccountResponse);
                })).open();
            })).open();
        }
    }

    export namespace props {

        export let orderProps = function(propOrder: string[], props: json.PropertyInfo[]): json.PropertyInfo[] {
            let propsNew: json.PropertyInfo[] = util.arrayClone(props);
            let targetIdx: number = 0;

            for (let prop of propOrder) {
                targetIdx = moveNodePosition(propsNew, targetIdx, prop);
            }

            return propsNew;
        }

        let moveNodePosition = function(props: json.PropertyInfo[], idx: number, typeName: string): number {
            let tagIdx: number = util.arrayIndexOfItemByProp(props, "name", typeName);
            if (tagIdx != -1) {
                util.arrayMoveItem(props, tagIdx, idx++);
            }
            return idx;
        }

        /*
         * Toggles display of properties in the gui.
         */
        export let propsToggle = function(): void {
            meta64.showProperties = meta64.showProperties ? false : true;
            // setDataIconUsingId("#editModeButton", editMode ? "edit" :
            // "forbidden");

            // fix for polymer
            // var elm = $("#propsToggleButton");
            // elm.toggleClass("ui-icon-grid", meta64.showProperties);
            // elm.toggleClass("ui-icon-forbidden", !meta64.showProperties);

            render.renderPageFromData();
            view.scrollToSelectedNode();
            meta64.selectTab("mainTabName");
        }

        export let deletePropertyFromLocalData = function(propertyName): void {
            for (var i = 0; i < edit.editNode.properties.length; i++) {
                if (propertyName === edit.editNode.properties[i].name) {
                    // splice is how you delete array elements in js.
                    edit.editNode.properties.splice(i, 1);
                    break;
                }
            }
        }

        /*
         * Sorts props input array into the proper order to show for editing. Simple algorithm first grabs 'jcr:content'
         * node and puts it on the top, and then does same for 'jctCnst.TAGS'
         */
        export let getPropertiesInEditingOrder = function(node: json.NodeInfo, props: json.PropertyInfo[]): json.PropertyInfo[] {
            let func: Function = meta64.propOrderingFunctionsByJcrType[node.primaryTypeName];
            if (func) {
                return func(node, props);
            }

            let propsNew: json.PropertyInfo[] = util.arrayClone(props);
            movePropsToTop([jcrCnst.CONTENT, jcrCnst.TAGS], propsNew);
            movePropsToEnd([jcrCnst.CREATED, jcrCnst.CREATED_BY, jcrCnst.LAST_MODIFIED, jcrCnst.LAST_MODIFIED_BY], propsNew);

            return propsNew;
        }

        /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
        let movePropsToTop = function(propsList: string[], props: json.PropertyInfo[]) {
            for (let prop of propsList) {
                let tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    util.arrayMoveItem(props, tagIdx, 0);
                }
            }
        }

        /* Moves all the properties listed in propList array to the end of the list of properties and keeps them in the order specified */
        let movePropsToEnd = function(propsList: string[], props: json.PropertyInfo[]) {
            for (let prop of propsList) {
                let tagIdx = util.arrayIndexOfItemByProp(props, "name", prop);
                if (tagIdx != -1) {
                    util.arrayMoveItem(props, tagIdx, props.length);
                }
            }
        }

        /*
         * properties will be null or a list of PropertyInfo objects.
         */
        export let renderProperties = function(properties): string {
            if (properties) {
                let table: string = "";
                let propCount: number = 0;

                $.each(properties, function(i, property) {
                    if (render.allowPropertyToDisplay(property.name)) {
                        var isBinaryProp = render.isBinaryProperty(property.name);

                        propCount++;
                        let td: string = render.tag("td", {
                            "class": "prop-table-name-col"
                        }, render.sanitizePropertyName(property.name));

                        let val: string;
                        if (isBinaryProp) {
                            val = "[binary]";
                        } else if (!property.values) {
                            val = render.wrapHtml(property.value);
                        } else {
                            val = props.renderPropertyValues(property.values);
                        }

                        td += render.tag("td", {
                            "class": "prop-table-val-col"
                        }, val);

                        table += render.tag("tr", {
                            "class": "prop-table-row"
                        }, td);

                    } else {
                        console.log("Hiding property: " + property.name);
                    }
                });

                if (propCount == 0) {
                    return "";
                }

                return render.tag("table", {
                    "border": "1",
                    "class": "property-table"
                }, table);
            } else {
                return undefined;
            }
        }

        /*
         * brute force searches on node (NodeInfo.java) object properties list, and returns the first property
         * (PropertyInfo.java) with name matching propertyName, else null.
         */
        export let getNodeProperty = function(propertyName, node): json.PropertyInfo {
            if (!node || !node.properties)
                return null;

            for (var i = 0; i < node.properties.length; i++) {
                let prop: json.PropertyInfo = node.properties[i];
                if (prop.name === propertyName) {
                    return prop;
                }
            }
            return null;
        }

        export let getNodePropertyVal = function(propertyName, node): string {
            let prop: json.PropertyInfo = getNodeProperty(propertyName, node);
            return prop ? prop.value : null;
        }

        /*
         * Returns trus if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
         * etc. on the GUI.
         */
        export let isNonOwnedNode = function(node): boolean {
            let createdBy: string = getNodePropertyVal(jcrCnst.CREATED_BY, node);

            // if we don't know who owns this node assume the admin owns it.
            if (!createdBy) {
                createdBy = "admin";
            }

            /* This is OR condition because of createdBy is null we assume we do not own it */
            return createdBy != meta64.userName;
        }

        /*
         * Returns true if this is a comment node, that the current user doesn't own. Used to disable "edit", "delete",
         * etc. on the GUI.
         */
        export let isNonOwnedCommentNode = function(node): boolean {
            let commentBy: string = getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy != meta64.userName;
        }

        export let isOwnedCommentNode = function(node): boolean {
            let commentBy: string = getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            return commentBy != null && commentBy == meta64.userName;
        }

        /*
         * Returns string representation of property value, even if multiple properties
         */
        export let renderProperty = function(property): string {
            /* If this is a single-value type property */
            if (!property.values) {

                /* if property is missing return empty string */
                if (!property.value || property.value.length == 0) {
                    return "";
                }

                return property.value;
            }
            /* else render multi-value property */
            else {
                return renderPropertyValues(property.values);
            }
        }

        export let renderPropertyValues = function(values): string {
            let ret: string = "<div>";
            let count: number = 0;
            $.each(values, function(i, value) {
                if (count > 0) {
                    ret += cnst.BR;
                }
                ret += render.wrapHtml(value);
                count++;
            });
            ret += "</div>";
            return ret;
        }
    }
    export namespace render {
        let debug: boolean = false;

        /*
         * This is the content displayed when the user signs in, and we see that they have no content being displayed. We
         * want to give them some instructions and the ability to add content.
         */
        let getEmptyPagePrompt = function(): string {
            return "<p>There are no subnodes under this node. <br><br>Click 'EDIT MODE' and then use the 'ADD' button to create content.</p>";
        }

        let renderBinary = function(node: json.NodeInfo): string {
            /*
             * If this is an image render the image directly onto the page as a visible image
             */
            if (node.binaryIsImage) {
                return makeImageTag(node);
            }
            /*
             * If not an image we render a link to the attachment, so that it can be downloaded.
             */
            else {
                let anchor: string = tag("a", {
                    "href": getUrlForNodeAttachment(node)
                }, "[Download Attachment]");

                return tag("div", {
                    "class": "binary-link"
                }, anchor);
            }
        }

        /*
         * Important little method here. All GUI page/divs are created using this sort of specification here that they
         * all must have a 'build' method that is called first time only, and then the 'init' method called before each
         * time the component gets displayed with new information.
         *
         * If 'data' is provided, this is the instance data for the dialog
         */
        export let buidPage = function(pg, data): void {
            console.log("buildPage: pg.domId=" + pg.domId);

            if (!pg.built || data) {
                pg.build(data);
                pg.built = true;
            }

            if (pg.init) {
                pg.init(data);
            }
        }

        export let buildRowHeader = function(node: json.NodeInfo, showPath: boolean, showName: boolean): string {
            let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);

            let headerText: string = "";

            if (cnst.SHOW_PATH_ON_ROWS) {
                headerText += "<div class='path-display'>Path: " + formatPath(node) + "</div>";
            }

            headerText += "<div>";

            if (commentBy) {
                let clazz: string = (commentBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Comment By: " + commentBy + "</span>";
            } //
            else if (node.createdBy) {
                let clazz: string = (node.createdBy === meta64.userName) ? "created-by-me" : "created-by-other";
                headerText += "<span class='" + clazz + "'>Created By: " + node.createdBy + "</span>";
            }

            headerText += `<span id='ownerDisplay${node.uid}'></span>`;
            if (node.lastModified) {
                headerText += `  Mod: ${node.lastModified}`;
            }
            headerText += "</div>";

            /*
             * on root node name will be empty string so don't show that
             *
             * commenting: I decided users will understand the path as a single long entity with less confusion than
             * breaking out the name for them. They already unserstand internet URLs. This is the same concept. No need
             * to baby them.
             *
             * The !showPath condition here is because if we are showing the path then the end of that is always the
             * name, so we don't need to show the path AND the name. One is a substring of the other.
             */
            if (showName && !showPath && node.name) {
                headerText += `Name: ${node.name} [uid=${node.uid}]`;
            }

            headerText = tag("div", {
                "class": "header-text"
            }, headerText);

            return headerText;
        }

        /*
         * Pegdown markdown processor will create <code> blocks and the class if provided, so in order to get google
         * prettifier to process it the rest of the way (when we call prettyPrint() for the whole page) we now run
         * another stage of transformation to get the <pre> tag put in with 'prettyprint' etc.
         */
        export let injectCodeFormatting = function(content: string): string {
            if (!content) return content;
            // example markdown:
            // ```js
            // var x = 10;
            // var y = "test";
            // ```
            //
            if (util.contains(content, "<code")) {
                meta64.codeFormatDirty = true;
                content = encodeLanguages(content);
                content = util.replaceAll(content, "</code>", "</pre>");
            }

            return content;
        }

        export let injectSubstitutions = function(content: string): string {
            return util.replaceAll(content, "{{locationOrigin}}", window.location.origin);
        }

        export let encodeLanguages = function(content: string): string {
            /*
             * todo-1: need to provide some way of having these language types configurable in a properties file
             * somewhere, and fill out a lot more file types.
             */
            var langs = ["js", "html", "htm", "css"];
            for (var i = 0; i < langs.length; i++) {
                content = util.replaceAll(content, "<code class=\"" + langs[i] + "\">", //
                    "<?prettify lang=" + langs[i] + "?><pre class='prettyprint'>");
            }
            content = util.replaceAll(content, "<code>", "<pre class='prettyprint'>");

            return content;
        }

        /* after a property, or node is updated (saved) we can now call this method instead of refreshing the entire page
        which is what's done in most of the app, which is much less efficient and snappy visually */
        export let refreshNodeOnPage = function(node: json.NodeInfo): void {
            //need to lookup uid from NodeInfo.id then set the content of this div.
            //"id": uid + "_content"
            //to the value from renderNodeContent(node, true, true, true, true, true)));
            let uid: string = meta64.identToUidMap[node.id];
            if (!uid) throw `Unable to find nodeId ${node.id} in uid map`;
            meta64.initNode(node, false);
            if (uid != node.uid) throw "uid changed unexpectly after initNode";
            let rowContent: string = renderNodeContent(node, true, true, true, true, true);
            $("#" + uid + "_content").html(rowContent);
        }

        /*
         * This is the function that renders each node in the main window. The rendering in here is very central to the
         * app and is what the user sees covering 90% of the screen most of the time. The "content* nodes.
         *
         * todo-0: Rather than having this node renderer itself be responsible for rendering all the different types
         * of nodes, need a more pluggable design, where rendeing of different things is deletaged to some
         * appropriate object/service
         */
        export let renderNodeContent = function(node: json.NodeInfo, showPath, showName, renderBin, rowStyling, showHeader): string {
            var ret: string = getTopRightImageTag(node);

            /* todo-2: enable headerText when appropriate here */
            if (meta64.showMetaData) {
                ret += showHeader ? buildRowHeader(node, showPath, showName) : "";
            }

            if (meta64.showProperties) {
                var properties = props.renderProperties(node.properties);
                if (properties) {
                    ret += /* "<br>" + */properties;
                }
            } else {
                let renderComplete: boolean = false;

                /*
                 * Special Rendering for Nodes that have a plugin-renderer
                 */
                if (!renderComplete) {
                    let func: Function = meta64.renderFunctionsByJcrType[node.primaryTypeName];
                    if (func) {
                        renderComplete = true;
                        ret += func(node, rowStyling)
                    }
                }

                if (!renderComplete) {
                    let contentProp: json.PropertyInfo = props.getNodeProperty(jcrCnst.CONTENT, node);

                    //console.log("contentProp: " + contentProp);
                    if (contentProp) {
                        renderComplete = true;

                        let jcrContent = props.renderProperty(contentProp);
                        //console.log("**************** jcrContent for MARKDOWN:\n"+jcrContent);

                        let markedContent = "<marked-element sanitize='true'>" +
                            "<div class='markdown-html'></div>" +
                            "<script type='text/markdown'>\n" +
                            jcrContent +
                            "</script>" +
                            "</marked-element>";

                        //When doing server-side markdown we had this processing the HTML that was generated
                        //but I haven't looked into how to get this back now that we are doing markdown on client.
                        //jcrContent = injectCodeFormatting(jcrContent);
                        //jcrContent = injectSubstitutions(jcrContent);

                        if (rowStyling) {
                            ret += tag("div", {
                                "class": "jcr-content"
                            }, markedContent);
                        } else {
                            ret += tag("div", {
                                "class": "jcr-root-content"
                            }, markedContent);
                        }
                    }
                }

                if (!renderComplete) {
                    if (node.path.trim() == "/") {
                        ret += "Root Node";
                    }
                    // ret += "<div>[No Content Property]</div>";
                    let properties: string = props.renderProperties(node.properties);
                    if (properties) {
                        ret += /* "<br>" + */properties;
                    }
                }
            }

            if (renderBin && node.hasBinary) {
                let binary: string = renderBinary(node);

                /*
                 * We append the binary image or resource link either at the end of the text or at the location where
                 * the user has put {{insert-attachment}} if they are using that to make the image appear in a specific
                 * locatio in the content text.
                 */
                if (util.contains(ret, cnst.INSERT_ATTACHMENT)) {
                    ret = util.replaceAll(ret, cnst.INSERT_ATTACHMENT, binary);
                } else {
                    ret += binary;
                }
            }

            let tags: string = props.getNodePropertyVal(jcrCnst.TAGS, node);
            if (tags) {
                ret += tag("div", {
                    "class": "tags-content"
                }, "Tags: " + tags);
            }

            return ret;
        }

        export let renderJsonFileSearchResultProperty = function(jsonContent: string): string {
            let content: string = "";
            try {
                console.log("json: " + jsonContent);
                let list: any[] = JSON.parse(jsonContent);

                for (let entry of list) {
                    content += tag("div", {
                        "class": "systemFile",
                        "onclick": `m64.meta64.editSystemFile('${entry.fileName}')`
                    }, entry.fileName);

                    /* openSystemFile worked on linux, but i'm switching to full text file edit capability only and doing that
                    inside meta64 from now on, so openSystemFile is no longer being used */
                    // let localOpenLink = tag("paper-button", {
                    //     "raised": "raised",
                    //     "onclick": "m64.meta64.openSystemFile('" + entry.fileName + "')"
                    // }, "Local Open");
                    //
                    // let downloadLink = "";
                    //haven't implemented download capability yet.
                    // tag("paper-button", {
                    //     "raised": "raised",
                    //     "onclick": "m64.meta64.downloadSystemFile('" + entry.fileName + "')"
                    // }, "Download")
                    // let linksDiv = tag("div", {
                    // }, localOpenLink + downloadLink);

                    // content += tag("div", {
                    // }, fileNameDiv);
                }
            }
            catch (e) {
                util.logAndReThrow("render failed", e);
                content = "[render failed]"
            }
            return content;
        }

        /*
         * This is the primary method for rendering each node (like a row) on the main HTML page that displays node
         * content. This generates the HTML for a single row/node.
         *
         * node is a NodeInfo.java JSON
         */
        export let renderNodeAsListItem = function(node: json.NodeInfo, index: number, count: number, rowCount: number): string {

            let uid: string = node.uid;
            let prevPageExists: boolean = nav.mainOffset > 0;
            let nextPageExists: boolean = !nav.endReached;
            let canMoveUp: boolean = (index > 0 && rowCount > 1) || prevPageExists;
            let canMoveDown: boolean = (index < count - 1) || nextPageExists;

            let isRep: boolean = util.startsWith(node.name, "rep:") || /*
														 * meta64.currentNodeData. bug?
														 */util.contains(node.path, "/rep:");

            let editingAllowed: boolean = props.isOwnedCommentNode(node);
            if (!editingAllowed) {
                editingAllowed = (meta64.isAdminUser || !isRep) && !props.isNonOwnedCommentNode(node)
                    && !props.isNonOwnedNode(node);
            }

            // console.log("Rendering Node Row[" + index + "] editingAllowed="+editingAllowed);

            /*
             * if not selected by being the new child, then we try to select based on if this node was the last one
             * clicked on for this page.
             */
            // console.log("test: [" + parentIdToFocusIdMap[currentNodeId]
            // +"]==["+ node.id + "]")
            let focusNode: json.NodeInfo = meta64.getHighlightedNode();
            let selected: boolean = (focusNode && focusNode.uid === uid);

            let buttonBarHtmlRet: string = makeRowButtonBarHtml(node, canMoveUp, canMoveDown, editingAllowed);
            let bkgStyle: string = getNodeBkgImageStyle(node);

            let cssId: string = uid + "_row";
            return tag("div", {
                "class": "node-table-row" + (selected ? " active-row" : " inactive-row"),
                "onClick": `m64.nav.clickOnNodeRow(this, '${uid}');`, //
                "id": cssId,
                "style": bkgStyle
            },//
                buttonBarHtmlRet + tag("div", {
                    "id": uid + "_content"
                }, renderNodeContent(node, true, true, true, true, true)));
        }

        export let showNodeUrl = function() {
            let node: json.NodeInfo = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("You must first click on a node.")).open();
                return;
            }

            let path: string = util.stripIfStartsWith(node.path, "/root");
            let url: string = window.location.origin + "?id=" + path;
            meta64.selectTab("mainTabName");

            let message: string = "URL using path: <br>" + url;
            let uuid: string = props.getNodePropertyVal("jcr:uuid", node);
            if (uuid) {
                message += "<p>URL for UUID: <br>" + window.location.origin + "?id=" + uuid;
            }

            (new MessageDlg(message, "URL of Node")).open();
        }

        export let getTopRightImageTag = function(node: json.NodeInfo) {
            let topRightImg: string = props.getNodePropertyVal('img.top.right', node);
            let topRightImgTag: string = "";
            if (topRightImg) {
                topRightImgTag = tag("img", {
                    "src": topRightImg,
                    "class": "top-right-image"
                }, "", false);
            }
            return topRightImgTag;
        }

        export let getNodeBkgImageStyle = function(node: json.NodeInfo): string {
            let bkgImg: string = props.getNodePropertyVal('img.node.bkg', node);
            let bkgImgStyle: string = "";
            if (bkgImg) {
                //todo-0: as I was convertingi some strings to backtick i noticed this URL missing the quotes around the string. Is this a bug?
                bkgImgStyle = `background-image: url(${bkgImg});`;
            }
            return bkgImgStyle;
        }

        export let centeredButtonBar = function(buttons?: string, classes?: string): string {
            classes = classes || "";

            return tag("div", {
                "class": "horizontal center-justified layout vertical-layout-row " + classes
            }, buttons);
        }

        export let centerContent = function(content: string, width: number): string {
            let div: string = render.tag("div", { "style": `width:${width}px;` }, content);

            let attrs = {
                "class": "horizontal center-justified layout vertical-layout-row"
            };

            return render.tag("div", attrs, div, true);
        }

        export let buttonBar = function(buttons: string, classes: string): string {
            classes = classes || "";

            return tag("div", {
                "class": "horizontal left-justified layout vertical-layout-row " + classes
            }, buttons);
        }

        export let makeRowButtonBarHtml = function(node: json.NodeInfo, canMoveUp: boolean, canMoveDown: boolean, editingAllowed: boolean) {

            let createdBy: string = props.getNodePropertyVal(jcrCnst.CREATED_BY, node);
            let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, node);
            let publicAppend: string = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, node);

            let openButton: string = "";
            let selButton: string = "";
            let createSubNodeButton: string = "";
            let editNodeButton: string = "";
            let moveNodeUpButton: string = "";
            let moveNodeDownButton: string = "";
            let insertNodeButton: string = "";
            let replyButton: string = "";

            /*
             * Show Reply button if this is a publicly appendable node and not created by current user,
             * or having been added as comment by current user
             */
            if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                replyButton = tag("paper-button", {
                    "raised": "raised",
                    "onClick": `m64.edit.replyToComment('${node.uid}');` //
                }, //
                    "Reply");
            }

            let buttonCount: number = 0;

            /* Construct Open Button */
            if (nodeHasChildren(node.uid)) {
                buttonCount++;

                openButton = tag("paper-button", {

                    /* For some unknown reason the ability to style this with the class broke, and even
                    after dedicating several hours trying to figure out why I'm still baffled. I checked everything
                    a hundred times and still don't know what I'm doing wrong...I just finally put the god damn fucking style attribute
                    here to accomplish the same thing */
                    //"class": "green",
                    "style": "background-color: #4caf50;color:white;",
                    "raised": "raised",
                    "onClick": `m64.nav.openNode('${node.uid}');`//
                }, //
                    "Open");
            }

            /*
             * If in edit mode we always at least create the potential (buttons) for a user to insert content, and if
             * they don't have privileges the server side security will let them know. In the future we can add more
             * intelligence to when to show these buttons or not.
             */
            if (meta64.userPreferences.editMode) {
                // console.log("Editing allowed: " + nodeId);

                let selected: boolean = meta64.selectedNodes[node.uid] ? true : false;

                // console.log(" nodeId " + node.uid + " selected=" + selected);
                buttonCount++;

                let css: Object = selected ? {
                    "id": node.uid + "_sel",//
                    "onClick": `m64.nav.toggleNodeSel('${node.uid}');`,
                    "checked": "checked",
                    //padding is a back hack to make checkbox line up with other icons.
                    //(i will probably end up using a paper-icon-button that toggles here, instead of checkbox)
                    "style": "margin-top: 11px;"
                } : //
                    {
                        "id": node.uid + "_sel",//
                        "onClick": `m64.nav.toggleNodeSel('${node.uid}');`,
                        "style": "margin-top: 11px;"
                    };

                selButton = tag("paper-checkbox", css, "");

                if (cnst.NEW_ON_TOOLBAR && !commentBy) {
                    /* Construct Create Subnode Button */
                    buttonCount++;
                    createSubNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt", //"icons:more-vert",
                        "id": "addNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": `m64.edit.createSubNode('${node.uid}');`
                    }, "Add");
                }

                if (cnst.INS_ON_TOOLBAR && !commentBy) {
                    buttonCount++;
                    /* Construct Create Subnode Button */
                    insertNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture", //"icons:more-horiz",
                        "id": "insertNodeButtonId" + node.uid,
                        "raised": "raised",
                        "onClick": `m64.edit.insertNode('${node.uid}');`
                    }, "Ins");
                }
            }

            //Polmer Icons Reference: https://elements.polymer-project.org/elements/iron-icons?view=demo:demo/index.html

            if (meta64.userPreferences.editMode && editingAllowed) {
                buttonCount++;
                /* Construct Create Subnode Button */
                editNodeButton = tag("paper-icon-button", //
                    {
                        "alt": "Edit node.",
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": `m64.edit.runEditNode('${node.uid}');`
                    }, "Edit");

                if (cnst.MOVE_UPDOWN_ON_TOOLBAR && meta64.currentNode.childrenOrdered && !commentBy) {

                    if (canMoveUp) {
                        buttonCount++;
                        /* Construct Create Subnode Button */
                        moveNodeUpButton = tag("paper-icon-button", {
                            "icon": "icons:arrow-upward",
                            "raised": "raised",
                            "onClick": `m64.edit.moveNodeUp('${node.uid}');`
                        }, "Up");
                    }

                    if (canMoveDown) {
                        buttonCount++;
                        /* Construct Create Subnode Button */
                        moveNodeDownButton = tag("paper-icon-button", {
                            "icon": "icons:arrow-downward",
                            "raised": "raised",
                            "onClick": `m64.edit.moveNodeDown('${node.uid}');`
                        }, "Dn");
                    }
                }
            }

            /*
             * i will be finding a reusable/DRY way of doing tooltops soon, this is just my first experiment.
             *
             * However tooltips ALWAYS cause problems. Mystery for now.
             */
            let insertNodeTooltip: string = "";
            //			 tag("paper-tooltip", {
            //			 "for" : "insertNodeButtonId" + node.uid
            //			 }, "INSERTS a new node at the current tree position. As a sibling on this level.");

            let addNodeTooltip: string = "";
            //			 tag("paper-tooltip", {
            //			 "for" : "addNodeButtonId" + node.uid
            //			 }, "ADDS a new node inside the current node, as a child of it.");

            let allButtons: string = selButton + openButton + insertNodeButton + createSubNodeButton + insertNodeTooltip
                + addNodeTooltip + editNodeButton + moveNodeUpButton + moveNodeDownButton + replyButton;

            return allButtons.length > 0 ? makeHorizontalFieldSet(allButtons, "row-toolbar") : "";
        }

        export let makeHorizontalFieldSet = function(content?: string, extraClasses?: string): string {

            /* Now build entire control bar */
            return tag("div", //
                {
                    "class": "horizontal layout" + (extraClasses ? (" " + extraClasses) : "")
                }, content, true);
        }

        export let makeHorzControlGroup = function(content: string): string {
            return tag("div", {
                "class": "horizontal layout"
            }, content, true);
        }

        export let makeRadioButton = function(label: string, id: string): string {
            return tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        }

        /*
         * Returns true if the nodeId (see makeNodeId()) NodeInfo object has 'hasChildren' true
         */
        export let nodeHasChildren = function(uid: string): boolean {
            var node: json.NodeInfo = meta64.uidToNodeMap[uid];
            if (!node) {
                console.log("Unknown nodeId in nodeHasChildren: " + uid);
                return false;
            } else {
                return node.hasChildren;
            }
        }

        export let formatPath = function(node: json.NodeInfo): string {
            let path: string = node.path;

            /* we inject space in here so this string can wrap and not affect window sizes adversely, or need scrolling */
            path = util.replaceAll(path, "/", " / ");
            let shortPath: string = path.length < 50 ? path : path.substring(0, 40) + "...";

            let noRootPath: string = shortPath;
            if (util.startsWith(noRootPath, "/root")) {
                noRootPath = noRootPath.substring(0, 5);
            }

            let ret: string = meta64.isAdminUser ? shortPath : noRootPath;
            ret += " [" + node.primaryTypeName + "]";
            return ret;
        }

        export let wrapHtml = function(text: string): string {
            return "<div>" + text + "</div>";
        }

        /*
         * Renders page and always also takes care of scrolling to selected node if there is one to scroll to
         */
        export let renderPageFromData = function(data?: json.RenderNodeResponse, scrollToTop?: boolean): string {
            meta64.codeFormatDirty = false;
            console.log("m64.render.renderPageFromData()");

            let newData: boolean = false;
            if (!data) {
                data = meta64.currentNodeData;
            } else {
                newData = true;
            }

            nav.endReached = data && data.endReached;

            if (!data || !data.node) {
                util.setVisibility("#listView", false);
                $("#mainNodeContent").html("No content is available here.");
                return;
            } else {
                util.setVisibility("#listView", true);
            }

            meta64.treeDirty = false;

            if (newData) {
                meta64.uidToNodeMap = {};
                meta64.idToNodeMap = {};
                meta64.identToUidMap = {};

                /*
                 * I'm choosing to reset selected nodes when a new page loads, but this is not a requirement. I just
                 * don't have a "clear selections" feature which would be needed so user has a way to clear out.
                 */
                meta64.selectedNodes = {};
                meta64.parentUidToFocusNodeMap = {};

                meta64.initNode(data.node, true);
                meta64.setCurrentNodeData(data);
            }

            let propCount: number = meta64.currentNode.properties ? meta64.currentNode.properties.length : 0;

            if (debug) {
                console.log("RENDER NODE: " + data.node.id + " propCount=" + propCount);
            }

            let output: string = "";
            let bkgStyle: string = getNodeBkgImageStyle(data.node);

            /*
             * NOTE: mainNodeContent is the parent node of the page content, and is always the node displayed at the to
             * of the page above all the other nodes which are its child nodes.
             */
            let mainNodeContent: string = renderNodeContent(data.node, true, true, true, false, true);

            //console.log("mainNodeContent: "+mainNodeContent);

            if (mainNodeContent.length > 0) {
                let uid: string = data.node.uid;
                let cssId: string = uid + "_row";
                let buttonBar: string = "";
                let editNodeButton: string = "";
                let createSubNodeButton: string = "";
                let replyButton: string = "";

                // console.log("data.node.path="+data.node.path);
                // console.log("isNonOwnedCommentNode="+props.isNonOwnedCommentNode(data.node));
                // console.log("isNonOwnedNode="+props.isNonOwnedNode(data.node));

                let createdBy: string = props.getNodePropertyVal(jcrCnst.CREATED_BY, data.node);
                let commentBy: string = props.getNodePropertyVal(jcrCnst.COMMENT_BY, data.node);
                let publicAppend: string = props.getNodePropertyVal(jcrCnst.PUBLIC_APPEND, data.node);

                /*
                 * Show Reply button if this is a publicly appendable node and not created by current user,
                 * or having been added as comment by current user
                 */

                if (publicAppend && createdBy != meta64.userName && commentBy != meta64.userName) {
                    replyButton = tag("paper-button", {
                        "raised": "raised",
                        "onClick": `m64.edit.replyToComment('${data.node.uid}');` //
                    }, //
                        "Reply");
                }

                if (meta64.userPreferences.editMode && cnst.NEW_ON_TOOLBAR && edit.isInsertAllowed(data.node)) {
                    createSubNodeButton = tag("paper-icon-button", {
                        "icon": "icons:picture-in-picture-alt", //icons:more-vert",
                        "raised": "raised",
                        "onClick": `m64.edit.createSubNode('${uid}');`
                    }, "Add");
                }

                /* Add edit button if edit mode and this isn't the root */
                if (edit.isEditAllowed(data.node)) {

                    /* Construct Create Subnode Button */
                    editNodeButton = tag("paper-icon-button", {
                        "icon": "editor:mode-edit",
                        "raised": "raised",
                        "onClick": `m64.edit.runEditNode('${uid}');`
                    }, "Edit");
                }

                /* Construct Create Subnode Button */
                let focusNode: json.NodeInfo = meta64.getHighlightedNode();
                let selected: boolean = focusNode && focusNode.uid === uid;
                // var rowHeader = buildRowHeader(data.node, true, true);

                if (createSubNodeButton || editNodeButton || replyButton) {
                    buttonBar = makeHorizontalFieldSet(createSubNodeButton + editNodeButton + replyButton);
                }

                let content: string = tag("div", {
                    "class": (selected ? "mainNodeContentStyle active-row" : "mainNodeContentStyle inactive-row"),
                    "onClick": `m64.nav.clickOnNodeRow(this, '${uid}');`,
                    "id": cssId
                },//
                    buttonBar + mainNodeContent);

                $("#mainNodeContent").show();
                $("#mainNodeContent").html(content);

                /* force all links to open a new window/tab */
                //$("a").attr("target", "_blank"); <---- this doesn't work.
                // $('#mainNodeContent').find("a").each(function() {
                //     $(this).attr("target", "_blank");
                // });
            } else {
                $("#mainNodeContent").hide();
            }

            // console.log("update status bar.");
            view.updateStatusBar();

            if (nav.mainOffset > 0) {
                let firstButton: string = makeButton("First Page", "firstPageButton", firstPage);
                let prevButton: string = makeButton("Prev Page", "prevPageButton", prevPage);
                output += centeredButtonBar(firstButton + prevButton, "paging-button-bar");
            }

            let rowCount: number = 0;
            if (data.children) {
                let childCount: number = data.children.length;
                // console.log("childCount: " + childCount);
                /*
                 * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on
                 * the client side for various reasons.
                 */
                for (var i = 0; i < data.children.length; i++) {
                    let node: json.NodeInfo = data.children[i];
                    if (!edit.nodesToMoveSet[node.id]) {
                        let row: string = generateRow(i, node, newData, childCount, rowCount);
                        if (row.length != 0) {
                            output += row;
                            rowCount++;
                        }
                    }
                }
            }

            if (edit.isInsertAllowed(data.node)) {
                if (rowCount == 0 && !meta64.isAnonUser) {
                    output = getEmptyPagePrompt();
                }
            }

            if (!data.endReached) {
                let nextButton = makeButton("Next Page", "nextPageButton", nextPage);
                let lastButton = makeButton("Last Page", "lastPageButton", lastPage);
                output += centeredButtonBar(nextButton + lastButton, "paging-button-bar");
            }

            util.setHtml("listView", output);

            if (meta64.codeFormatDirty) {
                prettyPrint();
            }

            $("a").attr("target", "_blank");

            /*
             * TODO-3: Instead of calling screenSizeChange here immediately, it would be better to set the image sizes
             * exactly on the attributes of each image, as the HTML text is rendered before we even call
             * setHtml, so that images always are GUARANTEED to render correctly immediately.
             */
            meta64.screenSizeChange();

            if (scrollToTop || !meta64.getHighlightedNode()) {
                view.scrollToTop();
            } else {
                view.scrollToSelectedNode();
            }
        }

        export let firstPage = function(): void {
            console.log("First page button click.");
            view.firstPage();
        }

        export let prevPage = function(): void {
            console.log("Prev page button click.");
            view.prevPage();
        }

        export let nextPage = function(): void {
            console.log("Next page button click.");
            view.nextPage();
        }

        export let lastPage = function(): void {
            console.log("Last page button click.");
            view.lastPage();
        }

        export let generateRow = function(i: number, node: json.NodeInfo, newData: boolean, childCount: number, rowCount: number): string {

            if (meta64.isNodeBlackListed(node))
                return "";

            if (newData) {
                meta64.initNode(node, true);

                if (debug) {
                    console.log(" RENDER ROW[" + i + "]: node.id=" + node.id);
                }
            }

            rowCount++; // warning: this is the local variable/parameter
            var row = renderNodeAsListItem(node, i, childCount, rowCount);
            // console.log("row[" + rowCount + "]=" + row);
            return row;
        }

        export let getUrlForNodeAttachment = function(node: json.NodeInfo): string {
            return postTargetUrl + "bin/file-name?nodeId=" + encodeURIComponent(node.path) + "&ver=" + node.binVer;
        }

        /* see also: makeImageTag() */
        export let adjustImageSize = function(node: json.NodeInfo): void {

            var elm = $("#" + node.imgId);
            if (elm) {
                // var width = elm.attr("width");
                // var height = elm.attr("height");
                // console.log("width=" + width + " height=" + height);

                if (node.width && node.height) {

                    /*
                     * New Logic is try to display image at 150% meaning it can go outside the content div it's in,
                     * which we want, but then we also limit it with max-width so on smaller screen devices or small
                     * window resizings even on desktop browsers the image will always be entirely visible and not
                     * clipped.
                     */
                    // var maxWidth = meta64.deviceWidth - 80;
                    // elm.attr("width", "150%");
                    // elm.attr("height", "auto");
                    // elm.attr("style", "max-width: " + maxWidth + "px;");
                    /*
                     * DO NOT DELETE (for a long time at least) This is the old logic for resizing images responsively,
                     * and it works fine but my new logic is better, with limiting max width based on screen size. But
                     * keep this old code for now..
                     */
                    if (node.width > meta64.deviceWidth - 80) {

                        /* set the width we want to go for */
                        // var width = meta64.deviceWidth - 80;
                        /*
                         * and set the height to the value it needs to be at for same w/h ratio (no image stretching)
                         */
                        // var height = width * node.height / node.width;
                        elm.attr("width", "100%");
                        elm.attr("height", "auto");
                        // elm.attr("style", "max-width: " + maxWidth + "px;");
                    }
                    /*
                     * Image does fit on screen so render it at it's exact size
                     */
                    else {
                        elm.attr("width", node.width);
                        elm.attr("height", node.height);
                    }
                }
            }
        }

        /* see also: adjustImageSize() */
        export let makeImageTag = function(node: json.NodeInfo) {
            let src: string = getUrlForNodeAttachment(node);
            node.imgId = "imgUid_" + node.uid;

            if (node.width && node.height) {

                /*
                 * if image won't fit on screen we want to size it down to fit
                 *
                 * Yes, it would have been simpler to just use something like width=100% for the image width but then
                 * the hight would not be set explicitly and that would mean that as images are loading into the page,
                 * the effective scroll position of each row will be increasing each time the URL request for a new
                 * image completes. What we want is to have it so that once we set the scroll position to scroll a
                 * particular row into view, it will stay the correct scroll location EVEN AS the images are streaming
                 * in asynchronously.
                 *
                 */
                if (node.width > meta64.deviceWidth - 50) {

                    /* set the width we want to go for */
                    let width: number = meta64.deviceWidth - 50;

                    /*
                     * and set the height to the value it needs to be at for same w/h ratio (no image stretching)
                     */
                    let height: number = width * node.height / node.width;

                    return tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": width + "px",
                        "height": height + "px"
                    }, null, false);
                }
                /* Image does fit on screen so render it at it's exact size */
                else {
                    return tag("img", {
                        "src": src,
                        "id": node.imgId,
                        "width": node.width + "px",
                        "height": node.height + "px"
                    }, null, false);
                }
            } else {
                return tag("img", {
                    "src": src,
                    "id": node.imgId
                }, null, false);
            }
        }

        /*
         * creates HTML tag with all attributes/values specified in attributes object, and closes the tag also if
         * content is non-null
         */
        export let tag = function(tag: string, attributes?: Object, content?: string, closeTag?: boolean): string {

            /* default parameter values */
            if (typeof (closeTag) === 'undefined')
                closeTag = true;

            /* HTML tag itself */
            let ret: string = "<" + tag;

            if (attributes) {
                ret += " ";
                $.each(attributes, function(k, v) {
                    if (v) {
                        if (typeof v !== 'string') {
                            v = String(v);
                        }

                        /*
                         * we intelligently wrap strings that contain single quotes in double quotes and vice versa
                         */
                        if (util.contains(v, "'")) {
                            //ret += k + "=\"" + v + "\" ";
                            ret += `${k}="${v}" `;
                        } else {
                            //ret += k + "='" + v + "' ";
                            ret += `${k}='${v}' `;
                        }
                    } else {
                        ret += k + " ";
                    }
                });
            }

            if (closeTag) {
                if (!content) {
                    content = "";
                }
                //ret += ">" + content + "</" + tag + ">";
                ret += `>${content}</${tag}>`;
            } else {
                ret += "/>";
            }

            return ret;
        }

        export let makeTextArea = function(fieldName: string, fieldId: string): string {
            return tag("paper-textarea", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        }

        export let makeEditField = function(fieldName: string, fieldId: string): string {
            return tag("paper-input", {
                "name": fieldId,
                "label": fieldName,
                "id": fieldId
            }, "", true);
        }

        export let makePasswordField = function(fieldName: string, fieldId: string): string {
            return tag("paper-input", {
                "type": "password",
                "name": fieldId,
                "label": fieldName,
                "id": fieldId,
                "class": "meta64-input"
            }, "", true);
        }

        export let makeButton = function(text: string, id: string, callback: any, ctx?: any): string {
            let attribs = {
                "raised": "raised",
                "id": id,
                "class": "standardButton"
            };

            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }

            return render.tag("paper-button", attribs, text, true);
        }

        export let allowPropertyToDisplay = function(propName: string): boolean {
            if (!meta64.inSimpleMode())
                return true;
            return meta64.simpleModePropertyBlackList[propName] == null;
        }

        export let isReadOnlyProperty = function(propName: string): boolean {
            return meta64.readOnlyPropertyList[propName];
        }

        export let isBinaryProperty = function(propName: string): boolean {
            return meta64.binaryPropertyList[propName];
        }

        export let sanitizePropertyName = function(propName: string): string {
            if (meta64.editModeOption === "simple") {
                return propName === jcrCnst.CONTENT ? "Content" : propName;
            } else {
                return propName;
            }
        }
    }
    export namespace srch {
        export let _UID_ROWID_SUFFIX: string = "_srch_row";

        export let searchNodes: any = null;
        export let searchPageTitle: string = "Search Results";
        export let timelinePageTitle: string = "Timeline";

        export let searchOffset = 0;
        export let timelineOffset = 0;

        /*
         * Holds the NodeSearchResponse.java JSON, or null if no search has been done.
         */
        export let searchResults: any = null;

        /*
         * Holds the NodeSearchResponse.java JSON, or null if no timeline has been done.
         */
        export let timelineResults: any = null;

        /*
         * Will be the last row clicked on (NodeInfo.java object) and having the red highlight bar
         */
        export let highlightRowNode: json.NodeInfo = null;

        /*
         * maps node 'identifier' (assigned at server) to uid value which is a value based off local sequence, and uses
         * nextUid as the counter.
         */
        export let identToUidMap: any = {};

        /*
         * maps node.uid values to the NodeInfo.java objects
         *
         * The only contract about uid values is that they are unique insofar as any one of them always maps to the same
         * node. Limited lifetime however. The server is simply numbering nodes sequentially. Actually represents the
         * 'instance' of a model object. Very similar to a 'hashCode' on Java objects.
         */
        export let uidToNodeMap: { [key: string]: json.NodeInfo } = {};

        export let numSearchResults = function() {
            return srch.searchResults != null && //
                srch.searchResults.searchResults != null && //
                srch.searchResults.searchResults.length != null ? //
                srch.searchResults.searchResults.length : 0;
        }

        export let searchTabActivated = function() {
            /*
             * If a logged in user clicks the search tab, and no search results are currently displaying, then go ahead
             * and open up the search dialog.
             */
            if (numSearchResults() == 0 && !meta64.isAnonUser) {
                (new SearchContentDlg()).open();
            }
        }

        export let searchNodesResponse = function(res: json.NodeSearchResponse) {
            searchResults = res;
            let searchResultsPanel = new SearchResultsPanel();
            var content = searchResultsPanel.build();
            util.setHtml("searchResultsPanel", content);
            searchResultsPanel.init();
            meta64.changePage(searchResultsPanel);
        }

        export let timelineResponse = function(res: json.NodeSearchResponse) {
            timelineResults = res;
            let timelineResultsPanel = new TimelineResultsPanel();
            var content = timelineResultsPanel.build();
            util.setHtml("timelineResultsPanel", content);
            timelineResultsPanel.init();
            meta64.changePage(timelineResultsPanel);
        }

        export let searchFilesResponse = function(res: json.FileSearchResponse) {
            nav.mainOffset = 0;
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": res.searchResultNodeId,
                "upLevel": null,
                "renderParentIfLeaf": null,
                "offset": 0,
                "goToLastPage": false
            }, nav.navPageNodeResponse);
        }

        export let timelineByModTime = function() {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.LAST_MODIFIED,
                "searchProp": null
            }, timelineResponse);
        }

        export let timelineByCreateTime = function() {
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to 'timeline' under.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": "",
                "sortDir": "DESC",
                "sortField": jcrCnst.CREATED,
                "searchProp": null
            }, timelineResponse);
        }

        export let initSearchNode = function(node: json.NodeInfo) {
            node.uid = util.getUidForId(identToUidMap, node.id);
            uidToNodeMap[node.uid] = node;
        }

        export let populateSearchResultsPage = function(data, viewName) {
            var output = '';
            var childCount = data.searchResults.length;

            /*
             * Number of rows that have actually made it onto the page to far. Note: some nodes get filtered out on the
             * client side for various reasons.
             */
            var rowCount = 0;

            $.each(data.searchResults, function(i, node) {
                if (meta64.isNodeBlackListed(node))
                    return;

                initSearchNode(node);

                rowCount++;
                output += renderSearchResultAsListItem(node, i, childCount, rowCount);
            });

            util.setHtml(viewName, output);
        }

        /*
         * Renders a single line of search results on the search results page.
         *
         * node is a NodeInfo.java JSON
         */
        export let renderSearchResultAsListItem = function(node, index, count, rowCount) {

            var uid = node.uid;
            console.log("renderSearchResult: " + uid);

            var cssId = uid + _UID_ROWID_SUFFIX;
            // console.log("Rendering Node Row[" + index + "] with id: " +cssId)

            var buttonBarHtml = makeButtonBarHtml("" + uid);

            console.log("buttonBarHtml=" + buttonBarHtml);
            var content = render.renderNodeContent(node, true, true, true, true, true);

            return render.tag("div", {
                "class": "node-table-row inactive-row",
                "onClick": `m64.srch.clickOnSearchResultRow(this, '${uid}');`, //
                "id": cssId
            },//
                buttonBarHtml//
                + render.tag("div", {
                    "id": uid + "_srch_content"
                }, content));
        }

        export let makeButtonBarHtml = function(uid) {
            var gotoButton = render.makeButton("Go to Node", uid, `m64.srch.clickSearchNode('${uid}');`);
            return render.makeHorizontalFieldSet(gotoButton);
        }

        export let clickOnSearchResultRow = function(rowElm, uid) {
            unhighlightRow();
            highlightRowNode = uidToNodeMap[uid];

            util.changeOrAddClass(rowElm, "inactive-row", "active-row");
        }

        export let clickSearchNode = function(uid: string) {
            /*
             * update highlight node to point to the node clicked on, just to persist it for later
             */
            srch.highlightRowNode = srch.uidToNodeMap[uid];
            if (!srch.highlightRowNode) {
                throw "Unable to find uid in search results: " + uid;
            }

            view.refreshTree(srch.highlightRowNode.id, true, srch.highlightRowNode.id);
            meta64.selectTab("mainTabName");
        }

        /*
         * turn of row selection styling of whatever row is currently selected
         */
        export let unhighlightRow = function() {

            if (!highlightRowNode) {
                return;
            }

            /* now make CSS id from node */
            var nodeId = highlightRowNode.uid + _UID_ROWID_SUFFIX;

            var elm = util.domElm(nodeId);
            if (elm) {
                /* change class on element */
                util.changeOrAddClass(elm, "active-row", "inactive-row");
            }
        }
    }
    export namespace share {

        let findSharedNodesResponse = function(res: json.GetSharedNodesResponse) {
            srch.searchNodesResponse(res);
        }

        export let sharingNode: json.NodeInfo = null;

        /*
         * Handles 'Sharing' button on a specific node, from button bar above node display in edit mode
         */
        export let editNodeSharing = function(): void {
            let node: json.NodeInfo = meta64.getHighlightedNode();

            if (!node) {
                (new MessageDlg("No node is selected.")).open();
                return;
            }
            sharingNode = node;
            (new SharingDlg()).open();
        }

        export let findSharedNodes = function(): void {
            let focusNode: json.NodeInfo = meta64.getHighlightedNode();
            if (focusNode == null) {
                return;
            }

            srch.searchPageTitle = "Shared Nodes";

            util.json<json.GetSharedNodesRequest, json.GetSharedNodesResponse>("getSharedNodes", {
                "nodeId": focusNode.id
            }, findSharedNodesResponse);
        }
    }
    export namespace user {

        let logoutResponse = function(res: json.LogoutResponse): void {
            /* reloads browser with the query parameters stripped off the path */
            window.location.href = window.location.origin;
        }

        /*
         * for testing purposes, I want to allow certain users additional privileges. A bit of a hack because it will go
         * into production, but on my own production these are my "testUserAccounts", so no real user will be able to
         * use these names
         */
        export let isTestUserAccount = function(): boolean {
            return meta64.userName.toLowerCase() === "adam" || //
                meta64.userName.toLowerCase() === "bob" || //
                meta64.userName.toLowerCase() === "cory" || //
                meta64.userName.toLowerCase() === "dan";
        }

        export let setTitleUsingLoginResponse = function(res): void {
            var title = BRANDING_TITLE_SHORT;

            /* todo-0: If users go with very long usernames this is gonna be ugly */
            if (!meta64.isAnonUser) {
                title += ":" + res.userName;
            }

            $("#headerAppName").html(title);
        }

        /* TODO-3: move this into meta64 module */
        export let setStateVarsUsingLoginResponse = function(res: json.LoginResponse): void {
            if (res.rootNode) {
                meta64.homeNodeId = res.rootNode.id;
                meta64.homeNodePath = res.rootNode.path;
            }
            meta64.userName = res.userName;
            meta64.isAdminUser = res.userName === "admin";
            meta64.isAnonUser = res.userName === "anonymous";
            meta64.anonUserLandingPageNode = res.anonUserLandingPageNode;
            meta64.allowFileSystemSearch = res.allowFileSystemSearch;

            meta64.userPreferences = res.userPreferences;
            meta64.editModeOption = res.userPreferences.advancedMode ? meta64.MODE_ADVANCED : meta64.MODE_SIMPLE;
            meta64.showMetaData = res.userPreferences.showMetaData;

            console.log("from server: meta64.editModeOption=" + meta64.editModeOption);
        }

        export let openSignupPg = function(): void {
            (new SignupDlg()).open();
        }

        /* Write a cookie that expires in a year for all paths */
        export let writeCookie = function(name, val): void {
            $.cookie(name, val, {
                expires: 365,
                path: '/'
            });
        }

        /*
         * This method is ugly. It is the button that can be login *or* logout.
         */
        export let openLoginPg = function(): void {
            let loginDlg: LoginDlg = new LoginDlg();
            loginDlg.populateFromCookies();
            loginDlg.open();
        }

        export let refreshLogin = function(): void {

            console.log("refreshLogin.");

            let callUsr: string;
            let callPwd: string;
            let usingCookies: boolean = false;

            var loginSessionReady = $("#loginSessionReady").text();
            if (loginSessionReady === "true") {
                console.log("    loginSessionReady = true");
                /*
                 * using blank credentials will cause server to look for a valid session
                 */
                callUsr = "";
                callPwd = "";
                usingCookies = true;
            } else {
                console.log("    loginSessionReady = false");

                let loginState: string = $.cookie(cnst.COOKIE_LOGIN_STATE);

                /* if we have known state as logged out, then do nothing here */
                if (loginState === "0") {
                    meta64.loadAnonPageHome(false);
                    return;
                }

                let usr: string = $.cookie(cnst.COOKIE_LOGIN_USR);
                let pwd: string = $.cookie(cnst.COOKIE_LOGIN_PWD);

                usingCookies = !util.emptyString(usr) && !util.emptyString(pwd);
                console.log("cookieUser=" + usr + " usingCookies = " + usingCookies);

                /*
                 * empyt credentials causes server to try to log in with any active session credentials.
                 */
                callUsr = usr ? usr : "";
                callPwd = pwd ? pwd : "";
            }

            console.log("refreshLogin with name: " + callUsr);

            if (!callUsr) {
                meta64.loadAnonPageHome(false);
            } else {
                util.json<json.LoginRequest, json.LoginResponse>("login", {
                    "userName": callUsr,
                    "password": callPwd,
                    "tzOffset": new Date().getTimezoneOffset(),
                    "dst": util.daylightSavingsTime
                }, function(res: json.LoginResponse) {
                    if (usingCookies) {
                        loginResponse(res, callUsr, callPwd, usingCookies);
                    } else {
                        refreshLoginResponse(res);
                    }
                });
            }
        }

        export let logout = function(updateLoginStateCookie) {
            if (meta64.isAnonUser) {
                return;
            }

            /* Remove warning dialog to ask user about leaving the page */
            $(window).off("beforeunload");

            if (updateLoginStateCookie) {
                writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
            }

            util.json<json.LogoutRequest, json.LogoutResponse>("logout", {}, logoutResponse);
        }

        export let login = function(loginDlg, usr, pwd) {
            util.json<json.LoginRequest, json.LoginResponse>("login", {
                "userName": usr,
                "password": pwd,
                "tzOffset": new Date().getTimezoneOffset(),
                "dst": util.daylightSavingsTime
            }, function(res: json.LoginResponse) {
                loginResponse(res, usr, pwd, null, loginDlg);
            });
        }

        export let deleteAllUserCookies = function() {
            $.removeCookie(cnst.COOKIE_LOGIN_USR);
            $.removeCookie(cnst.COOKIE_LOGIN_PWD);
            $.removeCookie(cnst.COOKIE_LOGIN_STATE);
        }

        export let loginResponse = function(res?: json.LoginResponse, usr?: string, pwd?: string, usingCookies?: boolean, loginDlg?: LoginDlg) {
            if (util.checkSuccess("Login", res)) {
                console.log("loginResponse: usr=" + usr + " homeNodeOverride: " + res.homeNodeOverride);

                if (usr != "anonymous") {
                    writeCookie(cnst.COOKIE_LOGIN_USR, usr);
                    writeCookie(cnst.COOKIE_LOGIN_PWD, pwd);
                    writeCookie(cnst.COOKIE_LOGIN_STATE, "1");
                }

                if (loginDlg) {
                    loginDlg.cancel();
                }

                setStateVarsUsingLoginResponse(res);

                if (res.userPreferences.lastNode) {
                    console.log("lastNode: " + res.userPreferences.lastNode);
                } else {
                    console.log("lastNode is null.");
                }

                /* set ID to be the page we want to show user right after login */
                let id: string = null;

                if (!util.emptyString(res.homeNodeOverride)) {
                    console.log("loading homeNodeOverride=" + res.homeNodeOverride);
                    id = res.homeNodeOverride;
                    meta64.homeNodeOverride = id;
                } else {
                    if (res.userPreferences.lastNode) {
                        console.log("loading lastNode=" + res.userPreferences.lastNode);
                        id = res.userPreferences.lastNode;
                    } else {
                        console.log("loading homeNodeId=" + meta64.homeNodeId);
                        id = meta64.homeNodeId;
                    }
                }

                view.refreshTree(id, false, null, true);
                setTitleUsingLoginResponse(res);
            } else {
                if (usingCookies) {
                    (new MessageDlg("Cookie login failed.")).open();

                    /*
                     * blow away failed cookie credentials and reload page, should result in brand new page load as anon
                     * user.
                     */
                    $.removeCookie(cnst.COOKIE_LOGIN_USR);
                    $.removeCookie(cnst.COOKIE_LOGIN_PWD);
                    writeCookie(cnst.COOKIE_LOGIN_STATE, "0");
                    location.reload();
                }
            }
        }

        // res is JSON response object from server.
        let refreshLoginResponse = function(res: json.LoginResponse): void {
            console.log("refreshLoginResponse");

            if (res.success) {
                user.setStateVarsUsingLoginResponse(res);
                user.setTitleUsingLoginResponse(res);
            }

            meta64.loadAnonPageHome(false);
        }
    }
    export namespace view {

        export let scrollToSelNodePending: boolean = false;

        export let updateStatusBar = function(): void {
            if (!meta64.currentNodeData)
                return;
            var statusLine = "";

            if (meta64.editModeOption === meta64.MODE_ADVANCED) {
                statusLine += "count: " + meta64.currentNodeData.children.length;
            }

            if (meta64.userPreferences.editMode) {
                statusLine += " Selections: " + util.getPropertyCount(meta64.selectedNodes);
            }
        }

        /*
         * newId is optional parameter which, if supplied, should be the id we scroll to when finally done with the
         * render.
         */
        export let refreshTreeResponse = function(res?: json.RenderNodeResponse, targetId?: any, scrollToTop?: boolean): void {
            render.renderPageFromData(res, scrollToTop);

            if (scrollToTop) {

            } else {
                if (targetId) {
                    meta64.highlightRowById(targetId, true);
                } else {
                    scrollToSelectedNode();
                }
            }
            meta64.refreshAllGuiEnablement();
            util.delayedFocus("#mainNodeContent");
        }

        /*
         * newId is optional and if specified makes the page scroll to and highlight that node upon re-rendering.
         */
        export let refreshTree = function(nodeId?: any, renderParentIfLeaf?: any, highlightId?: any, isInitialRender?: boolean): void {
            if (!nodeId) {
                nodeId = meta64.currentNodeId;
            }

            console.log("Refreshing tree: nodeId=" + nodeId);
            if (!highlightId) {
                let currentSelNode: json.NodeInfo = meta64.getHighlightedNode();
                highlightId = currentSelNode != null ? currentSelNode.id : nodeId;
            }

            /*
            I don't know of any reason 'refreshTree' should itself reset the offset, but I leave this comment here
            as a hint for the future.
            nav.mainOffset = 0;
            */
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": nodeId,
                "upLevel": null,
                "renderParentIfLeaf": renderParentIfLeaf ? true : false,
                "offset": nav.mainOffset,
                "goToLastPage": false
            }, function(res: json.RenderNodeResponse) {
                if (res.offsetOfNodeFound > -1) {
                    nav.mainOffset = res.offsetOfNodeFound;
                }
                refreshTreeResponse(res, highlightId);

                if (isInitialRender && meta64.urlCmd == "addNode" && meta64.homeNodeOverride) {
                    edit.editMode(true);
                    edit.createSubNode(meta64.currentNode.uid);
                }
            });
        }

        export let firstPage = function(): void {
            console.log("Running firstPage Query");
            nav.mainOffset = 0;
            loadPage(false);
        }

        export let prevPage = function(): void {
            console.log("Running prevPage Query");
            nav.mainOffset -= nav.ROWS_PER_PAGE;
            if (nav.mainOffset < 0) {
                nav.mainOffset = 0;
            }
            loadPage(false);
        }

        export let nextPage = function(): void {
            console.log("Running nextPage Query");
            nav.mainOffset += nav.ROWS_PER_PAGE;
            loadPage(false);
        }

        export let lastPage = function(): void {
            console.log("Running lastPage Query");
            //nav.mainOffset += nav.ROWS_PER_PAGE;
            loadPage(true);
        }

        let loadPage = function(goToLastPage: boolean): void {
            util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
                "nodeId": meta64.currentNodeId,
                "upLevel": null,
                "renderParentIfLeaf": true,
                "offset": nav.mainOffset,
                "goToLastPage": goToLastPage
            }, function(res: json.RenderNodeResponse) {
                if (goToLastPage) {
                    if (res.offsetOfNodeFound > -1) {
                        nav.mainOffset = res.offsetOfNodeFound;
                    }
                }
                refreshTreeResponse(res, null, true);
            });
        }

        /*
         * todo-3: this scrolling is slightly imperfect. sometimes the code switches to a tab, which triggers
         * scrollToTop, and then some other code scrolls to a specific location a fraction of a second later. the
         * 'pending' boolean here is a crutch for now to help visual appeal (i.e. stop if from scrolling to one place
         * and then scrolling to a different place a fraction of a second later)
         */
        export let scrollToSelectedNode = function() {
            scrollToSelNodePending = true;

            setTimeout(function() {
                scrollToSelNodePending = false;

                let elm: any = nav.getSelectedPolyElement();
                if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    elm.node.scrollIntoView();
                }
                // If we couldn't find a selected node on this page, scroll to
                // top instead.
                else {
                    $("#mainContainer").scrollTop(0);
                    //todo-0: removed mainPaperTabs from visibility, but what code should go here now?
                    // elm = util.polyElm("mainPaperTabs");
                    // if (elm && elm.node && typeof elm.node.scrollIntoView == 'function') {
                    //     elm.node.scrollIntoView();
                    // }
                }
            }, 1000);
        }

        export let scrollToTop = function() {
            if (scrollToSelNodePending)
                return;

            //let e = $("#mainContainer");
            $("#mainContainer").scrollTop(0);

            //todo-0: not using mainPaperTabs any longer so shw should go here now ?
            setTimeout(function() {
                if (scrollToSelNodePending)
                    return;
                $("#mainContainer").scrollTop(0);
            }, 1000);
        }

        export let initEditPathDisplayById = function(domId: string) {
            let node: json.NodeInfo = edit.editNode;
            let e: any = $("#" + domId);
            if (!e)
                return;

            if (edit.editingUnsavedNode) {
                e.html("");
                e.hide();
            } else {
                var pathDisplay = "Path: " + render.formatPath(node);

                // todo-2: Do we really need ID in addition to Path here?
                // pathDisplay += "<br>ID: " + node.id;

                if (node.lastModified) {
                    pathDisplay += "<br>Mod: " + node.lastModified;
                }
                e.html(pathDisplay);
                e.show();
            }
        }

        export let showServerInfo = function() {
            util.json<json.GetServerInfoRequest, json.GetServerInfoResponse>("getServerInfo", {}, function(res: json.GetServerInfoResponse) {
                (new MessageDlg(res.serverInfo)).open();
            });
        }
    }
    export namespace menuPanel {

        let makeTopLevelMenu = function(title: string, content: string, id?: string): string {
            let paperItemAttrs = {
                class: "menu-trigger"
            };

            let paperItem = render.tag("paper-item", paperItemAttrs, title);

            let paperSubmenuAttrs = {
                "label": title,
                "selectable": ""
            };

            if (id) {
                (<any>paperSubmenuAttrs).id = id;
            }

            return render.tag("paper-submenu", paperSubmenuAttrs
                //{
                //"label": title,
                //"class": "meta64-menu-heading",
                //"class": "menu-content sublist"
                //}
                , paperItem + //"<paper-item class='menu-trigger'>" + title + "</paper-item>" + //
                makeSecondLevelList(content), true);
        }

        let makeSecondLevelList = function(content: string): string {
            return render.tag("paper-menu", {
                "class": "menu-content sublist my-menu-section",
                "selectable": ""
                //,
                //"multi": "multi"
            }, content, true);
        }

        let menuItem = function(name: string, id: string, onClick: any): string {
            return render.tag("paper-item", {
                "id": id,
                "onclick": onClick,
                "selectable": ""
            }, name, true);
        }

        let domId: string = "mainAppMenu";

        export let build = function(): void {

            // I ended up not really liking this way of selecting tabs. I can just use normal polymer tabs.
            // var pageMenuItems = //
            //     menuItem("Main", "mainPageButton", "m64.meta64.selectTab('mainTabName');") + //
            //     menuItem("Search", "searchPageButton", "m64.meta64.selectTab('searchTabName');") + //
            //     menuItem("Timeline", "timelinePageButton", "m64.meta64.selectTab('timelineTabName');");
            // var pageMenu = makeTopLevelMenu("Page", pageMenuItems);

            var rssItems = //
                menuItem("Feeds", "mainMenuRss", "m64.nav.openRssFeedsNode();");
            var mainMenuRss = makeTopLevelMenu("RSS", rssItems);

            var editMenuItems = //
                menuItem("Create", "createNodeButton", "m64.edit.createNode();") + //
                menuItem("Rename", "renameNodePgButton", "(new m64.RenameNodeDlg()).open();") + //
                menuItem("Cut", "cutSelNodesButton", "m64.edit.cutSelNodes();") + //
                menuItem("Paste", "pasteSelNodesButton", "m64.edit.pasteSelNodes();") + //
                menuItem("Clear Selections", "clearSelectionsButton", "m64.edit.clearSelections();") + //
                menuItem("Import", "openImportDlg", "(new m64.ImportDlg()).open();") + //
                menuItem("Export", "openExportDlg", "(new m64.ExportDlg()).open();") + //
                menuItem("Delete", "deleteSelNodesButton", "m64.edit.deleteSelNodes();");
            var editMenu = makeTopLevelMenu("Edit", editMenuItems);

            var moveMenuItems = //
                menuItem("Up", "moveNodeUpButton", "m64.edit.moveNodeUp();") + //
                menuItem("Down", "moveNodeDownButton", "m64.edit.moveNodeDown();") + //
                menuItem("to Top", "moveNodeToTopButton", "m64.edit.moveNodeToTop();") + //
                menuItem("to Bottom", "moveNodeToBottomButton", "m64.edit.moveNodeToBottom();");//
            var moveMenu = makeTopLevelMenu("Move", moveMenuItems);

            var attachmentMenuItems = //
                menuItem("Upload from File", "uploadFromFileButton", "m64.attachment.openUploadFromFileDlg();") + //
                menuItem("Upload from URL", "uploadFromUrlButton", "m64.attachment.openUploadFromUrlDlg();") + //
                menuItem("Delete Attachment", "deleteAttachmentsButton", "m64.attachment.deleteAttachment();");
            var attachmentMenu = makeTopLevelMenu("Attach", attachmentMenuItems);

            var sharingMenuItems = //
                menuItem("Edit Node Sharing", "editNodeSharingButton", "m64.share.editNodeSharing();") + //
                menuItem("Find Shared Subnodes", "findSharedNodesButton", "m64.share.findSharedNodes();");
            var sharingMenu = makeTopLevelMenu("Share", sharingMenuItems);

            var searchMenuItems = //
                menuItem("Content", "contentSearchDlgButton", "(new m64.SearchContentDlg()).open();") +//
                //todo-0: make a version of the dialog that does a tag search
                menuItem("Tags", "tagSearchDlgButton", "(new m64.SearchTagsDlg()).open();") + //
                menuItem("Files", "fileSearchDlgButton", "(new m64.SearchFilesDlg(true)).open();");

            var searchMenu = makeTopLevelMenu("Search", searchMenuItems);

            var timelineMenuItems = //
                menuItem("Created", "timelineCreatedButton", "m64.srch.timelineByCreateTime();") +//
                menuItem("Modified", "timelineModifiedButton", "m64.srch.timelineByModTime();");//
            var timelineMenu = makeTopLevelMenu("Timeline", timelineMenuItems);

            var viewOptionsMenuItems = //
                menuItem("Toggle Properties", "propsToggleButton", "m64.props.propsToggle();") + //
                menuItem("Refresh", "refreshPageButton", "m64.meta64.refresh();") + //
                menuItem("Show URL", "showFullNodeUrlButton", "m64.render.showNodeUrl();") + //
                menuItem("Preferences", "accountPreferencesButton", "(new m64.PrefsDlg()).open();"); //
            var viewOptionsMenu = makeTopLevelMenu("View", viewOptionsMenuItems);

            // WORK IN PROGRESS ( do not delete)
            // var fileSystemMenuItems = //
            //     menuItem("Reindex", "fileSysReindexButton", "m64.systemfolder.reindex();") + //
            //     menuItem("Search", "fileSysSearchButton", "m64.systemfolder.search();"); //
            //     //menuItem("Browse", "fileSysBrowseButton", "m64.systemfolder.browse();");
            // var fileSystemMenu = makeTopLevelMenu("FileSys", fileSystemMenuItems);

            /*
             * whatever is commented is only commented for polymer conversion
             */
            var myAccountItems = //
                menuItem("Change Password", "changePasswordPgButton", "(new m64.ChangePasswordDlg()).open();") + //
                menuItem("Manage Account", "manageAccountButton", "(new m64.ManageAccountDlg()).open();"); //

            // menuItem("Full Repository Export", "fullRepositoryExport", "
            // edit.fullRepositoryExport();") + //
            var myAccountMenu = makeTopLevelMenu("Account", myAccountItems);

            var adminItems = //
                menuItem("Generate RSS", "generateRSSButton", "m64.podcast.generateRSS();") +//
                menuItem("Server Info", "showServerInfoButton", "m64.view.showServerInfo();") +//
                menuItem("Insert Book: War and Peace", "insertBookWarAndPeaceButton", "m64.edit.insertBookWarAndPeace();"); //
            var adminMenu = makeTopLevelMenu("Admin", adminItems, "adminMenu");

            var helpItems = //
                menuItem("Main Menu Help", "mainMenuHelp", "m64.nav.openMainMenuHelp();");
            var mainMenuHelp = makeTopLevelMenu("Help/Docs", helpItems);

            var content = /* pageMenu+ */ mainMenuRss + editMenu + moveMenu + attachmentMenu + sharingMenu + viewOptionsMenu /* + fileSystemMenu */ + searchMenu + timelineMenu + myAccountMenu
                + adminMenu + mainMenuHelp;

            util.setHtml(domId, content);
        }

        export let init = function(): void {
            meta64.refreshAllGuiEnablement();
        }
    }

    /*
    NOTE: The AudioPlayerDlg AND this singleton-ish class both share some state and cooperate

    Reference: https://www.w3.org/2010/05/video/mediaevents.html
    */
    export namespace podcast {
        export let player: any = null;
        export let startTimePending: number = null;

        let uid: string = null;
        let node: json.NodeInfo = null;
        let adSegments: AdSegment[] = null;

        let pushTimer: any = null;

        export let generateRSS = function(): void {
            util.json<json.GenerateRSSRequest, json.GenerateRSSResponse>("generateRSS", {
            }, generateRSSResponse);
        }

        let generateRSSResponse = function(): void {
            alert('rss complete.');
        }

        export let renderFeedNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let title: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedTitle", node);
            let desc: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedDesc", node);
            let imgUrl: json.PropertyInfo = props.getNodeProperty("meta64:rssFeedImageUrl", node);

            let feed: string = "";
            if (title) {
                feed += render.tag("h2", {
                }, title.value);
            }
            if (desc) {
                feed += render.tag("p", {
                }, desc.value);
            }

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, feed);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    feed);
            }

            if (imgUrl) {
                ret += render.tag("img", {
                    "style": "max-width: 200px;",
                    "src": imgUrl.value
                }, null, false);
            }

            return ret;
        }

        export let getMediaPlayerUrlFromNode = function(node: json.NodeInfo): string {
            let link: json.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
            if (link && link.value && util.contains(link.value.toLowerCase(), ".mp3")) {
                return link.value;
            }

            let uri: json.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);
            if (uri && uri.value && util.contains(uri.value.toLowerCase(), ".mp3")) {
                return uri.value;
            }

            let encUrl: json.PropertyInfo = props.getNodeProperty("meta64:rssItemEncUrl", node);
            if (encUrl && encUrl.value) {
                let encType: json.PropertyInfo = props.getNodeProperty("meta64:rssItemEncType", node);
                if (encType && encType.value && util.startsWith(encType.value, "audio/")) {
                    return encUrl.value;
                }
            }

            return null;
        }

        export let renderItemNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let rssTitle: json.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);
            let rssDesc: json.PropertyInfo = props.getNodeProperty("meta64:rssItemDesc", node);
            let rssAuthor: json.PropertyInfo = props.getNodeProperty("meta64:rssItemAuthor", node);
            let rssLink: json.PropertyInfo = props.getNodeProperty("meta64:rssItemLink", node);
            let rssUri: json.PropertyInfo = props.getNodeProperty("meta64:rssItemUri", node);

            let entry: string = "";

            if (rssLink && rssLink.value && rssTitle && rssTitle.value) {
                entry += render.tag("a", {
                    "href": rssLink.value
                }, render.tag("h3", {}, rssTitle.value));
            }

            let playerUrl = getMediaPlayerUrlFromNode(node);
            if (playerUrl) {
                entry += render.tag("paper-button", {
                    "raised": "raised",
                    "onClick": "m64.podcast.openPlayerDialog('" + node.uid + "');",
                    "class": "standardButton"
                }, //
                    "Play");
            }

            if (rssDesc && rssDesc.value) {
                entry += render.tag("p", {
                }, rssDesc.value);
            }

            if (rssAuthor && rssAuthor.value) {
                entry += render.tag("div", {
                }, "By: " + rssAuthor.value);
            }

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, entry);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    entry);
            }

            return ret;
        }

        export let propOrderingFeedNode = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:rssFeedTitle",
                "meta64:rssFeedDesc",
                "meta64:rssFeedLink",
                "meta64:rssFeedUri",
                "meta64:rssFeedSrc",
                "meta64:rssFeedImageUrl"];

            return props.orderProps(propOrder, properties);
        }

        export let propOrderingItemNode = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:rssItemTitle",
                "meta64:rssItemDesc",
                "meta64:rssItemLink",
                "meta64:rssItemUri",
                "meta64:rssItemAuthor"];

            return props.orderProps(propOrder, properties);
        }

        export let openPlayerDialog = function(_uid: string) {
            uid = _uid;
            node = meta64.uidToNodeMap[uid];

            if (node) {
                let mp3Url = getMediaPlayerUrlFromNode(node);
                if (mp3Url) {
                    util.json<json.GetPlayerInfoRequest, json.GetPlayerInfoResponse>("getPlayerInfo", {
                        "url": mp3Url
                    }, function(res: json.GetPlayerInfoResponse) {
                        parseAdSegmentUid(uid);
                        let dlg = new AudioPlayerDlg(mp3Url, uid, res.timeOffset);
                        dlg.open();
                    });
                }
            }
        }

        let parseAdSegmentUid = function(_uid: string) {
            if (node) {
                let adSegs: json.PropertyInfo = props.getNodeProperty("ad-segments", node);
                if (adSegs) {
                    parseAdSegmentText(adSegs.value);
                }
            }
            else throw "Unable to find node uid: " + uid;
        }

        let parseAdSegmentText = function(adSegs: string) {
            adSegments = [];

            let segList: string[] = adSegs.split("\n");
            for (let seg of segList) {
                let segTimes: string[] = seg.split(",");
                if (segTimes.length != 2) {
                    console.log("invalid time range: " + seg);
                    continue;
                }

                let beginSecs: number = convertToSeconds(segTimes[0]);
                let endSecs: number = convertToSeconds(segTimes[1]);

                adSegments.push(new AdSegment(beginSecs, endSecs));
            }
        }

        /* convert from fomrat "minutes:seconts" to absolute number of seconds
        *
        * todo-0: make this accept just seconds, or min:sec, or hour:min:sec, and be able to
        * parse any of them correctly.
        */
        let convertToSeconds = function(timeVal: string) {
            /* end time is designated with asterisk by user, and represented by -1 in variables */
            if (timeVal == '*') return -1;
            let timeParts: string[] = timeVal.split(":");
            if (timeParts.length != 2) {
                console.log("invalid time value: " + timeVal);
                return;
            }
            let minutes = new Number(timeParts[0]).valueOf();
            let seconds = new Number(timeParts[1]).valueOf();
            return minutes * 60 + seconds;
        }

        export let restoreStartTime = function() {
            /* makes player always start wherever the user last was when they clicked "pause" */
            if (player && startTimePending) {
                player.currentTime = startTimePending;
                startTimePending = null;
            }
        }

        export let onCanPlay = function(uid: string, elm: any): void {
            player = elm;
            restoreStartTime();
            player.play();
        }

        export let onTimeUpdate = function(uid: string, elm: any): void {
            if (!pushTimer) {
                /* ping server once every five minutes */
                pushTimer = setInterval(pushTimerFunction, 5 * 60 * 1000);
            }
            //console.log("CurrentTime=" + elm.currentTime);
            player = elm;

            /* todo-1: we call restoreStartTime upon loading of the component but it doesn't seem to have the effect doing anything at all
            and can't even update the slider displayed position, until playins is STARTED. Need to come back and fix this because users
            currently have the glitch of always hearing the first fraction of a second of video, which of course another way to fix
            would be by altering the volumn to zero until restoreStartTime has gone into effect */
            restoreStartTime();

            if (!adSegments) return;
            for (let seg of adSegments) {
                /* endTime of -1 means the rest of the media should be considered ADs */
                if (player.currentTime >= seg.beginTime && //
                    (player.currentTime <= seg.endTime || seg.endTime < 0)) {

                    /* jump to end of audio if rest is an add, with logic of -3 to ensure we don't
                    go into a loop jumping to end over and over again */
                    if (seg.endTime < 0 && player.currentTime < player.duration - 3) {
                        /* jump to last to seconds of audio, i'll do this instead of pausing, in case
                         there are is more audio automatically about to play, we don't want to halt it all */
                        player.loop = false;
                        player.currentTime = player.duration - 2;
                    }
                    /* or else we are in a comercial segment so jump to one second past it */
                    else {
                        player.currentTime = seg.endTime + 1
                    }
                    return;
                }
            }
        }

        /* todo-0: for production, boost this up to one minute */
        export let pushTimerFunction = function(): void {
            //console.log("pushTimer");
            /* the purpose of this timer is to be sure the browser session doesn't timeout while user is playing
            but if the media is paused we DO allow it to timeout. Othwerwise if user is listening to audio, we
            contact the server during this timer to update the time on the server AND keep session from timing out

            todo-0: would everything work if 'player' WAS the jquery object always.
            */
            if (player && !player.paused) {
                /* this safety check to be sure no hidden audio can still be playing should no longer be needed
                now that I have the close litener even on the dialog, but i'll leave this here anyway. Can't hurt. */
                if (!$(player).is(":visible")) {
                    console.log("closing player, because it was detected as not visible. player dialog get hidden?");
                    player.pause();
                }
                //console.log("Autosave player info.");
                savePlayerInfo(player.src, player.currentTime);
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let pause = function(): void {
            if (player) {
                player.pause();
                savePlayerInfo(player.src, player.currentTime);
            }
        }

        export let destroyPlayer = function(dlg: AudioPlayerDlg): void {
            if (player) {
                player.pause();

                setTimeout(function() {
                    savePlayerInfo(player.src, player.currentTime);
                    let localPlayer = $(player);
                    player = null;
                    localPlayer.remove();

                    if (dlg) {
                        dlg.cancel();
                    }
                }, 750);
            }
        }

        export let play = function(): void {
            if (player) {
                player.play();
            }
        }

        export let speed = function(rate: number): void {
            if (player) {
                player.playbackRate = rate;
            }
        }

        //This podcast handling hack is only in this file temporarily
        export let skip = function(delta: number): void {
            if (player) {
                player.currentTime += delta;
            }
        }

        export let savePlayerInfo = function(url: string, timeOffset: number): void {
            if (meta64.isAnonUser) return;

            util.json<json.SetPlayerInfoRequest, json.SetPlayerInfoResponse>("setPlayerInfo", {
                "url": url,
                "timeOffset": timeOffset //,
                //"nodePath": node.path
            }, setPlayerInfoResponse);
        }

        let setPlayerInfoResponse = function(): void {
            //alert('save complete.');
        }
    }
    export namespace systemfolder {

        export let renderNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";
            let pathProp: json.PropertyInfo = props.getNodeProperty("meta64:path", node);
            let path: string = "";

            if (pathProp) {
                path += render.tag("h2", {
                }, pathProp.value);
            }

            /* This was an experiment to load a node property with the results of a directory listing, but I decided that
            really if I want to have a file browser, the right way to do that is to have a dedicated tab that can do it
            just like the other top-level tabs */
            //let fileListingProp: json.PropertyInfo = props.getNodeProperty("meta64:json", node);
            //let fileListing = fileListingProp ? render.renderJsonFileSearchResultProperty(fileListingProp.value) : "";

            if (rowStyling) {
                ret += render.tag("div", {
                    "class": "jcr-content"
                }, path /* + fileListing */);
            } else {
                ret += render.tag("div", {
                    "class": "jcr-root-content"
                },
                    path /* + fileListing */);
            }

            return ret;
        }

        export let renderFileListNode = function(node: json.NodeInfo, rowStyling: boolean): string {
            let ret: string = "";

            let searchResultProp: json.PropertyInfo = props.getNodeProperty(jcrCnst.JSON_FILE_SEARCH_RESULT, node);
            if (searchResultProp) {
                let jcrContent = render.renderJsonFileSearchResultProperty(searchResultProp.value);

                if (rowStyling) {
                    ret += render.tag("div", {
                        "class": "jcr-content"
                    }, jcrContent);
                } else {
                    ret += render.tag("div", {
                        "class": "jcr-root-content"
                    },
                        jcrContent);
                }
            }

            return ret;
        }

        export let fileListPropOrdering = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:json"];

            return props.orderProps(propOrder, properties);
        }

        export let reindex = function() {
            let selNode: json.NodeInfo = meta64.getHighlightedNode();
            if (selNode) {
                util.json<json.FileSearchRequest, json.FileSearchResponse>("fileSearch", {
                    "nodeId": selNode.id,
                    "reindex": true,
                    "searchText": null
                }, reindexResponse, systemfolder);
            }
        }

        export let browse = function() {
            // This browse function works, but i'm disabling it, for now because what I'll be doing instead is making it
            // switch to a FileBrowser Tab (main tab) where browsing will all be done. No JCR nodes will be updated during
            // the process of browsing and editing files on the server.
            //
            // let selNode: json.NodeInfo = meta64.getHighlightedNode();
            // if (selNode) {
            //     util.json<json.BrowseFolderRequest, json.BrowseFolderResponse>("browseFolder", {
            //         "nodeId": selNode.path
            //     }, systemfolder.refreshResponse, systemfolder);
            // }
        }

        export let refreshResponse = function(res: json.BrowseFolderResponse) {
            //nav.mainOffset = 0;
            // util.json<json.RenderNodeRequest, json.RenderNodeResponse>("renderNode", {
            //     "nodeId": res.searchResultNodeId,
            //     "upLevel": null,
            //     "renderParentIfLeaf": null,
            //     "offset": 0,
            //     "goToLastPage" : false
            // }, nav.navPageNodeResponse);
        }

        export let reindexResponse = function(res: json.FileSearchResponse) {
            alert("Reindex complete.");
        }

        export let search = function() {
            (new m64.SearchFilesDlg(true)).open();
        }

        export let propOrdering = function(node: json.NodeInfo, properties: json.PropertyInfo[]): json.PropertyInfo[] {
            let propOrder: string[] = [//
                "meta64:path"];

            return props.orderProps(propOrder, properties);
        }
    }
    /*
     * Base class for all dialog boxes.
     *
     * todo: when refactoring all dialogs to this new base-class design I'm always
     * creating a new dialog each time, so the next optimization will be to make
     * certain dialogs (indeed most of them) be able to behave as singletons once
     * they have been constructed where they merely have to be reshown and
     * repopulated to reopen one of them, and closing any of them is merely done by
     * making them invisible.
     */
    export class DialogBase {

        private horizCenterDlgContent: boolean = true;

        data: any;
        built: boolean;
        guid: string;

        constructor(protected domId: string) {
            this.data = {};

            /*
             * We register 'this' so we can do meta64.getObjectByGuid in onClick methods
             * on the dialog and be able to have 'this' available to the functions that are encoded in onClick methods
             * as strings.
             */
            meta64.registerDataObject(this);
            meta64.registerDataObject(this.data);
        }

        /* this method is called to initialize the content of the dialog when it's displayed, and should be the place where
        any defaults or values in for fields, etc. should be set when the dialog is displayed */
        init = (): void => {
        }

        closeEvent = (): void => {
        }

        build = (): string => {
            return ""
        };

        open = (): void => {
            let thiz = this;
            /*
             * get container where all dialogs are created (true polymer dialogs)
             */
            let modalsContainer = util.polyElm("modalsContainer");

            /* suffix domId for this instance/guid */
            let id = this.id(this.domId);

            /*
             * TODO. IMPORTANT: need to put code in to remove this dialog from the dom
             * once it's closed, AND that same code should delete the guid's object in
             * map in this module
             */
            let node = document.createElement("paper-dialog");

            //NOTE: This works, but is an example of what NOT to do actually. Instead always
            //set these properties on the 'polyElm.node' below.
            //node.setAttribute("with-backdrop", "with-backdrop");

            node.setAttribute("id", id);
            modalsContainer.node.appendChild(node);

            // todo-3: put in CSS now
            node.style.border = "3px solid gray";

            Polymer.dom.flush(); // <---- is this needed ? todo-3
            Polymer.updateStyles();


            if (this.horizCenterDlgContent) {

                let content: string =
                    render.tag("div", {
                        //howto: example of how to center a div in another div. This div is the one being centered.
                        //The trick to getting the layout working was NOT setting this width to 100% even though somehow
                        //the layout does result in it being 100% i think.
                        "style": "margin: 0 auto; max-width: 800px;" //"margin: 0 auto; width: 800px;"
                    },
                        this.build());
                util.setHtml(id, content);

                // let left = render.tag("div", {
                //     "display": "table-column",
                //     "style": "border: 1px solid black;"
                // }, "left");
                // let center = render.tag("div", {
                //     "display": "table-column",
                //     "style": "border: 1px solid black;"
                // }, this.build());
                // let right = render.tag("div", {
                //     "display": "table-column",
                //     "style": "border: 1px solid black;"
                // }, "right");
                //
                // let row = render.tag("div", { "display": "table-row" }, left + center + right);
                //
                // let table: string = render.tag("div",
                //     {
                //         "display": "table",
                //     }, row);
                //
                // util.setHtml(id, table);
            }
            else {
                /* todo-0: lookup paper-dialog-scrollable, for examples on how we can implement header and footer to build
                a much better dialog. */
                let content = this.build();
                // render.tag("div", {
                //     "class" : "main-dialog-content"
                // },
                // this.build());
                util.setHtml(id, content);
            }


            this.built = true;

            this.init();
            console.log("Showing dialog: " + id);

            /* now open and display polymer dialog we just created */
            let polyElm = util.polyElm(id);

            /*
            i tried to tweak the placement of the dialog using fitInto, and it didn't work
            so I'm just using the paper-dialog CSS styling to alter the dialog size to fullscreen
            let ironPages = util.polyElm("mainIronPages");

            After the TypeScript conversion I noticed having a modal flag will cause
            an infinite loop (completely hang) Chrome browser, but this issue is most likely
            not related to TypeScript at all, but i'm just mention TS just in case, because
            that's when I noticed it. Dialogs are fine but not a dialog on top of another dialog, which is
            the case where it hangs if model=true
            */
            //polyElm.node.modal = true;

            //polyElm.node.refit();
            polyElm.node.noCancelOnOutsideClick = true;
            //polyElm.node.horizontalOffset = 0;
            //polyElm.node.verticalOffset = 0;
            //polyElm.node.fitInto = ironPages.node;
            //polyElm.node.constrain();
            //polyElm.node.center();
            polyElm.node.open();

            //var dialog = document.getElementById('loginDialog');
            node.addEventListener('iron-overlay-closed', function(customEvent) {
                //var id = (<any>customEvent.currentTarget).id;
                //console.log("****************** Dialog: " + id + " is closed!");
                thiz.closeEvent();
            });

            /*
            setting to zero margin immediately, and then almost immediately, and then afte 1.5 seconds
            is a really ugly hack, but I couldn't find the right style class or way of doing this in the google
            docs on the dialog class.
            */
            polyElm.node.style.margin = "0px";
            polyElm.node.refit();

            /* I'm doing this in desparation. nothing else seems to get rid of the margin */
            setTimeout(function() {
                polyElm.node.style.margin = "0px";
                polyElm.node.refit();
            }, 10);

            /* I'm doing this in desparation. nothing else seems to get rid of the margin */
            setTimeout(function() {
                polyElm.node.style.margin = "0px";
                polyElm.node.refit();
            }, 1500);
        }

        /* todo: need to cleanup the registered IDs that are in maps for this dialog */
        public cancel() {
            var polyElm = util.polyElm(this.id(this.domId));
            polyElm.node.cancel();
        }

        /*
         * Helper method to get the true id that is specific to this dialog (i.e. guid
         * suffix appended)
         */
        id = (id): string => {
            if (id == null)
                return null;

            /* if dialog already suffixed */
            if (util.contains(id, "_dlgId")) {
                return id;
            }
            return id + "_dlgId" + this.data.guid;
        }

        el = (id): any => {
            if (!util.startsWith(id, "#")) {
                return $("#" + this.id(id));
            }
            else {
                return $(this.id(id));
            }
        }

        makePasswordField = (text: string, id: string): string => {
            return render.makePasswordField(text, this.id(id));
        }

        makeEditField = (fieldName: string, id: string) => {
            id = this.id(id);
            return render.tag("paper-input", {
                "name": id,
                "label": fieldName,
                "id": id,
                "class": "meta64-input"
            }, "", true);
        }

        makeMessageArea = (message: string, id?: string): string => {
            var attrs = {
                "class": "dialog-message"
            };
            if (id) {
                attrs["id"] = this.id(id);
            }
            return render.tag("p", attrs, message);
        }

        // todo: there's a makeButton (and other similar methods) that don't have the
        // encodeCallback capability yet
        makeButton = (text: string, id: string, callback: any, ctx?: any): string => {
            let attribs = {
                "raised": "raised",
                "id": this.id(id),
                "class": "standardButton"
            };

            if (callback != undefined) {
                attribs["onClick"] = meta64.encodeOnClick(callback, ctx);
            }

            return render.tag("paper-button", attribs, text, true);
        }

        /* The reason delayCloseCallback is here is so that we can encode a button to popup a new dialog over the top of
        an existing dialog, and have that happen instantly, rather than letting it close, and THEN poping up a second dialog,
        becasue using the delay means that the one being hidden is not able to become hidden before the one comes up because
        that creates an uglyness. It's better to popup one right over the other and no flicker happens in that case. */
        makeCloseButton = (text: string, id: string, callback?: any, ctx?: any, initiallyVisible: boolean = true, delayCloseCallback: number = 0): string => {

            let attribs = {
                "raised": "raised",

                /* warning: this dialog-confirm will cause google polymer to close the dialog instantly when the button
                 is clicked and sometimes we don't want that, like for example, when we open a dialog over another dialog,
                 we don't want the instantaneous close and display of background. It creates a flicker effect.

                "dialog-confirm": "dialog-confirm",
                */

                "id": this.id(id),
                "class": "standardButton"
            };

            let onClick = "";

            if (callback != undefined) {
                onClick = meta64.encodeOnClick(callback, ctx);
            }

            onClick += meta64.encodeOnClick(this.cancel, this, null, delayCloseCallback);

            if (onClick) {
                attribs["onClick"] = onClick;
            }

            if (!initiallyVisible) {
                attribs["style"] = "display:none;"
            }

            return render.tag("paper-button", attribs, text, true);
        }

        bindEnterKey = (id: string, callback: any): void => {
            util.bindEnterKey(this.id(id), callback);
        }

        setInputVal = (id: string, val: string): void => {
            if (!val) {
                val = "";
            }
            util.setInputVal(this.id(id), val);
        }

        getInputVal = (id: string): string => {
            return util.getInputVal(this.id(id)).trim();
        }

        setHtml = (text: string, id: string): void => {
            util.setHtml(this.id(id), text);
        }

        makeRadioButton = (label: string, id: string): string => {
            id = this.id(id);
            return render.tag("paper-radio-button", {
                "id": id,
                "name": id
            }, label);
        }

        makeCheckBox = (label: string, id: string, initialState: boolean): string => {
            id = this.id(id);

            var attrs = {
                //"onClick": "m64.meta64.getObjectByGuid(" + this.guid + ").publicCommentingChanged();",
                "name": id,
                "id": id
            };

            ////////////
            //             <paper-checkbox on-change="checkboxChanged">click</paper-checkbox>
            //
            //             checkboxChanged : function(event){
            //     if(event.target.checked) {
            //         console.log(event.target.value);
            //     }
            // }
            ////////////

            if (initialState) {
                attrs["checked"] = "checked";
            }

            let checkbox: string = render.tag("paper-checkbox", attrs, "", false);

            checkbox += render.tag("label", {
                "for": id
            }, label, true);

            return checkbox;
        }

        makeHeader = (text: string, id?: string, centered?: boolean): string => {
            var attrs = {
                "class": /*"dialog-header " +*/ (centered ? "horizontal center-justified layout" : "") + " dialog-header"
            };

            //add id if one was provided
            if (id) {
                attrs["id"] = this.id(id);
            }

            /* making this H2 tag causes google to drag in a bunch of its own styles and are hard to override */
            return render.tag("div", attrs, text);
        }

        focus = (id: string): void => {
            if (!util.startsWith(id, "#")) {
                id = "#" + id;
            }
            id = this.id(id);
            util.delayedFocus(id);
            // setTimeout(function() {
            //     $(id).focus();
            // }, 1000);
        }
    }
    export class ProgressDlg extends DialogBase {

        constructor() {
            super("ProgressDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Processing Request", "", true);

            var progressBar = render.tag("paper-progress", {
                "indeterminate": "indeterminate",
                "value": "800",
                "min": "100",
                "max": "1000"
            });

            var barContainer = render.tag("div", {
                "style": "width:280px; margin: 0 auto; margin-top:24px; margin-bottom:24px;",
                "class": "horizontal center-justified layout"
            }, progressBar);

            return header + barContainer;
        }
    }
    export class ConfirmDlg extends DialogBase {

        constructor(private title: string, private message: string, private buttonText: string, private yesCallback: Function,
            private noCallback?: Function) {
            super("ConfirmDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var content: string = this.makeHeader("", "ConfirmDlgTitle") + this.makeMessageArea("", "ConfirmDlgMessage");
            content = render.centerContent(content, 300);

            var buttons = this.makeCloseButton("Yes", "ConfirmDlgYesButton", this.yesCallback)
                + this.makeCloseButton("No", "ConfirmDlgNoButton", this.noCallback);
            content += render.centeredButtonBar(buttons);

            return content;
        }

        init = (): void => {
            this.setHtml(this.title, "ConfirmDlgTitle");
            this.setHtml(this.message, "ConfirmDlgMessage");
            this.setHtml(this.buttonText, "ConfirmDlgYesButton");
        }
    }

    export class EditSystemFileDlg extends DialogBase {

        constructor(private fileName: string) {
            super("EditSystemFileDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let content: string = "<h2>File Editor: " + this.fileName + "</h2>";

            let buttons = this.makeCloseButton("Save", "SaveFileButton", this.saveEdit)
                + this.makeCloseButton("Cancel", "CancelFileEditButton", this.cancelEdit);
            content += render.centeredButtonBar(buttons);

            return content;
        }

        saveEdit = (): void => {
            console.log("save.");
        }

        cancelEdit = (): void => {
            console.log("cancel.");
        }

        init = (): void => {
        }
    }

    /*
     * Callback can be null if you don't need to run any function when the dialog is closed
     */
    export class MessageDlg extends DialogBase {

        constructor(private message?: any, private title?: any, private callback?: any) {
            super("MessageDlg");

            if (!title) {
                title = "Message";
            }
            this.title = title;
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var content = this.makeHeader(this.title) + "<p>" + this.message + "</p>";
            content += render.centeredButtonBar(this.makeCloseButton("Ok", "messageDlgOkButton", this.callback));
            return content;
        }
    }
    export class LoginDlg extends DialogBase {
        constructor() {
            super("LoginDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Login");

            var formControls = this.makeEditField("User", "userName") + //
                this.makePasswordField("Password", "password");

            var loginButton = this.makeButton("Login", "loginButton", this.login, this);
            var resetPasswordButton = this.makeButton("Forgot Password", "resetPasswordButton", this.resetPassword, this);
            var backButton = this.makeCloseButton("Close", "cancelLoginButton");
            var buttonBar = render.centeredButtonBar(loginButton + resetPasswordButton + backButton);
            var divider = "<div><h3>Or Login With...</h3></div>";

            var form = formControls + buttonBar;

            var mainContent = form;
            var content = header + mainContent;

            this.bindEnterKey("userName", user.login);
            this.bindEnterKey("password", user.login);
            return content;
        }

        init = (): void => {
            this.populateFromCookies();
        }

        populateFromCookies = (): void => {
            var usr = $.cookie(cnst.COOKIE_LOGIN_USR);
            var pwd = $.cookie(cnst.COOKIE_LOGIN_PWD);

            if (usr) {
                this.setInputVal("userName", usr);
            }
            if (pwd) {
                this.setInputVal("password", pwd);
            }
        }

        login = (): void => {

            var usr = this.getInputVal("userName");
            var pwd = this.getInputVal("password");

            user.login(this, usr, pwd);
        }

        resetPassword = (): any => {
            var thiz = this;
            var usr = this.getInputVal("userName");

            (new ConfirmDlg("Confirm Reset Password",
                "Reset your password ?<p>You'll still be able to login with your old password until the new one is set.",
                "Yes, reset.", function() {
                    thiz.cancel();
                    (new ResetPasswordDlg(usr)).open();
                })).open();
        }
    }
    export class SignupDlg extends DialogBase {

        constructor() {
            super("SignupDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader(BRANDING_TITLE + " Signup");

            var formControls = //
                this.makeEditField("User", "signupUserName") + //
                this.makePasswordField("Password", "signupPassword") + //
                this.makeEditField("Email", "signupEmail") + //
                this.makeEditField("Captcha", "signupCaptcha");

            var captchaImage = render.tag("div", //
                {
                    "class": "captcha-image" //
                }, //
                render.tag("img", //
                    {
                        "id": this.id("captchaImage"),
                        "class": "captcha",
                        "src": ""//
                    }, //
                    "", false));

            var signupButton = this.makeButton("Signup", "signupButton", this.signup, this);
            var newCaptchaButton = this.makeButton("Try Different Image", "tryAnotherCaptchaButton",
                this.tryAnotherCaptcha, this);
            var backButton = this.makeCloseButton("Close", "cancelSignupButton");

            var buttonBar = render.centeredButtonBar(signupButton + newCaptchaButton + backButton);

            return header + formControls + captchaImage + buttonBar;

            /*
             * $("#" + _.domId + "-main").css({ "backgroundImage" : "url(/ibm-702-bright.jpg);" "background-repeat" :
             * "no-repeat;", "background-size" : "100% auto" });
             */
        }

        signup = (): void => {
            var userName = this.getInputVal("signupUserName");
            var password = this.getInputVal("signupPassword");
            var email = this.getInputVal("signupEmail");
            var captcha = this.getInputVal("signupCaptcha");

            /* no real validation yet, other than non-empty */
            if (!userName || userName.length == 0 || //
                !password || password.length == 0 || //
                !email || email.length == 0 || //
                !captcha || captcha.length == 0) {
                (new MessageDlg("Sorry, you cannot leave any fields blank.")).open();
                return;
            }

            util.json<json.SignupRequest, json.SignupResponse>("signup", {
                "userName": userName,
                "password": password,
                "email": email,
                "captcha": captcha
            }, this.signupResponse, this);
        }

        signupResponse = (res: json.SignupResponse): void => {
            if (util.checkSuccess("Signup new user", res)) {

                /* close the signup dialog */
                this.cancel();

                (new MessageDlg(
                    "User Information Accepted.<p/>Check your email for signup confirmation.",
                    "Signup"
                )).open();
            }
        }

        tryAnotherCaptcha = (): void => {

            var n = util.currentTimeMillis();

            /*
             * embed a time parameter just to thwart browser caching, and ensure server and browser will never return the same
             * image twice.
             */
            var src = postTargetUrl + "captcha?t=" + n;
            $("#" + this.id("captchaImage")).attr("src", src);
        }

        pageInitSignupPg = (): void => {
            this.tryAnotherCaptcha();
        }

        init = (): void => {
            this.pageInitSignupPg();
            util.delayedFocus("#" + this.id("signupUserName"));
        }
    }
    export class PrefsDlg extends DialogBase {
        constructor() {
            super("PrefsDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Peferences");

            var radioButtons = this.makeRadioButton("Simple", "editModeSimple") + //
                this.makeRadioButton("Advanced", "editModeAdvanced");

            var radioButtonGroup = render.tag("paper-radio-group", {
                "id": this.id("simpleModeRadioGroup"),
                "selected": this.id("editModeSimple")
            }, radioButtons);

            let showMetaDataCheckBox = this.makeCheckBox("Show Row Metadata", "showMetaData", meta64.showMetaData);
            var checkboxBar = render.makeHorzControlGroup(showMetaDataCheckBox);

            var formControls = radioButtonGroup;

            var legend = "<legend>Edit Mode:</legend>";
            var radioBar = render.makeHorzControlGroup(legend + formControls);

            var saveButton = this.makeCloseButton("Save", "savePreferencesButton", this.savePreferences, this);
            var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");

            var buttonBar = render.centeredButtonBar(saveButton + backButton);
            return header + radioBar + checkboxBar + buttonBar;
        }

        savePreferences = (): void => {
            var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
            meta64.editModeOption = polyElm.node.selected == this.id("editModeSimple") ? meta64.MODE_SIMPLE
                : meta64.MODE_ADVANCED;

            let showMetaDataCheckbox = util.polyElm(this.id("showMetaData"));
            meta64.showMetaData = showMetaDataCheckbox.node.checked;

            util.json<json.SaveUserPreferencesRequest, json.SaveUserPreferencesResponse>("saveUserPreferences", {
                //todo-0: both of these options should come from meta64.userPrefernces, and not be stored directly on meta64 scope.
                "userPreferences": {
                    "advancedMode": meta64.editModeOption === meta64.MODE_ADVANCED,
                    "editMode": meta64.userPreferences.editMode,
                    /* todo-1: how can I flag a property as optional in TypeScript generator ? Would be probably some kind of json/jackson @required annotation */
                    "lastNode": null,
                    "importAllowed": false,
                    "exportAllowed": false,
                    "showMetaData": meta64.showMetaData
                }
            }, this.savePreferencesResponse, this);
        }

        savePreferencesResponse = (res: json.SaveUserPreferencesResponse): void => {
            if (util.checkSuccess("Saving Preferences", res)) {
                meta64.selectTab("mainTabName");
                meta64.refresh();
                // todo-2: try and maintain scroll position ? this is going to be async, so watch out.
                // view.scrollToSelectedNode();
            }
        }

        init = (): void => {
            var polyElm = util.polyElm(this.id("simpleModeRadioGroup"));
            polyElm.node.select(meta64.editModeOption == meta64.MODE_SIMPLE ? this.id("editModeSimple") : this
                .id("editModeAdvanced"));

            //todo-0: put these two lines in a utility method
            polyElm = util.polyElm(this.id("showMetaData"));
            polyElm.node.checked = meta64.showMetaData;

            Polymer.dom.flush();
        }
    }
    export class ManageAccountDlg extends DialogBase {

        constructor() {
            super("ManageAccountDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Manage Account");

            var backButton = this.makeCloseButton("Cancel", "cancelPreferencesDlgButton");
            var closeAccountButton = meta64.isAdminUser ? "Admin Cannot Close Acount" : this.makeButton("Close Account", "closeAccountButton", "prefs.closeAccount();");

            var buttonBar = render.centeredButtonBar(closeAccountButton);

            var bottomButtonBar = render.centeredButtonBar(backButton);
            var bottomButtonBarDiv = render.tag("div", {
                "class": "close-account-bar"
            }, bottomButtonBar);

            return header + buttonBar + bottomButtonBarDiv;
        }
    }
    export class ExportDlg extends DialogBase {
        constructor() {
            super("ExportDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Export to XML");

            var formControls = this.makeEditField("Export to File Name", "exportTargetNodeName");

            var exportButton = this.makeButton("Export", "exportNodesButton", this.exportNodes, this);
            var backButton = this.makeCloseButton("Close", "cancelExportButton");
            var buttonBar = render.centeredButtonBar(exportButton + backButton);

            return header + formControls + buttonBar;
        }

        exportNodes = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            var targetFileName = this.getInputVal("exportTargetNodeName");

            if (util.emptyString(targetFileName)) {
                (new MessageDlg("Please enter a name for the export file.")).open();
                return;
            }

            if (highlightNode) {
                util.json<json.ExportRequest, json.ExportResponse>("exportToXml", {
                    "nodeId": highlightNode.id,
                    "targetFileName": targetFileName
                }, this.exportResponse, this);
            }
        }

        exportResponse = (res: json.ExportResponse): void => {
            if (util.checkSuccess("Export", res)) {
                (new MessageDlg("Export Successful.")).open();
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }
    }
    export class ImportDlg extends DialogBase {
        constructor() {
            super("ImportDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Import from XML");

            var formControls = this.makeEditField("File name to import", "sourceFileName");

            var importButton = this.makeButton("Import", "importNodesButton", this.importNodes, this);
            var backButton = this.makeCloseButton("Close", "cancelImportButton");
            var buttonBar = render.centeredButtonBar(importButton + backButton);

            return header + formControls + buttonBar;
        }

        importNodes = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            var sourceFileName = this.getInputVal("sourceFileName");

            if (util.emptyString(sourceFileName)) {
                (new MessageDlg("Please enter a name for the import file.")).open();
                return;
            }

            if (highlightNode) {
                util.json<json.ImportRequest, json.ImportResponse>("import", {
                    "nodeId": highlightNode.id,
                    "sourceFileName": sourceFileName
                }, this.importResponse, this);
            }
        }

        importResponse = (res: json.ImportResponse): void => {
            if (util.checkSuccess("Import", res)) {
                (new MessageDlg("Import Successful.")).open();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }
    }
    export class SearchContentDlg extends DialogBase {

        constructor() {
            super("SearchContentDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Search Content");

            var instructions = this.makeMessageArea("Enter some text to find. Only content text will be searched. All sub-nodes under the selected node are included in the search.");
            var formControls = this.makeEditField("Search", "searchText");

            var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchNodes, this);
            var backButton = this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);

            var content = header + instructions + formControls + buttonBar;
            this.bindEnterKey("searchText", srch.searchNodes)
            return content;
        }

        searchNodes = (): void => {
            return this.searchProperty(jcrCnst.CONTENT);
        }

        searchProperty = (searchProp: string) => {
            if (!util.ajaxReady("searchNodes")) {
                return;
            }

            // until i get better validation
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }

            // until better validation
            var searchText = this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": searchText,
                "sortDir": "",
                "sortField": "",
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        }

        init = (): void => {
            //util.delayedFocus(this.id("searchText"));
            this.focus("searchText");
        }
    }
    export class SearchTagsDlg extends DialogBase {

        constructor() {
            super("SearchTagsDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Search Tags");

            var instructions = this.makeMessageArea("Enter some text to find. Only tags text will be searched. All sub-nodes under the selected node are included in the search.");
            var formControls = this.makeEditField("Search", "searchText");

            var searchButton = this.makeCloseButton("Search", "searchNodesButton", this.searchTags, this);
            var backButton = this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);

            var content = header + instructions + formControls + buttonBar;
            this.bindEnterKey("searchText", srch.searchNodes)
            return content;
        }

        searchTags = (): void => {
            return this.searchProperty(jcrCnst.TAGS);
        }

        searchProperty = (searchProp: any) => {
            if (!util.ajaxReady("searchNodes")) {
                return;
            }

            // until i get better validation
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }

            // until better validation
            var searchText = this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }

            util.json<json.NodeSearchRequest, json.NodeSearchResponse>("nodeSearch", {
                "nodeId": node.id,
                "searchText": searchText,
                "sortDir": "",
                "sortField": "",
                "searchProp": searchProp
            }, srch.searchNodesResponse, srch);
        }

        init = (): void => {
            util.delayedFocus(this.id("searchText"));
        }
    }
    export class SearchFilesDlg extends DialogBase {

        constructor(private lucene: boolean) {
            super("SearchFilesDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Search Files");

            var instructions = this.makeMessageArea("Enter some text to find.");
            var formControls = this.makeEditField("Search", "searchText");

            var searchButton = this.makeCloseButton("Search", "searchButton", this.searchTags, this);
            var backButton = this.makeCloseButton("Close", "cancelSearchButton");
            var buttonBar = render.centeredButtonBar(searchButton + backButton);

            var content = header + instructions + formControls + buttonBar;
            this.bindEnterKey("searchText", srch.searchNodes)
            return content;
        }

        searchTags = (): void => {
            return this.searchProperty(jcrCnst.TAGS);
        }

        searchProperty = (searchProp: any) => {
            if (!util.ajaxReady("searchFiles")) {
                return;
            }

            // until i get better validation
            var node = meta64.getHighlightedNode();
            if (!node) {
                (new MessageDlg("No node is selected to search under.")).open();
                return;
            }

            // until better validation
            var searchText = this.getInputVal("searchText");
            if (util.emptyString(searchText)) {
                (new MessageDlg("Enter search text.")).open();
                return;
            }

            let nodeId: string = null;
            let selNode: json.NodeInfo = meta64.getHighlightedNode();
            if (selNode) {
                nodeId = selNode.id;
            }

            util.json<json.FileSearchRequest, json.FileSearchResponse>("fileSearch", {
                "nodeId": nodeId,
                "reindex": false,
                "searchText": searchText
            }, srch.searchFilesResponse, srch);
        }

        init = (): void => {
            util.delayedFocus(this.id("searchText"));
        }
    }
    export class ChangePasswordDlg extends DialogBase {

        pwd: string;

        constructor(private passCode: string) {
            super("ChangePasswordDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog.
         *
         * If the user is doing a "Reset Password" we will have a non-null passCode here, and we simply send this to the server
         * where it will validate the passCode, and if it's valid use it to perform the correct password change on the correct
         * user.
         */
        build = (): string => {

            var header = this.makeHeader(this.passCode ? "Password Reset" : "Change Password");

            var message = render.tag("p", {

            }, "Enter your new password below...");

            var formControls = this.makePasswordField("New Password", "changePassword1");

            var changePasswordButton = this.makeCloseButton("Change Password", "changePasswordActionButton",
                this.changePassword, this);
            var backButton = this.makeCloseButton("Close", "cancelChangePasswordButton");

            var buttonBar = render.centeredButtonBar(changePasswordButton + backButton);

            return header + message + formControls + buttonBar;
        }

        changePassword = (): void => {
            this.pwd = this.getInputVal("changePassword1").trim();

            if (this.pwd && this.pwd.length >= 4) {
                util.json<json.ChangePasswordRequest, json.ChangePasswordResponse>("changePassword", {
                    "newPassword": this.pwd,
                    "passCode": this.passCode
                }, this.changePasswordResponse, this);
            } else {
                (new MessageDlg("Invalid password(s).")).open();
            }
        }

        changePasswordResponse = (res: json.ChangePasswordResponse) => {
            if (util.checkSuccess("Change password", res)) {

                var msg = "Password changed successfully.";

                if (this.passCode) {
                    msg += "<p>You may now login as <b>" + res.user
                        + "</b> with your new password.";
                }

                var thiz = this;
                (new MessageDlg(msg, "Password Change", function() {
                    if (thiz.passCode) {
                        //this login call DOES work, but the reason we don't do this is because the URL still has the passCode on it and we
                        //want to direct the user to a url without that.
                        //user.login(null, res.user, thiz.pwd);

                        window.location.href = window.location.origin;
                    }
                })).open();
            }
        }

        init = (): void => {
            this.focus("changePassword1");
        }
    }
    export class ResetPasswordDlg extends DialogBase {

        constructor(private user: string) {
            super("ResetPasswordDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Reset Password");

            var message = this.makeMessageArea("Enter your user name and email address and a change-password link will be sent to you");

            var formControls = this.makeEditField("User", "userName") + //
                this.makeEditField("Email Address", "emailAddress");

            var resetPasswordButton = this.makeCloseButton("Reset my Password", "resetPasswordButton",
                this.resetPassword, this);
            var backButton = this.makeCloseButton("Close", "cancelResetPasswordButton");

            var buttonBar = render.centeredButtonBar(resetPasswordButton + backButton);

            return header + message + formControls + buttonBar;
        }

        resetPassword = (): void => {

            var userName = this.getInputVal("userName").trim();
            var emailAddress = this.getInputVal("emailAddress").trim();

            if (userName && emailAddress) {
                util.json<json.ResetPasswordRequest, json.ResetPasswordResponse>("resetPassword", {
                    "user": userName,
                    "email": emailAddress
                }, this.resetPasswordResponse, this);
            } else {
                (new MessageDlg("Oops. Try that again.")).open();
            }
        }

        resetPasswordResponse = (res: json.ResetPasswordResponse): void => {
            if (util.checkSuccess("Reset password", res)) {
                (new MessageDlg("Password reset email was sent. Check your inbox.")).open();
            }
        }

        init = (): void => {
            if (this.user) {
                this.setInputVal("userName", this.user);
            }
        }
    }
    export class UploadFromFileDlg extends DialogBase {

        constructor() {
            super("UploadFromFileDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Upload File Attachment");

            let uploadPathDisplay = "";

            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {//
                    "id": this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }

            let uploadFieldContainer = "";
            let formFields = "";

            /*
             * For now I just hard-code in 7 edit fields, but we could theoretically make this dynamic so user can click 'add'
             * button and add new ones one at a time. Just not taking the time to do that yet.
             *
             * todo-0: This is ugly to pre-create these input fields. Need to make them able to add dynamically.
             * (Will do this modification once I get the drag-n-drop stuff working first)
             */
            for (let i = 0; i < 7; i++) {
                let input = render.tag("input", {
                    "id": this.id("upload" + i + "FormInputId"),
                    "type": "file",
                    "name": "files"
                }, "", true);

                /* wrap in DIV to force vertical align */
                formFields += render.tag("div", {
                    "style": "margin-bottom: 10px;"
                }, input);
            }

            formFields += render.tag("input", {
                "id": this.id("uploadFormNodeId"),
                "type": "hidden",
                "name": "nodeId"
            }, "", true);

            /* boolean field to specify if we explode zip files onto the JCR tree */
            formFields += render.tag("input", {
                "id": this.id("explodeZips"),
                "type": "hidden",
                "name": "explodeZips"
            }, "", true);

            let form = render.tag("form", {
                "id": this.id("uploadForm"),
                "method": "POST",
                "enctype": "multipart/form-data",
                "data-ajax": "false" // NEW for multiple file upload support???
            }, formFields);

            uploadFieldContainer = render.tag("div", {//
                "id": this.id("uploadFieldContainer")
            }, "<p>Upload from your computer</p>" + form);

            let uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
            let backButton = this.makeCloseButton("Close", "closeUploadButton");
            let buttonBar = render.centeredButtonBar(uploadButton + backButton);

            return header + uploadPathDisplay + uploadFieldContainer + buttonBar;
        }

        hasAnyZipFiles = (): boolean => {
            let ret: boolean = false;
            for (let i = 0; i < 7; i++) {
                let inputVal = $("#" + this.id("upload" + i + "FormInputId")).val();
                if (inputVal.toLowerCase().endsWith(".zip")) {
                    return true;
                }
            }
            return ret;
        }

        uploadFileNow = (): void => {

            let uploadFunc = (explodeZips) => {
                /* Upload form has hidden input element for nodeId parameter */
                $("#" + this.id("uploadFormNodeId")).attr("value", attachment.uploadNode.id);
                $("#" + this.id("explodeZips")).attr("value", explodeZips ? "true" : "false");

                /*
                 * This is the only place we do something differently from the normal 'util.json()' calls to the server, because
                 * this is highly specialized here for form uploading, and is different from normal ajax calls.
                 */
                let data = new FormData(<HTMLFormElement>($("#" + this.id("uploadForm"))[0]));

                let prms = $.ajax({
                    url: postTargetUrl + "upload",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST'
                });

                prms.done(function() {
                    meta64.refresh();
                });

                prms.fail(function() {
                    (new MessageDlg("Upload failed.")).open();
                });
            };

            if (this.hasAnyZipFiles()) {
                (new ConfirmDlg("Explode Zips?",
                    "Do you want Zip files exploded onto the tree when uploaded?",
                    "Yes, explode zips", //
                    //Yes function
                    function() {
                        uploadFunc(true);
                    },//
                    //No function
                    function() {
                        uploadFunc(false);
                    })).open();
            }
            else {
                uploadFunc(false);
            }
        }

        init = (): void => {
            /* display the node path at the top of the edit page */
            $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        }
    }
    export class UploadFromFileDropzoneDlg extends DialogBase {

        constructor() {
            super("UploadFromFileDropzoneDlg");
        }

        fileList: Object[] = null;
        zipQuestionAnswered: boolean = false;
        explodeZips: boolean = false;

        build = (): string => {
            let header = this.makeHeader("Upload File Attachment");

            let uploadPathDisplay = "";

            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {//
                    "id": this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }

            let formFields = "";

            console.log("Upload Action URL: " + postTargetUrl + "upload");

            let hiddenInputContainer = render.tag("div", {
                "id": this.id("hiddenInputContainer"),
                "style": "display: none;"
            }, "");

            let form = render.tag("form", {
                "action": postTargetUrl + "upload",
                "autoProcessQueue": false,
                /* Note: we also have some styling in meta64.css for 'dropzone' */
                "class": "dropzone",
                "id": this.id("dropzone-form-id")
            }, "");

            let uploadButton = this.makeCloseButton("Upload", "uploadButton", null, null, false);
            let backButton = this.makeCloseButton("Close", "closeUploadButton");
            let buttonBar = render.centeredButtonBar(uploadButton + backButton);

            return header + uploadPathDisplay + form + hiddenInputContainer + buttonBar;
        }

        configureDropZone = (): void => {

            let thiz = this;
            let config: Object = {
                url: postTargetUrl + "upload",
                // Prevents Dropzone from uploading dropped files immediately
                autoProcessQueue: false,
                paramName: "files",
                maxFilesize: 2,
                parallelUploads: 10,

                /* Not sure what's this is for, but the 'files' parameter on the server is always NULL, unless
                the uploadMultiple is false */
                uploadMultiple: false,
                addRemoveLinks: true,
                dictDefaultMessage: "Drag & Drop files here, or Click",
                hiddenInputContainer: "#" + thiz.id("hiddenInputContainer"),

                /*
                This doesn't work at all. Dropzone apparently claims to support this but doesn't.
                See the "sending" function below, where I ended up passing these parameters.
                headers : {
                    "nodeId" : attachment.uploadNode.id,
                    "explodeZips" : explodeZips ? "true" : "false"
                },
                */

                init: function() {
                    let dropzone = this; // closure
                    var submitButton = document.querySelector("#" + thiz.id("uploadButton"));
                    if (!submitButton) {
                        console.log("Unable to get upload button.");
                    }

                    submitButton.addEventListener("click", function(e) {
                        //e.preventDefault();
                        dropzone.processQueue();
                    });

                    this.on("addedfile", function() {
                        thiz.updateFileList(this);
                        thiz.runButtonEnablement(this);
                    });

                    this.on("removedfile", function() {
                        thiz.updateFileList(this);
                        thiz.runButtonEnablement(this);
                    });

                    this.on("sending", function(file, xhr, formData) {
                        formData.append("nodeId", attachment.uploadNode.id);
                        formData.append("explodeZips", this.explodeZips ? "true" : "false");
                        this.zipQuestionAnswered = false;
                    });

                    this.on("queuecomplete", function(file) {
                        meta64.refresh();
                    });
                }
            };

            (<any>$("#" + this.id("dropzone-form-id"))).dropzone(config);
        }

        updateFileList = (dropzoneEvt: any): void => {
            let thiz = this;
            this.fileList = dropzoneEvt.getAddedFiles();
            this.fileList = this.fileList.concat(dropzoneEvt.getQueuedFiles());

            /* Detect if any ZIP files are currently selected, and ask user the question about whether they
            should be extracted automatically during the upload, and uploaded as individual nodes
            for each file */
            if (!this.zipQuestionAnswered && this.hasAnyZipFiles()) {
                this.zipQuestionAnswered = true;
                (new ConfirmDlg("Explode Zips?",
                    "Do you want Zip files exploded onto the tree when uploaded?",
                    "Yes, explode zips", //
                    //Yes function
                    function() {
                        thiz.explodeZips = true;
                    },//
                    //No function
                    function() {
                        thiz.explodeZips = false;
                    })).open();
            }
        }

        hasAnyZipFiles = (): boolean => {
            let ret: boolean = false;
            for (let file of this.fileList) {
                if (file["name"].toLowerCase().endsWith(".zip")) {
                    return true;
                }
            }
            return ret;
        }

        runButtonEnablement = (dropzoneEvt: any): void => {
            if (dropzoneEvt.getAddedFiles().length > 0 ||
                dropzoneEvt.getQueuedFiles().length > 0) {
                $("#" + this.id("uploadButton")).show();
            }
            else {
                $("#" + this.id("uploadButton")).hide();
            }
        }

        init = (): void => {
            /* display the node path at the top of the edit page */
            $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));

            this.configureDropZone();
        }
    }
    export class UploadFromUrlDlg extends DialogBase {

        constructor() {
            super("UploadFromUrlDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Upload File Attachment");

            var uploadPathDisplay = "";

            if (cnst.SHOW_PATH_IN_DLGS) {
                uploadPathDisplay += render.tag("div", {//
                    "id": this.id("uploadPathDisplay"),
                    "class": "path-display-in-editor"
                }, "");
            }

            var uploadFieldContainer = "";
            var uploadFromUrlDiv = "";

            var uploadFromUrlField = this.makeEditField("Upload From URL", "uploadFromUrl");
            uploadFromUrlDiv = render.tag("div", {//
            }, uploadFromUrlField);

            var uploadButton = this.makeCloseButton("Upload", "uploadButton", this.uploadFileNow, this);
            var backButton = this.makeCloseButton("Close", "closeUploadButton");

            var buttonBar = render.centeredButtonBar(uploadButton + backButton);

            return header + uploadPathDisplay + uploadFieldContainer + uploadFromUrlDiv + buttonBar;
        }

        uploadFileNow = (): void => {
            var sourceUrl = this.getInputVal("uploadFromUrl");

            /* if uploading from URL */
            if (sourceUrl) {
                util.json<json.UploadFromUrlRequest, json.UploadFromUrlResponse>("uploadFromUrl", {
                    "nodeId": attachment.uploadNode.id,
                    "sourceUrl": sourceUrl
                }, this.uploadFromUrlResponse, this);
            }
        }

        uploadFromUrlResponse = (res: json.UploadFromUrlResponse): void => {
            if (util.checkSuccess("Upload from URL", res)) {
                meta64.refresh();
            }
        }

        init = (): void => {
            util.setInputVal(this.id("uploadFromUrl"), "");

            /* display the node path at the top of the edit page */
            $("#" + this.id("uploadPathDisplay")).html("Path: " + render.formatPath(attachment.uploadNode));
        }
    }
}
console.log("running module: EditNodeDlg.js");

/*
 * Editor Dialog (Edits Nodes)
 *
 */
namespace m64 {
    export class EditNodeDlg extends DialogBase {

        contentFieldDomId: string;
        fieldIdToPropMap: any = {};
        propEntries: Array<PropEntry> = new Array<PropEntry>();
        editPropertyDlgInst: any;

        constructor(private typeName?: string, private createAtTop?: boolean) {
            super("EditNodeDlg");

            /*
             * Property fields are generated dynamically and this maps the DOM IDs of each field to the property object it
             * edits.
             */
            this.fieldIdToPropMap = {};
            this.propEntries = new Array<PropEntry>();
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Edit Node");

            var saveNodeButton = this.makeCloseButton("Save", "saveNodeButton", this.saveNode, this);
            var addPropertyButton = this.makeButton("Add Property", "addPropertyButton", this.addProperty, this);
            var addTagsPropertyButton = this.makeButton("Add Tags", "addTagsPropertyButton",
                this.addTagsProperty, this);
            var splitContentButton = this.makeButton("Split", "splitContentButton", this.splitContent, this);
            var deletePropButton = this.makeButton("Delete", "deletePropButton", this.deletePropertyButtonClick, this);
            var cancelEditButton = this.makeCloseButton("Close", "cancelEditButton", this.cancelEdit, this);

            var buttonBar = render.centeredButtonBar(saveNodeButton + addPropertyButton + addTagsPropertyButton + deletePropButton
                + splitContentButton + cancelEditButton, "buttons");

            /* todo: need something better for this when supporting mobile */
            var width = 800; //window.innerWidth * 0.6;
            var height = 600; //window.innerHeight * 0.4;

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
                // todo-0: create CSS class for this.
                style: "padding-left: 0px; max-width:" + width + "px;height:" + height + "px;width:100%; overflow:scroll; border:4px solid lightGray;",
                class: "vertical-layout-row"
                //"padding-left: 0px; width:" + width + "px;height:" + height + "px;overflow:scroll; border:4px solid lightGray;"
            }, "Loading...");

            return header + internalMainContent + buttonBar;
        }

        /*
         * Generates all the HTML edit fields and puts them into the DOM model of the property editor dialog box.
         *
         */
        populateEditNodePg = () => {
            /* display the node path at the top of the edit page */
            view.initEditPathDisplayById(this.id("editNodePathDisplay"));

            var fields = "";
            var counter = 0;

            /* clear this map to get rid of old properties */
            this.fieldIdToPropMap = {};
            this.propEntries = new Array<PropEntry>();

            /* editNode will be null if this is a new node being created */
            if (edit.editNode) {
                console.log("Editing existing node.");

                /* iterator function will have the wrong 'this' so we save the right one */
                var thiz = this;
                var editOrderedProps = props.getPropertiesInEditingOrder(edit.editNode, edit.editNode.properties);
                var aceFields = [];

                // Iterate PropertyInfo.java objects
                /*
                 * Warning each iterator loop has its own 'this'
                 */
                $.each(editOrderedProps, function(index, prop) {

                    /*
                     * if property not allowed to display return to bypass this property/iteration
                     */
                    if (!render.allowPropertyToDisplay(prop.name)) {
                        console.log("Hiding property: " + prop.name);
                        return;
                    }

                    var fieldId = thiz.id("editNodeTextContent" + index);
                    console.log("Creating edit field " + fieldId + " for property " + prop.name);

                    var isMulti = prop.values && prop.values.length > 0;
                    var isReadOnlyProp = render.isReadOnlyProperty(prop.name);
                    var isBinaryProp = render.isBinaryProperty(prop.name);

                    let propEntry: PropEntry = new PropEntry(fieldId, prop, isMulti, isReadOnlyProp, isBinaryProp, null);

                    thiz.fieldIdToPropMap[fieldId] = propEntry;
                    thiz.propEntries.push(propEntry);
                    var field = "";

                    if (isMulti) {
                        field += thiz.makeMultiPropEditor(propEntry);
                    } else {
                        field += thiz.makeSinglePropEditor(propEntry, aceFields);
                    }

                    fields += render.tag("div", {
                        "class": ((!isReadOnlyProp && !isBinaryProp) || edit.showReadOnlyProperties ? "propertyEditListItem"
                            : "propertyEditListItemHidden")
                        // "style" : "display: "+ (!rdOnly || meta64.showReadOnlyProperties ? "inline" : "none")
                    }, field);
                });
            }
            /* Editing a new node */
            else {
                // todo-0: this entire block needs review now (redesign)
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
                } else {
                    var field = render.tag("paper-textarea", {
                        "id": this.id("newNodeNameId"),
                        "label": "New Node Name"
                    }, '', true);

                    fields += render.tag("div", { "display": "table-row" }, field);
                }
            }

            //I'm not quite ready to add this button yet.
            // var toggleReadonlyVisButton = render.tag("paper-button", {
            //     "raised": "raised",
            //     "onClick": "meta64.getObjectByGuid(" + this.guid + ").toggleShowReadOnly();" //
            // }, //
            //     (edit.showReadOnlyProperties ? "Hide Read-Only Properties" : "Show Read-Only Properties"));
            //
            // fields += toggleReadonlyVisButton;

            //let row = render.tag("div", { "display": "table-row" }, left + center + right);

            let propTable: string = render.tag("div",
                {
                    "display": "table",
                }, fields);


            util.setHtml(this.id("propertyEditFieldContainer"), propTable);

            if (cnst.USE_ACE_EDITOR) {
                for (var i = 0; i < aceFields.length; i++) {
                    var editor = ace.edit(aceFields[i].id);
                    editor.setValue(util.unencodeHtml(aceFields[i].val));
                    meta64.aceEditorsById[aceFields[i].id] = editor;
                }
            }

            var instr = edit.editingUnsavedNode ? //
                "You may leave this field blank and a unique ID will be assigned. You only need to provide a name if you want this node to have a more meaningful URL."
                : //
                "";

            this.el("editNodeInstructions").html(instr);

            /*
             * Allow adding of new properties as long as this is a saved node we are editing, because we don't want to start
             * managing new properties on the client side. We need a genuine node already saved on the server before we allow
             * any property editing to happen.
             */
            util.setVisibility("#" + this.id("addPropertyButton"), !edit.editingUnsavedNode);

            var tagsPropExists = props.getNodePropertyVal("tags", edit.editNode) != null;
            // console.log("hasTagsProp: " + tagsProp);
            util.setVisibility("#" + this.id("addTagsPropertyButton"), !tagsPropExists);
        }

        toggleShowReadOnly = (): void => {
            // alert("not yet implemented.");
            // see saveExistingNode for how to iterate all properties, although I wonder why I didn't just use a map/set of
            // properties elements
            // instead so I don't need to parse any DOM or domIds inorder to iterate over the list of them????
        }

        addProperty = (): void => {
            this.editPropertyDlgInst = new EditPropertyDlg(this);
            this.editPropertyDlgInst.open();
        }

        addTagsProperty = (): void => {
            if (props.getNodePropertyVal(edit.editNode, "tags")) {
                return;
            }

            var postData = {
                nodeId: edit.editNode.id,
                propertyName: "tags",
                propertyValue: ""
            };
            util.json<json.SavePropertyRequest, json.SavePropertyResponse>("saveProperty", postData, this.addTagsPropertyResponse, this);
        }

        addTagsPropertyResponse = (res: json.SavePropertyResponse): void => {
            if (util.checkSuccess("Add Tags Property", res)) {
                this.savePropertyResponse(res);
            }
        }

        savePropertyResponse = (res: any): void => {
            util.checkSuccess("Save properties", res);

            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;

            // if (this.domId != "EditNodeDlg") {
            //     console.log("error: incorrect object for EditNodeDlg");
            // }
            this.populateEditNodePg();
        }

        addSubProperty = (fieldId: string): void => {
            var prop = this.fieldIdToPropMap[fieldId].property;

            var isMulti = util.isObject(prop.values);

            /* convert to multi-type if we need to */
            if (!isMulti) {
                prop.values = [];
                prop.values.push(prop.value);
                prop.value = null;
            }

            /*
             * now add new empty property and populate it onto the screen
             *
             * TODO-3: for performance we could do something simpler than 'populateEditNodePg' here, but for now we just
             * rerendering the entire edit page.
             */
            prop.values.push("");

            this.populateEditNodePg();
        }

        /*
         * Deletes the property of the specified name on the node being edited, but first gets confirmation from user
         */
        deleteProperty = (propName: string) => {
            var thiz = this;
            (new ConfirmDlg("Confirm Delete", "Delete the Property: " + propName, "Yes, delete.", function() {
                thiz.deletePropertyImmediate(propName);
            })).open();
        }

        deletePropertyImmediate = (propName: string) => {

            var thiz = this;
            util.json<json.DeletePropertyRequest, json.DeletePropertyResponse>("deleteProperty", {
                "nodeId": edit.editNode.id,
                "propName": propName
            }, function(res: json.DeletePropertyResponse) {
                thiz.deletePropertyResponse(res, propName);
            });
        }

        deletePropertyResponse = (res: any, propertyToDelete: any) => {

            if (util.checkSuccess("Delete property", res)) {

                /*
                 * remove deleted property from client side data, so we can re-render screen without making another call to
                 * server
                 */
                props.deletePropertyFromLocalData(propertyToDelete);

                /* now just re-render screen from local variables */
                meta64.treeDirty = true;

                this.populateEditNodePg();
            }
        }

        clearProperty = (fieldId: string): void => {
            if (!cnst.USE_ACE_EDITOR) {
                util.setInputVal(this.id(fieldId), "");
            } else {
                var editor = meta64.aceEditorsById[this.id(fieldId)];
                if (editor) {
                    editor.setValue("");
                }
            }

            /* scan for all multi-value property fields and clear them */
            var counter = 0;
            while (counter < 1000) {
                if (!cnst.USE_ACE_EDITOR) {
                    if (!util.setInputVal(this.id(fieldId + "_subProp" + counter), "")) {
                        break;
                    }
                } else {
                    var editor = meta64.aceEditorsById[this.id(fieldId + "_subProp" + counter)];
                    if (editor) {
                        editor.setValue("");
                    } else {
                        break;
                    }
                }
                counter++;
            }
        }

        /*
         * for now just let server side choke on invalid things. It has enough security and validation to at least protect
         * itself from any kind of damage.
         */
        saveNode = (): void => {
            /*
             * If editing an unsaved node it's time to run the insertNode, or createSubNode, which actually saves onto the
             * server, and will initiate further editing like for properties, etc.
             */
            if (edit.editingUnsavedNode) {
                console.log("saveNewNode.");

                // todo-0: need to make this compatible with Ace Editor.
                this.saveNewNode();
            }
            /*
             * Else we are editing a saved node, which is already saved on server.
             */
            else {
                console.log("saveExistingNode.");
                this.saveExistingNode();
            }
        }

        saveNewNode = (newNodeName?: string): void => {
            if (!newNodeName) {
                newNodeName = util.getInputVal(this.id("newNodeNameId"));
            }

            /*
             * If we didn't create the node we are inserting under, and neither did "admin", then we need to send notification
             * email upon saving this new node.
             */
            if (meta64.userName != edit.parentOfNewNode.createdBy && //
                edit.parentOfNewNode.createdBy != "admin") {
                edit.sendNotificationPendingSave = true;
            }

            meta64.treeDirty = true;
            if (edit.nodeInsertTarget) {
                util.json<json.InsertNodeRequest, json.InsertNodeResponse>("insertNode", {
                    "parentId": edit.parentOfNewNode.id,
                    "targetName": edit.nodeInsertTarget.name,
                    "newNodeName": newNodeName,
                    "typeName": this.typeName ? this.typeName : "nt:unstructured"
                }, edit.insertNodeResponse, edit);
            } else {
                util.json<json.CreateSubNodeRequest, json.CreateSubNodeResponse>("createSubNode", {
                    "nodeId": edit.parentOfNewNode.id,
                    "newNodeName": newNodeName,
                    "typeName": this.typeName ? this.typeName : "nt:unstructured",
                    "createAtTop": this.createAtTop
                }, edit.createSubNodeResponse, edit);
            }
        }

        saveExistingNode = (): void => {
            console.log("saveExistingNode");

            /* holds list of properties to send to server. Each one having name+value properties */
            var propertiesList = [];
            var thiz = this;

            $.each(this.propEntries, function(index: number, prop: any) {

                console.log("--------------- Getting prop idx: " + index);

                /* Ignore this property if it's one that cannot be edited as text */
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
                    } else {
                        propVal = util.getTextAreaValById(prop.id);
                    }

                    if (propVal !== prop.value) {
                        console.log("Prop changed: propName=" + prop.property.name + " propVal=" + propVal);
                        propertiesList.push({
                            "name": prop.property.name,
                            "value": propVal
                        });
                    } else {
                        console.log("Prop didn't change: " + prop.id);
                    }
                }
                /* Else this is a MULTI property */
                else {
                    console.log("Saving multi property field: " + JSON.stringify(prop));

                    var propVals = [];

                    $.each(prop.subProps, function(index, subProp) {

                        console.log("subProp[" + index + "]: " + JSON.stringify(subProp));

                        var propVal;
                        if (cnst.USE_ACE_EDITOR) {
                            var editor = meta64.aceEditorsById[subProp.id];
                            if (!editor)
                                throw "Unable to find Ace Editor for subProp ID: " + subProp.id;
                            propVal = editor.getValue();
                            // alert("Setting[" + propVal + "]");
                        } else {
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

            });// end iterator

            /* if anything changed, save to server */
            if (propertiesList.length > 0) {
                var postData = {
                    nodeId: edit.editNode.id,
                    properties: propertiesList,
                    sendNotification: edit.sendNotificationPendingSave
                };
                console.log("calling saveNode(). PostData=" + util.toJson(postData));
                util.json<json.SaveNodeRequest, json.SaveNodeResponse>("saveNode", postData, edit.saveNodeResponse, null, {
                    savedId: edit.editNode.id
                });
                edit.sendNotificationPendingSave = false;
            } else {
                console.log("nothing changed. Nothing to save.");
            }
        }

        makeMultiPropEditor = (propEntry: PropEntry): string => {
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
                propValStr = util.escapeForAttrib(propVal);
                var label = (i == 0 ? propEntry.property.name : "*") + "." + i;

                console.log("Creating textarea with id=" + id);

                let subProp: SubProp = new SubProp(id, propVal);
                propEntry.subProps.push(subProp);

                if (propEntry.binary || propEntry.readOnly) {
                    fields += render.tag("paper-textarea", {
                        "id": id,
                        "readonly": "readonly",
                        "disabled": "disabled",
                        "label": label,
                        "value": propValStr
                    }, '', true);
                } else {
                    fields += render.tag("paper-textarea", {
                        "id": id,
                        "label": label,
                        "value": propValStr
                    }, '', true);
                }
            }

            let col = render.tag("div", {
                "style": "display: table-cell;"
            }, fields);

            return col;
        }

        makeSinglePropEditor = (propEntry: PropEntry, aceFields: any): string => {
            console.log("Property single-type: " + propEntry.property.name);

            var field = "";

            var propVal = propEntry.binary ? "[binary]" : propEntry.property.value;
            var label = render.sanitizePropertyName(propEntry.property.name);
            var propValStr = propVal ? propVal : '';
            propValStr = util.escapeForAttrib(propValStr);
            console.log("making single prop editor: prop[" + propEntry.property.name + "] val[" + propEntry.property.value
                + "] fieldId=" + propEntry.id);

            let propSelCheckbox: string = "";

            if (propEntry.readOnly || propEntry.binary) {
                field += render.tag("paper-textarea", {
                    "id": propEntry.id,
                    "readonly": "readonly",
                    "disabled": "disabled",
                    "label": label,
                    "value": propValStr
                }, "", true);
            } else {
                propSelCheckbox = this.makeCheckBox("", "selProp_" + propEntry.id, false);

                if (propEntry.property.name == jcrCnst.CONTENT) {
                    this.contentFieldDomId = propEntry.id;
                }
                if (!cnst.USE_ACE_EDITOR) {
                    field += render.tag("paper-textarea", {
                        "id": propEntry.id,
                        "label": label,
                        "value": propValStr
                    }, '', true);
                } else {
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

            let selCol = render.tag("div", {
                "style": "width: 40px; display: table-cell; padding: 10px;"
            }, propSelCheckbox);

            let editCol = render.tag("div", {
                "style": "width: 100%; display: table-cell; padding: 10px;"
            }, field);

            return selCol + editCol;
        }

        deletePropertyButtonClick = (): void => {

            /* Iterate over all properties */
            for (let id in this.fieldIdToPropMap) {
                if (this.fieldIdToPropMap.hasOwnProperty(id)) {

                    /* get PropEntry for this item */
                    let propEntry: PropEntry = this.fieldIdToPropMap[id];
                    if (propEntry) {
                        //console.log("prop=" + propEntry.property.name);
                        let selPropDomId = "selProp_" + propEntry.id;

                        /*
                        Get checkbox control and its value
                        todo-1: getting value of checkbox should be in some shared utility method
                        */
                        let selCheckbox = util.polyElm(this.id(selPropDomId));
                        if (selCheckbox) {
                            let checked: boolean = selCheckbox.node.checked;
                            if (checked) {
                                //console.log("prop IS CHECKED=" + propEntry.property.name);
                                this.deleteProperty(propEntry.property.name);

                                /* for now lets' just support deleting one property at a time, and so we can return once we found a
                                checked one to delete. Would be easy to extend to allow multiple-selects in the future */
                                return;
                            }
                        }
                    }
                    else {
                        throw "propEntry not found for id: " + id;
                    }
                }
            }
            console.log("Delete property: ")
        }

        splitContent = (): void => {
            let nodeBelow: json.NodeInfo = edit.getNodeBelow(edit.editNode);
            util.json<json.SplitNodeRequest, json.SplitNodeResponse>("splitNode", {
                "nodeId": edit.editNode.id,
                "nodeBelowId": (nodeBelow == null ? null : nodeBelow.id),
                "delimiter": null
            }, this.splitContentResponse);
        }

        splitContentResponse = (res: json.SplitNodeResponse): void => {
            if (util.checkSuccess("Split content", res)) {
                this.cancel();
                view.refreshTree(null, false);
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }

        cancelEdit = (): void => {
            this.cancel();
            if (meta64.treeDirty) {
                meta64.goToMainPage(true);
            } else {
                meta64.selectTab("mainTabName");
                view.scrollToSelectedNode();
            }
        }

        init = (): void => {
            console.log("EditNodeDlg.init");
            this.populateEditNodePg();
            if (this.contentFieldDomId) {
                util.delayedFocus("#" + this.contentFieldDomId);
            }
        }
    }

    /*
     * Property Editor Dialog (Edits Node Properties)
     */
    export class EditPropertyDlg extends DialogBase {

        constructor(private editNodeDlg: any) {
            super("EditPropertyDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
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
        }

        populatePropertyEdit = (): void => {
            var field = '';

            /* Property Name Field */
            {
                var fieldPropNameId = "addPropertyNameTextContent";

                field += render.tag("paper-textarea", {
                    "name": fieldPropNameId,
                    "id": this.id(fieldPropNameId),
                    "placeholder": "Enter property name",
                    "label": "Name"
                }, "", true);
            }

            /* Property Value Field */
            {
                var fieldPropValueId = "addPropertyValueTextContent";

                field += render.tag("paper-textarea", {
                    "name": fieldPropValueId,
                    "id": this.id(fieldPropValueId),
                    "placeholder": "Enter property text",
                    "label": "Value"
                }, "", true);
            }

            /* display the node path at the top of the edit page */
            view.initEditPathDisplayById(this.id("editPropertyPathDisplay"));

            util.setHtml(this.id("addPropertyFieldContainer"), field);
        }

        saveProperty = (): void => {
            var propertyNameData = util.getInputVal(this.id("addPropertyNameTextContent"));
            var propertyValueData = util.getInputVal(this.id("addPropertyValueTextContent"));

            var postData = {
                nodeId: edit.editNode.id,
                propertyName: propertyNameData,
                propertyValue: propertyValueData
            };
            util.json<json.SavePropertyRequest, json.SavePropertyResponse>("saveProperty", postData, this.savePropertyResponse, this);
        }

        savePropertyResponse = (res: json.SavePropertyResponse): void => {
            util.checkSuccess("Save properties", res);

            edit.editNode.properties.push(res.propertySaved);
            meta64.treeDirty = true;

            // if (this.editNodeDlg.domId != "EditNodeDlg") {
            //     console.log("error: incorrect object for EditNodeDlg");
            // }
            this.editNodeDlg.populateEditNodePg();
        }

        init = (): void => {
            this.populatePropertyEdit();
        }
    }
    export class ShareToPersonDlg extends DialogBase {

        constructor() {
            super("ShareToPersonDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Share Node to Person");

            var formControls = this.makeEditField("User to Share With", "shareToUserName");
            var shareButton = this.makeCloseButton("Share", "shareNodeToPersonButton", this.shareNodeToPerson,
                this);
            var backButton = this.makeCloseButton("Close", "cancelShareNodeToPersonButton");
            var buttonBar = render.centeredButtonBar(shareButton + backButton);

            return header + "<p>Enter the username of the person you want to share this node with:</p>" + formControls
                + buttonBar;
        }

        shareNodeToPerson = (): void => {
            var targetUser = this.getInputVal("shareToUserName");
            if (!targetUser) {
                (new MessageDlg("Please enter a username")).open();
                return;
            }

            /*
             * Trigger going to server at next main page refresh
             */
            meta64.treeDirty = true;
            var thiz = this;
            util.json<json.AddPrivilegeRequest, json.AddPrivilegeResponse>("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": targetUser,
                "privileges": ["read", "write", "addChildren", "nodeTypeManagement"],
                "publicAppend": false
            }, thiz.reloadFromShareWithPerson, thiz);
        }

        reloadFromShareWithPerson = (res: json.AddPrivilegeResponse): void => {
            if (util.checkSuccess("Share Node with Person", res)) {
                (new SharingDlg()).open();
            }
        }
    }
    export class SharingDlg extends DialogBase {

        constructor() {
            super("SharingDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Node Sharing");

            var shareWithPersonButton = this.makeButton("Share with Person", "shareNodeToPersonPgButton",
                this.shareNodeToPersonPg, this);
            var makePublicButton = this.makeButton("Share to Public", "shareNodeToPublicButton", this.shareNodeToPublic,
                this);
            var backButton = this.makeCloseButton("Close", "closeSharingButton");

            var buttonBar = render.centeredButtonBar(shareWithPersonButton + makePublicButton + backButton);

            var width = window.innerWidth * 0.6;
            var height = window.innerHeight * 0.4;

            var internalMainContent = "<div id='" + this.id("shareNodeNameDisplay") + "'></div>" + //
                "<div class='vertical-layout-row' style=\"width:" + width + "px;height:" + height + "px;overflow:scroll;border:4px solid lightGray;\" id='"
                + this.id("sharingListFieldContainer") + "'></div>";

            return header + internalMainContent + buttonBar;
        }

        init = (): void => {
            this.reload();
        }

        /*
         * Gets privileges from server and displays in GUI also. Assumes gui is already at correct page.
         */
        reload = (): void => {
            console.log("Loading node sharing info.");

            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": share.sharingNode.id,
                "includeAcl": true,
                "includeOwners": true
            }, this.getNodePrivilegesResponse, this);
        }

        /*
         * Handles getNodePrivileges response.
         *
         * res=json of GetNodePrivilegesResponse.java
         *
         * res.aclEntries = list of AccessControlEntryInfo.java json objects
         */
        getNodePrivilegesResponse = (res: json.GetNodePrivilegesResponse): void => {
            this.populateSharingPg(res);
        }

        /*
         * Processes the response gotten back from the server containing ACL info so we can populate the sharing page in the gui
         */
        populateSharingPg = (res: json.GetNodePrivilegesResponse): void => {
            var html = "";
            var This = this;

            $.each(res.aclEntries, function(index, aclEntry) {
                html += "<h4>User: " + aclEntry.principalName + "</h4>";
                html += render.tag("div", {
                    "class": "privilege-list"
                }, This.renderAclPrivileges(aclEntry.principalName, aclEntry));
            });

            var publicAppendAttrs = {
                "onClick": "m64.meta64.getObjectByGuid(" + this.guid + ").publicCommentingChanged();",
                "name": "allowPublicCommenting",
                "id": this.id("allowPublicCommenting")
            };

            if (res.publicAppend) {
                publicAppendAttrs["checked"] = "checked";
            }

            /* todo: use actual polymer paper-checkbox here */
            html += render.tag("paper-checkbox", publicAppendAttrs, "", false);

            html += render.tag("label", {
                "for": this.id("allowPublicCommenting")
            }, "Allow public commenting under this node.", true);

            util.setHtml(this.id("sharingListFieldContainer"), html);
        }

        publicCommentingChanged = (): void => {

            /*
             * Using onClick on the element AND this timeout is the only hack I could find to get get what amounts to a state
             * change listener on a paper-checkbox. The documented on-change listener simply doesn't work and appears to be
             * simply a bug in google code AFAIK.
             */
            var thiz = this;
            setTimeout(function() {
                var polyElm = util.polyElm(thiz.id("allowPublicCommenting"));

                meta64.treeDirty = true;

                util.json<json.AddPrivilegeRequest, json.AddPrivilegeResponse>("addPrivilege", {
                    "nodeId": share.sharingNode.id,
                    "privileges": null,
                    "principal": null,
                    "publicAppend": (polyElm.node.checked ? true : false)
                });

            }, 250);
        }

        removePrivilege = (principal: string, privilege: string): void => {
            /*
             * Trigger going to server at next main page refresh
             */
            meta64.treeDirty = true;

            util.json<json.RemovePrivilegeRequest, json.RemovePrivilegeResponse>("removePrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": principal,
                "privilege": privilege
            }, this.removePrivilegeResponse, this);
        }

        removePrivilegeResponse = (res: json.RemovePrivilegeResponse): void => {

            util.json<json.GetNodePrivilegesRequest, json.GetNodePrivilegesResponse>("getNodePrivileges", {
                "nodeId": share.sharingNode.path,
                "includeAcl": true,
                "includeOwners": true
            }, this.getNodePrivilegesResponse, this);
        }

        renderAclPrivileges = (principal: any, aclEntry: any): string => {
            var ret = "";
            var thiz = this;
            $.each(aclEntry.privileges, function(index, privilege) {

                var removeButton = thiz.makeButton("Remove", "removePrivButton", //
                    "m64.meta64.getObjectByGuid(" + thiz.guid + ").removePrivilege('" + principal + "', '" + privilege.privilegeName
                    + "');");

                var row = render.makeHorizontalFieldSet(removeButton);

                row += "<b>" + principal + "</b> has privilege <b>" + privilege.privilegeName + "</b> on this node.";

                ret += render.tag("div", {
                    "class": "privilege-entry"
                }, row);
            });
            return ret;
        }

        shareNodeToPersonPg = (): void => {
            (new ShareToPersonDlg()).open();
        }

        shareNodeToPublic = (): void => {
            console.log("Sharing node to public.");

            /*
             * Trigger going to server at next main page refresh
             */
            meta64.treeDirty = true;

            /*
             * Add privilege and then reload share nodes dialog from scratch doing another callback to server
             *
             * TODO: this additional call can be avoided as an optimization
             */
            util.json<json.AddPrivilegeRequest, json.AddPrivilegeResponse>("addPrivilege", {
                "nodeId": share.sharingNode.id,
                "principal": "everyone",
                "privileges": ["read"],
                "publicAppend": false
            }, this.reload, this);
        }
    }
    export class RenameNodeDlg extends DialogBase {
        constructor() {
            super("RenameNodeDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Rename Node");

            var curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
            var curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";

            var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");

            var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", this.renameNode, this);
            var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
            var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);

            return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
        }

        renameNode = (): void => {
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

            /* if no node below this node, returns null */
            var nodeBelow = edit.getNodeBelow(highlightNode);

            var renamingRootNode = (highlightNode.id === meta64.currentNodeId);

            var thiz = this;
            util.json<json.RenameNodeRequest, json.RenameNodeResponse>("renameNode", {
                "nodeId": highlightNode.id,
                "newName": newName
            }, function(res: json.RenameNodeResponse) {
                thiz.renameNodeResponse(res, renamingRootNode);
            });
        }

        renameNodeResponse = (res: json.RenameNodeResponse, renamingPageRoot: boolean): void => {
            if (util.checkSuccess("Rename node", res)) {
                if (renamingPageRoot) {
                    view.refreshTree(res.newId, true);
                } else {
                    view.refreshTree(null, false, res.newId);
                }
                // meta64.selectTab("mainTabName");
            }
        }

        init = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                return;
            }
            $("#" + this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
            $("#" + this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
        }
    }

    /* This is an audio player dialog that has ad-skipping technology provided by podcast.ts */
    export class AudioPlayerDlg extends DialogBase {

        constructor(private sourceUrl: string, private nodeUid: string, private startTimePending: number) {
            super("AudioPlayerDlg");
            console.log(`startTimePending in constructor: ${startTimePending}`);
            podcast.startTimePending = startTimePending;
        }

        /* When the dialog closes we need to stop and remove the player */
        public cancel() {
            super.cancel();
            let player = $("#" + this.id("audioPlayer"));
            if (player && player.length > 0) {
                /* for some reason the audio player needs to be accessed like it's an array */
                (<any>player[0]).pause();
                player.remove();
            }
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Audio Player");

            let node: json.NodeInfo = meta64.uidToNodeMap[this.nodeUid];
            if (!node) {
                throw `unknown node uid: ${this.nodeUid}`;
            }

            let rssTitle: json.PropertyInfo = props.getNodeProperty("meta64:rssItemTitle", node);

            /* This is where I need a short name of the media being played */
            let description = render.tag("p", {
            }, rssTitle.value);

            //references:
            //http://www.w3schools.com/tags/ref_av_dom.asp
            //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
            let playerAttribs: any = {
                "src": this.sourceUrl,
                "id": this.id("audioPlayer"),
                "style": "width: 100%; padding:0px; margin-top: 0px; margin-left: 0px; margin-right: 0px;",
                "ontimeupdate": `m64.podcast.onTimeUpdate('${this.nodeUid}', this);`,
                "oncanplay": `m64.podcast.onCanPlay('${this.nodeUid}', this);`,
                "controls": "controls",
                "preload": "auto"
            };

            let player = render.tag("audio", playerAttribs);

            //Skipping Buttons
            let skipBack30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": `m64.podcast.skip(-30, '${this.nodeUid}', this);`,
                "class": "standardButton"
            }, //
                "< 30s");

            let skipForward30Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": `m64.podcast.skip(30, '${this.nodeUid}', this);`,
                "class": "standardButton"
            }, //
                "30s >");

            let skipButtonBar = render.centeredButtonBar(skipBack30Button + skipForward30Button);

            //Speed Buttons
            let speedNormalButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.0);",
                "class": "standardButton"
            }, //
                "Normal");

            let speed15Button = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(1.5);",
                "class": "standardButton"
            }, //
                "1.5X");

            let speed2xButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.speed(2);",
                "class": "standardButton"
            }, //
                "2X");

            let speedButtonBar = render.centeredButtonBar(speedNormalButton + speed15Button + speed2xButton);

            //Dialog Buttons
            let pauseButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.pause();",
                "class": "standardButton"
            }, //
                "Pause");

            let playButton = render.tag("paper-button", {
                "raised": "raised",
                "onClick": "m64.podcast.play();",
                "class": "playButton"
            }, //
                "Play");

            //todo-0: even if this button appears to work, I need it to explicitly enforce the saving of the timevalue AND the removal of the AUDIO element from the DOM */
            let closeButton = this.makeButton("Close", "closeAudioPlayerDlgButton", this.closeBtn);

            let buttonBar = render.centeredButtonBar(playButton + pauseButton + closeButton);

            return header + description + player + skipButtonBar + speedButtonBar + buttonBar;
        }

        closeEvent = (): void => {
            podcast.destroyPlayer(null);
        }

        closeBtn = (): void => {
            podcast.destroyPlayer(this);
        }

        init = (): void => {
        }
    }
    export class CreateNodeDlg extends DialogBase {

        lastSelDomId: string;
        lastSelTypeName: string;

        constructor() {
            super("CreateNodeDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            let header = this.makeHeader("Create New Node");

            let createFirstChildButton = this.makeCloseButton("First", "createFirstChildButton", this.createFirstChild, this, true, 1000);
            let createLastChildButton = this.makeCloseButton("Last", "createLastChildButton", this.createLastChild, this);
            let createInlineButton = this.makeCloseButton("Inline", "createInlineButton", this.createInline, this);
            let backButton = this.makeCloseButton("Cancel", "cancelButton");
            let buttonBar = render.centeredButtonBar(createFirstChildButton + createLastChildButton + createInlineButton + backButton);

            let content = "";
            let typeIdx = 0;
            /* todo-1: need a better way to enumerate and add the types we want to be able to search */
            content += this.makeListItem("Standard Type", "nt:unstructured", typeIdx++, true);
            content += this.makeListItem("RSS Feed", "meta64:rssfeed", typeIdx++, false);
            content += this.makeListItem("System Folder", "meta64:systemfolder", typeIdx++, false);

            var listBox = render.tag("div", {
                "class": "listBox"
            }, content);

            var mainContent: string = listBox;

            var centeredHeader: string = render.tag("div", {
                "class": "centeredTitle"
            }, header);

            return centeredHeader + mainContent + buttonBar;
        }

        makeListItem(val: string, typeName: string, typeIdx: number, initiallySelected: boolean): string {
            let payload: Object = {
                "typeName": typeName,
                "typeIdx": typeIdx
            };

            let divId: string = this.id("typeRow" + typeIdx);

            if (initiallySelected) {
                this.lastSelTypeName = typeName;
                this.lastSelDomId = divId;
            }

            return render.tag("div", {
                "class": "listItem" + (initiallySelected ? " selectedListItem" : ""),
                "id": divId,
                "onclick": meta64.encodeOnClick(this.onRowClick, this, payload)
            }, val);
        }

        createFirstChild = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, this.lastSelTypeName, true);
        }

        createLastChild = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.createSubNode(null, this.lastSelTypeName, false);
        }

        createInline = (): void => {
            if (!this.lastSelTypeName) {
                alert("choose a type.");
                return;
            }
            edit.insertNode(null, this.lastSelTypeName);
        }

        onRowClick = (payload: any): void => {
            let divId = this.id("typeRow" + payload.typeIdx);
            this.lastSelTypeName = payload.typeName;

            if (this.lastSelDomId) {
                this.el(this.lastSelDomId).removeClass("selectedListItem");
            }
            this.lastSelDomId = divId;
            this.el(divId).addClass("selectedListItem");
        }

        init = (): void => {
            let node: json.NodeInfo = meta64.getHighlightedNode();
            if (node) {
                let canInsertInline: boolean = meta64.homeNodeId != node.id;
                if (canInsertInline) {
                    this.el("createInlineButton").show();
                }
                else {
                    this.el("createInlineButton").hide();
                }
            }
        }
    }
    export class SearchResultsPanel {

        domId: string = "searchResultsPanel";
        tabId: string = "searchTabName";
        visible: boolean = false;

        build = () => {
            var header = "<h2 id='searchPageTitle' class='page-title'></h2>";
            var mainContent = "<div id='searchResultsView'></div>";
            return header + mainContent;
        };

        init = () => {
            $("#searchPageTitle").html(srch.searchPageTitle);
            srch.populateSearchResultsPage(srch.searchResults, "searchResultsView");
        }
    }
    export class TimelineResultsPanel {

        domId: string = "timelineResultsPanel";
        tabId: string = "timelineTabName";
        visible: boolean = false;

        build = () => {
            var header = "<h2 id='timelinePageTitle' class='page-title'></h2>";
            var mainContent = "<div id='timelineView'></div>";
            return header + mainContent;
        }

        init = () => {
            $("#timelinePageTitle").html(srch.timelinePageTitle);
            srch.populateSearchResultsPage(srch.timelineResults, "timelineView");
        }
    }
}
