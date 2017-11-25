console.log("UtilIntf.ts");

import * as I from "../Interfaces";

export interface UtilIntf {

    postConstruct(_f: any) ;

    logAjax: boolean ;
    timeoutMessageShown: boolean ;
    offline: boolean ;

    waitCounter: number;
    pgrsDlg: any;

    buf2hex (arr: Uint8Array): string ;

    hex2buf (str): Uint8Array ;

    escapeRegExp (s: string): string ;

    escapeForAttrib (s: string): string ;

    unencodeHtml (s: string): string ;

    replaceAll (s: string, find: string, replace: string): string ;

    contains (s: string, str: string): boolean ;

    startsWith (s: string, str: string): boolean ;

    endsWith (s: string, str: string): boolean ;

    chopAtLastChar (str: string, char: string): string ;

    stripIfStartsWith (s: string, str: string): string ;

    arrayClone(a: any[]): any[] ;

    arrayIndexOfItemByProp (a: any[], propName: string, propVal: string): number ;

    arrayMoveItem (a: any[], fromIndex: number, toIndex: number) ;

    stdTimezoneOffset (date: Date) ;

    dst (date: Date) ;

    indexOfObject (arr: any[], obj) ;

    assertNotNull (varName) ;

    /*
     * We use this variable to determine if we are waiting for an ajax call, but the server also enforces that each
     * session is only allowed one concurrent call and simultaneous calls would just "queue up".
     */
    _ajaxCounter: number ;

    daylightSavingsTime: boolean ;

    getCheckBoxStateById (id: string): boolean ;
    toJson (obj: Object) ;

    /*
     * This came from here:
     * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     */
    getParameterByName (name?: any, url?: any): string ;

    initProgressMonitor (): void ;

    progressInterval (): void ;

    getHostAndPort (): string ;

    ajax <RequestType, ResponseType>(postName: string, postData: RequestType, //
        callback?: (response: ResponseType) => void) ;

    logAndThrow (message: string) ;

    logAndReThrow (message: string, exception: any) ;

    ajaxReady (requestName): boolean ;

    isAjaxWaiting (): boolean ;

    focusElmById (id: string) ;

    //todo-1: Haven't yet verified this is correct, but i'm not using it anywhere important yet.
    isElmVisible (elm: HTMLElement) ;

    /* set focus to element by id (id must be actual jquery selector) */
    delayedFocus (id: string): void ;
    /*
     * We could have put this logic inside the json method itself, but I can forsee cases where we don't want a
     * message to appear when the json response returns success==false, so we will have to call checkSuccess inside
     * every response method instead, if we want that response to print a message to the user when fail happens.
     *
     * requires: res.success res.message
     */
    checkSuccess (opFriendlyName, res): boolean ;

    showMessage (message: string): void ;

    /* adds all array objects to obj as a set */
    addAll (obj, a): void ;

    nullOrUndef (obj): boolean ;

    /*
     * We have to be able to map any identifier to a uid, that will be repeatable, so we have to use a local
     * 'hashset-type' implementation
     */
    getUidForId (map: { [key: string]: string }, id): string ;

    elementExists (id): boolean ;
    /* Takes textarea dom Id (# optional) and returns its value */
    getTextAreaValById (id): string ;

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    domElm (id): HTMLElement ;
    setInnerHTMLById (id: string, val: string): void ;

    setInnerHTML (elm: HTMLElement, val: string): void ;

    poly (id): any ;

    /*
     * Gets the RAW DOM element and displays an error message if it's not found. Do not prefix with "#"
     */
    polyElm (id: string): any ;
    polyElmNode (id: string): any ;

    isObject (obj: any): boolean ;

    currentTimeMillis (): number ;

    emptyString (val: string): boolean ;

    getInputVal (id: string): any ;

    /* returns true if element was found, or false if element not found */
    setInputVal (id: string, val: string): boolean ;

    bindEnterKey (id: string, func: Function) ;

    /*
     * displays message (msg) of object is not of specified type
     */
    verifyType (obj: any, type: any, msg: string) ;

    setHtml (id: string, content: string): void ;
    setElmDisplayById (id: string, showing: boolean) ;

    setElmDisplay (elm: any, showing: boolean) ;

    getPropertyCount (obj: Object): number ;

    forEachElmBySel (sel: string, callback: Function): void ;

    /* Equivalent of ES6 Object.assign(). Takes all properties from src and merges them onto dst */
    mergeProps (dst: Object, src: Object): void ;

    /* Iterates by callling callback with property key/value pairs for each property in the object */
    forEachProp (obj: Object, callback: I.PropertyIterator): void ;

    forEachArrElm (elements: any[], callback: Function): void ;

    /*
     * iterates over an object creating a string containing it's keys and values
     */
    printObject (obj: Object): string ;

    /* iterates over an object creating a string containing it's keys */
    printKeys (obj: Object): string ;

    /*
     * Makes eleId enabled based on vis flag
     *
     * eleId can be a DOM element or the ID of a dom element, with or without leading #
     */
    setEnablement (elmId: string, enable: boolean): void ;

    /* Programatically creates objects by name, similar to what Java reflection does
    
    * ex: let example = InstanceLoader.getInstance<NamedThing>(window, 'ExampleClass', args...);
    */
    getInstance<T>(context: Object, name: string, ...args: any[]): T ;

    setCookie (name: string, val: string): void ;

    deleteCookie (name: string): void ;

    getCookie (name: string): string ;

    changeOrAddClassToElm (elm: HTMLElement, oldClass: string, newClass: string) ;

    /*
     * Removed oldClass from element and replaces with newClass, and if oldClass is not present it simply adds
     * newClass. If old class existed, in the list of classes, then the new class will now be at that position. If
     * old class didn't exist, then new Class is added at end of class list.
     */
    changeOrAddClass (id: string, oldClass: string, newClass: string) ;

    removeClassFromElmById (id: string, clazz: string) ;

    removeClassFromElm (el: any, clazz: string): void ;

    addClassToElmById (id: any, clazz: string): void ;

    addClassToElm (el: any, clazz: string): void ;

    toggleClassFromElm (el: any, clazz: string): void ;
    /* Returns password promise by depending on a dialog to prompt the user if not yet prompted */
    getPassword (): Promise<string> ;

    /* Source: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript */
    copyToClipboard (text) ;
}
