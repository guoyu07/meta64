import { Comp } from "./base/Comp";
import { DialogBase } from "../DialogBase";
export declare class Button extends Comp {
    text: string;
    callback: Function;
    isDlgCloser: boolean;
    dlg: DialogBase;
    delayCloseCallback: number;
    constructor(text: string, callback: Function, _attribs?: Object, isDlgCloser?: boolean, dlg?: DialogBase, initiallyVisible?: boolean, delayCloseCallback?: number);
    renderHtml: () => string;
}
