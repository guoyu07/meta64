/// <reference types="react" />
import * as React from "react";
import { CompImpl } from "./CompImpl";
export declare abstract class Comp extends React.Component implements CompImpl {
    private isReact;
    private static guid;
    static idToCompMap: {
        [key: string]: Comp;
    };
    attribs: Object;
    children: Comp[];
    renderPending: boolean;
    enabled: boolean;
    visible: boolean;
    isEnabledFunc: Function;
    isVisibleFunc: Function;
    constructor(attribs: Object, isReact?: boolean);
    refreshState(): void;
    setDomAttr: (attrName: string, attrVal: string) => void;
    bindOnClick: (callback: Function) => void;
    setIsEnabledFunc(isEnabledFunc: Function): void;
    setIsVisibleFunc(isVisibleFunc: Function): void;
    updateState(): boolean;
    setVisibleIfAnyChildrenVisible(): void;
    static nextGuid(): number;
    static findById(id: string): Comp;
    removeAllChildren: () => void;
    getId: () => string;
    getElement: () => HTMLElement;
    whenElm: (func: Function) => void;
    setVisible: (visible: boolean) => void;
    setEnabled: (enabled: boolean) => void;
    setClass: (clazz: string) => void;
    setOnClick: (onclick: Function) => void;
    renderToDom: (elm?: HTMLElement) => void;
    renderChildrenToDom: (elm?: HTMLElement) => void;
    setInnerHTML: (html: string) => void;
    addChild: (comp: Comp) => void;
    addChildren: (comps: Comp[]) => void;
    setChildren: (comps: Comp[]) => void;
    renderChildren: () => string;
    reactRenderChildren: () => React.ReactNode[];
    reactRender: () => any;
    renderHtml: () => string;
}
