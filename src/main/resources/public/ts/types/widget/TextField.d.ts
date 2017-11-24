import { Comp } from "./base/Comp";
export declare class TextField extends Comp {
    constructor(label: string);
    bindEnterKey: (func: Function) => void;
    setValue: (val: string) => void;
    getValue: () => string;
    focus: () => void;
    renderHtml: () => string;
}
