/// <reference types="react" />
import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
import * as React from "react";
export declare class ButtonRe extends Comp {
    text: string;
    callback: Function;
    isDlgCloser: boolean;
    dlg: DialogBase;
    delayCloseCallback: number;
    constructor(text: string, callback: Function, _attribs?: Object, isDlgCloser?: boolean, dlg?: DialogBase, initiallyVisible?: boolean, delayCloseCallback?: number);
    reactRender: () => React.DOMElement<Object, Element>;
}
