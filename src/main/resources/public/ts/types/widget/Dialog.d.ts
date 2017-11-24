import { Comp } from "./base/Comp";
export declare class Dialog extends Comp {
    text: string;
    constructor(text: string);
    renderHtml: () => string;
}
