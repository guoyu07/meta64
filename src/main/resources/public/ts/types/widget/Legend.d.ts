import { Comp } from "./base/Comp";
export declare class Legend extends Comp {
    text: string;
    constructor(text: string, centered?: boolean, attribs?: Object);
    renderHtml: () => string;
}
