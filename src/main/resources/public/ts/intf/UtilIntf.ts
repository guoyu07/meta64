console.log("UtilIntf.ts");

import * as I from "../Interfaces";
import {Singletons} from "../Singletons";

export interface UtilIntf {
    logAjax: boolean;
    timeoutMessageShown: boolean;
    offline: boolean;
    waitCounter: number;
    pgrsDlg: any;

    buf2hex(arr: Uint8Array): string;
    hex2buf(str): Uint8Array;
    escapeRegExp(s: string): string;
    escapeForAttrib(s: string): string;
    unencodeHtml(s: string): string;
    replaceAll(s: string, find: string, replace: string): string;
    contains(s: string, str: string): boolean;
    startsWith(s: string, str: string): boolean;
    endsWith(s: string, str: string): boolean;
    chopAtLastChar(str: string, char: string): string;
    stripIfStartsWith(s: string, str: string): string;
    arrayClone(a: any[]): any[];
    arrayIndexOfItemByProp(a: any[], propName: string, propVal: string): number;
    arrayMoveItem(a: any[], fromIndex: number, toIndex: number);
    stdTimezoneOffset(date: Date);
    dst(date: Date);
    indexOfObject(arr: any[], obj);
    assertNotNull(varName);

    daylightSavingsTime: boolean;

    getCheckBoxStateById(id: string): boolean;
    toJson(obj: Object);

    getParameterByName(name?: any, url?: any): string;
    initProgressMonitor(): void;
    progressInterval(): void;
    getHostAndPort(): string;
    getRpcPath(): string;
    ajax<RequestType, ResponseType>(postName: string, postData: RequestType,
        callback?: (response: ResponseType) => void);
    logAndThrow(message: string);
    logAndReThrow(message: string, exception: any);
    ajaxReady(requestName): boolean;
    isAjaxWaiting(): boolean;
    focusElmById(id: string);
    isElmVisible(elm: HTMLElement);
    delayedFocus(id: string): void;
    checkSuccess(opFriendlyName, res): boolean;
    showMessage(message: string): void;
    addAll(obj, a): void;
    nullOrUndef(obj): boolean;
    getUidForId(map: { [key: string]: string }, id): string;
    elementExists(id): boolean;
    getTextAreaValById(id): string;
    domElm(id): HTMLElement;
    setInnerHTMLById(id: string, val: string): void;
    setInnerHTML(elm: HTMLElement, val: string): void;
    isObject(obj: any): boolean;
    currentTimeMillis(): number;
    emptyString(val: string): boolean;
    getInputVal(id: string): any;
    setInputVal(id: string, val: string): boolean;
    bindEnterKey(id: string, func: Function);
    verifyType(obj: any, type: any, msg: string);
    setHtml(id: string, content: string): void;
    setElmDisplayById(id: string, showing: boolean);
    setElmDisplay(elm: any, showing: boolean);
    getPropertyCount(obj: Object): number;
    forEachElmBySel(sel: string, callback: Function): void;
    mergeProps(dst: Object, src: Object): void;
    forEachProp(obj: Object, callback: I.PropertyIterator): void;
    forEachArrElm(elements: any[], callback: Function): void;
    printObject(obj: Object): string;
    printKeys(obj: Object): string;
    setEnablement(elmId: string, enable: boolean): void;
    getInstance<T>(context: Object, name: string, ...args: any[]): T;
    setCookie(name: string, val: string): void;
    deleteCookie(name: string): void;
    getCookie(name: string): string;
    changeOrAddClassToElm(elm: HTMLElement, oldClass: string, newClass: string);
    changeOrAddClass(id: string, oldClass: string, newClass: string);
    removeClassFromElmById(id: string, clazz: string);
    removeClassFromElm(el: any, clazz: string): void;
    addClassToElmById(id: any, clazz: string): void;
    addClassToElm(el: any, clazz: string): void;
    toggleClassFromElm(el: any, clazz: string): void;
    getPassword(): Promise<string>;
    copyToClipboard(text);
}
