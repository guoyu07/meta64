import { Comp } from "./base/Comp";
export declare class Textarea extends Comp {
    attribs: Object;
    constructor(attribs: Object);
    getValue: () => string;
    setValue: (val: string) => void;
    renderHtml: () => string;
}
