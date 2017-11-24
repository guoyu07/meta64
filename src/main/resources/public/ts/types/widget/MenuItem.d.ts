import { Comp } from "./base/Comp";
export declare class MenuItem extends Comp {
    name: string;
    clickFunc: Function;
    constructor(name: string, clickFunc: Function, isEnabledFunc?: Function, isVisibleFunc?: Function, bottomSeparator?: boolean);
    renderHtml: () => string;
}
