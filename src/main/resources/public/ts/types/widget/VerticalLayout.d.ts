import { Comp } from "./base/Comp";
export declare class VerticalLayout extends Comp {
    constructor(initialComps?: Comp[], justify?: string);
    renderHtml: () => string;
}
