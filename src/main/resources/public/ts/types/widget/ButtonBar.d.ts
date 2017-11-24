import { Comp } from "./base/Comp";
export declare class ButtonBar extends Comp {
    constructor(initialButtons?: Comp[], justify?: string);
    renderHtml: () => string;
}
